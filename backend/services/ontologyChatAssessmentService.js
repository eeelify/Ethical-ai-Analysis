const PROVENANCE_TYPES = Object.freeze([
  'USER_CONFIRMED',
  'USER_EVIDENCE',
  'PROJECT_METADATA',
  'LLM_EXTRACTED',
  'NEO4J_GRAPH_LOOKUP',
  'NEO4J_RULE_INFERENCE',
  'OWL_ASSERTED',
  'OWL_INFERRED',
  'SWRL_INFERRED',
  'KEYWORD_FALLBACK'
]);

const ASSESSMENT_VERSION = 'ontology-chat-semantic-facts-v2';

const FACT_LABELS = Object.freeze({
  systemName: 'System name',
  systemPurpose: 'System purpose',
  primaryUsers: 'Primary users',
  affectedPersons: 'Affected persons',
  deploymentContext: 'Deployment context',
  systemInputs: 'System inputs',
  systemOutputs: 'System outputs',
  decisionsSupported: 'Decisions supported',
  humanRoleDescription: 'Human role description',
  educationContext: 'Education context',
  studentWellbeingPurpose: 'Student wellbeing purpose',
  providesMedicalDiagnosis: 'Provides medical diagnosis',
  influencesMedicalTreatment: 'Influences medical treatment',
  producesIndividualRiskScore: 'Produces individual risk score',
  profilesIndividualCharacteristic: 'Evaluates or predicts an individual characteristic',
  recommendsCounselorContact: 'Recommends counselor contact',
  recommendsPersonalizedContent: 'Recommends personalized content',
  assignsAcademicGrade: 'Assigns academic grade',
  evaluatesLearningOutcome: 'Evaluates learning outcome',
  monitorsExaminationBehaviour: 'Monitors examination behaviour',
  processesPersonalData: 'Processes personal data',
  processesHealthRelatedData: 'Processes health-related data',
  processesWearableData: 'Processes wearable data',
  processesQuestionnaireData: 'Processes questionnaire responses',
  processesJournalEntries: 'Processes journal entries',
  processesAttendanceRecords: 'Processes attendance records',
  processesAcademicPerformanceData: 'Processes academic performance data',
  humanReviewAvailable: 'Human review available',
  humanCanOverride: 'Human can override',
  explicitConsent: 'Explicit consent',
  legalBasisDocumented: 'Legal basis documented',
  wearableDataOptional: 'Wearable data optional',
  participationVoluntary: 'Participation voluntary',
  withdrawalAvailable: 'Withdrawal available',
  purposeLimitation: 'Purpose limitation',
  educationalAuthorization: 'Educational authorization',
  retentionPeriodDefined: 'Retention period defined',
  pseudonymizationUsed: 'Pseudonymization used',
  appealMechanismAvailable: 'Appeal mechanism available',
  usedForModelTraining: 'Used for model training',
  securityMeasuresDocumented: 'Security measures documented',
  employmentContext: 'Employment context',
  manufacturingContext: 'Manufacturing context',
  workforceSchedulingPurpose: 'Workforce scheduling purpose',
  recommendsMonthlyShiftSchedule: 'Recommends monthly shift schedule',
  fairShiftDistributionObjective: 'Fair shift distribution objective',
  preventsExcessiveWorkload: 'Prevents excessive workload',
  processesEmployeeAvailability: 'Processes employee availability',
  processesWorkingHourPreferences: 'Processes working-hour preferences',
  processesJobQualifications: 'Processes job qualifications',
  processesPreviousShiftAssignments: 'Processes previous shift assignments',
  processesWeeklyWorkingLimits: 'Processes weekly working limits',
  processesHRRecords: 'Processes HR records',
  humanCanModify: 'Human can modify output',
  humanCanReject: 'Human can reject output',
  decisionPublishedOnlyAfterHumanReview: 'Decision published only after human review',
  explanationAvailable: 'Explanation available',
  correctionRightAvailable: 'Correction right available',
  challengeMechanismAvailable: 'Challenge mechanism available',
  manualReviewAvailable: 'Manual review available',
  nonPenaltyForReviewRequest: 'No penalty for review request',
  employeesInformed: 'Employees informed',
  affectedPersonsInformed: 'Affected persons informed',
  accessRestricted: 'Access restricted',
  authorizedHRAndManagersOnly: 'Authorized HR staff and managers only',
  authorizedStaffOnly: 'Authorized staff only',
  retentionPeriod: 'Retention period',
  makesHiringDecision: 'Makes hiring decision',
  makesFiringDecision: 'Makes firing decision',
  makesPromotionDecision: 'Makes promotion decision',
  makesSalaryDecision: 'Makes salary decision',
  makesDisciplinaryDecision: 'Makes disciplinary decision',
  usesFacialRecognition: 'Uses facial recognition',
  usesEmotionDetection: 'Uses emotion detection',
  processesHealthData: 'Processes health data',
  processesBiometricData: 'Processes biometric data',
  insuranceContext: 'Insurance context',
  insuranceClaimsPurpose: 'Insurance claims purpose',
  recommendsClaimAssessment: 'Recommends claim assessment',
  makesFinalClaimDecision: 'Makes final claim decision',
  fullyAutomatedDecision: 'Fully automated decision',
  processesInsuranceClaimData: 'Processes insurance claim data',
  processesClaimantData: 'Processes claimant data'
});

const UNKNOWN_FACTS = Object.freeze({
  retentionPeriodDefined: null,
  pseudonymizationUsed: null,
  appealMechanismAvailable: null,
  usedForModelTraining: null,
  securityMeasuresDocumented: null
});

const DISPLAY_LABELS = Object.freeze({
  ProfilingAI: 'Profiling AI',
  MedicalDiagnosisAI: 'Medical diagnosis AI',
  AutomatedGradingAI: 'Automated grading AI',
  RemoteProctoringAI: 'Remote proctoring AI',
  ContentRecommendationAI: 'Content recommendation AI',
  Education: 'Education',
  StudentWellbeing: 'Student wellbeing',
  RiskScoring: 'Risk scoring',
  DecisionSupport: 'Decision support',
  PersonalDataProcessing: 'Personal data processing',
  HealthRelatedDataProcessing: 'Health-related data processing',
  WearableDataProcessing: 'Wearable data processing',
  JournalTextProcessing: 'Journal text processing',
  AcademicRecordProcessing: 'Academic record processing',
  CounselorInterventionPrioritization: 'Counselor intervention prioritization',
  NonBindingRecommendation: 'Non-binding recommendation',
  Employment: 'Employment',
  Manufacturing: 'Manufacturing',
  WorkforceScheduling: 'Workforce scheduling',
  ShiftRecommendation: 'Shift recommendation',
  HRDataProcessing: 'HR data processing',
  HumanReviewedAI: 'Human-reviewed AI',
  EmployeeShiftAllocation: 'Employee shift allocation',
  HumanReviewedShiftRecommendation: 'Human-reviewed shift recommendation',
  HiringDecisionAI: 'Hiring decision AI',
  FiringDecisionAI: 'Firing decision AI',
  PromotionDecisionAI: 'Promotion decision AI',
  SalaryDecisionAI: 'Salary decision AI',
  DisciplinaryDecisionAI: 'Disciplinary decision AI',
  FacialRecognitionAI: 'Facial recognition AI',
  EmotionRecognitionAI: 'Emotion recognition AI',
  HealthDataProcessing: 'Health data processing',
  BiometricDataProcessing: 'Biometric data processing',
  Insurance: 'Insurance',
  InsuranceClaimsSupport: 'Insurance claims support',
  ClaimAssessmentRecommendation: 'Claim assessment recommendation'
});

const normalizeWhitespace = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const getProjectId = (project) => String(project?._id || project?.id || '');

const getProjectText = (project) => [
  project?.title ? `Project title: ${project.title}` : '',
  project?.shortDescription ? `Project short description: ${project.shortDescription}` : '',
  project?.fullDescription ? `Project full description: ${project.fullDescription}` : ''
].filter(Boolean).join('. ');

const splitSentences = (text) => {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?]+[.!?]?/g) || [normalized];
  return matches.map((item) => item.trim()).filter(Boolean);
};

const includesAny = (text, patterns) => patterns.some((pattern) => pattern.test(text));

const cleanEvidenceText = (sentence) => normalizeWhitespace(sentence).slice(0, 700);

function createFactEvidence({ fact, value, sourceText, source, messageIndex, confidence = 0.95 }) {
  return {
    fact,
    label: FACT_LABELS[fact] || fact,
    value,
    sourceText: cleanEvidenceText(sourceText),
    source,
    messageIndex,
    confidence,
    recordedAt: new Date().toISOString()
  };
}

function addFact(facts, fact, value, sentence, source, messageIndex, confidence = 0.95) {
  facts.push(createFactEvidence({
    fact,
    value,
    sourceText: sentence,
    source,
    messageIndex,
    confidence
  }));
}

