const express = require('express');
const mongoose = require('mongoose');
const ontologyService = require('../services/ontologyService');
const OntologyChatConversation = require('../models/OntologyChatConversation');
const ProjectAssignment = require('../models/projectAssignment');
const {
  ASSESSMENT_VERSION,
  FACT_LABELS,
  assessOntologyChat,
  buildGraphFactAssertions
} = require('../services/ontologyChatAssessmentService');
const { extractOntologyChatFactsWithGemini } = require('../services/ontologyChatGeminiExtractor');
const { generateChatResponse } = require('../services/geminiService');

const router = express.Router();

const MAX_MESSAGE_LENGTH = 12000;

const isValidObjectId = (id) => {
  if (typeof mongoose.isValidObjectId === 'function') {
    return mongoose.isValidObjectId(id);
  }
  return mongoose.Types.ObjectId.isValid(id);
};

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const toIdString = (value) => {
  if (!value) return '';
  return String(value._id || value.id || value);
};

const normalizeRole = (role) =>
  String(role || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

const unique = (items) =>
  Array.from(new Set((items || []).map((item) => String(item || '').trim()).filter(Boolean)));

const getRequestUserId = (req) =>
  req.body?.userId ||
  req.query?.userId ||
  req.headers?.['x-user-id'] ||
  req.headers?.['x-userid'];

let indexMigrationPromise = null;

async function ensureFlexibleOntologyChatIndexes() {
  if (!indexMigrationPromise) {
    indexMigrationPromise = (async () => {
      try {
        const indexes = await OntologyChatConversation.collection.indexes();
        const legacyUnique = indexes.find((index) =>
          index.name === 'projectId_1_userId_1' &&
          index.unique === true
        );

        if (legacyUnique) {
          await OntologyChatConversation.collection.dropIndex(legacyUnique.name);
        }
      } catch (error) {
        console.warn('Ontology chat index migration skipped:', error.message || error);
      }
    })();
  }

  return indexMigrationPromise;
}

async function assertUseCaseOwnerAccess(req, res) {
  const userId = getRequestUserId(req);

  if (!userId || !isValidObjectId(userId)) {
    res.status(400).json({ success: false, error: 'Invalid or missing userId' });
    return null;
  }

  const User = mongoose.model('User');
  const userIdObj = toObjectId(userId);
  const user = await User.findById(userIdObj).select('_id name email role').lean();

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return null;
  }

  if (!['use-case-owner', 'usecase-owner', 'usecaseowner'].includes(normalizeRole(user.role))) {
    res.status(403).json({ success: false, error: 'Only UseCaseOwner users can access ontology chat' });
    return null;
  }

  return { userIdObj, user };
}

async function assertProjectAccessForUser(projectId, userIdObj, res) {
  if (!projectId || !isValidObjectId(projectId)) {
    res.status(400).json({ success: false, error: 'Invalid projectId' });
    return null;
  }

  const Project = mongoose.model('Project');
  const UseCase = mongoose.model('UseCase');
  const projectIdObj = toObjectId(projectId);
  const project = await Project.findById(projectIdObj).lean();

  if (!project) {
    res.status(404).json({ success: false, error: 'Project not found' });
    return null;
  }

  const assignedUsers = Array.isArray(project.assignedUsers) ? project.assignedUsers : [];
  const isAssignedToProject = assignedUsers.some((assignedUser) => toIdString(assignedUser) === String(userIdObj));

  let ownsLinkedUseCase = false;
  const linkedUseCaseId = toIdString(project.useCase);
  if (linkedUseCaseId && isValidObjectId(linkedUseCaseId)) {
    const linkedUseCase = await UseCase.findById(linkedUseCaseId).select('ownerId').lean();
    ownsLinkedUseCase = toIdString(linkedUseCase?.ownerId) === String(userIdObj);
  }

  const hasAssignment = Boolean(await ProjectAssignment.exists({
    projectId: projectIdObj,
    userId: userIdObj
  }));

  if (!isAssignedToProject && !ownsLinkedUseCase && !hasAssignment) {
    res.status(403).json({
      success: false,
      error: 'Access denied: this project is not assigned to the current UseCaseOwner'
    });
    return null;
  }

  return { projectIdObj, project };
}

