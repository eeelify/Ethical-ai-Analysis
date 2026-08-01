const path = require('path');
const dotenv = require('dotenv');

const ALLOWED_STATUSES = new Set(['confirmed', 'false', 'uncertain', 'planned', 'inferred', 'unknown']);
const ALLOWED_TOP_LEVEL_KEYS = new Set([
  'systemUnderstanding',
  'facts',
  'semanticCandidates',
  'unknownFacts',
  'possibleContradictions'
]);

const FORBIDDEN_ASSESSMENT_KEYS = new Set([
  'risk',
  'risks',
  'riskLevel',
  'risk_level',
  'primaryRisks',
  'primary_risks',
  'nonApplicableRisks',
  'non_applicable_risks',
  'classification',
  'classifications',
  'legalClassification',
  'legal_classification',
  'legalConclusion',
  'legalConclusions',
  'legal_conclusion',
  'legal_conclusions',
  'euAiActClassification',
  'eu_ai_act_classification',
  'ethicalViolations',
  'ethical_violations',
  'ontologyRuleResults',
  'ontology_rule_results',
  'ruleResults',
  'rule_results',
  'ontologyInferences',
  'ontology_inferences',
  'inferredTriples',
  'inferred_triples',
  'legalProvisions',
  'legal_provisions',
  'regulatoryConsiderations',
  'regulatory_considerations',
  'recommendedLegalArticles',
  'recommended_legal_articles',
  'safeguardEvaluation',
  'safeguard_evaluation',
  'safeguards',
  'finalReport',
  'final_report',
  'finalAssessment',
  'final_assessment',
  'qualitativeRiskDecision',
  'qualitative_risk_decision',
  'qualitativeAssessment',
  'qualitative_assessment',
  'assessment',
  'score',
  'scores',
  'scoreBreakdown',
  'compositeScore'
]);

const SEMANTIC_KINDS = new Set([
  'domain',
  'purpose',
  'actor',
  'primary_user',
  'affected_person',
  'input_data',
  'data_processing',
  'output',
  'decision_supported',
  'human_role',
  'safeguard',
  'right',
  'exclusion',
  'automation_boundary',
  'access_control',
  'retention',
  'consent',
  'security',
  'other'
]);

const SEMANTIC_KIND_ALIASES = Object.freeze({
  context: 'domain',
  use_case: 'purpose',
  function: 'purpose',
  functionality: 'purpose',
  user: 'primary_user',
  users: 'primary_user',
  primary_actor: 'primary_user',
  affected: 'affected_person',
  affected_people: 'affected_person',
  affected_persons: 'affected_person',
  data: 'input_data',
  data_input: 'input_data',
  input: 'input_data',
  processed_data: 'data_processing',
  processing: 'data_processing',
  decision: 'decision_supported',
  decision_support: 'decision_supported',
  human: 'human_role',
  oversight: 'human_role',
  protection: 'safeguard',
  rights: 'right',
  excluded_functionality: 'exclusion',
  negation: 'exclusion',
  automation: 'automation_boundary',
  access: 'access_control'
});

const FACT_ALIASES = Object.freeze({
  humanOversightAvailable: 'humanReviewAvailable',
  humanReview: 'humanReviewAvailable',
  humanInTheLoop: 'humanReviewAvailable',
  humanCanReview: 'humanReviewAvailable',
  humanCanOverrideRecommendation: 'humanCanOverride',
  humanCanIgnoreRecommendation: 'humanCanOverride',
  humanCanModifyRecommendation: 'humanCanModify',
  humanCanRejectRecommendation: 'humanCanReject',
  explanationRightAvailable: 'explanationAvailable',
  rightToExplanation: 'explanationAvailable',
  correctionRight: 'correctionRightAvailable',
  rightToCorrection: 'correctionRightAvailable',
  appealAvailable: 'appealMechanismAvailable',
  appealMechanism: 'appealMechanismAvailable',
  secondManualReviewAvailable: 'manualReviewAvailable',
  manualReconsiderationAvailable: 'manualReviewAvailable',
  finalHumanDecision: 'humanReviewAvailable',
  makesFinalClaimDecision: 'makesFinalClaimDecision',
  approvesClaims: 'makesFinalClaimDecision',
  rejectsClaims: 'makesFinalClaimDecision',
  automatedFinalDecision: 'fullyAutomatedDecision',
  usesFacialRecognitionTechnology: 'usesFacialRecognition',
  usesEmotionRecognition: 'usesEmotionDetection',
  usesBiometrics: 'processesBiometricData',
  processesHealthInformation: 'processesHealthData',
  processesClaimData: 'processesInsuranceClaimData',
  processesClaimantData: 'processesClaimantData',
  claimantsAffected: 'affectedPersons',
  primaryUser: 'primaryUsers',
  primaryUsersList: 'primaryUsers',
  affectedPeople: 'affectedPersons',
  affectedPersonsList: 'affectedPersons',
  purpose: 'systemPurpose',
  systemContext: 'deploymentContext',
  inputs: 'systemInputs',
  outputs: 'systemOutputs',
  decisions: 'decisionsSupported',
  decisionSupported: 'decisionsSupported',
  humanRole: 'humanRoleDescription'
});