function detectFactsInSentence(sentence, source, messageIndex) {
  const facts = [];
  const s = sentence.toLowerCase();

  if (includesAny(s, [/\b(university|student|students|school|academic|attendance|counselor|counsellor)\b/])) {
    addFact(facts, 'educationContext', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(stress|wellbeing|well-being|counseling|counselling|counselor|counsellor)\b/])) {
    addFact(facts, 'studentWellbeingPurpose', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(workforce|employee|employees|employment|hr staff|human resources|manager|managers)\b/])) {
    addFact(facts, 'employmentContext', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bmanufacturing\b/])) {
    addFact(facts, 'manufacturingContext', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\binsurance\b|\bclaimants?\b|\bclaims?\s+(officer|handler|adjuster|assessment|recommendation)\b/])) {
    addFact(facts, 'insuranceContext', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bclaimants?\b/])) {
    addFact(facts, 'affectedPersons', 'Claimants', sentence, source, messageIndex, 0.8);
    addFact(facts, 'processesClaimantData', true, sentence, source, messageIndex, 0.75);
  }
  if (includesAny(s, [/\bclaims?\s+(officer|handler|adjuster)s?\b/])) {
    addFact(facts, 'primaryUsers', 'Claims officers', sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\bclaim\b.{0,80}\b(assessment|recommendation|decision support|decision-support)\b|\b(assess|support|recommend)\w*\b.{0,80}\bclaim\b/])) {
    addFact(facts, 'insuranceClaimsPurpose', true, sentence, source, messageIndex, 0.85);
  }
  if (includesAny(s, [/\brecommend\w*\b.{0,80}\bclaim\b|\bclaim\b.{0,80}\brecommend\w*\b/])) {
    addFact(facts, 'recommendsClaimAssessment', true, sentence, source, messageIndex, 0.85);
  }
  if (includesAny(s, [/\bclaim(s|ant)?\s+(data|records?|information)\b|\binsurance claim data\b/])) {
    addFact(facts, 'processesInsuranceClaimData', true, sentence, source, messageIndex, 0.85);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.75);
  }
  if (includesAny(s, [/\b(workforce scheduling|shift schedule|shift scheduling|monthly shift schedule|assigned shifts|shift allocation)\b/])) {
    addFact(facts, 'workforceSchedulingPurpose', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\brecommend(s|ed)?\b.{0,80}\b(monthly )?shift schedule\b|\bmonthly shift schedule\b/])) {
    addFact(facts, 'recommendsMonthlyShiftSchedule', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdistribute\b.{0,80}\b(night|weekend)\b.{0,80}\bfair/i, /\bfairly\b.{0,80}\b(night|weekend|shift)/i, /\bfair shift\b|\bshifts fairly\b/])) {
    addFact(facts, 'fairShiftDistributionObjective', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bprevent(s|ing)? excessive workloads?\b|\bmaximum weekly working limits?\b|\bworking[- ]time limits?\b|\bweekly working limits?\b/])) {
    addFact(facts, 'preventsExcessiveWorkload', true, sentence, source, messageIndex);
  }

  if (includesAny(s, [/\b(may|might|could|future|planned|pilot)\b.{0,80}\bdiagnos(is|e|tic)\b/])) {
    addFact(facts, 'providesMedicalDiagnosis', 'planned_or_uncertain', sentence, source, messageIndex, 0.75);
  } else if (includesAny(s, [
    /\b(does not|doesn't|do not|don't|not|no|without)\b.{0,80}\bmedical diagnos(is|e|tic)\b/,
    /\bnot for\b.{0,80}\bdiagnos(is|e|tic)\b/,
    /\bno\b.{0,40}\bdiagnos(is|e|tic)\b/
  ])) {
    addFact(facts, 'providesMedicalDiagnosis', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\b(medical diagnosis|diagnose patients|diagnostic output|clinical diagnosis|disease prediction)\b/])) {
    addFact(facts, 'providesMedicalDiagnosis', true, sentence, source, messageIndex);
  }

  if (includesAny(s, [/\b(treatment|therapy|clinical treatment|prescription|medication)\b/])) {
    addFact(facts, 'influencesMedicalTreatment', true, sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\brisk score\b|\bstress score\b|\bscore and\b|\bscoring\b|\bprioriti[sz]ed?\b/])) {
    addFact(facts, 'producesIndividualRiskScore', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bstress risk score\b|\bindividual\b.{0,60}\b(score|risk)\b|\bhigh-risk score\b|\bprioriti[sz]ed for intervention\b/])) {
    addFact(facts, 'profilesIndividualCharacteristic', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\brecommend(s|ed)? whether\b.{0,120}\b(counselor|counsellor|contact)\b/, /\b(counselor|counsellor)\b.{0,80}\bcontact\b/])) {
    addFact(facts, 'recommendsCounselorContact', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(personali[sz]ed content|content recommendation|news feed|filter bubble|social media feed|product recommendation)\b/])) {
    addFact(facts, 'recommendsPersonalizedContent', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(does not|not|no)\b.{0,60}\b(personali[sz]ed content|content recommendation|news feed)\b/])) {
    addFact(facts, 'recommendsPersonalizedContent', false, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(automated grading|assigns? grades?|academic grade|grades students)\b/])) {
    addFact(facts, 'assignsAcademicGrade', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(learning outcome|student assessment|exam score|performance evaluation)\b/])) {
    addFact(facts, 'evaluatesLearningOutcome', true, sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\b(proctoring|exam monitoring|monitors? examination|remote exam|test surveillance)\b/])) {
    addFact(facts, 'monitorsExaminationBehaviour', true, sentence, source, messageIndex);
  }

  if (includesAny(s, [/\bdoes not make\b.{0,140}\bhiring\b|\b(no|not|without)\b.{0,60}\bhiring decision\b/])) {
    addFact(facts, 'makesHiringDecision', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bhiring decision\b|\bmake(s)? hiring\b|\bautomated hiring\b/])) {
    addFact(facts, 'makesHiringDecision', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not make\b.{0,140}\bfiring\b|\b(no|not|without)\b.{0,60}\bfiring decision\b/])) {
    addFact(facts, 'makesFiringDecision', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bfiring decision\b|\bmake(s)? firing\b|\btermination decision\b|\bautomated firing\b/])) {
    addFact(facts, 'makesFiringDecision', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not make\b.{0,140}\bpromotion\b|\b(no|not|without)\b.{0,60}\bpromotion decision\b/])) {
    addFact(facts, 'makesPromotionDecision', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bpromotion decision\b|\bmake(s)? promotion\b|\bautomated promotion\b/])) {
    addFact(facts, 'makesPromotionDecision', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not make\b.{0,140}\bsalary\b|\b(no|not|without)\b.{0,60}\bsalary decision\b/])) {
    addFact(facts, 'makesSalaryDecision', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bsalary decision\b|\bmake(s)? salary\b|\bpay decision\b|\bcompensation decision\b/])) {
    addFact(facts, 'makesSalaryDecision', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not make\b.{0,160}\bdisciplinary\b|\b(no|not|without)\b.{0,60}\bdisciplinary decision\b/])) {
    addFact(facts, 'makesDisciplinaryDecision', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bdisciplinary decision\b|\bmake(s)? disciplinary\b|\bautomated discipline\b/])) {
    addFact(facts, 'makesDisciplinaryDecision', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not use\b.{0,120}\bfacial recognition\b|\b(no|not|without)\b.{0,60}\bfacial recognition\b/])) {
    addFact(facts, 'usesFacialRecognition', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bfacial recognition\b/])) {
    addFact(facts, 'usesFacialRecognition', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not use\b.{0,120}\bemotion detection\b|\b(no|not|without)\b.{0,60}\bemotion (detection|recognition)\b/])) {
    addFact(facts, 'usesEmotionDetection', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bemotion detection\b|\bemotion recognition\b/])) {
    addFact(facts, 'usesEmotionDetection', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not use\b.{0,120}\bhealth data\b|\b(no|not|without)\b.{0,60}\bhealth data\b/])) {
    addFact(facts, 'processesHealthData', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bhealth data\b/])) {
    addFact(facts, 'processesHealthData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdoes not use\b.{0,120}\bbiometric data\b|\b(no|not|without)\b.{0,60}\bbiometric data\b/])) {
    addFact(facts, 'processesBiometricData', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\bbiometric data\b|\bbiometrics\b/])) {
    addFact(facts, 'processesBiometricData', true, sentence, source, messageIndex);
  }
  const negatesFinalClaimDecision = includesAny(s, [
    /\b(does not|doesn't|do not|don't|not|no)\b.{0,120}\b(final\s+)?claims?\s+(approval|rejection|decision)\b/,
    /\b(does not|doesn't|do not|don't|not|no)\b.{0,120}\b(make|approve|reject|decide)\w*\b.{0,80}\bclaims?\b/,
    /\bclaims?\b.{0,80}\b(not|no)\b.{0,60}\b(approved|rejected|decided|approval|rejection|decision)\b/
  ]);
  const affirmsFinalClaimDecision = includesAny(s, [
    /\b(approve|reject|decide)s?\b.{0,40}\bclaims?\b/,
    /\bclaims?\b.{0,40}\b(approved|rejected|decided)\b/,
    /\b(final\s+)?claims?\s+(approval|rejection|decision)\b/
  ]);
  if (negatesFinalClaimDecision) {
    addFact(facts, 'makesFinalClaimDecision', false, sentence, source, messageIndex, 0.9);
    addFact(facts, 'fullyAutomatedDecision', false, sentence, source, messageIndex, 0.8);
  } else if (affirmsFinalClaimDecision) {
    addFact(facts, 'makesFinalClaimDecision', true, sentence, source, messageIndex, 0.8);
  }

  if (includesAny(s, [/\bpersonal data\b|\bquestionnaire\b|\bjournal entries?\b|\battendance records?\b|\bacademic performance data\b|\bsmartwatch\b|\bheart rate\b|\bsleep patterns?\b/])) {
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bemployees?[’']?s? declared availability\b|\bdeclared availability\b|\bavailability\b/])) {
    addFact(facts, 'processesEmployeeAvailability', true, sentence, source, messageIndex);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bworking[- ]hour preferences?\b|\bpreferred working hours?\b|\bworking hours?\b.{0,40}\bpreferences?\b/])) {
    addFact(facts, 'processesWorkingHourPreferences', true, sentence, source, messageIndex);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bjob qualifications?\b|\bqualifications?\b/])) {
    addFact(facts, 'processesJobQualifications', true, sentence, source, messageIndex);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bprevious shift assignments?\b|\bshift records?\b|\bprevious shift records?\b/])) {
    addFact(facts, 'processesPreviousShiftAssignments', true, sentence, source, messageIndex);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bmaximum weekly working limits?\b|\bweekly working limits?\b|\bworking[- ]time limits?\b/])) {
    addFact(facts, 'processesWeeklyWorkingLimits', true, sentence, source, messageIndex);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bhr system\b|\bhr records?\b|\bcompany'?s hr\b|\bhuman resources\b/])) {
    addFact(facts, 'processesHRRecords', true, sentence, source, messageIndex);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bheart rate\b|\bsleep patterns?\b|\bhealth-related\b|\bwellbeing\b|\bwell-being\b|\bstress\b|\bwearable\b|\bsmartwatch\b/])) {
    addFact(facts, 'processesHealthRelatedData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bsmartwatch\b|\bwearable\b|\bheart rate\b|\bsleep patterns?\b/])) {
    addFact(facts, 'processesWearableData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bquestionnaire responses?\b|\bquestionnaire\b/])) {
    addFact(facts, 'processesQuestionnaireData', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bjournal entries?\b|\bwritten journal\b/])) {
    addFact(facts, 'processesJournalEntries', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\battendance records?\b|\battendance data\b/])) {
    addFact(facts, 'processesAttendanceRecords', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bacademic performance data\b|\bacademic records?\b|\bperformance data\b/])) {
    addFact(facts, 'processesAcademicPerformanceData', true, sentence, source, messageIndex);
  }

  if (includesAny(s, [/\b(human review|human oversight|counselors? can review|counsellors? can review|claims? officers? review|review and override)\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(claims?\s+officer|officer|human reviewer)\b.{0,80}\breviews?\b.{0,80}\b(recommendation|claim|output)\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\bhuman manager reviews\b|\bmanager reviews\b|\breviews every proposed schedule\b|\bmanual scheduling review\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(can override|override the system|override recommendations?|manual override|review and override)\b/])) {
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(claims?\s+officer|officer|human reviewer)\b.{0,80}\b(can )?(modify|change|adjust|reject|override)\b.{0,80}\b(recommendation|claim|output)\b/])) {
    if (includesAny(s, [/\boverride\b/])) addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.86);
    if (includesAny(s, [/\b(modify|change|adjust)\b/])) addFact(facts, 'humanCanModify', true, sentence, source, messageIndex, 0.86);
    if (includesAny(s, [/\breject\b/])) addFact(facts, 'humanCanReject', true, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(claims?\s+officer|officer|human reviewer)\b/]) && includesAny(s, [/\brecommendation\b/])) {
    if (includesAny(s, [/\bclaims?\s+officer\b/])) addFact(facts, 'recommendsClaimAssessment', true, sentence, source, messageIndex, 0.8);
    if (includesAny(s, [/\b(modify|change|adjust)\b/])) addFact(facts, 'humanCanModify', true, sentence, source, messageIndex, 0.84);
    if (includesAny(s, [/\breject\b/])) addFact(facts, 'humanCanReject', true, sentence, source, messageIndex, 0.84);
    if (includesAny(s, [/\boverride\b/])) addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.84);
  }
  if (includesAny(s, [/\bcan modify\b|\bmodify\b.{0,40}\b(before publication|proposed schedule|schedule)\b/])) {
    addFact(facts, 'humanCanModify', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bcan reject\b|\breject it before publication\b|\breject\b.{0,40}\b(schedule|before publication)\b/])) {
    addFact(facts, 'humanCanReject', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bbefore publication\b|\bpublished only after\b|\bpublication\b/]) && includesAny(s, [/\breview|modify|reject|manager\b/])) {
    addFact(facts, 'decisionPublishedOnlyAfterHumanReview', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bview the reason\b|\breason for their assigned shifts?\b|\bexplanation\b|\breasons? for assigned shifts?\b/])) {
    addFact(facts, 'explanationAvailable', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\brequest corrections?\b|\bcorrect inaccurate information\b|\bcorrection right\b|\bmay correct\b/])) {
    addFact(facts, 'correctionRightAvailable', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bchallenge an assignment\b|\bchallenge\b.{0,60}\bassignment\b|\bappeal\b|\bcontest\b/])) {
    addFact(facts, 'challengeMechanismAvailable', true, sentence, source, messageIndex);
    addFact(facts, 'appealMechanismAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\bmanual scheduling review\b|\bmanual review\b|\brequest a manual\b/])) {
    addFact(facts, 'manualReviewAvailable', true, sentence, source, messageIndex);
    addFact(facts, 'appealMechanismAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\bwithout being penalized\b|\bwithout penalty\b|\bnot penalized\b|\bno penalty\b/])) {
    addFact(facts, 'nonPenaltyForReviewRequest', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bemployees are informed\b|\binformed about the data\b|\bnotice\b.{0,40}\bemployees\b/])) {
    if (includesAny(s, [/\bemployees\b/])) {
      addFact(facts, 'employeesInformed', true, sentence, source, messageIndex);
    } else {
      addFact(facts, 'affectedPersonsInformed', true, sentence, source, messageIndex);
    }
  }
  if (includesAny(s, [/\baccess is limited\b|\blimited to authorized\b|\baccess restricted\b|\bauthorized\b.{0,40}\bstaff\b/])) {
    addFact(facts, 'accessRestricted', true, sentence, source, messageIndex);
    addFact(facts, 'securityMeasuresDocumented', true, sentence, source, messageIndex, 0.85);
    if (!includesAny(s, [/\bhr staff\b/])) addFact(facts, 'authorizedStaffOnly', true, sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\bauthorized hr staff and managers?\b|\bauthorized\b.{0,40}\bhr staff\b.{0,40}\bmanagers?\b/])) {
    addFact(facts, 'authorizedHRAndManagersOnly', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(explicit and informed consent|explicit consent|informed consent|consent is obtained|consent obtained)\b/])) {
    addFact(facts, 'explicitConsent', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(legal basis|documented legal basis|lawful basis|documented educational authorization|documented educational authorisation)\b/])) {
    addFact(facts, 'legalBasisDocumented', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(optional smartwatch|wearable data optional|smartwatch data collection is optional)\b/])) {
    addFact(facts, 'wearableDataOptional', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(participation is voluntary|voluntary participation|students can withdraw|withdraw their consent|without losing access)\b/])) {
    addFact(facts, 'participationVoluntary', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bwithdraw their consent|withdraw consent|right to withdraw\b/])) {
    addFact(facts, 'withdrawalAvailable', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(not used for unrelated purposes|purpose limitation|only under|specific purpose|unrelated purposes)\b/])) {
    addFact(facts, 'purposeLimitation', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bdocumented educational authorization|documented educational authorisation|university's documented educational authorization|educational authorization\b/])) {
    addFact(facts, 'educationalAuthorization', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\bretention period\b|\bdata retention\b|\bretained for\b/])) {
    addFact(facts, 'retentionPeriodDefined', true, sentence, source, messageIndex, 0.85);
    const retentionMatch = sentence.match(/\bretained for\s+([^.;!?]+)/i);
    if (retentionMatch?.[1]) {
      addFact(facts, 'retentionPeriod', normalizeWhitespace(retentionMatch[1]), sentence, source, messageIndex, 0.9);
    }
  }
  if (includesAny(s, [/\bpseudonymi[sz]ation\b|\banonymi[sz]ation\b|\bde-identif(y|ied|ication)\b/])) {
    addFact(facts, 'pseudonymizationUsed', true, sentence, source, messageIndex, 0.85);
  }
  if (includesAny(s, [/\bappeal\b|\bcontest\b|\bchallenge the decision\b|\breview request\b/])) {
    addFact(facts, 'appealMechanismAvailable', true, sentence, source, messageIndex, 0.85);
  }
  if (includesAny(s, [/\bmodel training\b|\btrain the model\b|\btraining data\b/])) {
    addFact(facts, 'usedForModelTraining', !includesAny(s, [/\bnot\b.{0,40}\b(model training|train the model|training data)\b/]), sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\bencryption\b|\baccess control\b|\bsecurity measures?\b|\baudit log\b/])) {
    addFact(facts, 'securityMeasuresDocumented', true, sentence, source, messageIndex, 0.85);
  }

  return facts;
}