async function assertUseCaseOwnerProjectAccess(req, res) {
  const userContext = await assertUseCaseOwnerAccess(req, res);
  if (!userContext) return null;

  const projectContext = await assertProjectAccessForUser(req.params.projectId, userContext.userIdObj, res);
  if (!projectContext) return null;

  return { ...userContext, ...projectContext };
}

function deriveConversationTitle(conversation, project = null) {
  const explicitTitle = String(conversation?.title || '').trim();
  const projectAssessmentTitle = `${project?.title || conversation?.projectTitle || ''} assessment`.trim();
  const isGeneratedPlaceholder =
    !explicitTitle ||
    explicitTitle === 'New ontology chat' ||
    (projectAssessmentTitle && explicitTitle === projectAssessmentTitle);

  if (explicitTitle && !isGeneratedPlaceholder) return explicitTitle;

  const firstUserMessage = (conversation?.messages || []).find((message) => message.sender === 'user');
  if (firstUserMessage?.text) {
    const compact = String(firstUserMessage.text).replace(/\s+/g, ' ').trim();
    return compact.length > 42 ? `${compact.slice(0, 42)}...` : compact;
  }

  if (project?.title || conversation?.projectTitle) {
    return `${project?.title || conversation.projectTitle} assessment`;
  }

  return 'New ontology chat';
}

async function getProjectLookupForConversations(conversations) {
  const projectIds = unique((conversations || []).map((conversation) => toIdString(conversation.projectId)).filter((projectId) => projectId && isValidObjectId(projectId)));
  if (!projectIds.length) return new Map();

  const Project = mongoose.model('Project');
  const projects = await Project.find({ _id: { $in: projectIds.map(toObjectId) } }).select('_id title').lean();
  return new Map(projects.map((project) => [String(project._id), project]));
}

function hasCurrentAssessmentVersion(conversation) {
  if (!conversation?.ontologyResult) return true;
  const conversationVersion = conversation.assessmentVersion || null;
  const resultVersion = conversation.ontologyResult?.reportVersion || null;
  return conversationVersion === ASSESSMENT_VERSION && resultVersion === ASSESSMENT_VERSION;
}

function serializeConversation(conversation, projectLookup = new Map()) {
  if (!conversation) {
    return {
      conversationId: null,
      title: 'New ontology chat',
      projectId: null,
      projectTitle: null,
      status: 'not_started',
      messages: [],
      ontologyResult: null
    };
  }

  const projectId = toIdString(conversation.projectId) || null;
  const project = projectId ? projectLookup.get(projectId) : null;
  const assessmentIsCurrent = hasCurrentAssessmentVersion(conversation);

  return {
    conversationId: String(conversation._id),
    title: deriveConversationTitle(conversation, project),
    projectId,
    projectTitle: project?.title || conversation.projectTitle || null,
    status: assessmentIsCurrent ? (conversation.status || 'not_started') : 'needs_more_information',
    messages: conversation.messages || [],
    ontologyResult: assessmentIsCurrent ? (conversation.ontologyResult || null) : null,
    confirmedFacts: conversation.confirmedFacts || {},
    unknownFacts: conversation.unknownFacts || {},
    factEvidence: conversation.factEvidence || [],
    contradictions: conversation.contradictions || [],
    assessmentVersion: assessmentIsCurrent ? (conversation.assessmentVersion || ASSESSMENT_VERSION) : ASSESSMENT_VERSION,
    staleAssessmentDiscarded: !assessmentIsCurrent,
    updatedAt: conversation.updatedAt
  };
}

function serializeConversationSummary(conversation, projectLookup = new Map()) {
  const serialized = serializeConversation(conversation, projectLookup);
  const lastMessage = (conversation?.messages || []).slice(-1)[0];
  return {
    conversationId: serialized.conversationId,
    title: serialized.title,
    projectId: serialized.projectId,
    projectTitle: serialized.projectTitle,
    status: serialized.status,
    messageCount: (conversation?.messages || []).length,
    lastMessage: lastMessage?.text || '',
    updatedAt: serialized.updatedAt
  };
}