function loadEnvIfNeeded() {
  const envPathDot = path.resolve(__dirname, '../.env');
  const envPathNoDot = path.resolve(__dirname, '../env');
  dotenv.config({ path: envPathDot });
  dotenv.config({ path: envPathNoDot });
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeForEvidence(value) {
  return normalizeWhitespace(value)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .toLowerCase();
}

function stripCodeFences(value) {
  const text = String(value || '').trim();
  if (!text.startsWith('```')) return text;
  const withoutOpen = text.replace(/^```(?:json)?/i, '').trim();
  return withoutOpen.replace(/```$/i, '').trim();
}

function parseJsonResponse(text) {
  const cleaned = stripCodeFences(text);
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw error;
  }
}

function toUserMessageRecords(messages) {
  return (messages || [])
    .filter((message) => message.sender === 'user' && normalizeWhitespace(message.text))
    .map((message, index) => ({
      id: String(message._id || message.id || `user-message-${index + 1}`),
      index,
      text: normalizeWhitespace(message.text)
    }));
}

function findEvidenceMessage(evidence, userMessages) {
  const normalizedEvidence = normalizeForEvidence(evidence);
  if (!normalizedEvidence) return null;
  return userMessages.find((message) => normalizeForEvidence(message.text).includes(normalizedEvidence)) || null;
}

function normalizeFactName(fact, supportedFactNames) {
  const raw = normalizeWhitespace(fact);
  if (!raw) return null;
  if (supportedFactNames.has(raw)) return raw;
  if (FACT_ALIASES[raw] && supportedFactNames.has(FACT_ALIASES[raw])) return FACT_ALIASES[raw];

  const compact = raw.replace(/[^a-z0-9]/gi, '').toLowerCase();
  for (const name of supportedFactNames) {
    if (name.replace(/[^a-z0-9]/gi, '').toLowerCase() === compact) return name;
  }
  for (const [alias, canonical] of Object.entries(FACT_ALIASES)) {
    if (alias.replace(/[^a-z0-9]/gi, '').toLowerCase() === compact && supportedFactNames.has(canonical)) {
      return canonical;
    }
  }
  return null;
}

function normalizeFactValue(status, value) {
  if (status === 'false') return false;
  if (status === 'planned' || value === 'planned_or_uncertain') return 'planned_or_uncertain';
  if (Array.isArray(value)) return value.map((item) => normalizeWhitespace(item)).filter(Boolean).join('; ');
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return String(value);
  if (value === null || value === undefined || value === '') return status === 'confirmed' ? true : null;
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    if (['true', 'yes', 'confirmed'].includes(lower)) return true;
    if (['false', 'no'].includes(lower)) return false;
    return normalizeWhitespace(value);
  }
  return normalizeWhitespace(JSON.stringify(value));
}

function isAcceptableStatus(status) {
  return status === 'confirmed' || status === 'false' || status === 'planned';
}

function normalizeSemanticKind(kind) {
  const normalized = normalizeWhitespace(kind).replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
  if (SEMANTIC_KIND_ALIASES[normalized]) return SEMANTIC_KIND_ALIASES[normalized];
  return SEMANTIC_KINDS.has(normalized) ? normalized : 'other';
}

function normalizeSemanticPolarity(rawCandidate) {
  const raw = normalizeWhitespace(rawCandidate?.polarity || rawCandidate?.status || '');
  const compact = raw.toLowerCase();
  if (['false', 'negative', 'negated', 'excluded', 'not_applicable'].includes(compact)) return 'false';
  if (['planned', 'future'].includes(compact)) return 'planned';
  if (['uncertain', 'inferred', 'unknown'].includes(compact)) return compact;
  if (rawCandidate?.value === false) return 'false';

  const predicate = normalizeWhitespace(rawCandidate?.predicate).toLowerCase();
  if (/does\s*not|do\s*not|doesn't|don't|not\b|without\b|no\b/.test(predicate)) return 'false';
  return 'confirmed';
}

