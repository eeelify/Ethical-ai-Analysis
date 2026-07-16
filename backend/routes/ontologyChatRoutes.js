const express = require('express');
const mongoose = require('mongoose');
const ontologyService = require('../services/ontologyService');
const OntologyChatConversation = require('../models/OntologyChatConversation');
const ProjectAssignment = require('../models/projectAssignment');

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

async function assertUseCaseOwnerProjectAccess(req, res) {
  const projectId = req.params.projectId;
  const userId = getRequestUserId(req);

  if (!projectId || !isValidObjectId(projectId)) {
    res.status(400).json({ success: false, error: 'Invalid projectId' });
    return null;
  }

  if (!userId || !isValidObjectId(userId)) {
    res.status(400).json({ success: false, error: 'Invalid or missing userId' });
    return null;
  }

  const User = mongoose.model('User');
  const Project = mongoose.model('Project');
  const UseCase = mongoose.model('UseCase');

  const projectIdObj = toObjectId(projectId);
  const userIdObj = toObjectId(userId);

  const [user, project] = await Promise.all([
    User.findById(userIdObj).select('_id name email role').lean(),
    Project.findById(projectIdObj).lean()
  ]);

  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return null;
  }

  if (!['use-case-owner', 'usecase-owner', 'usecaseowner'].includes(normalizeRole(user.role))) {
    res.status(403).json({ success: false, error: 'Only UseCaseOwner users can access ontology chat' });
    return null;
  }

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

  return { projectIdObj, userIdObj, project, user };
}

function serializeConversation(conversation) {
  if (!conversation) {
    return {
      conversationId: null,
      status: 'not_started',
      messages: [],
      ontologyResult: null
    };
  }

  return {
    conversationId: String(conversation._id),
    status: conversation.status || 'not_started',
    messages: conversation.messages || [],
    ontologyResult: conversation.ontologyResult || null,
    updatedAt: conversation.updatedAt
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

function buildOntologyResult({ analysis, trace, contextText, project }) {
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
    missingOrUnverifiedInformation: unique(analysis?.missing_safeguards || []),
    recommendedNextSteps: unique([
      ...(analysis?.missing_safeguards || []).map((item) => `Verify safeguard: ${item}`),
      ethicalTensions.length ? 'Review inferred ethical tensions with assigned experts.' : null,
      legalProvisions.length ? 'Map detected legal provisions to project compliance evidence.' : null
    ]),
    scoreComponents: analysis?.score_components || null,
    compositeScore: analysis?.composite_score ?? null,
    rawOntologyAnalysis: analysis || null
  };
}

async function runOntologyAssessment(project, conversation) {
  const contextText = buildAnalysisContext(project, conversation.messages);
  const [analysisResult, traceResult] = await Promise.allSettled([
    ontologyService.analyzeText({ text: contextText }),
    ontologyService.graphTrace({ text: contextText })
  ]);

  if (analysisResult.status === 'rejected') {
    throw analysisResult.reason;
  }

  const analysis = analysisResult.value;
  const trace = traceResult.status === 'fulfilled' ? traceResult.value : null;
  const questions = buildClarifyingQuestions(contextText, analysis);

  if (!hasOntologySignal(analysis)) {
    return {
      status: 'needs_more_information',
      reply: 'I could not map the description to the ontology yet. Please add more detail about the system purpose, data, affected people, decision impact, and human oversight.',
      ontologyResult: null,
      raw: { analysis, trace }
    };
  }

  if (questions.length > 0) {
    return {
      status: 'needs_more_information',
      reply: `I need a little more information before completing the ontology assessment:\n\n${questions.map((question) => `- ${question}`).join('\n')}`,
      ontologyResult: null,
      raw: { analysis, trace, missingQuestions: questions }
    };
  }

  return {
    status: 'completed',
    reply: 'Based on the information provided, the ontology assessment is complete. I structured the ontology-derived results below.',
    ontologyResult: buildOntologyResult({ analysis, trace, contextText, project }),
    raw: { analysis, trace }
  };
}

router.get('/:projectId/ontology-chat', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;

    const conversation = await OntologyChatConversation.findOne({
      projectId: context.projectIdObj,
      userId: context.userIdObj
    }).lean();

    res.json({ success: true, ...serializeConversation(conversation) });
  } catch (error) {
    console.error('Error loading ontology chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to load ontology chat' });
  }
});

router.post('/:projectId/ontology-chat', async (req, res) => {
  try {
    const context = await assertUseCaseOwnerProjectAccess(req, res);
    if (!context) return;

    const message = String(req.body?.message || '').trim();
    const conversationId = req.body?.conversationId;

    if (!message) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(413).json({ success: false, error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    }

    let conversation = await OntologyChatConversation.findOne({
      projectId: context.projectIdObj,
      userId: context.userIdObj
    });

    if (!conversation) {
      conversation = new OntologyChatConversation({
        projectId: context.projectIdObj,
        userId: context.userIdObj,
        status: 'not_started',
        messages: []
      });
    } else if (conversationId && String(conversation._id) !== String(conversationId)) {
      return res.status(409).json({
        success: false,
        error: 'conversationId does not match the active project conversation'
      });
    }

    conversation.messages.push({
      sender: 'user',
      text: message
    });

    try {
      const assessment = await runOntologyAssessment(context.project, conversation);

      conversation.status = assessment.status;
      conversation.ontologyResult = assessment.ontologyResult;
      conversation.lastOntologyRaw = assessment.raw;
      conversation.messages.push({
        sender: 'system',
        text: assessment.reply,
        status: assessment.status,
        ontologyResult: assessment.ontologyResult
      });

      await conversation.save();

      return res.json({
        success: true,
        reply: assessment.reply,
        ...serializeConversation(conversation.toObject())
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

      return res.status(503).json({
        success: false,
        error: reply,
        reply,
        ...serializeConversation(conversation.toObject())
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

    await OntologyChatConversation.findOneAndDelete({
      projectId: context.projectIdObj,
      userId: context.userIdObj
    });

    res.json({
      success: true,
      conversationId: null,
      status: 'not_started',
      messages: [],
      ontologyResult: null
    });
  } catch (error) {
    console.error('Error clearing ontology chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to clear ontology chat' });
  }
});

module.exports = router;