function extractFactsFromText(text, source, messageIndex = null) {
  return splitSentences(text).flatMap((sentence) => detectFactsInSentence(sentence, source, messageIndex));
}

function evidenceIdentity(item) {
  return [
    item.fact,
    String(item.value),
    item.source,
    item.messageIndex === null || item.messageIndex === undefined ? 'project' : item.messageIndex,
    item.sourceText
  ].join('|');
}

function hasUserConfirmedEvidence(evidence, fact) {
  return evidence.some((item) => item.fact === fact && item.source === 'USER_CONFIRMED');
}

function hasConfirmedEvidence(evidence, fact) {
  return evidence.some((item) => item.fact === fact && ['USER_CONFIRMED', 'LLM_EXTRACTED', 'PROJECT_METADATA'].includes(item.source));
}

function mergeConversationFacts(previousState, newFacts) {
  const confirmedFacts = { ...(previousState?.confirmedFacts || {}) };
  const unknownFacts = { ...UNKNOWN_FACTS, ...(previousState?.unknownFacts || {}) };
  const factEvidence = [...(previousState?.factEvidence || [])];
  const contradictions = [...(previousState?.contradictions || [])];
  const existingEvidence = new Set(factEvidence.map(evidenceIdentity));

  newFacts.forEach((entry) => {
    if (!entry || !entry.fact) return;

    const currentValue = confirmedFacts[entry.fact];
    const hasCurrentValue = currentValue !== undefined && currentValue !== null;
    const userConfirmedExisting = hasUserConfirmedEvidence(factEvidence, entry.fact);
    const confirmedExisting = hasConfirmedEvidence(factEvidence, entry.fact);
    const incomingIsUserConfirmed = entry.source === 'USER_CONFIRMED';
    const incomingIsLlmExtracted = entry.source === 'LLM_EXTRACTED';
    const currentIsUncertain = currentValue === 'planned_or_uncertain';
    const incomingIsMoreSpecific = entry.value !== 'planned_or_uncertain';

    if (hasCurrentValue && currentValue !== entry.value) {
      if ((incomingIsUserConfirmed && userConfirmedExisting && !currentIsUncertain) || (incomingIsLlmExtracted && confirmedExisting && !currentIsUncertain)) {
        const contradictionKey = `${entry.fact}|${currentValue}|${entry.value}|${entry.sourceText}`;
        if (!contradictions.some((item) => item.key === contradictionKey)) {
          contradictions.push({
            key: contradictionKey,
            fact: entry.fact,
            label: FACT_LABELS[entry.fact] || entry.fact,
            existingValue: currentValue,
            incomingValue: entry.value,
            sourceText: entry.sourceText,
            source: entry.source,
            messageIndex: entry.messageIndex,
            status: 'needs_clarification'
          });
        }
        return;
      }

      if (incomingIsUserConfirmed || (incomingIsLlmExtracted && currentIsUncertain && incomingIsMoreSpecific) || (currentIsUncertain && incomingIsMoreSpecific)) {
        confirmedFacts[entry.fact] = entry.value;
      }
    } else if (!hasCurrentValue) {
      confirmedFacts[entry.fact] = entry.value;
    }

    delete unknownFacts[entry.fact];

    const id = evidenceIdentity(entry);
    if (!existingEvidence.has(id)) {
      factEvidence.push(entry);
      existingEvidence.add(id);
    }
  });

  Object.keys(UNKNOWN_FACTS).forEach((key) => {
    if (confirmedFacts[key] === undefined && unknownFacts[key] === undefined) {
      unknownFacts[key] = null;
    }
  });

  return { confirmedFacts, unknownFacts, factEvidence, contradictions };
}