function semanticText(candidate) {
  return [
    candidate.kind,
    candidate.subject,
    candidate.predicate,
    candidate.object,
    candidate.value,
    candidate.ontologyCandidate,
    candidate.evidence
  ].map(normalizeWhitespace).join(' ').toLowerCase();
}

function semanticHas(candidate, patterns) {
  const text = semanticText(candidate);
  return patterns.some((pattern) => pattern.test(text));
}

function isManualReviewRequestOnlyEvidence(evidence) {
  const text = normalizeForEvidence(evidence);
  return /\b(claimants?|employees?|students?|affected people|users?)\b.*\b(request|ask|appeal|challenge)\b.*\b(manual review|second manual review|review)\b/.test(text) &&
    !/\b(claims?\s+officer|officer|manager|human reviewer|reviewer|counselor|counsellor)\b.*\b(review|reviews|reviewed)\b.*\b(recommendation|output|schedule|claim)\b/.test(text);
}

function factIdentity(item) {
  return [
    item.fact,
    String(item.value),
    item.messageIndex === null || item.messageIndex === undefined ? 'unknown' : item.messageIndex,
    item.sourceText
  ].join('|');
}

function createMappedFact({ fact, value, evidence, evidenceMessage, factLabels, confidence = 0.84, semanticCandidate = null }) {
  return {
    fact,
    label: factLabels[fact] || fact,
    value,
    sourceText: evidence,
    source: 'LLM_EXTRACTED',
    evidenceSource: 'USER_EVIDENCE',
    provenance: ['LLM_EXTRACTED', 'USER_EVIDENCE'],
    extractionMethod: semanticCandidate ? 'SEMANTIC_CANDIDATE_MAP' : 'CANONICAL_FACT',
    semanticCandidate,
    sourceMessageId: semanticCandidate?.sourceMessageId || evidenceMessage.id,
    messageIndex: evidenceMessage.index,
    confidence,
    recordedAt: new Date().toISOString()
  };
}

function addMappedFact(target, seen, params) {
  if (!params.fact || !Object.prototype.hasOwnProperty.call(params.factLabels, params.fact)) return;
  const entry = createMappedFact(params);
  const key = factIdentity(entry);
  if (!seen.has(key)) {
    target.push(entry);
    seen.add(key);
  }
}

function addMappedListFact(target, seen, params) {
  const value = normalizeWhitespace(params.value);
  if (!value) return;
  addMappedFact(target, seen, { ...params, value });
}

function semanticSubjectLooksLikeSystemName(subjectValue) {
  const value = normalizeWhitespace(subjectValue);
  if (!value) return false;
  if (/^(customers?|users?|students?|employees?|applicants?|candidates?|claimants?|patients?|citizens?|people|individuals|support agents?|agents?|officers?|claims?\s+officers?|hr staff|human resources|recruiters?|hiring managers?|managers?|reviewers?|specialists?|teachers?|counselors?|counsellors?|senior agents?)$/i.test(value)) {
    return false;
  }
  return /\b(ai|artificial intelligence|system|tool|model|application|software|platform)\b/i.test(value);
}