function emptyConversationPayload() {
  return {
    conversationId: null,
    title: 'New ontology chat',
    projectId: null,
    projectTitle: null,
    status: 'not_started',
    messages: [],
    ontologyResult: null,
    confirmedFacts: {},
    unknownFacts: {},
    factEvidence: [],
    contradictions: [],
    assessmentVersion: ASSESSMENT_VERSION
  };
}

function buildAnalysisContext(project, messages) {
  const userMessages = (messages || [])
    .filter((message) => message.sender === 'user')
    .map((message, index) => `UseCaseOwner message ${index + 1}: ${message.text}`);

  return [
    project?.title ? `Project title: ${project.title}` : null,
    project?.shortDescription ? `Project short description: ${project.shortDescription}` : null,
    project?.fullDescription ? `Project full description: ${project.fullDescription}` : null,
    userMessages.length ? userMessages.join('\n\n') : null
  ].filter(Boolean).join('\n\n');
}

function buildClarifyingQuestions(text, analysis) {
  const normalized = String(text || '').toLowerCase();
  const questions = [];

  const checks = [
    {
      key: 'data_categories',
      pattern: /(data|veri|personal|kisisel|kişisel|sensitive|hassas|biometric|biyometrik|health|saglik|sağlık|education|egitim|eğitim|student|ogrenci|öğrenci|child|cocuk|çocuk|employee|calisan|çalışan|patient|hasta)/i,
      question: 'Which personal, sensitive, educational, health, biometric, or operational data categories does the system process?'
    },
    {
      key: 'affected_people',
      pattern: /(student|ogrenci|öğrenci|teacher|ogretmen|öğretmen|patient|hasta|employee|calisan|çalışan|customer|musteri|müşteri|user|kullanici|kullanıcı|child|cocuk|çocuk|manager|yonetici|yönetici|citizen|vatandas|vatandaş)/i,
      question: 'Which people or stakeholder groups are affected by the system outputs?'
    },
    {
      key: 'decision_effect',
      pattern: /(recommend|oner|öner|decision|karar|binding|baglayici|bağlayıcı|approve|reject|score|puan|rank|sirala|sırala|feedback|geri bildirim|alert|uyari|uyarı)/i,
      question: 'Does the system only provide recommendations, or can it create a binding decision about a person?'
    },
    {
      key: 'automation_level',
      pattern: /(automatic|automated|otomatik|manual|manuel|human|insan|review|control|kontrol|oversight|gozetim|gözetim|approve|onay)/i,
      question: 'Is a human able to review, approve, override, or stop the system decision?'
    }
  ];

  checks.forEach((check) => {
    if (!check.pattern.test(normalized)) {
      questions.push(check.question);
    }
  });

  const missingSafeguards = unique(analysis?.missing_safeguards).slice(0, 2);
  missingSafeguards.forEach((item) => {
    questions.push(`Please clarify whether this safeguard exists: ${item}.`);
  });

  return unique(questions).slice(0, 4);
}

function hasOntologySignal(analysis) {
  if (!analysis) return false;
  const finalRisk = String(analysis.final_risk_level || '').toLowerCase();
  return Boolean(
    (analysis.matched_keywords || []).length ||
    (analysis.inferred_categories || []).length ||
    (analysis.inferred_regulations || []).length ||
    (analysis.ethical_analysis || []).length ||
    (finalRisk && finalRisk !== 'unknown')
  );
}