function uniqueByValue(items) {
  const seen = new Set();
  return (items || []).filter((item) => {
    const key = String(item?.value || item?.name || item?.id || item);
    const normalized = key.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function factEvidenceFor(state, factKeys) {
  const keys = new Set(Array.isArray(factKeys) ? factKeys : [factKeys]);
  return (state.factEvidence || []).filter((item) => keys.has(item.fact));
}

function evidencePayload(state, factKeys) {
  const evidence = factEvidenceFor(state, factKeys);
  return {
    evidence: Array.from(new Set(evidence.map((item) => item.sourceText).filter(Boolean))).slice(0, 4),
    sources: Array.from(new Set(evidence.map((item) => item.source).filter(Boolean)))
  };
}

function listFromFact(value) {
  if (Array.isArray(value)) return value.map(normalizeWhitespace).filter(Boolean);
  return String(value || '')
    .split(/[;|]/)
    .map(normalizeWhitespace)
    .filter(Boolean);
}

function addListItems(target, value) {
  listFromFact(value).forEach((item) => target.push(item));
}

function conclusion(value, status, confidence, reason, state, factKeys, ruleIds = []) {
  const payload = evidencePayload(state, factKeys);
  return {
    value,
    label: DISPLAY_LABELS[value] || value,
    status,
    confidence,
    reason,
    evidence: payload.evidence,
    sources: payload.sources,
    ruleIds
  };
}

function buildSystemUnderstanding(project, state) {
  const facts = state.confirmedFacts || {};
  const isClaimAssessment = Boolean(facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment || facts.insuranceContext);
  const isWorkforceScheduling = Boolean(facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule);
  const inputs = [];
  addListItems(inputs, facts.systemInputs);
  if (facts.processesEmployeeAvailability) inputs.push('Employee availability');
  if (facts.processesWorkingHourPreferences) inputs.push('Working-hour preferences');
  if (facts.processesJobQualifications) inputs.push('Job qualifications');
  if (facts.processesPreviousShiftAssignments) inputs.push('Previous shift assignments');
  if (facts.processesWeeklyWorkingLimits) inputs.push('Maximum weekly working limits');
  if (facts.processesHRRecords) inputs.push('HR records');
  if (facts.processesInsuranceClaimData) inputs.push('Insurance claim data');
  if (facts.processesClaimantData) inputs.push('Claimant data');
  if (facts.processesQuestionnaireData) inputs.push('Questionnaire responses');
  if (facts.processesJournalEntries) inputs.push('Written journal entries');
  if (facts.processesAttendanceRecords) inputs.push('Attendance records');
  if (facts.processesAcademicPerformanceData) inputs.push('Academic performance data');
  if (facts.processesWearableData) inputs.push('Optional smartwatch data');

  const outputs = [];
  addListItems(outputs, facts.systemOutputs);
  if (facts.recommendsMonthlyShiftSchedule) outputs.push('Recommended monthly shift schedule');
  if (facts.recommendsClaimAssessment) outputs.push('Claim assessment recommendation');
  if (facts.explanationAvailable) {
    outputs.push(isWorkforceScheduling
      ? 'Reasons for assigned shifts'
      : isClaimAssessment
        ? 'Explanation for the claim recommendation'
        : 'Explanation for the outcome');
  }
  if (facts.producesIndividualRiskScore) {
    outputs.push(facts.studentWellbeingPurpose ? 'Individual stress risk score' : 'Individual assessment score');
  }
  if (facts.recommendsCounselorContact) outputs.push('Counselor contact recommendation');

  const decisionsSupported = [];
  addListItems(decisionsSupported, facts.decisionsSupported);
  if (facts.recommendsMonthlyShiftSchedule || facts.workforceSchedulingPurpose) decisionsSupported.push('Employee shift allocation');
  if (facts.recommendsClaimAssessment || facts.insuranceClaimsPurpose) decisionsSupported.push('Insurance claim assessment');
  if (facts.recommendsCounselorContact) decisionsSupported.push('Whether a student should be contacted by a university counselor');
  if (facts.producesIndividualRiskScore && facts.studentWellbeingPurpose) {
    decisionsSupported.push('Prioritization for student wellbeing intervention');
  } else if (facts.producesIndividualRiskScore) {
    decisionsSupported.push('Individual assessment or prioritization');
  }

  const affectedPersons = [];
  addListItems(affectedPersons, facts.affectedPersons);
  if (facts.employmentContext) affectedPersons.push('Employees');
  if (facts.insuranceContext || facts.insuranceClaimsPurpose || facts.processesClaimantData) affectedPersons.push('Claimants');
  if (facts.educationContext) affectedPersons.push('University students');

  const users = [];
  addListItems(users, facts.primaryUsers);
  if (facts.authorizedHRAndManagersOnly || facts.processesHRRecords) users.push('HR staff');
  if (facts.manufacturingContext || (facts.employmentContext && (facts.humanCanModify || facts.humanCanReject))) users.push('Manufacturing managers');
  if (facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) users.push('Claims officers');
  if (facts.recommendsCounselorContact || (facts.educationContext && facts.humanReviewAvailable)) users.push('University counselors');

  let humanRole = 'Not yet established';
  if (facts.humanRoleDescription) {
    humanRole = String(facts.humanRoleDescription);
  } else if (isClaimAssessment && facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject)) {
    humanRole = 'A claims officer reviews the claim recommendation and can change, reject, or override it before the final claim decision.';
  } else if (isWorkforceScheduling && facts.humanReviewAvailable && facts.humanCanModify && facts.humanCanReject) {
    humanRole = 'A manager reviews, modifies or rejects every schedule before publication.';
  } else if (facts.humanReviewAvailable && facts.humanCanOverride) {
    humanRole = isClaimAssessment
      ? 'A claims officer reviews and can override the recommendation.'
      : 'A human reviewer can review and override recommendations.';
  } else if (isClaimAssessment && facts.humanReviewAvailable) {
    humanRole = 'A claims officer reviews the claim recommendation, but override authority needs confirmation.';
  } else if (facts.humanReviewAvailable) {
    humanRole = 'Human review is available, but override authority needs confirmation.';
  }

  let purpose = project?.fullDescription || project?.shortDescription || project?.title || 'Purpose not yet established.';
  if (facts.systemPurpose) {
    purpose = String(facts.systemPurpose);
  } else if (facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) {
    purpose = 'Recommend fair monthly employee shift schedules while respecting availability, qualifications and working-time limits.';
  } else if (facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) {
    purpose = 'Support insurance claim assessment with an advisory recommendation for human review.';
  } else {
    const purposeEvidence = factEvidenceFor(state, ['studentWellbeingPurpose', 'producesIndividualRiskScore', 'recommendsCounselorContact']);
    purpose = purposeEvidence[0]?.sourceText || purpose;
  }

  let deploymentContext = 'Deployment context not yet established';
  if (facts.deploymentContext) {
    deploymentContext = String(facts.deploymentContext);
  } else if (facts.manufacturingContext && facts.workforceSchedulingPurpose) {
    deploymentContext = 'Manufacturing workforce scheduling';
  } else if (facts.insuranceContext || facts.insuranceClaimsPurpose) {
    deploymentContext = 'Insurance claim handling';
  } else if (facts.employmentContext) {
    deploymentContext = 'Employment decision-support context';
  } else if (facts.educationContext) {
    deploymentContext = 'University education and student support context';
  }

  return {
    purpose,
    users: Array.from(new Set(users)),
    affectedPersons: Array.from(new Set(affectedPersons)),
    inputs: Array.from(new Set(inputs)),
    outputs: Array.from(new Set(outputs)),
    decisionsSupported: Array.from(new Set(decisionsSupported)),
    humanRole,
    deploymentContext
  };
}

function buildClassifications(state) {
  const facts = state.confirmedFacts || {};
  const classifications = [];
  const excluded = [];

  if (facts.educationContext) {
    classifications.push(conclusion('Education', 'confirmed', 0.95, 'The selected project concerns students or a university context.', state, 'educationContext', ['RULE_DOMAIN_01']));
  }
  if (facts.studentWellbeingPurpose) {
    classifications.push(conclusion('StudentWellbeing', 'confirmed', 0.94, 'The system purpose is student stress or wellbeing support.', state, 'studentWellbeingPurpose', ['RULE_DOMAIN_02']));
  }
  if (facts.employmentContext) {
    classifications.push(conclusion('Employment', 'confirmed', 0.95, 'The system operates in an employment or workforce-management context.', state, 'employmentContext', ['RULE_EMPLOYMENT_DOMAIN_01']));
  }
  if (facts.manufacturingContext) {
    classifications.push(conclusion('Manufacturing', 'confirmed', 0.93, 'The deployment context is a manufacturing company.', state, 'manufacturingContext', ['RULE_MANUFACTURING_CONTEXT_01']));
  }
  if (facts.insuranceContext || facts.insuranceClaimsPurpose) {
    classifications.push(conclusion('Insurance', 'confirmed', 0.9, 'The system operates in an insurance or claims-handling context.', state, ['insuranceContext', 'insuranceClaimsPurpose'], ['RULE_INSURANCE_DOMAIN_01']));
  }
  if (facts.workforceSchedulingPurpose) {
    classifications.push(conclusion('WorkforceScheduling', 'confirmed', 0.95, 'The system supports workforce shift scheduling.', state, 'workforceSchedulingPurpose', ['RULE_WORKFORCE_SCHEDULING_01']));
  }
  if (facts.insuranceClaimsPurpose) {
    classifications.push(conclusion('InsuranceClaimsSupport', 'confirmed', 0.9, 'The system supports insurance claim assessment.', state, 'insuranceClaimsPurpose', ['RULE_INSURANCE_CLAIMS_01']));
  }
  if (facts.recommendsClaimAssessment) {
    classifications.push(conclusion('ClaimAssessmentRecommendation', 'confirmed', 0.9, 'The system recommends or supports claim assessment rather than directly deciding the claim.', state, 'recommendsClaimAssessment', ['RULE_CLAIM_RECOMMENDATION_01']));
    classifications.push(conclusion('DecisionSupport', 'confirmed', 0.88, 'The system supports a claim decision process with an advisory output reviewed by a human.', state, ['recommendsClaimAssessment', 'humanReviewAvailable'], ['RULE_FUNCTION_CLAIM_01']));
  }
  if (facts.recommendsMonthlyShiftSchedule) {
    classifications.push(conclusion('ShiftRecommendation', 'confirmed', 0.94, 'The system recommends a monthly shift schedule rather than making unrelated employment decisions.', state, 'recommendsMonthlyShiftSchedule', ['RULE_SHIFT_RECOMMENDATION_01']));
    classifications.push(conclusion('DecisionSupport', 'confirmed', 0.9, 'The system supports employee shift allocation decisions with a recommendation reviewed by humans.', state, ['recommendsMonthlyShiftSchedule', 'humanReviewAvailable'], ['RULE_FUNCTION_03']));
  }
  if (facts.producesIndividualRiskScore) {
    classifications.push(conclusion('RiskScoring', 'confirmed', 0.96, 'The system generates an individual risk score.', state, 'producesIndividualRiskScore', ['RULE_FUNCTION_01']));
  }
  if (facts.recommendsCounselorContact) {
    classifications.push(conclusion('DecisionSupport', 'confirmed', 0.92, 'The system supports counselor outreach decisions but does not make a binding decision by itself.', state, 'recommendsCounselorContact', ['RULE_FUNCTION_02']));
  }
  if (facts.processesPersonalData) {
    classifications.push(conclusion(
      'PersonalDataProcessing',
      'confirmed',
      0.93,
      facts.employmentContext
        ? 'The project processes identifiable or employee-related information.'
        : facts.educationContext
          ? 'The project processes identifiable or student-related information.'
          : 'The project processes identifiable personal information.',
      state,
      'processesPersonalData',
      ['RULE_DATA_01']
    ));
  }
  if (facts.processesHealthRelatedData) {
    classifications.push(conclusion('HealthRelatedDataProcessing', 'likely', 0.82, 'Stress, sleep, heart-rate, or wellbeing data may be health-related even when no medical diagnosis is made.', state, 'processesHealthRelatedData', ['RULE_DATA_02']));
  }
  if (facts.processesWearableData) {
    classifications.push(conclusion('WearableDataProcessing', 'confirmed', 0.9, 'Optional smartwatch or wearable data is processed.', state, 'processesWearableData', ['RULE_DATA_03']));
  }
  if (facts.processesJournalEntries) {
    classifications.push(conclusion('JournalTextProcessing', 'confirmed', 0.9, 'Written journal entries are processed.', state, 'processesJournalEntries', ['RULE_DATA_04']));
  }
  if (facts.processesAcademicPerformanceData || facts.processesAttendanceRecords) {
    classifications.push(conclusion('AcademicRecordProcessing', 'confirmed', 0.88, 'Academic or attendance records are processed as inputs.', state, ['processesAcademicPerformanceData', 'processesAttendanceRecords'], ['RULE_DATA_05']));
  }
  if (facts.processesHRRecords || facts.processesJobQualifications || facts.processesPreviousShiftAssignments) {
    classifications.push(conclusion('HRDataProcessing', 'confirmed', 0.9, 'The system processes HR-system records or job qualification information.', state, ['processesHRRecords', 'processesJobQualifications', 'processesPreviousShiftAssignments'], ['RULE_HR_DATA_01']));
  }
  if (facts.processesInsuranceClaimData || facts.processesClaimantData) {
    classifications.push(conclusion('PersonalDataProcessing', 'confirmed', 0.88, 'The system processes insurance claim or claimant-related personal information.', state, ['processesInsuranceClaimData', 'processesClaimantData'], ['RULE_CLAIM_DATA_01']));
  }
  if (facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.decisionPublishedOnlyAfterHumanReview)) {
    classifications.push(conclusion('HumanReviewedAI', 'confirmed', 0.92, 'The AI output is subject to human review or override before the final outcome.', state, ['humanReviewAvailable', 'humanCanOverride', 'humanCanModify', 'humanCanReject', 'decisionPublishedOnlyAfterHumanReview'], ['RULE_HUMAN_REVIEWED_AI_01']));
  }
  if (facts.profilesIndividualCharacteristic && facts.producesIndividualRiskScore) {
    classifications.push(conclusion('ProfilingAI', 'likely', 0.78, 'Profiling is considered because the system automatically scores an individual characteristic, not because it merely processes personal data.', state, ['profilesIndividualCharacteristic', 'producesIndividualRiskScore'], ['RULE_PROFILING_01']));
  }

  if (facts.providesMedicalDiagnosis === false) {
    excluded.push(conclusion('MedicalDiagnosisAI', 'excluded', 0.99, 'The user explicitly stated that the system does not make a medical diagnosis.', state, 'providesMedicalDiagnosis', ['RULE_EXCLUDE_MEDICAL_DIAGNOSIS_01']));
  }
  if (facts.makesHiringDecision === false) {
    excluded.push(conclusion('HiringDecisionAI', 'excluded', 0.99, 'The user explicitly stated that the system does not make hiring decisions.', state, 'makesHiringDecision', ['RULE_EXCLUDE_HIRING_01']));
  }
  if (facts.makesFiringDecision === false) {
    excluded.push(conclusion('FiringDecisionAI', 'excluded', 0.99, 'The user explicitly stated that the system does not make firing or termination decisions.', state, 'makesFiringDecision', ['RULE_EXCLUDE_FIRING_01']));
  }
  if (facts.makesPromotionDecision === false) {
    excluded.push(conclusion('PromotionDecisionAI', 'excluded', 0.99, 'The user explicitly stated that the system does not make promotion decisions.', state, 'makesPromotionDecision', ['RULE_EXCLUDE_PROMOTION_01']));
  }
  if (facts.makesSalaryDecision === false) {
    excluded.push(conclusion('SalaryDecisionAI', 'excluded', 0.99, 'The user explicitly stated that the system does not make salary or pay decisions.', state, 'makesSalaryDecision', ['RULE_EXCLUDE_SALARY_01']));
  }
  if (facts.makesDisciplinaryDecision === false) {
    excluded.push(conclusion('DisciplinaryDecisionAI', 'excluded', 0.99, 'The user explicitly stated that the system does not make disciplinary decisions.', state, 'makesDisciplinaryDecision', ['RULE_EXCLUDE_DISCIPLINARY_01']));
  }
  if (facts.usesFacialRecognition === false) {
    excluded.push(conclusion('FacialRecognitionAI', 'excluded', 0.99, 'The user explicitly stated that facial recognition is not used.', state, 'usesFacialRecognition', ['RULE_EXCLUDE_FACIAL_RECOGNITION_01']));
  }
  if (facts.usesEmotionDetection === false) {
    excluded.push(conclusion('EmotionRecognitionAI', 'excluded', 0.99, 'The user explicitly stated that emotion detection is not used.', state, 'usesEmotionDetection', ['RULE_EXCLUDE_EMOTION_RECOGNITION_01']));
  }
  if (facts.processesHealthData === false) {
    excluded.push(conclusion('HealthDataProcessing', 'excluded', 0.99, 'The user explicitly stated that health data is not processed.', state, 'processesHealthData', ['RULE_EXCLUDE_HEALTH_DATA_01']));
  }
  if (facts.processesBiometricData === false) {
    excluded.push(conclusion('BiometricDataProcessing', 'excluded', 0.99, 'The user explicitly stated that biometric data is not processed.', state, 'processesBiometricData', ['RULE_EXCLUDE_BIOMETRIC_DATA_01']));
  }
  if (facts.educationContext && facts.assignsAcademicGrade !== true) {
    const educationEvidence = evidencePayload(state, 'educationContext');
    excluded.push({
      value: 'AutomatedGradingAI',
      label: DISPLAY_LABELS.AutomatedGradingAI,
      status: 'insufficient_evidence',
      confidence: 0.9,
      reason: 'Education context alone is not evidence that the system assigns grades.',
      evidence: educationEvidence.evidence,
      sources: educationEvidence.sources,
      ruleIds: ['RULE_EXCLUDE_GRADING_01']
    });
  }
  if (facts.educationContext && facts.monitorsExaminationBehaviour !== true) {
    const educationEvidence = evidencePayload(state, 'educationContext');
    excluded.push({
      value: 'RemoteProctoringAI',
      label: DISPLAY_LABELS.RemoteProctoringAI,
      status: 'insufficient_evidence',
      confidence: 0.9,
      reason: 'Education context alone is not evidence of examination monitoring or proctoring.',
      evidence: educationEvidence.evidence,
      sources: educationEvidence.sources,
      ruleIds: ['RULE_EXCLUDE_PROCTORING_01']
    });
  }
  if (facts.recommendsCounselorContact && facts.recommendsPersonalizedContent !== true) {
    excluded.push({
      value: 'ContentRecommendationAI',
      label: DISPLAY_LABELS.ContentRecommendationAI,
      status: 'insufficient_evidence',
      confidence: 0.9,
      reason: 'A recommendation to contact a counselor is not personalized content recommendation.',
      evidence: evidencePayload(state, 'recommendsCounselorContact').evidence,
      sources: evidencePayload(state, 'recommendsCounselorContact').sources,
      ruleIds: ['RULE_EXCLUDE_CONTENT_RECOMMENDATION_01']
    });
  }

  return {
    classifications: uniqueByValue(classifications),
    excludedClassifications: uniqueByValue(excluded)
  };
}

function risk(value, status, confidence, reason, state, factKeys, ruleIds, domain = 'ethical') {
  return {
    value,
    status,
    confidence,
    reason,
    domain,
    ...evidencePayload(state, factKeys),
    ruleIds
  };
}

function buildRisks(state) {
  const facts = state.confirmedFacts || {};
  const primaryRisks = [];
  const nonApplicableRisks = [];

  if (facts.processesPersonalData) {
    primaryRisks.push(risk(
      'Personal data misuse or excessive processing',
      'likely',
      0.78,
      facts.employmentContext
        ? 'The system processes employee availability, preference, qualification, or HR records, so privacy, minimization, and access controls need evidence.'
        : facts.educationContext
          ? 'The system processes multiple student data sources, so privacy, minimization, and purpose limitation need evidence.'
          : 'The system processes personal data, so privacy, minimization, purpose limitation, and access controls need evidence.',
      state,
      ['processesPersonalData', 'processesQuestionnaireData', 'processesJournalEntries', 'processesAttendanceRecords', 'processesAcademicPerformanceData', 'processesEmployeeAvailability', 'processesWorkingHourPreferences', 'processesJobQualifications', 'processesPreviousShiftAssignments', 'processesHRRecords'],
      ['RISK_PRIVACY_01'],
      'data-protection'
    ));
  }
  if (facts.processesInsuranceClaimData || facts.processesClaimantData) {
    primaryRisks.push(risk(
      'Privacy or unauthorized access to claim records',
      facts.accessRestricted ? 'possible' : 'likely',
      facts.accessRestricted ? 0.56 : 0.72,
      facts.accessRestricted
        ? 'Claim or claimant records are personal information; restricted access reduces but does not eliminate misuse risk.'
        : 'Claim or claimant records are personal information and require clear access, retention, and security controls.',
      state,
      ['processesInsuranceClaimData', 'processesClaimantData', 'accessRestricted', 'retentionPeriodDefined'],
      ['RISK_CLAIM_PRIVACY_01'],
      'data-protection'
    ));
  }
  if (facts.processesHealthRelatedData) {
    primaryRisks.push(risk(
      'Sensitive wellbeing data exposure',
      'likely',
      0.76,
      'Stress, sleep, heart-rate, journal, or wellbeing data can be sensitive and may cause harm if exposed or misused.',
      state,
      ['processesHealthRelatedData', 'processesWearableData', 'processesJournalEntries'],
      ['RISK_SENSITIVE_WELLBEING_01'],
      'data-protection'
    ));
  }
  if (facts.producesIndividualRiskScore) {
    primaryRisks.push(risk(
      facts.studentWellbeingPurpose ? 'Incorrect student prioritization' : 'Incorrect individual assessment or prioritization',
      'likely',
      0.74,
      facts.studentWellbeingPurpose
        ? 'An inaccurate risk score could incorrectly prioritize or miss students who may need support.'
        : 'An inaccurate score could incorrectly rank, prioritize, or disadvantage affected people.',
      state,
      ['producesIndividualRiskScore', 'recommendsCounselorContact'],
      ['RISK_PRIORITIZATION_01'],
      'ethical'
    ));
  }
  if (facts.processesAcademicPerformanceData || facts.processesAttendanceRecords) {
    primaryRisks.push(risk(
      'Bias in student support prioritization',
      'possible',
      0.64,
      'Academic and attendance data may encode socioeconomic or accessibility differences and should be checked for bias before use in prioritization.',
      state,
      ['processesAcademicPerformanceData', 'processesAttendanceRecords'],
      ['RISK_FAIRNESS_01'],
      'ethical'
    ));
  }
  if (facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) {
    primaryRisks.push(risk(
      'Unfair distribution of night or weekend shifts',
      'possible',
      0.66,
      facts.fairShiftDistributionObjective
        ? 'The system is intended to distribute night and weekend shifts fairly, so fairness evidence should verify whether that objective is met.'
        : 'Shift allocation can unfairly distribute undesirable shifts if fairness constraints are not evidenced.',
      state,
      ['workforceSchedulingPurpose', 'recommendsMonthlyShiftSchedule', 'fairShiftDistributionObjective'],
      ['RISK_SHIFT_FAIRNESS_01'],
      'ethical'
    ));
    primaryRisks.push(risk(
      'Unsuitable assignments from inaccurate availability or qualification data',
      'possible',
      0.62,
      facts.correctionRightAvailable
        ? 'Incorrect availability, preference, or qualification records could still cause unsuitable assignments, but correction rights reduce residual risk.'
        : 'Incorrect availability, preference, or qualification records could cause unsuitable assignments.',
      state,
      ['processesEmployeeAvailability', 'processesWorkingHourPreferences', 'processesJobQualifications', 'correctionRightAvailable'],
      ['RISK_SHIFT_DATA_ACCURACY_01'],
      'ethical'
    ));
  }
  if (facts.processesWeeklyWorkingLimits || facts.preventsExcessiveWorkload) {
    primaryRisks.push(risk(
      'Excessive workload or working-time limit violations',
      'possible',
      0.58,
      facts.preventsExcessiveWorkload
        ? 'The system uses working-time limits and aims to prevent excessive workloads, but implementation evidence should confirm violations are actually blocked.'
        : 'Shift scheduling may create excessive workloads if working-time limits are not enforced.',
      state,
      ['processesWeeklyWorkingLimits', 'preventsExcessiveWorkload'],
      ['RISK_WORKING_TIME_01'],
      'legal-ethical'
    ));
  }
  if (facts.employmentContext && (facts.processesHRRecords || facts.processesPreviousShiftAssignments || facts.processesJobQualifications)) {
    primaryRisks.push(risk(
      'Unauthorized access to employee records',
      facts.accessRestricted && facts.authorizedHRAndManagersOnly ? 'possible' : 'likely',
      facts.accessRestricted && facts.authorizedHRAndManagersOnly ? 0.52 : 0.7,
      facts.accessRestricted && facts.authorizedHRAndManagersOnly
        ? 'Access is limited to authorized HR staff and managers, reducing but not eliminating employee-record access risk.'
        : 'Employee HR records require clear access controls and authorization boundaries.',
      state,
      ['processesHRRecords', 'processesPreviousShiftAssignments', 'processesJobQualifications', 'accessRestricted', 'authorizedHRAndManagersOnly'],
      ['RISK_EMPLOYEE_RECORD_ACCESS_01'],
      'data-protection'
    ));
  }
  if (facts.recommendsMonthlyShiftSchedule) {
    primaryRisks.push(risk(
      'Over-reliance by managers on recommended schedules',
      facts.humanCanModify && facts.humanCanReject ? 'possible' : 'likely',
      facts.humanCanModify && facts.humanCanReject ? 0.5 : 0.68,
      facts.humanCanModify && facts.humanCanReject
        ? 'Managers can modify or reject every proposed schedule before publication, reducing over-reliance risk.'
        : 'Managers may over-rely on recommended schedules if review authority is unclear.',
      state,
      ['recommendsMonthlyShiftSchedule', 'humanReviewAvailable', 'humanCanModify', 'humanCanReject'],
      ['RISK_MANAGER_OVERRELIANCE_01'],
      'ethical'
    ));
  }
  if (facts.recommendsClaimAssessment || facts.insuranceClaimsPurpose) {
    primaryRisks.push(risk(
      'Incorrect claim recommendation',
      facts.correctionRightAvailable || facts.manualReviewAvailable ? 'possible' : 'likely',
      facts.correctionRightAvailable || facts.manualReviewAvailable ? 0.6 : 0.74,
      facts.correctionRightAvailable || facts.manualReviewAvailable
        ? 'Incorrect claim information could still affect the recommendation, but correction or manual review reduces residual risk.'
        : 'Incorrect or incomplete claim information could lead to an unsuitable recommendation.',
      state,
      ['recommendsClaimAssessment', 'insuranceClaimsPurpose', 'correctionRightAvailable', 'manualReviewAvailable'],
      ['RISK_CLAIM_ACCURACY_01'],
      'ethical'
    ));
    primaryRisks.push(risk(
      'Over-reliance on claim recommendation',
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject) ? 'possible' : 'likely',
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject) ? 0.56 : 0.72,
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject)
        ? 'A human reviewer can change or reject the recommendation, reducing over-reliance risk.'
        : 'Claims staff may over-rely on the recommendation if final human authority is unclear.',
      state,
      ['recommendsClaimAssessment', 'humanReviewAvailable', 'humanCanOverride', 'humanCanModify', 'humanCanReject'],
      ['RISK_CLAIM_OVERRELIANCE_01'],
      'ethical'
    ));
  }
  if (facts.recommendsCounselorContact && !(facts.humanReviewAvailable && facts.humanCanOverride)) {
    primaryRisks.push(risk(
      'Unclear human review for intervention recommendations',
      'possible',
      0.62,
      facts.educationContext
        ? 'Counselor review or override has not been fully confirmed for recommendations that affect students.'
        : 'Human review or override has not been fully confirmed for recommendations that affect people.',
      state,
      'recommendsCounselorContact',
      ['RISK_OVERSIGHT_01'],
      'ethical'
    ));
  }

  if (facts.providesMedicalDiagnosis === false) {
    nonApplicableRisks.push(risk(
      'Clinical treatment or misdiagnosis harm',
      'not_applicable',
      0.98,
      'This risk requires medical diagnosis or treatment influence, which is explicitly excluded.',
      state,
      'providesMedicalDiagnosis',
      ['RISK_MEDICAL_DIAGNOSIS_01'],
      'technical-safety'
    ));
  }
  if (facts.recommendsCounselorContact && facts.recommendsPersonalizedContent !== true) {
    nonApplicableRisks.push(risk(
      'Filter bubble or content recommendation manipulation',
      'not_applicable',
      0.94,
      'This risk requires personalized content recommendation; counselor contact recommendation is a different function.',
      state,
      'recommendsCounselorContact',
      ['RISK_FILTER_BUBBLE_01'],
      'ethical'
    ));
  }
  if (facts.educationContext && facts.assignsAcademicGrade !== true) {
    nonApplicableRisks.push(risk(
      'Automated grading bias',
      'not_applicable',
      0.93,
      'This risk requires academic grade assignment or learning-outcome evaluation, not merely use in an education context.',
      state,
      'educationContext',
      ['RISK_AUTOMATED_GRADING_01'],
      'ethical'
    ));
  }
  if (facts.educationContext && facts.monitorsExaminationBehaviour !== true) {
    nonApplicableRisks.push(risk(
      'Remote proctoring surveillance',
      'not_applicable',
      0.93,
      'This risk requires examination monitoring or proctoring evidence.',
      state,
      'educationContext',
      ['RISK_PROCTORING_01'],
      'data-protection'
    ));
  }

  const mainRisks = primaryRisks
    .filter((item) => ['confirmed', 'likely', 'possible'].includes(item.status))
    .slice(0, 8);

  return { primaryRisks: uniqueByValue(mainRisks), nonApplicableRisks: uniqueByValue(nonApplicableRisks) };
}