function mapSemanticCandidateToFacts(candidate, { evidence, evidenceMessage, factLabels, seen }) {
  const facts = [];
  const status = normalizeSemanticPolarity(candidate);
  const kind = normalizeSemanticKind(candidate.kind);
  const isFalse = status === 'false';
  const subjectValue = normalizeWhitespace(candidate.subject);
  const objectValue = normalizeWhitespace(candidate.object || candidate.value || candidate.ontologyCandidate);
  const text = semanticText({ ...candidate, kind });
  const add = (fact, value = isFalse ? false : true, confidence = 0.82) =>
    addMappedFact(facts, seen, {
      fact,
      value,
      evidence,
      evidenceMessage,
      factLabels,
      confidence,
      semanticCandidate: { ...candidate, kind, polarity: status }
    });
  const addList = (fact, value = objectValue, confidence = 0.82) =>
    addMappedListFact(facts, seen, {
      fact,
      value,
      evidence,
      evidenceMessage,
      factLabels,
      confidence,
      semanticCandidate: { ...candidate, kind, polarity: status }
    });

  if (kind === 'purpose' && semanticSubjectLooksLikeSystemName(subjectValue)) {
    addList('systemName', subjectValue, 0.74);
  }

  if (semanticHas(candidate, [/\bclaimants?\b/])) {
    add('insuranceContext', true, 0.76);
    addList('affectedPersons', 'Claimants', 0.76);
  }

  if (['domain', 'purpose'].includes(kind)) {
    if (semanticHas(candidate, [/\binsurance\b/, /\bclaimants?\b/, /\bclaims?\s+(officer|handler|adjuster|assessment|recommendation|decision)\b/])) {
      add('insuranceContext', true, 0.86);
    }
    if (semanticHas(candidate, [/\bemployment\b/, /\bworkforce\b/, /\bemployees?\b/, /\bhr\b/, /\bmanager\b/])) add('employmentContext', true, 0.82);
    if (semanticHas(candidate, [/\bmanufacturing\b/])) add('manufacturingContext', true, 0.82);
    if (semanticHas(candidate, [/\buniversity\b/, /\bstudents?\b/, /\beducation\b/, /\bcounselors?\b/])) add('educationContext', true, 0.8);
  }

  if (kind === 'purpose') {
    addList('systemPurpose', objectValue || evidence, 0.78);
  }
  if (kind === 'purpose' && semanticHas(candidate, [/\bclaim\b.*\b(assess|recommend|support|review|triage)\b/, /\binsurance\b.*\bclaim\b/])) {
    add('insuranceClaimsPurpose', true, 0.88);
  }
  if (semanticHas(candidate, [/\brecommend\w*\b.*\bclaim\b/, /\bclaim\b.*\brecommend\w*\b/]) && ['purpose', 'output', 'decision_supported'].includes(kind)) {
    add('recommendsClaimAssessment', !isFalse, 0.88);
    add('insuranceClaimsPurpose', true, 0.84);
  }
  if (kind === 'purpose' && semanticHas(candidate, [/\bshift\b/, /\bscheduling\b/, /\bworkforce scheduling\b/])) {
    add('workforceSchedulingPurpose', true, 0.84);
  }

  if (['actor', 'primary_user'].includes(kind)) {
    addList('primaryUsers', subjectValue || objectValue, 0.8);
  }
  if (kind === 'affected_person') {
    addList('affectedPersons', objectValue, 0.82);
    if (semanticHas(candidate, [/\bclaimants?\b/])) {
      add('insuranceContext', true, 0.78);
      add('processesClaimantData', true, 0.76);
    }
  }

  if (['input_data', 'data_processing'].includes(kind)) {
    addList('systemInputs', objectValue, 0.78);
    if (semanticHas(candidate, [/\bpersonal\b/, /\bclaimants?\b/, /\bemployees?\b/, /\bstudents?\b/])) add('processesPersonalData', true, 0.76);
    if (semanticHas(candidate, [/\bclaim\b/, /\binsurance\b/])) add('processesInsuranceClaimData', true, 0.84);
    if (semanticHas(candidate, [/\bclaimants?\b/])) add('processesClaimantData', true, 0.84);
    if (semanticHas(candidate, [/\bhealth\b/, /\bmedical\b/])) add('processesHealthData', !isFalse, 0.78);
    if (semanticHas(candidate, [/\bbiometric\b/, /\bbiometrics\b/])) add('processesBiometricData', !isFalse, 0.78);
  }

  if (kind === 'output') {
    addList('systemOutputs', objectValue, 0.78);
    if (semanticHas(candidate, [/\bclaim\b.*\brecommend\w*\b/, /\brecommend\w*\b.*\bclaim\b/])) add('recommendsClaimAssessment', !isFalse, 0.86);
  }

  if (kind === 'decision_supported') {
    addList('decisionsSupported', objectValue, 0.8);
    if (semanticHas(candidate, [/\bclaim\b/])) {
      add('insuranceClaimsPurpose', true, 0.84);
      add('recommendsClaimAssessment', !isFalse, 0.84);
    }
  }

  if (kind === 'human_role') {
    addList('humanRoleDescription', evidence, 0.78);
    if (semanticHas(candidate, [/\bclaims?\s+officer\b.*\brecommendation\b/, /\brecommendation\b.*\bclaims?\s+officer\b/])) {
      add('recommendsClaimAssessment', true, 0.82);
    }
    const requestOnlyManualReview = /\b(claimants?|employees?|students?|affected people)\b.*\b(request|ask|appeal|challenge)\b.*\bmanual review\b/.test(text);
    const reviewerReviewsOutput = /\b(claims?\s+officer|officer|manager|human|reviewer|counselor|counsellor)\b.*\b(review|reviews|reviewed)\b.*\b(recommendation|output|schedule|claim)\b/.test(text);
    if (reviewerReviewsOutput && !requestOnlyManualReview) add('humanReviewAvailable', !isFalse, 0.86);
    if (semanticHas(candidate, [/\boverride\b/])) add('humanCanOverride', !isFalse, 0.86);
    if (semanticHas(candidate, [/\bmodify\b/, /\bchange\b/, /\badjust\b/])) add('humanCanModify', !isFalse, 0.84);
    if (semanticHas(candidate, [/\breject\b/])) add('humanCanReject', !isFalse, 0.84);
  }

  if (['safeguard', 'right'].includes(kind)) {
    if (semanticHas(candidate, [/\bexplanation\b/, /\breason\b/])) add('explanationAvailable', !isFalse, 0.86);
    if (semanticHas(candidate, [/\bcorrect\b/, /\bcorrection\b/, /\binaccurate\b/])) add('correctionRightAvailable', !isFalse, 0.86);
    if (semanticHas(candidate, [/\bmanual review\b/, /\bsecond review\b/, /\bhuman review request\b/])) add('manualReviewAvailable', !isFalse, 0.86);
    if (semanticHas(candidate, [/\bchallenge\b/, /\bappeal\b/, /\bcontest\b/])) {
      add('challengeMechanismAvailable', !isFalse, 0.84);
      add('appealMechanismAvailable', !isFalse, 0.82);
    }
    if (semanticHas(candidate, [/\binformed\b/, /\bnotice\b/, /\btransparency\b/])) add('affectedPersonsInformed', !isFalse, 0.82);
    if (semanticHas(candidate, [/\bwithout penalty\b/, /\bwithout being penalized\b/, /\bnon[- ]penalty\b/])) add('nonPenaltyForReviewRequest', !isFalse, 0.82);
  }

  if (kind === 'access_control' || semanticHas(candidate, [/\baccess\b.*\b(limited|restricted|authorized|authorised)\b/])) {
    add('accessRestricted', !isFalse, 0.84);
    if (semanticHas(candidate, [/\bauthorized\b/, /\bauthorised\b/, /\bstaff only\b/, /\bonly\b.*\b(staff|managers?|officers?)\b/])) {
      add('authorizedStaffOnly', !isFalse, 0.8);
    }
  }

  if (kind === 'retention' || semanticHas(candidate, [/\bretention\b/, /\bretained for\b/])) {
    add('retentionPeriodDefined', !isFalse, 0.84);
    if (objectValue && !['true', 'false'].includes(objectValue.toLowerCase())) addList('retentionPeriod', objectValue, 0.78);
  }

  if (kind === 'exclusion' || kind === 'automation_boundary') {
    if (semanticHas(candidate, [/\bfinal claim\b/, /\bapprove\b.*\bclaims?\b/, /\breject\b.*\bclaims?\b/, /\bclaims?\b.*\b(approval|rejection|decision)\b/])) {
      add('makesFinalClaimDecision', isFalse ? false : true, 0.86);
    }
    if (semanticHas(candidate, [/\bfully automated\b/, /\bsolely automated\b/, /\bwithout human\b/])) add('fullyAutomatedDecision', isFalse ? false : true, 0.84);
    if (semanticHas(candidate, [/\bfacial recognition\b/])) add('usesFacialRecognition', isFalse ? false : true, 0.84);
    if (semanticHas(candidate, [/\bemotion (detection|recognition)\b/])) add('usesEmotionDetection', isFalse ? false : true, 0.84);
    if (semanticHas(candidate, [/\bhealth data\b/, /\bmedical data\b/])) add('processesHealthData', isFalse ? false : true, 0.82);
    if (semanticHas(candidate, [/\bbiometric\b/])) add('processesBiometricData', isFalse ? false : true, 0.82);
  }

  return facts;
}