function buildOntologyResult({ analysis, trace, contextText, project, clarificationQuestions = [] }) {
  const matchedKeywords = analysis?.matched_keywords || [];
  const ethicalAnalysis = analysis?.ethical_analysis || [];
  const ethicalTensions = analysis?.ethical_tensions || [];

  const legalProvisions = unique([
    ...(analysis?.inferred_regulations || []),
    ...matchedKeywords.flatMap((match) => match.regulations || [])
  ]);

  const categories = unique([
    ...(analysis?.inferred_categories || []),
    ...matchedKeywords.map((match) => match.mapped_category)
  ]);

  const affectedPrinciples = unique(ethicalAnalysis.map((item) => item.principle));
  const possibleViolations = ethicalAnalysis.map((item) => ({
    principle: item.principle,
    severity: item.severity,
    reason: item.reason,
    impact: item.impact,
    harmType: item.harm_type
  }));

  const ethicalConflicts = ethicalTensions.map((item) => ({
    name: item.name,
    conflictingPrinciples: item.conflicting_principles || [],
    severity: item.severity,
    description: item.description,
    recommendation: item.recommendation
  }));

  const ontologyRelationsAndReasoning = unique([
    ...(analysis?.reasoning_trace || []),
    ...((trace?.trace || []).map((step) => `${step.step}: ${step.value}`)),
    ...(trace?.explanations || [])
  ]);

  return {
    detectedDomain: categories[0] || null,
    systemPurpose: project?.fullDescription || project?.shortDescription || contextText.slice(0, 600),
    aiSystemClassification: categories,
    stakeholders: unique(analysis?.stakeholders || analysis?.affected_stakeholders || []),
    dataCategories: unique(analysis?.data_categories || analysis?.inferred_data_categories || []),
    affectedPrinciples,
    possibleEthicalPrincipleViolations: possibleViolations,
    ethicalPrincipleConflicts: ethicalConflicts,
    riskLevel: analysis?.final_risk_level || analysis?.initial_risk_level || null,
    humanOversightRequirement: unique([
      ...(analysis?.detected_safeguards || []),
      ...(analysis?.missing_safeguards || []).map((item) => `Missing: ${item}`)
    ]),
    legalProvisions,
    detectedRiskTriggers: unique(analysis?.detected_risk_triggers || []),
    ontologyRelationsAndReasoning,
    missingOrUnverifiedInformation: unique([
      ...(analysis?.missing_safeguards || []),
      ...clarificationQuestions
    ]),
    recommendedNextSteps: unique([
      ...(analysis?.missing_safeguards || []).map((item) => `Verify safeguard: ${item}`),
      ...clarificationQuestions.map((question) => `Confirm: ${question}`),
      ethicalTensions.length ? 'Review inferred ethical tensions with assigned experts.' : null,
      legalProvisions.length ? 'Map detected legal provisions to project compliance evidence.' : null
    ]),
    rawOntologyAnalysis: analysis || null
  };
}

function getConversationFactState(conversation) {
  return {
    confirmedFacts: conversation.confirmedFacts || {},
    unknownFacts: conversation.unknownFacts || {},
    factEvidence: conversation.factEvidence || [],
    contradictions: conversation.contradictions || []
  };
}

async function syncConversationFactsToGraph({ project, userId, state }) {
  if (!toIdString(project)) {
    return {
      status: 'skipped',
      reason: 'No selected project is attached to this chat.',
      note: 'General ontology chats are assessed from conversation facts only and are not written to project graph facts.'
    };
  }

  try {
    const payload = buildGraphFactAssertions({ project, userId, state });
    const result = await ontologyService.executeQuery(payload, 3000);
    return {
      status: 'synced',
      operation: 'NEO4J_FACT_ASSERTION',
      factSources: Array.from(new Set((payload.params.facts || []).map((fact) => fact.source))),
      factCount: payload.params.facts.length,
      result: result?.results || result
    };
  } catch (error) {
    return {
      status: 'skipped',
      reason: error.message || String(error),
      note: 'Assessment did not use cached reports or raw keyword inference. Graph fact persistence is best-effort when the ontology API is available.'
    };
  }
}

async function runOntologyAssessment(project, conversation, userId) {
  const previousState = getConversationFactState(conversation);
  const geminiExtraction = await extractOntologyChatFactsWithGemini({
    messages: conversation.messages || [],
    previousState,
    factLabels: FACT_LABELS
  });

  const assessment = assessOntologyChat({
    project,
    messages: conversation.messages || [],
    previousState,
    llmFacts: geminiExtraction.acceptedFacts || [],
    geminiExtraction
  });

  const graphSync = await syncConversationFactsToGraph({
    project,
    userId,
    state: assessment.state
  });

  assessment.ontologyResult.reasoningTrace.graphFactPersistence = graphSync;
  assessment.raw.graphFactPersistence = graphSync;

  return assessment;
}

function assertRequestProjectMatchesRoute(req, res, projectIdObj) {
  const selectedProjectId = req.body?.projectId || req.body?.selectedProjectId;

  if (!selectedProjectId) {
    res.status(400).json({
      success: false,
      error: 'projectId is required for project-scoped ontology chat requests'
    });
    return false;
  }

  if (String(selectedProjectId) !== String(projectIdObj)) {
    res.status(409).json({
      success: false,
      error: 'selected projectId does not match the ontology chat route projectId'
    });
    return false;
  }

  return true;
}