function buildTensions(state) {
  const facts = state.confirmedFacts || {};
  const tensions = [];

  if (facts.processesPersonalData && facts.studentWellbeingPurpose) {
    tensions.push({
      value: 'Privacy vs Student wellbeing',
      status: 'likely',
      confidence: 0.78,
      conflictingPrinciples: ['Privacy', 'Beneficence'],
      reason: 'The system uses personal and potentially sensitive data to support student wellbeing interventions.',
      ...evidencePayload(state, ['processesPersonalData', 'studentWellbeingPurpose']),
      ruleIds: ['TENSION_PRIVACY_WELLBEING_01']
    });
  }
  if (facts.processesPersonalData && facts.fairShiftDistributionObjective) {
    tensions.push({
      value: 'Employee privacy vs Fair shift allocation',
      status: 'possible',
      confidence: 0.68,
      conflictingPrinciples: ['Privacy', 'Fairness'],
      reason: 'The system uses employee-related records to distribute shifts fairly, so minimization and fairness evidence both matter.',
      ...evidencePayload(state, ['processesPersonalData', 'fairShiftDistributionObjective']),
      ruleIds: ['TENSION_EMPLOYEE_PRIVACY_FAIRNESS_01']
    });
  }
  if (facts.producesIndividualRiskScore && facts.humanReviewAvailable) {
    tensions.push({
      value: 'Automation efficiency vs Human oversight',
      status: 'likely',
      confidence: 0.72,
      conflictingPrinciples: ['Human oversight', 'Timely support'],
      reason: facts.studentWellbeingPurpose
        ? 'Risk scoring can help prioritize support quickly, but counselor review remains necessary.'
        : 'Automated scoring can speed up prioritization, but meaningful human review remains necessary.',
      ...evidencePayload(state, ['producesIndividualRiskScore', 'humanReviewAvailable']),
      ruleIds: ['TENSION_OVERSIGHT_AUTOMATION_01']
    });
  }

  return uniqueByValue(tensions).slice(0, 5);
}