function findForbiddenAssessmentKeys(value, pathParts = []) {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findForbiddenAssessmentKeys(item, [...pathParts, `[${index}]`]));
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const currentPath = [...pathParts, key].join('.');
    const matches = FORBIDDEN_ASSESSMENT_KEYS.has(key) ? [currentPath] : [];
    return matches.concat(findForbiddenAssessmentKeys(child, [...pathParts, key]));
  });
}

function buildPrompt({ userMessages, previousState, factLabels }) {
  const schema = Object.entries(factLabels)
    .map(([fact, label]) => ({ fact, label }))
    .sort((a, b) => a.fact.localeCompare(b.fact));

  return `You are a constrained structured-fact extractor for an ontology chat.

You must ONLY extract facts from the supplied conversation messages.
You must NOT produce final risks, legal conclusions, EU AI Act classifications, ethical violations, ontology inferences, recommended legal articles, scores, thresholds, or qualitative assessment labels.

Return valid JSON only with this exact shape:
{
  "systemUnderstanding": {
    "name": null,
    "purpose": null,
    "primaryUsers": [],
    "affectedPersons": [],
    "deploymentContext": null,
    "inputs": [],
    "outputs": [],
    "decisionsSupported": [],
    "humanRole": null
  },
  "facts": [
    {
      "fact": "canonicalFactName",
      "value": true,
      "status": "confirmed",
      "evidence": "Exact sentence copied from one supplied conversation message.",
      "sourceMessageId": "message id from the supplied conversation"
    }
  ],
  "semanticCandidates": [
    {
      "kind": "purpose",
      "subject": "AI system or actor named in the evidence",
      "predicate": "supports",
      "object": "insurance claim assessment",
      "value": true,
      "polarity": "confirmed",
      "ontologyCandidate": "InsuranceClaimsSupport",
      "evidence": "Exact sentence copied from one supplied conversation message.",
      "sourceMessageId": "message id from the supplied conversation"
    }
  ],
  "unknownFacts": [],
  "possibleContradictions": []
}

Allowed statuses: confirmed, false, uncertain, planned, inferred, unknown.
Only confirmed, false, and planned facts can be used by the pipeline, and each of those MUST include an exact evidence sentence copied from the supplied conversation.
For list-like facts such as primaryUsers, affectedPersons, systemInputs, systemOutputs, or decisionsSupported, put a short semicolon-separated string in "value".
Use semanticCandidates when the statement is clear but the exact canonical fact name is not obvious. semanticCandidates are NOT final classifications or risks. They are ontology-aligned extraction candidates that the backend will validate and deterministically map to canonical facts.
Allowed semanticCandidate kinds: domain, purpose, actor, primary_user, affected_person, input_data, data_processing, output, decision_supported, human_role, safeguard, right, exclusion, automation_boundary, access_control, retention, consent, security, other.
Examples of semanticCandidates:
- "Claimants can request an explanation, correct inaccurate information, and ask for a second manual review." -> right / claimants / canRequest / explanation; right / claimants / canCorrect / inaccurate information; right / claimants / canRequest / manual review. Do NOT convert this sentence to humanReviewAvailable unless a human reviewer reviewing the AI output is explicitly stated.
- "A trained claims officer reviews every recommendation." -> human_role / claims officer / reviews / every recommendation.
- "It does not approve or reject claims." -> exclusion / system / doesNotPerform / final claim approval or rejection.
- "The officer can modify or reject the recommendation." -> human_role / claims officer / canModifyOrReject / recommendation.
For every non-null systemUnderstanding field, also include a corresponding fact when supported by evidence:
- name -> systemName
- purpose -> systemPurpose
- primaryUsers -> primaryUsers
- affectedPersons -> affectedPersons
- deploymentContext -> deploymentContext
- inputs -> systemInputs
- outputs -> systemOutputs
- decisionsSupported -> decisionsSupported
- humanRole -> humanRoleDescription

Supported canonical fact schema:
${JSON.stringify(schema, null, 2)}

Existing structured facts, for continuity only. Do not invent evidence from these:
${JSON.stringify(previousState?.confirmedFacts || {}, null, 2)}

Conversation messages:
${JSON.stringify(userMessages, null, 2)}
`;
}