function logAssessmentState({ conversation, projectIdObj, priorMessagesLoaded, existingFactsLoaded, assessment }) {
  console.info('[ontology-chat] state merge', {
    conversationId: String(conversation._id),
    projectId: String(projectIdObj || conversation.projectId || ''),
    priorMessagesLoaded,
    existingFactsLoaded,
    newFactsExtracted: assessment.raw?.stateMergeStats?.newFactsExtracted ?? null,
    llmExtractionStatus: assessment.raw?.stateMergeStats?.llmExtractionStatus ?? null,
    llmFactsAccepted: assessment.raw?.stateMergeStats?.llmFactsAccepted ?? null,
    llmFactsRejected: assessment.raw?.stateMergeStats?.llmFactsRejected ?? null,
    semanticCandidatesAccepted: assessment.raw?.stateMergeStats?.semanticCandidatesAccepted ?? null,
    semanticCandidatesRejected: assessment.raw?.stateMergeStats?.semanticCandidatesRejected ?? null,
    previousStateReset: assessment.raw?.stateMergeStats?.previousStateReset ?? null,
    previousStateResetReason: assessment.raw?.stateMergeStats?.previousStateResetReason ?? null,
    mergedFactsUsed: assessment.raw?.stateMergeStats?.mergedFactsUsed ?? null
  });
}

async function applyAssessmentToConversation({ conversation, project, userIdObj, projectIdObj, priorMessagesLoaded, existingFactsLoaded }) {
  const assessment = await runOntologyAssessment(project, conversation, userIdObj);

  const llmReply = await generateChatResponse(conversation.messages, assessment.ontologyResult);
  if (llmReply) {
    if (llmReply.includes("Rate Limit")) {
      assessment.reply = llmReply + "\n\n" + assessment.reply;
    } else {
      assessment.reply = llmReply;
    }
  }

  conversation.status = assessment.status;
  conversation.ontologyResult = assessment.ontologyResult;
  conversation.confirmedFacts = assessment.state.confirmedFacts;
  conversation.unknownFacts = assessment.state.unknownFacts;
  conversation.factEvidence = assessment.state.factEvidence;
  conversation.contradictions = assessment.state.contradictions;
  conversation.assessmentVersion = ASSESSMENT_VERSION;
  conversation.lastOntologyRaw = assessment.raw;
  conversation.title = deriveConversationTitle(conversation, project);
  conversation.projectTitle = project?.title || conversation.projectTitle || '';
  conversation.messages.push({
    sender: 'system',
    text: assessment.reply,
    status: assessment.status,
    ontologyResult: assessment.ontologyResult
  });

  logAssessmentState({
    conversation,
    projectIdObj,
    priorMessagesLoaded,
    existingFactsLoaded,
    assessment
  });

  await conversation.save();
  return assessment;
}

async function createOntologyConversation({ userIdObj, project = null }) {
  await ensureFlexibleOntologyChatIndexes();

  return new OntologyChatConversation({
    projectId: project?._id || null,
    projectTitle: project?.title || '',
    title: project?.title ? `${project.title} assessment` : 'New ontology chat',
    userId: userIdObj,
    status: 'not_started',
    messages: [],
    confirmedFacts: {},
    unknownFacts: {},
    factEvidence: [],
    contradictions: [],
    assessmentVersion: ASSESSMENT_VERSION
  });
}

async function loadConversationForUser(conversationId, userIdObj, res) {
  if (!conversationId || !isValidObjectId(conversationId)) {
    res.status(400).json({ success: false, error: 'Invalid conversationId' });
    return null;
  }

  const conversation = await OntologyChatConversation.findOne({
    _id: toObjectId(conversationId),
    userId: userIdObj
  });

  if (!conversation) {
    res.status(404).json({ success: false, error: 'Ontology chat conversation not found' });
    return null;
  }

  return conversation;
}

async function loadProjectForConversation(conversation, userIdObj, res) {
  const projectId = toIdString(conversation.projectId);
  if (!projectId) return null;

  const projectContext = await assertProjectAccessForUser(projectId, userIdObj, res);
  return projectContext?.project || null;
}