function buildSafeguards(state) {
  const facts = state.confirmedFacts || {};
  const confirmed = [];
  const partial = [];
  const missing = [];
  const requiresEvidence = [];
  const notApplicable = [];

  const addSafeguard = (bucket, value, reason, factKeys, ruleIds = []) => {
    bucket.push({ value, reason, ...evidencePayload(state, factKeys), ruleIds });
  };

  const humanActor = facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment || facts.insuranceContext
    ? 'A claims reviewer'
    : facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule
      ? 'A human manager'
      : 'A human reviewer';

  if (facts.humanReviewAvailable) addSafeguard(confirmed, 'HumanOversight', 'Human review is confirmed.', 'humanReviewAvailable', ['SAFEGUARD_OVERSIGHT_01']);
  if (facts.humanCanOverride) addSafeguard(confirmed, 'HumanCanOverride', `${humanActor} can override the proposed output.`, 'humanCanOverride', ['SAFEGUARD_OVERRIDE_01']);
  if (facts.humanCanModify) addSafeguard(confirmed, 'HumanCanModify', `${humanActor} can modify the proposed output.`, 'humanCanModify', ['SAFEGUARD_MODIFY_01']);
  if (facts.humanCanReject) addSafeguard(confirmed, 'HumanCanReject', `${humanActor} can reject the proposed output.`, 'humanCanReject', ['SAFEGUARD_REJECT_01']);
  const affectedGroup = facts.employmentContext ? 'Employees' : facts.insuranceContext || facts.insuranceClaimsPurpose ? 'Claimants' : 'Affected people';
  if (facts.employeesInformed || facts.affectedPersonsInformed) addSafeguard(confirmed, 'TransparencyNotice', `${affectedGroup} are informed about the data used by the system.`, ['employeesInformed', 'affectedPersonsInformed'], ['SAFEGUARD_NOTICE_01']);
  if (facts.explanationAvailable) addSafeguard(confirmed, 'ExplanationAvailable', `${affectedGroup} can receive or view reasons for the AI-supported outcome.`, 'explanationAvailable', ['SAFEGUARD_EXPLANATION_01']);
  if (facts.correctionRightAvailable) addSafeguard(confirmed, 'CorrectionRight', `${affectedGroup} can request correction of inaccurate information.`, 'correctionRightAvailable', ['SAFEGUARD_CORRECTION_01']);
  if (facts.challengeMechanismAvailable) addSafeguard(confirmed, 'ChallengeMechanism', `${affectedGroup} can challenge the outcome.`, 'challengeMechanismAvailable', ['SAFEGUARD_CHALLENGE_01']);
  if (facts.manualReviewAvailable) addSafeguard(confirmed, 'ManualReview', `${affectedGroup} can request manual review.`, 'manualReviewAvailable', ['SAFEGUARD_MANUAL_REVIEW_01']);
  if (facts.accessRestricted) addSafeguard(confirmed, 'AccessControl', facts.insuranceContext || facts.insuranceClaimsPurpose ? 'Access to claim records is restricted.' : 'Access to system records is restricted.', 'accessRestricted', ['SAFEGUARD_ACCESS_CONTROL_01']);
  if (facts.authorizedHRAndManagersOnly || facts.authorizedStaffOnly) addSafeguard(confirmed, 'LimitedAuthorizedAccess', facts.authorizedHRAndManagersOnly ? 'Access is limited to authorized HR staff and managers.' : 'Access is limited to authorized staff.', ['authorizedHRAndManagersOnly', 'authorizedStaffOnly'], ['SAFEGUARD_LIMITED_AUTHORIZED_ACCESS_01']);
  if (facts.retentionPeriodDefined) addSafeguard(confirmed, 'RetentionPeriod', facts.retentionPeriod ? `Retention period is defined as ${facts.retentionPeriod}.` : 'Retention period is defined.', ['retentionPeriodDefined', 'retentionPeriod'], ['SAFEGUARD_RETENTION_CONFIRMED_01']);
  if (facts.nonPenaltyForReviewRequest) addSafeguard(confirmed, 'NonPenaltyForReviewRequest', `${affectedGroup} can request review without being penalized.`, 'nonPenaltyForReviewRequest', ['SAFEGUARD_NON_PENALTY_01']);
  if (facts.processesWeeklyWorkingLimits || facts.preventsExcessiveWorkload) addSafeguard(confirmed, 'WorkingTimeLimitControl', 'The system considers working-time limits or excessive workload prevention.', ['processesWeeklyWorkingLimits', 'preventsExcessiveWorkload'], ['SAFEGUARD_WORKING_TIME_01']);
  if (facts.explicitConsent) addSafeguard(confirmed, 'ExplicitConsent', 'Explicit or informed consent is confirmed.', 'explicitConsent', ['SAFEGUARD_CONSENT_01']);
  if (facts.legalBasisDocumented) addSafeguard(confirmed, 'LegalBasis', 'A documented legal basis is confirmed.', 'legalBasisDocumented', ['SAFEGUARD_LEGAL_BASIS_01']);
  if (facts.wearableDataOptional || facts.participationVoluntary) {
    addSafeguard(confirmed, 'VoluntaryParticipation', 'Optional or voluntary participation is confirmed for at least part of the data collection.', ['wearableDataOptional', 'participationVoluntary'], ['SAFEGUARD_VOLUNTARY_01']);
  }
  if (facts.withdrawalAvailable) addSafeguard(confirmed, 'WithdrawalRight', 'The ability to withdraw consent is confirmed.', 'withdrawalAvailable', ['SAFEGUARD_WITHDRAWAL_01']);
  if (facts.purposeLimitation) addSafeguard(confirmed, 'PurposeLimitation', 'Purpose limitation is confirmed.', 'purposeLimitation', ['SAFEGUARD_PURPOSE_01']);

  if (facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData || facts.processesHealthRelatedData) {
    const dataFactKeys = ['processesPersonalData', 'processesInsuranceClaimData', 'processesClaimantData', 'processesHealthRelatedData'];
    if (!facts.retentionPeriodDefined) addSafeguard(requiresEvidence, 'RetentionPeriod', 'Retention period is relevant for personal or sensitive data and needs evidence.', dataFactKeys, ['SAFEGUARD_RETENTION_01']);
    if (!facts.pseudonymizationUsed) addSafeguard(requiresEvidence, 'PseudonymizationOrAnonymization', facts.employmentContext
      ? 'Pseudonymization or minimization may be relevant for employee scheduling and HR records and needs evidence.'
      : facts.educationContext
        ? 'Pseudonymization or anonymization is relevant for journal, wearable, or student records and needs evidence.'
        : facts.insuranceContext || facts.insuranceClaimsPurpose
          ? 'Pseudonymization, minimization, or access separation may be relevant for claim and claimant records and needs evidence.'
        : 'Pseudonymization, anonymization, or data minimization may be relevant for the processed personal data and needs evidence.', dataFactKeys, ['SAFEGUARD_PSEUDONYMIZATION_01']);
    if (!facts.securityMeasuresDocumented) addSafeguard(requiresEvidence, 'SecurityMeasures', facts.employmentContext
      ? 'Security controls are relevant for processed employee data and need evidence.'
      : facts.educationContext
        ? 'Security controls are relevant for the processed student data and need evidence.'
        : facts.insuranceContext || facts.insuranceClaimsPurpose
          ? 'Security controls are relevant for claim and claimant records and need evidence.'
        : 'Security controls are relevant for the processed personal data and need evidence.', dataFactKeys, ['SAFEGUARD_SECURITY_01']);
  }
  if (facts.producesIndividualRiskScore && !facts.appealMechanismAvailable) {
    addSafeguard(requiresEvidence, 'ReviewOrAppealMechanism', facts.educationContext
      ? 'Students may need a way to challenge or request review of risk-score-driven prioritization.'
      : 'Affected people may need a way to challenge or request review of score-driven prioritization.', 'producesIndividualRiskScore', ['SAFEGUARD_APPEAL_01']);
  }
  if (facts.providesMedicalDiagnosis === false) {
    addSafeguard(notApplicable, 'ClinicalValidationForDiagnosis', 'Clinical diagnostic validation is not applicable unless the system makes medical diagnoses.', 'providesMedicalDiagnosis', ['SAFEGUARD_MEDICAL_NA_01']);
  }

  return {
    confirmed: uniqueByValue(confirmed),
    partial: uniqueByValue(partial),
    missing: uniqueByValue(missing),
    requiresEvidence: uniqueByValue(requiresEvidence),
    notApplicable: uniqueByValue(notApplicable)
  };
}

function buildRegulatoryConsiderations(state) {
  const facts = state.confirmedFacts || {};
  const items = [];
  const processesPersonRelatedData = facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData;

  if (processesPersonRelatedData) {
    items.push({
      value: 'GDPR / KVKK personal-data principles',
      applicabilityStatus: facts.legalBasisDocumented ? 'likely_applicable_with_confirmed_basis' : 'likely_applicable_requires_basis_evidence',
      confidence: 0.82,
      reason: facts.employmentContext
        ? 'The system processes employee-related personal data, so lawfulness, fairness, transparency, minimization, retention, and access control should be evidenced.'
        : facts.educationContext
          ? 'The system processes student-related personal data, so lawfulness, fairness, transparency, minimization, and purpose limitation should be evidenced.'
          : facts.insuranceContext || facts.insuranceClaimsPurpose
            ? 'The system processes claim or claimant-related personal data, so lawfulness, fairness, transparency, minimization, retention, and access control should be evidenced.'
          : 'The system processes personal data, so lawfulness, fairness, transparency, minimization, retention, and access control should be evidenced.',
      supportingFacts: ['processesPersonalData', facts.processesInsuranceClaimData ? 'processesInsuranceClaimData' : null, facts.processesClaimantData ? 'processesClaimantData' : null, facts.legalBasisDocumented ? 'legalBasisDocumented' : null, facts.purposeLimitation ? 'purposeLimitation' : null].filter(Boolean),
      missingConditions: ['retentionPeriodDefined', 'securityMeasuresDocumented', 'pseudonymizationUsed'].filter((key) => !facts[key]),
      ...evidencePayload(state, ['processesPersonalData', 'processesInsuranceClaimData', 'processesClaimantData', 'legalBasisDocumented', 'purposeLimitation', 'employeesInformed', 'affectedPersonsInformed', 'accessRestricted', 'retentionPeriodDefined']),
      ruleIds: ['REG_DATA_PROTECTION_01']
    });
  }
  if (facts.processesHealthRelatedData) {
    items.push({
      value: 'Special-category or sensitive wellbeing data review',
      applicabilityStatus: 'possible',
      confidence: 0.68,
      reason: 'Stress, sleep, heart-rate, and journal data may require sensitive-data analysis depending on jurisdiction and implementation.',
      supportingFacts: ['processesHealthRelatedData'],
      missingConditions: ['data category legal qualification', 'securityMeasuresDocumented'].filter((item) => item !== 'securityMeasuresDocumented' || !facts.securityMeasuresDocumented),
      ...evidencePayload(state, 'processesHealthRelatedData'),
      ruleIds: ['REG_SENSITIVE_DATA_01']
    });
  }
  if (facts.producesIndividualRiskScore || facts.profilesIndividualCharacteristic) {
    items.push({
      value: 'Automated individual assessment / profiling review',
      applicabilityStatus: facts.humanReviewAvailable && facts.humanCanOverride ? 'possible_not_solely_automated' : 'possible_requires_automation_review',
      confidence: 0.7,
      reason: facts.studentWellbeingPurpose
        ? 'An individual stress risk score may qualify as profiling or automated assessment; confirmed counselor review lowers concern about solely automated effects.'
        : 'An individual assessment score may qualify as profiling or automated assessment; confirmed human review lowers concern about solely automated effects.',
      supportingFacts: ['producesIndividualRiskScore', facts.humanReviewAvailable ? 'humanReviewAvailable' : null, facts.humanCanOverride ? 'humanCanOverride' : null].filter(Boolean),
      missingConditions: facts.appealMechanismAvailable ? [] : ['appealMechanismAvailable'],
      ...evidencePayload(state, ['producesIndividualRiskScore', 'profilesIndividualCharacteristic', 'humanReviewAvailable', 'humanCanOverride']),
      ruleIds: ['REG_PROFILING_01']
    });
  }
  if (facts.employmentContext && (facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule)) {
    items.push({
      value: 'Employment and workplace-management AI review',
      applicabilityStatus: facts.humanReviewAvailable && (facts.humanCanModify || facts.humanCanReject) ? 'possible_not_solely_automated' : 'possible_requires_automation_review',
      confidence: 0.72,
      reason: 'The system supports employee shift allocation in an employment context; confirmed human review distinguishes it from fully automated hiring, firing, salary, promotion, or disciplinary decisions.',
      supportingFacts: ['employmentContext', 'workforceSchedulingPurpose', 'recommendsMonthlyShiftSchedule', facts.humanReviewAvailable ? 'humanReviewAvailable' : null].filter(Boolean),
      missingConditions: ['bias/fairness validation evidence', 'working-time compliance evidence'],
      ...evidencePayload(state, ['employmentContext', 'workforceSchedulingPurpose', 'recommendsMonthlyShiftSchedule', 'humanReviewAvailable', 'humanCanModify', 'humanCanReject']),
      ruleIds: ['REG_EMPLOYMENT_AI_01']
    });
  }
  if (facts.educationContext && facts.recommendsCounselorContact) {
    items.push({
      value: 'EU AI Act education/welfare use-case review',
      applicabilityStatus: 'possible',
      confidence: 0.58,
      reason: 'Education context alone is insufficient for high-risk classification, but student prioritization for intervention should be reviewed against education and access-to-services rules.',
      supportingFacts: ['educationContext', 'recommendsCounselorContact'],
      missingConditions: ['binding effect', 'material effect on access to services'],
      ...evidencePayload(state, ['educationContext', 'recommendsCounselorContact']),
      ruleIds: ['REG_EU_AI_ACT_EDU_01']
    });
  }

  return uniqueByValue(items).slice(0, 6);
}