function validateExtractorPayload(payload, { userMessages, factLabels }) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Gemini extractor returned a non-object JSON payload.');
  }

  const unsupportedTopLevelKeys = Object.keys(payload).filter((key) => !ALLOWED_TOP_LEVEL_KEYS.has(key));
  if (unsupportedTopLevelKeys.length) {
    throw new Error(`Gemini extractor returned unsupported top-level fields: ${unsupportedTopLevelKeys.join(', ')}`);
  }

  const forbiddenKeysReturned = findForbiddenAssessmentKeys(payload);
  if (forbiddenKeysReturned.length) {
    throw new Error(`Gemini extractor returned forbidden assessment fields: ${forbiddenKeysReturned.join(', ')}`);
  }

  if (!Array.isArray(payload.facts)) {
    throw new Error('Gemini extractor returned invalid schema: facts must be an array.');
  }

  if (payload.semanticCandidates !== undefined && !Array.isArray(payload.semanticCandidates)) {
    throw new Error('Gemini extractor returned invalid schema: semanticCandidates must be an array.');
  }

  if (payload.unknownFacts !== undefined && !Array.isArray(payload.unknownFacts)) {
    throw new Error('Gemini extractor returned invalid schema: unknownFacts must be an array.');
  }

  if (payload.possibleContradictions !== undefined && !Array.isArray(payload.possibleContradictions)) {
    throw new Error('Gemini extractor returned invalid schema: possibleContradictions must be an array.');
  }

  const supportedFactNames = new Set(Object.keys(factLabels || {}));
  const acceptedFacts = [];
  const rejectedFacts = [];
  const unknownFacts = [];
  const acceptedSemanticCandidates = [];
  const rejectedSemanticCandidates = [];
  const acceptedFactIdentities = new Set();
  const possibleContradictions = Array.isArray(payload.possibleContradictions)
    ? payload.possibleContradictions.slice(0, 20)
    : [];

  const rawFacts = Array.isArray(payload.facts) ? payload.facts : [];
  rawFacts.forEach((rawFact, index) => {
    const status = normalizeWhitespace(rawFact?.status || 'unknown');
    const canonicalFact = normalizeFactName(rawFact?.fact, supportedFactNames);
    const evidence = normalizeWhitespace(rawFact?.evidence);

    if (!ALLOWED_STATUSES.has(status)) {
      rejectedFacts.push({ index, fact: rawFact?.fact, reason: 'unsupported_status', status });
      return;
    }
    if (!canonicalFact) {
      rejectedFacts.push({ index, fact: rawFact?.fact, reason: 'unsupported_fact_name' });
      return;
    }

    if (!isAcceptableStatus(status)) {
      unknownFacts.push({
        fact: canonicalFact,
        status,
        value: rawFact?.value ?? null,
        reason: 'not_a_confirmed_fact'
      });
      return;
    }

    const evidenceMessage = findEvidenceMessage(evidence, userMessages);
    if (!evidence || !evidenceMessage) {
      rejectedFacts.push({
        index,
        fact: canonicalFact,
        status,
        reason: 'evidence_not_found_in_supplied_conversation',
        evidence
      });
      return;
    }

    const value = normalizeFactValue(status, rawFact?.value);
    if (value === null || value === undefined || value === '') {
      rejectedFacts.push({ index, fact: canonicalFact, status, reason: 'empty_value' });
      return;
    }

    if (canonicalFact === 'humanReviewAvailable' && value === true && isManualReviewRequestOnlyEvidence(evidence)) {
      rejectedFacts.push({
        index,
        fact: canonicalFact,
        status,
        reason: 'manual_review_right_is_not_system_output_human_review',
        evidence
      });
      return;
    }

    addMappedFact(acceptedFacts, acceptedFactIdentities, {
      fact: canonicalFact,
      value,
      evidence,
      evidenceMessage,
      factLabels,
      confidence: status === 'planned' ? 0.72 : 0.86,
      semanticCandidate: null
    });
  });

  const rawSemanticCandidates = Array.isArray(payload.semanticCandidates) ? payload.semanticCandidates : [];
  rawSemanticCandidates.forEach((rawCandidate, index) => {
    const polarity = normalizeSemanticPolarity(rawCandidate);
    const evidence = normalizeWhitespace(rawCandidate?.evidence);
    const kind = normalizeSemanticKind(rawCandidate?.kind);

    if (!ALLOWED_STATUSES.has(polarity)) {
      rejectedSemanticCandidates.push({ index, kind, reason: 'unsupported_polarity', polarity });
      return;
    }

    if (!isAcceptableStatus(polarity)) {
      unknownFacts.push({
        fact: normalizeWhitespace(rawCandidate?.ontologyCandidate || rawCandidate?.object || kind),
        status: polarity,
        value: rawCandidate?.value ?? rawCandidate?.object ?? null,
        reason: 'semantic_candidate_not_confirmed'
      });
      return;
    }

    const evidenceMessage = findEvidenceMessage(evidence, userMessages);
    if (!evidence || !evidenceMessage) {
      rejectedSemanticCandidates.push({
        index,
        kind,
        reason: 'evidence_not_found_in_supplied_conversation',
        evidence
      });
      return;
    }

    const semanticCandidate = {
      kind,
      subject: normalizeWhitespace(rawCandidate?.subject),
      predicate: normalizeWhitespace(rawCandidate?.predicate),
      object: normalizeWhitespace(rawCandidate?.object),
      value: rawCandidate?.value ?? null,
      polarity,
      ontologyCandidate: normalizeWhitespace(rawCandidate?.ontologyCandidate),
      evidence,
      sourceMessageId: rawCandidate?.sourceMessageId || evidenceMessage.id,
      messageIndex: evidenceMessage.index
    };
    const mappedFacts = mapSemanticCandidateToFacts(semanticCandidate, {
      evidence,
      evidenceMessage,
      factLabels,
      seen: acceptedFactIdentities
    });

    if (!mappedFacts.length) {
      rejectedSemanticCandidates.push({
        index,
        kind,
        reason: 'no_deterministic_mapping',
        ontologyCandidate: semanticCandidate.ontologyCandidate,
        object: semanticCandidate.object
      });
      return;
    }

    acceptedSemanticCandidates.push({
      ...semanticCandidate,
      mappedFacts: mappedFacts.map((fact) => fact.fact)
    });
    acceptedFacts.push(...mappedFacts);
  });

  return {
    acceptedFacts,
    rejectedFacts,
    unknownFacts,
    acceptedSemanticCandidates,
    rejectedSemanticCandidates,
    possibleContradictions,
    systemUnderstanding: payload.systemUnderstanding || null
  };
}