router.get('/ontology-chat', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerAccess(req, res);
    if (!context) return;

    await ensureFlexibleOntologyChatIndexes();

    const conversations = await OntologyChatConversation.find({
      userId: context.userIdObj
    }).sort({ updatedAt: -1 }).limit(50).lean();
    const projectLookup = await getProjectLookupForConversations(conversations);

    res.json({
      success: true,
      conversations: conversations.map((conversation) => serializeConversationSummary(conversation, projectLookup)),
      activeConversation: conversations[0]
        ? serializeConversation(conversations[0], projectLookup)
        : emptyConversationPayload()
    });
  } catch (error) {
    console.error('Error listing ontology chats:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to list ontology chats' });
  }
});

router.post('/ontology-chat', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerAccess(req, res);
    if (!context) return;

    const selectedProjectId = req.body?.projectId || req.body?.selectedProjectId;
    let project = null;

    if (selectedProjectId) {
      const projectContext = await assertProjectAccessForUser(selectedProjectId, context.userIdObj, res);
      if (!projectContext) return;
      project = projectContext.project;
    }

    const conversation = await createOntologyConversation({
      userIdObj: context.userIdObj,
      project
    });
    await conversation.save();

    const projectLookup = await getProjectLookupForConversations([conversation]);
    res.status(201).json({
      success: true,
      ...serializeConversation(conversation.toObject(), projectLookup)
    });
  } catch (error) {
    console.error('Error creating ontology chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create ontology chat' });
  }
});

router.get('/ontology-chat/:conversationId', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerAccess(req, res);
    if (!context) return;

    const conversation = await loadConversationForUser(req.params.conversationId, context.userIdObj, res);
    if (!conversation) return;

    const project = await loadProjectForConversation(conversation, context.userIdObj, res);
    if (toIdString(conversation.projectId) && !project) return;

    const projectLookup = await getProjectLookupForConversations([conversation]);
    res.json({
      success: true,
      ...serializeConversation(conversation.toObject(), projectLookup)
    });
  } catch (error) {
    console.error('Error loading ontology chat conversation:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to load ontology chat conversation' });
  }
});

router.post('/ontology-chat/:conversationId/messages', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerAccess(req, res);
    if (!context) return;

    const message = String(req.body?.message || '').trim();
    if (!message) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(413).json({ success: false, error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    }

    const conversation = await loadConversationForUser(req.params.conversationId, context.userIdObj, res);
    if (!conversation) return;

    const project = await loadProjectForConversation(conversation, context.userIdObj, res);
    if (toIdString(conversation.projectId) && !project) return;

    const priorMessagesLoaded = (conversation.messages || []).length;
    const existingFactsLoaded = Object.keys(conversation.confirmedFacts || {}).length;
    conversation.messages.push({
      sender: 'user',
      text: message
    });

    try {
      const assessment = await applyAssessmentToConversation({
        conversation,
        project,
        userIdObj: context.userIdObj,
        projectIdObj: toIdString(conversation.projectId) ? conversation.projectId : null,
        priorMessagesLoaded,
        existingFactsLoaded
      });

      const projectLookup = await getProjectLookupForConversations([conversation]);
      return res.json({
        success: true,
        reply: assessment.reply,
        ...serializeConversation(conversation.toObject(), projectLookup)
      });
    } catch (ontologyError) {
      const reply = `Ontology service is unavailable or did not return a valid assessment. ${ontologyError.message || ontologyError}`;

      conversation.status = 'error';
      conversation.ontologyResult = null;
      conversation.lastOntologyRaw = {
        error: ontologyError.message || String(ontologyError)
      };
      conversation.messages.push({
        sender: 'system',
        text: reply,
        status: 'error',
        ontologyResult: null
      });

      await conversation.save();

      const projectLookup = await getProjectLookupForConversations([conversation]);
      return res.status(503).json({
        success: false,
        error: reply,
        reply,
        ...serializeConversation(conversation.toObject(), projectLookup)
      });
    }
  } catch (error) {
    console.error('Error posting ontology chat message:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to process ontology chat message' });
  }
});