function buildMissingInformation(state) {
  const facts = state.confirmedFacts || {};
  const questions = [];
  const processesPersonRelatedData = facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData;

  if ((state.contradictions || []).length) {
    questions.push('Please clarify the contradictory statement before the assessment is finalized.');
  }
  if ((processesPersonRelatedData || facts.processesHealthRelatedData) && !facts.retentionPeriodDefined) {
    questions.push(facts.employmentContext
      ? 'What is the retention period for employee availability, preference, qualification, and shift assignment records?'
      : facts.educationContext
        ? 'What is the retention period for questionnaire, journal, academic, attendance, and wearable data?'
        : facts.insuranceContext || facts.insuranceClaimsPurpose
          ? 'What is the retention period for claim and claimant records?'
        : 'How long is the processed personal data retained?');
  }
  if ((processesPersonRelatedData || facts.processesHealthRelatedData) && !facts.pseudonymizationUsed) {
    questions.push(facts.employmentContext
      ? 'Are employee scheduling records minimized, pseudonymized, or otherwise protected from unnecessary identification?'
      : facts.educationContext
        ? 'Are journal entries, wearable data, and student records pseudonymized, anonymized, or otherwise separated from direct identifiers?'
        : facts.insuranceContext || facts.insuranceClaimsPurpose
          ? 'Are claim records minimized, pseudonymized, or otherwise protected from unnecessary identification?'
        : 'Is the personal data minimized, pseudonymized, anonymized, or otherwise protected from unnecessary identification?');
  }
  if (facts.producesIndividualRiskScore && !facts.appealMechanismAvailable) {
    questions.push(facts.educationContext
      ? 'Can students challenge, appeal, or request review of counselor-prioritization outcomes?'
      : 'Can affected people challenge, appeal, or request review of score-driven outcomes?');
  }
  if ((facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) && !facts.challengeMechanismAvailable) {
    questions.push('Can employees challenge a shift assignment or request manual scheduling review?');
  }
  if ((processesPersonRelatedData || facts.processesHealthRelatedData) && !facts.securityMeasuresDocumented) {
    questions.push(facts.employmentContext
      ? 'Which access controls, audit logs, or security measures protect employee scheduling and HR records?'
      : facts.educationContext
        ? 'Which access controls, encryption, or audit logs protect the processed student data?'
        : facts.insuranceContext || facts.insuranceClaimsPurpose
          ? 'Which access controls, audit logs, or security measures protect claim and claimant records?'
        : 'Which access controls, encryption, audit logs, or security measures protect the processed personal data?');
  }

  return questions.slice(0, 4).map((question) => ({
    question,
    status: 'requires_evidence'
  }));
}

function buildRecommendedActions(state) {
  const facts = state.confirmedFacts || {};
  const actions = [];
  const affectedGroup = facts.employmentContext ? 'employees' : facts.insuranceContext || facts.insuranceClaimsPurpose ? 'claimants' : 'affected people';

  if (facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) {
    actions.push('Validate shift allocation fairness across night, weekend, workload, qualification, and availability constraints.');
    actions.push('Keep manager review, modification, and rejection before schedule publication as mandatory controls.');
  }
  if (facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) {
    actions.push('Document which claim data inputs influence the recommendation and which checks prevent inaccurate claim outcomes.');
    actions.push('Keep claims-officer review and override authority explicit for every recommendation.');
  }
  if (facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData || facts.processesHealthRelatedData) {
    actions.push(facts.employmentContext
      ? 'Document retention, access control, security, and minimization evidence for each employee data source.'
      : facts.insuranceContext || facts.insuranceClaimsPurpose
        ? 'Document retention, access control, security, and minimization evidence for each claim or claimant data source.'
      : 'Document data retention, access control, security, and minimization evidence for each data source.');
  }
  if (facts.producesIndividualRiskScore) {
    actions.push(facts.studentWellbeingPurpose
      ? 'Validate the stress risk score for false positives, false negatives, and bias across student groups.'
      : 'Validate the assessment score for false positives, false negatives, and unfair outcome patterns.');
  }
  if (facts.recommendsCounselorContact) {
    actions.push('Keep counselor review and override as a mandatory control for intervention prioritization.');
  }
  if (facts.explicitConsent || facts.participationVoluntary) {
    actions.push(facts.educationContext
      ? 'Keep consent, withdrawal, and non-penalty language visible to students before data collection.'
      : 'Keep consent, withdrawal, and non-penalty information visible before data collection.');
  } else if ((facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData) && !facts.employmentContext) {
    actions.push(facts.educationContext
      ? 'Collect evidence for lawful basis, notice, consent where required, and student withdrawal rights.'
      : 'Collect evidence for lawful basis, notice, consent where required, and affected-person rights.');
  }
  if (!facts.appealMechanismAvailable && facts.producesIndividualRiskScore) {
    actions.push(facts.educationContext
      ? 'Define a review or appeal path for students affected by prioritization.'
      : 'Define a review or appeal path for people affected by score-driven prioritization.');
  }
  if (facts.correctionRightAvailable || facts.challengeMechanismAvailable || facts.manualReviewAvailable) {
    actions.push(`Keep correction, challenge, and manual-review paths visible to ${affectedGroup} and track their outcomes.`);
  }

  return Array.from(new Set(actions)).slice(0, 7);
}

function buildConfirmedFactList(state) {
  return Object.entries(state.confirmedFacts || {})
    .map(([fact, value]) => ({
      fact,
      label: FACT_LABELS[fact] || fact,
      value,
      ...evidencePayload(state, fact)
    }))
    .filter((item) => item.evidence.length > 0)
    .sort((a, b) => a.label.localeCompare(b.label));
}

function buildReasoningTrace(state, keywordCandidates = [], context = {}) {
  return {
    defaultCollapsed: true,
    assessmentVersion: ASSESSMENT_VERSION,
    projectContext: {
      projectAttached: Boolean(context.projectId),
      projectId: context.projectId || null,
      projectTitle: context.projectTitle || null,
      metadataUsed: Boolean(context.projectId)
    },
    provenanceTypes: PROVENANCE_TYPES,
    ontologySource: {
      neo4jStatus: 'Neo4j is supported as the project knowledge graph and fact store, but keyword lookup is not treated as inference.',
      owlFileLoaded: false,
      owlReasoningClaim: 'The UseCaseOwner chat result does not claim OWL 2 DL reasoning unless an OWL file is explicitly loaded and executed.',
      swrlStatus: 'No SWRL output is inserted as an ethical principle.'
    },
    steps: [
      {
        step: 'structured_fact_extraction',
        method: context.geminiExtraction
          ? 'Gemini constrained JSON extraction plus semantic candidate normalization. Canonical facts and semantic candidates are validated against exact user evidence, then semantic candidates are deterministically mapped to supported ontology facts before merge.'
          : 'Contextual pattern extraction with negation handling',
        sources: context.geminiExtraction ? ['PROJECT_METADATA', 'USER_CONFIRMED', 'LLM_EXTRACTED'] : ['PROJECT_METADATA', 'USER_CONFIRMED'],
        boundary: context.geminiExtraction ? 'Gemini candidate facts and semantic candidates are not ontology inference and do not produce risks, legal conclusions, safeguard evaluations, or final assessments.' : undefined
      },
      {
        step: 'fact_merge',
        method: 'Project/user-scoped facts are merged with previous confirmed facts; contradictions are kept for clarification.'
      },
      {
        step: 'applicability_rules',
        method: 'Risks and legal considerations are emitted only when required facts are present.'
      }
    ],
    stateMergeStats: context.stateMergeStats || null,
    geminiStructuredExtraction: context.geminiExtraction || null,
    keywordCandidates,
    contradictions: state.contradictions || []
  };
}

function buildKeywordCandidates(text) {
  const candidates = [
    { keyword: 'medical diagnosis', candidate: 'MedicalDiagnosisAI' },
    { keyword: 'personal data', candidate: 'PersonalDataProcessing' },
    { keyword: 'recommendation', candidate: 'RecommendationCandidate' },
    { keyword: 'education', candidate: 'EducationCandidate' },
    { keyword: 'student', candidate: 'EducationCandidate' },
    { keyword: 'risk score', candidate: 'RiskScoring' }
  ];
  const lower = String(text || '').toLowerCase();
  return candidates
    .filter((item) => lower.includes(item.keyword))
    .map((item) => ({
      ...item,
      provenance: 'KEYWORD_FALLBACK',
      confidence: 0.2,
      note: 'Candidate only; not used as a final classification without structured fact validation.'
    }));
}

function buildReport({ project, state, keywordCandidates, stateMergeStats = null, geminiExtraction = null }) {
  const facts = state.confirmedFacts || {};
  const isClaimAssessment = Boolean(facts.insuranceContext || facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment);
  const isWorkforceScheduling = Boolean(facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule);
  const projectId = getProjectId(project);
  const systemUnderstanding = buildSystemUnderstanding(project, state);
  const { classifications, excludedClassifications } = buildClassifications(state);
  const { primaryRisks, nonApplicableRisks } = buildRisks(state);
  const safeguards = buildSafeguards(state);
  const regulatoryConsiderations = buildRegulatoryConsiderations(state);
  const missingInformation = buildMissingInformation(state);
  const recommendedActions = buildRecommendedActions(state);
  const confirmedFacts = buildConfirmedFactList(state);
  const ethicalTensions = buildTensions(state);

  const summaryParts = [];
  if (facts.employmentContext && facts.workforceSchedulingPurpose) {
    summaryParts.push(projectId
      ? 'The selected project is understood as an employment-context workforce scheduling decision-support system.'
      : 'This general ontology chat is understood as an employment-context workforce scheduling decision-support system.');
  } else if (facts.insuranceContext || facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) {
    summaryParts.push(projectId
      ? 'The selected project is understood as an insurance claim assessment decision-support system.'
      : 'This general ontology chat is understood as an insurance claim assessment decision-support system.');
  } else if (facts.educationContext && facts.studentWellbeingPurpose) {
    summaryParts.push('The selected project is understood as an education-context student wellbeing decision-support system.');
  } else {
    summaryParts.push(projectId
      ? 'The selected project has been assessed only from selected project metadata and confirmed conversation facts.'
      : 'This general ontology chat has been assessed only from confirmed conversation facts.');
  }
  if (facts.recommendsMonthlyShiftSchedule) {
    summaryParts.push('It recommends monthly shift schedules for human review and is not treated as an automated hiring, firing, promotion, salary, or disciplinary decision system.');
  }
  if (facts.recommendsClaimAssessment) {
    summaryParts.push('It produces claim assessment recommendations and is not treated as making final claim approval or rejection decisions unless that authority is confirmed.');
  }
  if (facts.producesIndividualRiskScore) {
    summaryParts.push('It generates an individual risk score, so prioritization, profiling, and fairness risks require evidence-based review.');
  }
  if (facts.providesMedicalDiagnosis === false) {
    summaryParts.push('Medical diagnosis is explicitly excluded and is not used to add clinical diagnosis risks.');
  }
  if (facts.humanReviewAvailable && facts.humanCanOverride) {
    summaryParts.push(isClaimAssessment
      ? 'Claims-officer review and override are confirmed safeguards and reduce automation risk.'
      : 'Human review and override are confirmed safeguards and reduce automation risk.');
  }
  if (isWorkforceScheduling && facts.humanReviewAvailable && (facts.humanCanModify || facts.humanCanReject)) {
    summaryParts.push('Human review, modification, and rejection rights are confirmed safeguards and reduce residual scheduling risk.');
  } else if (isClaimAssessment && facts.humanReviewAvailable && (facts.humanCanModify || facts.humanCanReject) && !facts.humanCanOverride) {
    summaryParts.push('Claims-officer review, change, and rejection rights are confirmed safeguards and reduce automation risk.');
  }
  if (facts.legalBasisDocumented && facts.explicitConsent) {
    summaryParts.push('Legal basis and explicit or informed consent are confirmed and preserved across turns.');
  }

  return {
    reportVersion: ASSESSMENT_VERSION,
    projectScope: {
      projectId,
      projectTitle: project?.title || null,
      metadataUsed: Boolean(projectId),
      contaminationControls: [
        projectId ? 'Only selected project metadata is included.' : 'No selected project metadata is attached to this general chat.',
        'Conversation facts are scoped by projectId and userId.',
        'Cached GraphRAG reports are not reused as project facts.'
      ]
    },
    executiveSummary: summaryParts.slice(0, 7).join(' '),
    systemUnderstanding,
    confirmedFacts,
    classifications,
    excludedClassifications,
    domains: classifications.filter((item) => ['Education', 'StudentWellbeing', 'Employment', 'Manufacturing', 'Insurance'].includes(item.value)),
    systemFunctions: classifications.filter((item) => ['RiskScoring', 'DecisionSupport', 'WorkforceScheduling', 'ShiftRecommendation', 'InsuranceClaimsSupport', 'ClaimAssessmentRecommendation', 'HumanReviewedAI'].includes(item.value)),
    dataProcessingFunctions: classifications.filter((item) => item.value.endsWith('Processing') || item.value === 'JournalTextProcessing' || item.value === 'AcademicRecordProcessing' || item.value === 'HRDataProcessing'),
    decisionEffects: facts.recommendsCounselorContact
      ? [
          conclusion('CounselorInterventionPrioritization', 'likely', 0.76, 'The system may prioritize students for counselor intervention.', state, ['recommendsCounselorContact', 'producesIndividualRiskScore'], ['RULE_DECISION_EFFECT_01']),
          facts.humanReviewAvailable && facts.humanCanOverride
            ? conclusion('NonBindingRecommendation', 'confirmed', 0.88, 'The human reviewer can override the recommendation.', state, ['humanReviewAvailable', 'humanCanOverride'], ['RULE_DECISION_EFFECT_02'])
            : null
        ].filter(Boolean)
      : facts.producesIndividualRiskScore
        ? [
            conclusion('IndividualAssessmentOrPrioritization', 'likely', 0.76, 'The system may assess or prioritize people using an individual score.', state, ['producesIndividualRiskScore', 'profilesIndividualCharacteristic'], ['RULE_DECISION_EFFECT_SCORE_01']),
            facts.humanReviewAvailable && facts.humanCanOverride
              ? conclusion('NonBindingRecommendation', 'confirmed', 0.88, 'The human reviewer can override the recommendation.', state, ['humanReviewAvailable', 'humanCanOverride'], ['RULE_DECISION_EFFECT_02'])
              : null
          ].filter(Boolean)
      : facts.recommendsClaimAssessment || facts.insuranceClaimsPurpose
        ? [
            conclusion('ClaimAssessmentRecommendation', 'confirmed', 0.84, 'The system supports claim assessment through a recommendation or advisory output.', state, ['recommendsClaimAssessment', 'insuranceClaimsPurpose'], ['RULE_DECISION_EFFECT_CLAIM_01']),
            facts.makesFinalClaimDecision === false
              ? conclusion('NonBindingRecommendation', 'confirmed', 0.88, 'The user explicitly excluded final claim approval or rejection by the AI system.', state, 'makesFinalClaimDecision', ['RULE_DECISION_EFFECT_CLAIM_02'])
              : null,
            facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject)
              ? conclusion('HumanReviewedAI', 'confirmed', 0.88, 'A human claims reviewer can review or change the recommendation.', state, ['humanReviewAvailable', 'humanCanOverride', 'humanCanModify', 'humanCanReject'], ['RULE_DECISION_EFFECT_CLAIM_03'])
              : null
          ].filter(Boolean)
      : facts.recommendsMonthlyShiftSchedule
        ? [
            conclusion('EmployeeShiftAllocation', 'likely', 0.76, 'The system supports employee shift allocation through schedule recommendations.', state, ['recommendsMonthlyShiftSchedule', 'workforceSchedulingPurpose'], ['RULE_DECISION_EFFECT_SHIFT_01']),
            facts.humanReviewAvailable && (facts.humanCanModify || facts.humanCanReject)
              ? conclusion('HumanReviewedShiftRecommendation', 'confirmed', 0.9, 'A human manager reviews, modifies, or rejects schedules before publication.', state, ['humanReviewAvailable', 'humanCanModify', 'humanCanReject', 'decisionPublishedOnlyAfterHumanReview'], ['RULE_DECISION_EFFECT_SHIFT_02'])
              : null
          ].filter(Boolean)
        : [],
    possibleRegulatoryUseCases: classifications.filter((item) => item.value === 'ProfilingAI'),
    excludedUseCases: excludedClassifications,
    primaryRisks,
    ethicalTensions,
    safeguards,
    regulatoryConsiderations,
    missingInformation,
    recommendedActions,
    reasoningTrace: buildReasoningTrace(state, keywordCandidates, {
      projectId,
      projectTitle: project?.title || null,
      stateMergeStats,
      geminiExtraction
    }),
    nonApplicableRisks
  };
}