async function extractOntologyChatFactsWithGemini({ messages, previousState, factLabels }) {
  const userMessages = toUserMessageRecords(messages);
  if (!userMessages.length) {
    return {
      status: 'skipped',
      reason: 'No user conversation text supplied to Gemini extractor.',
      acceptedFacts: [],
      rejectedFacts: [],
      acceptedSemanticCandidates: [],
      rejectedSemanticCandidates: [],
      unknownFacts: [],
      possibleContradictions: []
    };
  }

  loadEnvIfNeeded();
  const apiKey = normalizeWhitespace(process.env.GEMINI_API_KEY);
  if (!apiKey) {
    return {
      status: 'partial',
      reason: 'GEMINI_API_KEY is not configured; deterministic extraction was used.',
      acceptedFacts: [],
      rejectedFacts: [],
      acceptedSemanticCandidates: [],
      rejectedSemanticCandidates: [],
      unknownFacts: [],
      possibleContradictions: []
    };
  }

  const prompt = buildPrompt({ userMessages, previousState, factLabels });
  const preferredModelName = normalizeWhitespace(process.env.GEMINI_ONTOLOGY_CHAT_MODEL || process.env.GEMINI_MODEL || 'gemini-flash-lite-latest');
  const modelNames = Array.from(new Set([
    preferredModelName,
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.6-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash'
  ].filter(Boolean)));
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0,
          topP: 0.1,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json'
        }
      });

      const result = await model.generateContent(prompt);
      const rawText = result?.response?.text?.() || '';
      const rawJson = parseJsonResponse(rawText);
      const validated = validateExtractorPayload(rawJson, { userMessages, factLabels });

      return {
        status: validated.rejectedFacts.length || validated.rejectedSemanticCandidates.length ? 'partial' : 'accepted',
        model: modelName,
        promptSchema: {
          supportedFacts: Object.keys(factLabels || {}).sort(),
          semanticCandidateKinds: Array.from(SEMANTIC_KINDS).sort(),
          forbiddenOutputs: Array.from(FORBIDDEN_ASSESSMENT_KEYS).sort(),
          requiredEvidence: 'confirmed, false, and planned facts require exact conversation evidence'
        },
        acceptedFacts: validated.acceptedFacts,
        rejectedFacts: validated.rejectedFacts,
        acceptedSemanticCandidates: validated.acceptedSemanticCandidates,
        rejectedSemanticCandidates: validated.rejectedSemanticCandidates,
        unknownFacts: validated.unknownFacts,
        possibleContradictions: validated.possibleContradictions,
        systemUnderstanding: validated.systemUnderstanding,
        rawResponse: rawJson,
        stats: {
          userMessagesSupplied: userMessages.length,
          acceptedFacts: validated.acceptedFacts.length,
          rejectedFacts: validated.rejectedFacts.length,
          acceptedSemanticCandidates: validated.acceptedSemanticCandidates.length,
          rejectedSemanticCandidates: validated.rejectedSemanticCandidates.length,
          unknownFacts: validated.unknownFacts.length
        }
      };
    } catch (error) {
      lastError = error;
      const message = error.message || String(error);
      const modelUnavailable = /404|not found|not supported|not available/i.test(message);
      const quotaExhausted = message.includes('429') || /quota|RESOURCE_EXHAUSTED|free_tier/i.test(message);
      // On unavailable model (404) or quota exhaustion (429) try the next model.
      if (!modelUnavailable && !quotaExhausted) break;
    }
  }

  return {
    status: 'partial',
    model: modelNames.join(', '),
    reason: lastError?.message || String(lastError || 'Gemini extraction failed.'),
    acceptedFacts: [],
    rejectedFacts: [],
    acceptedSemanticCandidates: [],
    rejectedSemanticCandidates: [],
    unknownFacts: [],
    possibleContradictions: []
  };
}

module.exports = {
  extractOntologyChatFactsWithGemini,
  validateExtractorPayload,
  buildPrompt
};