router.delete('/ontology-chat/:conversationId', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerAccess(req, res);
    if (!context) return;

    if (!req.params.conversationId || !isValidObjectId(req.params.conversationId)) {
      return res.status(400).json({ success: false, error: 'Invalid conversationId' });
    }

    await OntologyChatConversation.findOneAndDelete({
      _id: toObjectId(req.params.conversationId),
      userId: context.userIdObj
    });

    const conversations = await OntologyChatConversation.find({
      userId: context.userIdObj
    }).sort({ updatedAt: -1 }).limit(50).lean();
    const projectLookup = await getProjectLookupForConversations(conversations);

    res.json({
      success: true,
      conversations: conversations.map((conversation) => serializeConversationSummary(conversation, projectLookup)),
      activeConversation: conversations[0]
        ? serializeConversation(conversations[0], projectLookup)
        : emptyConversationPayload()
    });
  } catch (error) {
    console.error('Error deleting ontology chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to delete ontology chat' });
  }
});

router.get('/:projectId/ontology-chat/:conversationId', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;

    const conversation = await loadConversationForUser(req.params.conversationId, context.userIdObj, res);
    if (!conversation) return;

    if (toIdString(conversation.projectId) !== String(context.projectIdObj)) {
      return res.status(409).json({
        success: false,
        error: 'conversationId does not belong to the selected project'
      });
    }

    const projectLookup = await getProjectLookupForConversations([conversation]);
    res.json({
      success: true,
      ...serializeConversation(conversation.toObject(), projectLookup)
    });
  } catch (error) {
    console.error('Error loading project ontology chat conversation:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to load ontology chat conversation' });
  }
});

router.post('/:projectId/ontology-chat/:conversationId/messages', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;
    if (!assertRequestProjectMatchesRoute(req, res, context.projectIdObj)) return;

    const message = String(req.body?.message || '').trim();
    if (!message) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(413).json({ success: false, error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    }

    const conversation = await loadConversationForUser(req.params.conversationId, context.userIdObj, res);
    if (!conversation) return;

    if (toIdString(conversation.projectId) !== String(context.projectIdObj)) {
      return res.status(409).json({
        success: false,
        error: 'conversationId does not belong to the selected project'
      });
    }

    const priorMessagesLoaded = (conversation.messages || []).length;
    const existingFactsLoaded = Object.keys(conversation.confirmedFacts || {}).length;
    conversation.messages.push({
      sender: 'user',
      text: message
    });

    try {
      const assessment = await applyAssessmentToConversation({
        conversation,
        project: context.project,
        userIdObj: context.userIdObj,
        projectIdObj: context.projectIdObj,
        priorMessagesLoaded,
        existingFactsLoaded
      });

      const projectLookup = await getProjectLookupForConversations([conversation]);
      return res.json({
        success: true,
        reply: assessment.reply,
        ...serializeConversation(conversation.toObject(), projectLookup)
      });
    } catch (ontologyError) {
      const reply = `Ontology service is unavailable or did not return a valid assessment. ${ontologyError.message || ontologyError}`;

      conversation.status = 'error';
      conversation.ontologyResult = null;
      conversation.lastOntologyRaw = {
        error: ontologyError.message || String(ontologyError)
      };
      conversation.messages.push({
        sender: 'system',
        text: reply,
        status: 'error',
        ontologyResult: null
      });

      await conversation.save();

      const projectLookup = await getProjectLookupForConversations([conversation]);
      return res.status(503).json({
        success: false,
        error: reply,
        reply,
        ...serializeConversation(conversation.toObject(), projectLookup)
      });
    }
  } catch (error) {
    console.error('Error posting project ontology chat message:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to process ontology chat message' });
  }
});

router.delete('/:projectId/ontology-chat/:conversationId', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;

    if (!req.params.conversationId || !isValidObjectId(req.params.conversationId)) {
      return res.status(400).json({ success: false, error: 'Invalid conversationId' });
    }

    await OntologyChatConversation.findOneAndDelete({
      _id: toObjectId(req.params.conversationId),
      projectId: context.projectIdObj,
      userId: context.userIdObj
    });

    const conversations = await OntologyChatConversation.find({
      projectId: context.projectIdObj,
      userId: context.userIdObj
    }).sort({ updatedAt: -1 }).limit(50).lean();
    const projectLookup = await getProjectLookupForConversations(conversations);

    res.json({
      success: true,
      conversations: conversations.map((conversation) => serializeConversationSummary(conversation, projectLookup)),
      activeConversation: conversations[0]
        ? serializeConversation(conversations[0], projectLookup)
        : emptyConversationPayload()
    });
  } catch (error) {
    console.error('Error deleting project ontology chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to delete ontology chat' });
  }
});