function normalizeIdentityValue(value) {
  return normalizeWhitespace(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function factEntriesToMap(entries) {
  return (entries || []).reduce((acc, entry) => {
    if (!entry?.fact) return acc;
    if (entry.value !== undefined && entry.value !== null) acc[entry.fact] = entry.value;
    return acc;
  }, {});
}

function domainGroupsForFacts(facts) {
  const groups = new Set();
  if (facts.educationContext || facts.studentWellbeingPurpose || facts.recommendsCounselorContact) groups.add('education');
  if (facts.insuranceContext || facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment || facts.processesInsuranceClaimData || facts.processesClaimantData) groups.add('insurance');
  if (facts.employmentContext || facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) groups.add('employment');
  if (facts.manufacturingContext) groups.add('employment');
  return groups;
}

function getPreviousStateResetInfo(previousState, incomingFacts) {
  const previousFacts = previousState?.confirmedFacts || {};
  const incomingFactMap = factEntriesToMap(incomingFacts);
  const previousName = normalizeIdentityValue(previousFacts.systemName);
  const incomingName = normalizeIdentityValue(incomingFactMap.systemName);

  if (previousName && incomingName && previousName !== incomingName) {
    return {
      reset: true,
      reason: 'incoming_system_name_differs_from_previous_state',
      previousSystemName: previousFacts.systemName,
      incomingSystemName: incomingFactMap.systemName
    };
  }

  const previousDomains = domainGroupsForFacts(previousFacts);
  const incomingDomains = domainGroupsForFacts(incomingFactMap);
  if (previousDomains.size && incomingDomains.size) {
    const overlap = Array.from(incomingDomains).some((domain) => previousDomains.has(domain));
    if (!overlap) {
      return {
        reset: true,
        reason: 'incoming_domain_differs_from_previous_state',
        previousDomains: Array.from(previousDomains),
        incomingDomains: Array.from(incomingDomains)
      };
    }
  }

  return { reset: false, reason: null };
}

function assessOntologyChat({ project, messages = [], previousState = {}, newMessage = '', messageIndex = null, llmFacts = [], geminiExtraction = null }) {
  const projectText = getProjectText(project);
  const projectFacts = extractFactsFromText(projectText, 'PROJECT_METADATA', null);
  const userMessages = messages.filter((message) => message.sender === 'user');
  const userFacts = newMessage
    ? extractFactsFromText(newMessage, 'USER_CONFIRMED', messageIndex)
    : userMessages.flatMap((message, index) => extractFactsFromText(message.text, 'USER_CONFIRMED', index));
  const latestUserMessage = newMessage
    ? { text: newMessage, index: messageIndex ?? userMessages.length }
    : userMessages.length
      ? { text: userMessages[userMessages.length - 1].text, index: userMessages.length - 1 }
      : null;
  const latestMessageFacts = latestUserMessage
    ? extractFactsFromText(latestUserMessage.text, 'USER_CONFIRMED', latestUserMessage.index)
    : [];

  const validLlmFacts = Array.isArray(llmFacts) ? llmFacts.filter((fact) => fact && fact.fact && fact.source === 'LLM_EXTRACTED') : [];
  const resetInfo = getPreviousStateResetInfo(previousState, [...userFacts, ...validLlmFacts]);
  const mergeBaseState = resetInfo.reset ? {} : previousState;
  const state = mergeConversationFacts(mergeBaseState, [...projectFacts, ...userFacts, ...validLlmFacts]);
  const stateMergeStats = {
    projectId: getProjectId(project) || null,
    projectAttached: Boolean(getProjectId(project)),
    priorUserMessagesLoaded: Math.max(0, userMessages.length - (latestUserMessage ? 1 : 0)),
    priorMessagesLoaded: Math.max(0, messages.length - (latestUserMessage ? 1 : 0)),
    existingFactsLoaded: Object.keys(previousState?.confirmedFacts || {}).length,
    newFactsExtracted: latestMessageFacts.length,
    llmFactsAccepted: validLlmFacts.length,
    llmFactsRejected: geminiExtraction?.rejectedFacts?.length || 0,
    llmExtractionStatus: geminiExtraction?.status || 'not_run',
    semanticCandidatesAccepted: geminiExtraction?.acceptedSemanticCandidates?.length || 0,
    semanticCandidatesRejected: geminiExtraction?.rejectedSemanticCandidates?.length || 0,
    previousStateReset: resetInfo.reset,
    previousStateResetReason: resetInfo.reason,
    totalExtractedFactsThisRun: projectFacts.length + userFacts.length + validLlmFacts.length,
    mergedFactsUsed: Object.keys(state.confirmedFacts || {}).length
  };
  const fullText = [
    projectText,
    ...userMessages.map((message) => message.text),
    newMessage
  ].join(' ');
  const keywordCandidates = buildKeywordCandidates(fullText);
  const ontologyResult = buildReport({ project, state, keywordCandidates, stateMergeStats, geminiExtraction });
  const hasFacts = Object.keys(state.confirmedFacts || {}).length > 0;
  const hasContradictions = (state.contradictions || []).some((item) => item.status === 'needs_clarification');
  const status = hasContradictions || !hasFacts ? 'needs_more_information' : 'completed';

  let reply = '';
  if (hasContradictions) {
    reply = 'I found a contradiction in the confirmed project facts. Please clarify it before I finalize the assessment.';
  } else if (status === 'completed') {
    const risks = Array.isArray(ontologyResult.primaryRisks) ? ontologyResult.primaryRisks : [];
    const actions = Array.isArray(ontologyResult.recommendedActions) ? ontologyResult.recommendedActions : [];
    
    const risksText = risks.length > 0
      ? risks.map(r => `- **${r.title || r.value || 'Risk'}** (${r.severity || r.status || 'Unknown'}): ${r.reason || ''}`).join('\n')
      : 'No major risks identified yet.';
      
    const actionsText = actions.length > 0
      ? actions.map(a => `- ${a.value || a.action || a}`).join('\n')
      : 'No specific actions required.';
      
    reply = `Based on your input, here is my assessment:\n\n### Main Risks\n${risksText}\n\n### Recommended Actions\n${actionsText}\n\nPlease let me know if you have any other questions or need further details.`;
  } else {
    reply = 'I need more project information before I can produce an evidence-based assessment. Could you provide more details about the system, users, or data?';
  }

  return {
    status,
    reply,
    state,
    ontologyResult,
    raw: {
      assessmentVersion: ASSESSMENT_VERSION,
      projectId: getProjectId(project),
      factCount: Object.keys(state.confirmedFacts || {}).length,
      stateMergeStats,
      geminiExtraction,
      keywordCandidates,
      contradictions: state.contradictions || []
    }
  };
}

function buildGraphFactAssertions({ project, userId, state }) {
  const projectId = getProjectId(project);
  const latestEvidenceByFact = new Map();

  (state.factEvidence || []).forEach((item) => {
    latestEvidenceByFact.set(item.fact, item);
  });

  const facts = Object.entries(state.confirmedFacts || {}).map(([key, value]) => {
    const evidence = latestEvidenceByFact.get(key) || {};
    return {
      key,
      label: FACT_LABELS[key] || key,
      value,
      valueText: String(value),
      source: evidence.source || 'USER_CONFIRMED',
      evidenceSource: evidence.evidenceSource || null,
      provenance: evidence.provenance || [evidence.source || 'USER_CONFIRMED'],
      sourceText: evidence.sourceText || '',
      confidence: evidence.confidence || 0.9
    };
  });

  return {
    query: `
      MERGE (s:AISystem {projectId: $projectId})
      SET s.name = $projectTitle,
          s.userId = $userId,
          s.updatedAt = datetime()
      WITH s
      UNWIND $facts AS fact
      MERGE (f:Fact {projectId: $projectId, userId: $userId, key: fact.key})
      SET f.label = fact.label,
          f.value = fact.valueText,
          f.source = fact.source,
          f.evidenceSource = fact.evidenceSource,
          f.provenance = fact.provenance,
          f.sourceText = fact.sourceText,
          f.confidence = fact.confidence,
          f.updatedAt = datetime()
      MERGE (s)-[:HAS_FACT]->(f)
      WITH s, fact
      FOREACH (_ IN CASE WHEN fact.key = 'providesMedicalDiagnosis' AND fact.valueText = 'false' THEN [1] ELSE [] END |
        MERGE (c:OntologyConcept {name: 'MedicalDiagnosisAI'})
        MERGE (s)-[:DOES_NOT_PERFORM]->(c)
      )
      FOREACH (_ IN CASE WHEN fact.key = 'producesIndividualRiskScore' AND fact.valueText = 'true' THEN [1] ELSE [] END |
        MERGE (c:OntologyConcept {name: 'IndividualRiskScore'})
        MERGE (s)-[:PRODUCES]->(c)
      )
      FOREACH (_ IN CASE WHEN fact.key IN ['humanReviewAvailable', 'humanCanOverride', 'explicitConsent', 'legalBasisDocumented'] AND fact.valueText = 'true' THEN [1] ELSE [] END |
        MERGE (sg:Safeguard {name: fact.key})
        MERGE (s)-[:HAS_SAFEGUARD]->(sg)
      )
      RETURN count(fact) AS fact_count
    `,
    params: {
      projectId,
      userId: String(userId || ''),
      projectTitle: project?.title || projectId,
      facts
    }
  };
}

module.exports = {
  ASSESSMENT_VERSION,
  PROVENANCE_TYPES,
  FACT_LABELS,
  UNKNOWN_FACTS,
  assessOntologyChat,
  extractFactsFromText,
  mergeConversationFacts,
  buildGraphFactAssertions
};