router.get('/:projectId/ontology-chat', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;

    const conversations = await OntologyChatConversation.find({
      projectId: context.projectIdObj,
      userId: context.userIdObj
    }).sort({ updatedAt: -1 }).limit(50).lean();

    const projectLookup = await getProjectLookupForConversations(conversations);
    res.json({
      success: true,
      conversations: conversations.map((conversation) => serializeConversationSummary(conversation, projectLookup)),
      activeConversation: conversations[0]
        ? serializeConversation(conversations[0], projectLookup)
        : emptyConversationPayload()
    });
  } catch (error) {
    console.error('Error loading ontology chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to load ontology chat' });
  }
});

router.post('/:projectId/ontology-chat', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;
    if (!assertRequestProjectMatchesRoute(req, res, context.projectIdObj)) return;

    const message = String(req.body?.message || '').trim();
    const conversationId = req.body?.conversationId;

    if (!message) {
      const conversation = await createOntologyConversation({
        userIdObj: context.userIdObj,
        project: context.project
      });
      await conversation.save();

      const projectLookup = await getProjectLookupForConversations([conversation]);
      return res.status(201).json({
        success: true,
        ...serializeConversation(conversation.toObject(), projectLookup)
      });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(413).json({ success: false, error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    }

    let conversation = null;
    if (conversationId) {
      conversation = await loadConversationForUser(conversationId, context.userIdObj, res);
      if (!conversation) return;

      if (toIdString(conversation.projectId) !== String(context.projectIdObj)) {
        return res.status(409).json({
          success: false,
          error: 'conversationId does not belong to the selected project'
        });
      }
    } else {
      conversation = await OntologyChatConversation.findOne({
        projectId: context.projectIdObj,
        userId: context.userIdObj
      }).sort({ updatedAt: -1 });
    }

    if (!conversation) {
      conversation = await createOntologyConversation({
        userIdObj: context.userIdObj,
        project: context.project
      });
    }

    const priorMessagesLoaded = (conversation.messages || []).length;
    const existingFactsLoaded = Object.keys(conversation.confirmedFacts || {}).length;
    conversation.messages.push({
      sender: 'user',
      text: message
    });

    try {
      const assessment = await applyAssessmentToConversation({
        conversation,
        project: context.project,
        userIdObj: context.userIdObj,
        projectIdObj: context.projectIdObj,
        priorMessagesLoaded,
        existingFactsLoaded
      });

      const projectLookup = await getProjectLookupForConversations([conversation]);
      return res.json({
        success: true,
        reply: assessment.reply,
        ...serializeConversation(conversation.toObject(), projectLookup)
      });
    } catch (ontologyError) {
      const reply = `Ontology service is unavailable or did not return a valid assessment. ${ontologyError.message || ontologyError}`;

      conversation.status = 'error';
      conversation.ontologyResult = null;
      conversation.lastOntologyRaw = {
        error: ontologyError.message || String(ontologyError)
      };
      conversation.messages.push({
        sender: 'system',
        text: reply,
        status: 'error',
        ontologyResult: null
      });

      await conversation.save();

      const projectLookup = await getProjectLookupForConversations([conversation]);
      return res.status(503).json({
        success: false,
        error: reply,
        reply,
        ...serializeConversation(conversation.toObject(), projectLookup)
      });
    }
  } catch (error) {
    console.error('Error posting ontology chat message:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to process ontology chat message' });
  }
});

router.delete('/:projectId/ontology-chat', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;

    await OntologyChatConversation.deleteMany({
      projectId: context.projectIdObj,
      userId: context.userIdObj
    });

    res.json({
      success: true,
      ...emptyConversationPayload()
    });
  } catch (error) {
    console.error('Error clearing ontology chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to clear ontology chat' });
  }
});

module.exports = router;
