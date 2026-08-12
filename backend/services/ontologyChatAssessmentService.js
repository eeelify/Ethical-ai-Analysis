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

const ASSESSMENT_VERSION = 'ontology-chat-semantic-facts-v3';

const FACT_LABELS = Object.freeze({
  systemName: 'System name',
  systemPurpose: 'System purpose',
  userRole: 'User role',
  primaryUsers: 'Primary users',
  affectedPersons: 'Affected persons',
  deploymentContext: 'Deployment context',
  systemInputs: 'System inputs',
  systemOutputs: 'System outputs',
  decisionsSupported: 'Decisions supported',
  humanRoleDescription: 'Human role description',
  lessonPlanningPurpose: 'Lesson planning purpose',
  assignmentEvaluationPurpose: 'Assignment evaluation purpose',
  essayScoringPurpose: 'Essay scoring purpose',
  feedbackSuggestionOnly: 'AI suggests feedback only',
  adaptiveLearningSupport: 'Adaptive learning support',
  learningProcessInfluence: 'Learning process influence',
  teacherFinalGradeDecision: 'Teacher decides final grade',
  processesStudentWork: 'Processes student work',
  studentNamesUsed: 'Student names used',
  studentNamesUseUnknown: 'Student names use unknown',
  educationAdmissionsPurpose: 'Education admissions purpose',
  applicantScoring: 'Applicant scoring',
  recommendsAdmissionsOutcome: 'Admissions recommendation',
  officersUsuallyFollowRecommendation: 'Human officers usually follow the recommendation',
  noFormalAppealMechanism: 'No formal appeal mechanism',
  noClearIndividualExplanation: 'No clear individual score explanation',
  usesThirdPartyCloudProvider: 'Uses third-party cloud provider',
  processesDemographicData: 'Processes demographic data',
  processesDisabilityData: 'Processes disability data',
  historicalBiasEvidence: 'Historical bias evidence',
  dataFieldDisability: 'Disability data field',
  dataFieldGender: 'Gender data field',
  dataFieldAge: 'Age data field',
  dataFieldRegion: 'Region data field',
  dataFieldSocioeconomic: 'Socioeconomic data field',
  dataFieldPreviousSchool: 'Previous school data field',
  educationContext: 'Education context',
  clinicalTriagePurpose: 'Clinical triage purpose',
  healthcareContext: 'Healthcare context',
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
  processesPatientRecords: 'Processes patient records',
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
  employmentRecruitmentPurpose: 'Employment recruitment purpose',
  applicantRankingPurpose: 'Applicant ranking purpose',
  ranksJobApplicants: 'Ranks job applicants',
  processesApplicantCVs: 'Processes applicant CVs',
  processesApplicantEducation: 'Processes applicant education',
  processesApplicantWorkExperience: 'Processes applicant work experience',
  processesApplicantSkills: 'Processes applicant skills',
  processesCoverLetters: 'Processes cover letters',
  jobApplicantsAffected: 'Job applicants affected',
  supportsHiringDecision: 'Supports hiring decision',
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

const APPENDABLE_FACTS = new Set([
  'systemPurpose',
  'primaryUsers',
  'affectedPersons',
  'systemInputs',
  'systemOutputs',
  'decisionsSupported'
]);

const COMPATIBLE_TEXT_FACTS = new Set([
  'userRole',
  'deploymentContext',
  'humanRoleDescription'
]);

const FINAL_GRADE_FIELD = 'final_grade_assignment';

const STRICT_BOOLEAN_CONTRADICTION_FACTS = new Set([
  'appealMechanismAvailable',
  'assignsAcademicGrade',
  'challengeMechanismAvailable',
  'correctionRightAvailable',
  'decisionPublishedOnlyAfterHumanReview',
  'explanationAvailable',
  'fullyAutomatedDecision',
  'humanCanModify',
  'humanCanOverride',
  'humanCanReject',
  'humanReviewAvailable',
  'manualReviewAvailable',
  'makesDisciplinaryDecision',
  'makesFinalClaimDecision',
  'makesFiringDecision',
  'makesHiringDecision',
  'makesPromotionDecision',
  'makesSalaryDecision',
  'processesBiometricData',
  'processesHealthData',
  'studentNamesUsed',
  'usesEmotionDetection',
  'usesFacialRecognition'
]);

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
  EducationAdmissionsAccess: 'Education admissions or access assessment',
  ApplicantScoring: 'Applicant scoring',
  AdmissionsRecommendation: 'Admissions recommendation',
  HighRiskEducationAccessAssessment: 'EU AI Act education access high-risk candidate',
  HumanReviewEffectivenessRequiresVerification: 'Human review effectiveness requires verification',
  ThirdPartyCloudProcessing: 'Third-party cloud processing',
  PersonalDataProcessing: 'Personal data processing',
  DemographicDataProcessing: 'Demographic data processing',
  DisabilityDataProcessing: 'Disability data processing',
  HealthRelatedDataProcessing: 'Health-related data processing',
  WearableDataProcessing: 'Wearable data processing',
  JournalTextProcessing: 'Journal text processing',
  AcademicRecordProcessing: 'Academic record processing',
  CounselorInterventionPrioritization: 'Counselor intervention prioritization',
  NonBindingRecommendation: 'Non-binding recommendation',
  Employment: 'Employment',
  EmploymentRecruitment: 'Employment recruitment',
  ApplicantRanking: 'Applicant ranking',
  RecruitmentDecisionSupport: 'Recruitment decision support',
  CandidateApplicationDataProcessing: 'Candidate application data processing',
  HighRiskEmploymentRecruitmentAssessment: 'EU AI Act employment recruitment high-risk candidate',
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

function cleanExtractedPhrase(value, maxLength = 180) {
  return normalizeWhitespace(value)
    .replace(/^(?:and\s+|their\s+|his\s+|her\s+|its\s+|an?\s+|the\s+)/i, '')
    .replace(/\s+(?:please|thanks?|thank you)$/i, '')
    .replace(/[.;!?]+$/g, '')
    .slice(0, maxLength)
    .trim();
}

function sentenceCase(value) {
  const text = cleanExtractedPhrase(value);
  if (!text) return text;
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function extractGenericRole(normalizedSentence) {
  const roleMatch = normalizedSentence.match(/\b(?:I am|I'm|As an?|As the)\s+(?:an?\s+|the\s+)?([A-Za-z][A-Za-z0-9 /&-]{2,70}?)(?=\.|,|\s+and\s+I\b|\s+who\b|\s+using\b|\s+with\b|$)/i);
  const role = cleanExtractedPhrase(roleMatch?.[1] || '', 70);
  if (!role || /^(using|use|an ai|ai|the ai|this system)$/i.test(role)) return null;
  return sentenceCase(role);
}

function extractGenericPurpose(normalizedSentence) {
  const patterns = [
    /\b(?:I|we|our team|my team)\s+use[s]?\s+(?:an?\s+)?(?:AI[- ]based\s+)?(?:AI\s+)?(?:tool|system|model|application|software|platform)?\s*(?:to|for)\s+(.+?)(?=\s+based on\b|\s+using\b|\s+with\b|\s+from\b|[.;!?]|$)/i,
    /\b(?:the\s+)?(?:AI[- ]based\s+)?(?:AI\s+)?(?:tool|system|model|application|software|platform)\s+(?:is used|is designed|helps|supports)\s+(?:to|for)\s+(.+?)(?=\s+based on\b|\s+using\b|\s+with\b|\s+from\b|[.;!?]|$)/i,
    /\b(?:an?\s+|the\s+)?[A-Za-z0-9 /&-]{0,80}?\b(?:AI[- ]based\s+)?(?:AI\s+)?(?:tool|system|model|application|software|platform)\s+used\s+(?:to|for)\s+(.+?)(?=\s+based on\b|\s+using\b|\s+with\b|\s+from\b|[.;!?]|$)/i,
    /\b(?:an?\s+|the\s+)?[A-Za-z0-9 /&-]{0,80}?\b(?:AI[- ]based\s+)?(?:AI\s+)?(?:tool|system|model|application|software|platform)\s+(?:designed|built|created|intended)\s+(?:to|for)\s+(.+?)(?=\s+based on\b|\s+using\b|\s+with\b|\s+from\b|[.;!?]|$)/i,
    /\b(?:the\s+)?(?:AI[- ]based\s+)?(?:AI\s+)?(?:tool|system|model|application|software|platform)\s+(?:continuously\s+|automatically\s+)?(?:analyzes|analyses|processes)\s+.+?\s+to\s+(.+?)(?=[.;!?]|$)/i,
    /\b(?:the\s+)?(?:AI[- ]based\s+)?(?:AI\s+)?(?:tool|system|model|application|software|platform)\s+(?:continuously\s+|automatically\s+)?(?:analyzes|analyses|processes)\s+.+?\s+and\s+(?:generates|produces|provides|creates|recommends)\s+(.+?)(?=[.;!?]|$)/i
  ];

  for (const pattern of patterns) {
    const match = normalizedSentence.match(pattern);
    const purpose = cleanExtractedPhrase(match?.[1] || '');
    if (purpose && !/^(it|that|which)$/i.test(purpose)) return sentenceCase(purpose);
  }

  return null;
}

function extractGenericInputs(normalizedSentence) {
  const inputs = [];
  const inputPatterns = [
    /\bbased on\s+(.+?)(?=[.;!?]|$)/i,
    /\busing\s+(.+?)(?=\s+to\b|[.;!?]|$)/i,
    /\bruntime data includes\s+(.+?)(?=[.;!?]|$)/i,
    /\b(student inputs?|user inputs?)\s+(?:are|is)?\s*(?:processed|used|analy[sz]ed)?\s*(?:automatically)?\s*(?=[.;!?]|$)/i,
    /\b(?:analyzes|analyses|processes|uses|takes in)\s+(.+?)(?=\s+to\b|\s+and\s+(?:generates|produces|recommends|outputs|creates|provides|flags|ranks|scores)\b|[.;!?]|$)/i
  ];

  inputPatterns.forEach((pattern) => {
    const match = normalizedSentence.match(pattern);
    const raw = cleanExtractedPhrase(match?.[1] || '', 240);
    if (!raw || /\bAI\s+(tool|system|model|application|software|platform)\b/i.test(raw)) return;
    raw
      .split(/\s*,\s*|\s+and\s+|\s+or\s+/i)
      .map((item) => cleanExtractedPhrase(item, 80))
      .filter((item) => item &&
        !/^(?:is|are|was|were|be|being|been|occur|occurs|generally occur|not clearly defined)\b/i.test(item) &&
        !/\b(transformer|large language model|llm|version|build|architecture|web browsers?|mobile compatibility|educational platforms?|learning management system|lms|institutional education portals?)\b/i.test(item))
      .forEach((item) => inputs.push(sentenceCase(item)));
  });

  return Array.from(new Set(inputs));
}

function extractGenericOutput(normalizedSentence) {
  const s = normalizedSentence.toLowerCase();
  if (includesAny(s, [/\b(rank|ranks|ranking|prioriti[sz]e|prioriti[sz]es)\b/])) return 'Ranking or prioritization';
  if (includesAny(s, [/\b(score|scores|scoring|rate|rates|rating)\b/])) return 'Score or rating';
  if (includesAny(s, [/\brefund recommendations?\b/])) return 'Refund recommendation';
  if (includesAny(s, [/\bproduct recommendations?\b|\bpersonalized recommendations?\b/])) return 'Product recommendation';
  if (includesAny(s, [/\bresponse drafts?\b|\bdraft responses?\b/])) return 'Response draft';
  if (includesAny(s, [/\b(recommend|recommends|recommendation|recommendations|suggest|suggests|suggestion|suggestions)\b/])) return 'Recommendation';
  if (includesAny(s, [/\b(flag|flags|detect|detects|classify|classifies|screen|screens)\b/])) return 'Flag, detection, or classification';
  if (includesAny(s, [/\b(generate|generates|draft|drafts|create|creates|produce|produces|write|writes)\b/])) return 'Generated content';
  if (includesAny(s, [/\b(approve|approves|reject|rejects|decide|decides|determine|determines)\b/])) return 'Decision output';
  return null;
}

function textDescribesEducationalSupport(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  return includesAny(s, [
    /\b(tutor|educational chatbot|academic support|educational support|independent learning|learning process)\b/,
    /\b(answering questions?|answers? questions?|explaining concepts?|provide[s]? examples?|analogies|study guidance|learning guidance|pedagogical responses?)\b/,
    /\b(adapt(?:ing|s)? responses?)\b.{0,80}\b(knowledge level|student'?s? level|context of the interaction)\b/
  ]);
}

function textDescribesAutomatedEducationalContentWithoutFormalDecision(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  return includesAny(s, [/\b(automated|automatically|without human approval|without prior human approval|highly automated)\b/]) &&
    textDescribesEducationalSupport(s) &&
    !includesAny(s, [
      /\b(final|formal|official)\b.{0,60}\b(decision|grade|grading|admission|disciplinary|certification|outcome)\b/,
      /\b(approve|reject|admit|exclude|disciplinary outcome|certif(?:y|ication)|assigns? grades?|determines? grades?)\b/
    ]);
}

function textExplicitlyAffirmsEducationAdmissionsDecision(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s || textExplicitlyNegatesEducationAdmissionsDecision(s)) return false;
  return includesAny(s, [
    /\b(university\s+)?admissions?\b.{0,140}\b(decision|support|score|scoring|recommend|recommendation|accept|acceptance|reject|rejection|waiting[- ]list|outcome|applicant)\w*\b/,
    /\b(applicant scoring|student applicant score|admissions score|admissions recommendation|recommendations? for admission|admission outcome|waiting[- ]list)\b/,
    /\b(recommends?|recommendations?)\b.{0,80}\b(acceptance|rejection|waiting[- ]list)\b/
  ]);
}

function textExplicitlyAffirmsAdmissionsOutcome(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s || textExplicitlyNegatesEducationAdmissionsDecision(s)) return false;
  return includesAny(s, [
    /\b(admissions?|student applicants?|applicants?)\b.{0,120}\b(acceptance|rejection|waiting[- ]list|admission outcome|admissions? recommendation)\b/,
    /\b(recommends?|recommendations?)\b.{0,80}\b(acceptance|rejection|waiting[- ]list)\b/
  ]);
}

function extractPeopleGroupsFromText(normalizedSentence) {
  const groups = [
    ['student applicant', 'Student applicants'],
    ['students', 'Students'],
    ['student', 'Students'],
    ['student applicants', 'Student applicants'],
    ['job applicants', 'Job applicants'],
    ['job applicant', 'Job applicants'],
    ['applicants', 'Applicants'],
    ['applicant', 'Applicants'],
    ['candidates', 'Candidates'],
    ['candidate', 'Candidates'],
    ['employees', 'Employees'],
    ['employee', 'Employees'],
    ['workers', 'Workers'],
    ['worker', 'Workers'],
    ['patients', 'Patients'],
    ['patient', 'Patients'],
    ['customers', 'Customers'],
    ['customer', 'Customers'],
    ['clients', 'Clients'],
    ['client', 'Clients'],
    ['claimants', 'Claimants'],
    ['claimant', 'Claimants'],
    ['citizens', 'Citizens'],
    ['citizen', 'Citizens'],
    ['borrowers', 'Borrowers'],
    ['borrower', 'Borrowers'],
    ['tenants', 'Tenants'],
    ['tenant', 'Tenants'],
    ['users', 'Users'],
    ['user', 'Users'],
    ['people', 'People'],
    ['person', 'People'],
    ['individuals', 'Individuals']
  ];
  const s = normalizedSentence.toLowerCase();
  return groups
    .filter(([needle]) => new RegExp(`\\b${needle.replace(/\s+/g, '\\s+')}\\b`, 'i').test(s))
    .map(([, label]) => label);
}

function genericPurposeLooksDecisionRelevant(value) {
  return includesAny(normalizeWhitespace(value).toLowerCase(), [
    /\b(rank|score|rate|prioriti[sz]e|screen|evaluate|assess|flag|detect|classify|recommend|approve|reject|decide|determine|predict)\w*\b/
  ]);
}

function textMentionsPersonRelatedData(normalizedSentence) {
  return includesAny(normalizedSentence.toLowerCase(), [
    /\b(name|email|phone|address|location|ip address|profile|history|record|cv|resume|cover letter|application data|grade|health|biometric|financial|transaction|salary|performance|order|ticket|live chat|refund|purchase|browsing)\w*\b/
  ]);
}

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
  const normalizedSentence = normalizeWhitespace(sentence);
  const s = sentence.toLowerCase();

  const namedSystemMatch = normalizedSentence.match(/^([A-Z][A-Za-z0-9_-]{2,})\s+is\s+(?:an?|the)\s+/);
  if (namedSystemMatch?.[1] && !['this', 'there'].includes(namedSystemMatch[1].toLowerCase())) {
    addFact(facts, 'systemName', namedSystemMatch[1], sentence, source, messageIndex, 0.9);
  }

  if (includesAny(s, [/\bhigh school teacher\b/])) {
    addFact(facts, 'userRole', 'High school teacher', sentence, source, messageIndex, 0.94);
    addFact(facts, 'primaryUsers', 'Teacher', sentence, source, messageIndex, 0.88);
    addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\b(i am|i'm|as a)\b.{0,40}\bteacher\b|\bteacher\b/])) {
    addFact(facts, 'userRole', 'Teacher', sentence, source, messageIndex, 0.9);
    addFact(facts, 'primaryUsers', 'Teacher', sentence, source, messageIndex, 0.88);
    addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(i am|i'm|as an?|as the)\b.{0,50}\b(hr specialist|human resources specialist|recruiter|hiring manager)\b|\bhr specialist\b|\bhuman resources specialist\b|\brecruiter\b|\bhiring manager\b/])) {
    const role = includesAny(s, [/\brecruiter\b/])
      ? 'Recruiter'
      : includesAny(s, [/\bhiring manager\b/])
        ? 'Hiring manager'
        : 'HR specialist';
    addFact(facts, 'userRole', role, sentence, source, messageIndex, 0.92);
    addFact(facts, 'primaryUsers', 'HR or recruitment staff', sentence, source, messageIndex, 0.88);
    addFact(facts, 'employmentContext', true, sentence, source, messageIndex, 0.9);
  }

  const genericRole = extractGenericRole(normalizedSentence);
  if (genericRole) {
    addFact(facts, 'userRole', genericRole, sentence, source, messageIndex, 0.72);
    addFact(facts, 'primaryUsers', genericRole, sentence, source, messageIndex, 0.7);
  }

  const genericPurpose = extractGenericPurpose(normalizedSentence);
  if (genericPurpose) {
    addFact(facts, 'systemPurpose', genericPurpose, sentence, source, messageIndex, 0.76);
    if (genericPurposeLooksDecisionRelevant(genericPurpose)) {
      addFact(facts, 'decisionsSupported', `${genericPurpose} support`, sentence, source, messageIndex, 0.68);
    }
  }

  const genericOutput = extractGenericOutput(normalizedSentence);
  const negatesOfficialAcademicDecision = textExplicitlyNegatesOfficialAcademicDecision(s);
  if (genericOutput && !negatesOfficialAcademicDecision) {
    addFact(facts, 'systemOutputs', genericOutput, sentence, source, messageIndex, 0.68);
  } else if (negatesOfficialAcademicDecision && includesAny(s, [/\b(generate|generates|provide|provides|answer|answers|explain|explains|explanation|examples?)\b/])) {
    addFact(facts, 'systemOutputs', 'Generated educational support content', sentence, source, messageIndex, 0.68);
  }

  extractGenericInputs(normalizedSentence).forEach((input) => {
    addFact(facts, 'systemInputs', input, sentence, source, messageIndex, 0.68);
  });

  const genericPeopleGroups = extractPeopleGroupsFromText(normalizedSentence);
  genericPeopleGroups.forEach((group) => {
    addFact(facts, 'affectedPersons', group, sentence, source, messageIndex, 0.68);
  });
  if (includesAny(s, [/\bsupport agents?\b|\bcustomer support agents?\b/])) {
    addFact(facts, 'primaryUsers', 'Support agents', sentence, source, messageIndex, 0.72);
  }
  if (!negatesOfficialAcademicDecision && textMentionsPersonRelatedData(normalizedSentence)) {
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.62);
  }
  if (!negatesOfficialAcademicDecision && genericPeopleGroups.length && genericPurposeLooksDecisionRelevant(genericPurpose || normalizedSentence)) {
    addFact(facts, 'profilesIndividualCharacteristic', true, sentence, source, messageIndex, 0.62);
    if (includesAny(s, [/\b(rank|score|rate|prioriti[sz]e|screen|evaluate|assess|classify)\w*\b/])) {
      addFact(facts, 'producesIndividualRiskScore', true, sentence, source, messageIndex, 0.6);
    }
  }
  const negatesAutomatedDecision = textExplicitlyNegatesAutomatedDecision(s);
  if (textExplicitlyAffirmsAutomatedDecision(s)) {
    addFact(facts, 'fullyAutomatedDecision', true, sentence, source, messageIndex, 0.72);
  }
  if (negatesOfficialAcademicDecision) {
    addFact(facts, 'fullyAutomatedDecision', false, sentence, source, messageIndex, 0.84);
  }
  if (!negatesOfficialAcademicDecision && (negatesAutomatedDecision || includesAny(s, [
    /\b(ai|system|tool|model)\b.{0,100}\b(cannot|can't|does not|doesn't|do not|don't|never|not)\b.{0,80}\b(make|decide|determine|approve|reject|assign|shortlist)\w*\b.{0,80}\b(final )?(decision|outcome|result|approval|rejection|applicants?|candidates?)\b/,
    /\b(advisory only|recommendation only|suggestion only|does not make final decisions?|not a final decision)\b/,
    /\b(i|we|human|person|people|staff|officer|manager|reviewer|specialist|team)\b.{0,100}\b(decide|decides|make|makes|determine|determines)\b.{0,80}\b(final )?(decision|outcome|result)\b/
  ]))) {
    addFact(facts, 'fullyAutomatedDecision', false, sentence, source, messageIndex, 0.78);
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.72);
  }
  if (includesAny(s, [/\bstudents?\b/])) {
    addFact(facts, 'affectedPersons', 'Students', sentence, source, messageIndex, 0.82);
    addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.78);
  }
  if (textDescribesEducationalSupport(s)) {
    addFact(facts, 'systemPurpose', 'Provide educational support to students', sentence, source, messageIndex, 0.86);
    addFact(facts, 'systemOutputs', 'Explanations, examples, analogies, and study guidance', sentence, source, messageIndex, 0.84);
    addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.86);
    if (includesAny(s, [/\b(student|students)\b/])) {
      addFact(facts, 'affectedPersons', 'Students', sentence, source, messageIndex, 0.84);
    }
  }
  if (includesAny(s, [
    /\badapt(?:ing|s)? responses?\b.{0,100}\b(knowledge level|student'?s? level|context of the interaction)\b/,
    /\b(level-appropriate instruction|guidance throughout the learning process|steer(?:s|ing)? the learning process)\b/,
    /\bstrongly influence[s]?\b.{0,120}\b(learning behavior|academic performance|educational outcomes|students'? understanding)\b/
  ])) {
    addFact(facts, 'adaptiveLearningSupport', true, sentence, source, messageIndex, 0.82);
    addFact(facts, 'learningProcessInfluence', true, sentence, source, messageIndex, 0.78);
  }
  if (includesAny(s, [/\blesson plans?\b|\bprepare lesson materials?\b|\bgenerate quiz questions?\b|\bquiz questions?\b/])) {
    addFact(facts, 'lessonPlanningPurpose', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemPurpose', includesAny(s, [/\bquiz questions?\b/]) ? 'Generate quiz questions or learning materials' : 'Generate lesson plans or learning materials', sentence, source, messageIndex, 0.86);
    addFact(facts, 'systemOutputs', includesAny(s, [/\bquiz questions?\b/]) ? 'Quiz questions' : 'Lesson plans', sentence, source, messageIndex, 0.82);
    addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(assignments?|student assignments?|student work)\b.{0,80}\b(evaluat|assess|score|grade|feedback)\w*\b|\b(evaluat|assess|score|grade|feedback)\w*\b.{0,80}\b(assignments?|student work)\b/])) {
    addFact(facts, 'assignmentEvaluationPurpose', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemPurpose', 'Evaluate student assignments or student work', sentence, source, messageIndex, 0.84);
    addFact(facts, 'processesStudentWork', true, sentence, source, messageIndex, 0.84);
    addFact(facts, 'systemInputs', 'Student assignments or student work', sentence, source, messageIndex, 0.82);
    addFact(facts, 'affectedPersons', 'Students', sentence, source, messageIndex, 0.86);
    addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.88);
  }
  if (includesAny(s, [/\b(score|scores|scoring|grade|grades|grading)\b.{0,80}\b(essays?|student essays?)\b|\b(essays?|student essays?)\b.{0,80}\b(score|scores|scoring|grade|grades|grading)\b/])) {
    addFact(facts, 'essayScoringPurpose', true, sentence, source, messageIndex, 0.92);
    addFact(facts, 'assignmentEvaluationPurpose', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemPurpose', 'Score or evaluate student essays', sentence, source, messageIndex, 0.88);
    addFact(facts, 'processesStudentWork', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'systemInputs', 'Student essays', sentence, source, messageIndex, 0.86);
    addFact(facts, 'systemOutputs', 'Essay score or evaluation', sentence, source, messageIndex, 0.84);
    addFact(facts, 'evaluatesLearningOutcome', true, sentence, source, messageIndex, 0.82);
    addFact(facts, 'affectedPersons', 'Students', sentence, source, messageIndex, 0.86);
    addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\b(generate|draft|provide|create|suggest)\w*\b.{0,60}\bfeedback\b|\bfeedback\b.{0,60}\b(generate|draft|provide|create|suggest)\w*\b/])) {
    addFact(facts, 'systemPurpose', 'Generate feedback for student work', sentence, source, messageIndex, 0.84);
    addFact(facts, 'systemOutputs', 'Feedback generation', sentence, source, messageIndex, 0.84);
    if (includesAny(s, [/\bstudents?|essays?|assignments?|student work\b/])) {
      addFact(facts, 'assignmentEvaluationPurpose', true, sentence, source, messageIndex, 0.82);
      addFact(facts, 'affectedPersons', 'Students', sentence, source, messageIndex, 0.8);
      addFact(facts, 'educationContext', true, sentence, source, messageIndex, 0.82);
    }
  }
  if (includesAny(s, [/\bonly\b.{0,40}\b(suggests?|recommend\w*)\b.{0,60}\bfeedback\b|\b(suggests?|recommend\w*)\b.{0,60}\bfeedback\b.{0,40}\bonly\b/])) {
    addFact(facts, 'feedbackSuggestionOnly', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemOutputs', 'Feedback suggestions', sentence, source, messageIndex, 0.86);
    addFact(facts, 'fullyAutomatedDecision', false, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\b(i|teacher|human)\b.{0,80}\b(decide|decides|make|makes)\b.{0,60}\b(final )?(grade|grading decision)\b|\bfinal grade\b.{0,80}\b(myself|teacher|human|i decide)\b/])) {
    addFact(facts, 'teacherFinalGradeDecision', true, sentence, source, messageIndex, 0.92);
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'fullyAutomatedDecision', false, sentence, source, messageIndex, 0.86);
    addFact(facts, 'assignsAcademicGrade', false, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\b(ai|system|score)\b.{0,80}\b(directly|automatically)\b.{0,80}\b(final grade|grade)\b|\bfinal grade\b.{0,80}\b(automatically|directly)\b.{0,80}\b(ai|system|score)\b/])) {
    addFact(facts, 'assignsAcademicGrade', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'fullyAutomatedDecision', true, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\bstudents?\b.{0,80}\b(ask|request)\b.{0,80}\b(review|correct|correction)\b|\b(review|correct|correction)\b.{0,80}\bincorrect score\b/])) {
    addFact(facts, 'correctionRightAvailable', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'manualReviewAvailable', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'affectedPersons', 'Students', sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\bstudent names?\b.{0,60}\b(use|used|entered|shared|included)\b|\b(use|used|enter|entered|share|shared|include|included)\b.{0,60}\bstudent names?\b/])) {
    const negatedNames = includesAny(s, [/\b(no|not|without|do not|don't|does not|doesn't|not told|have not told)\b.{0,80}\bstudent names?\b|\bstudent names?\b.{0,80}\b(no|not|unknown|not told)\b/]);
    if (includesAny(s, [/\bnot told\b|\bhave not told\b|\bunknown\b|\bwhether\b/])) {
      addFact(facts, 'studentNamesUseUnknown', true, sentence, source, messageIndex, 0.9);
    } else {
      addFact(facts, 'studentNamesUsed', !negatedNames, sentence, source, messageIndex, 0.86);
      if (!negatedNames) addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.86);
    }
  }
  const personalDataUnknownMention = includesAny(s, [/\bnot told\b|\bhave not told\b|\bunknown\b|\bwhether\b/]);
  if (!personalDataUnknownMention && !negatesOfficialAcademicDecision && includesAny(s, [/\bstudent (names?|ids?|grades?|records?)\b|\bgrades?\b.{0,40}\bstudents?\b/])) {
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.75);
  }

  if (includesAny(s, [/\b(university|student|students|school|academic|attendance|counselor|counsellor)\b/])) {
    addFact(facts, 'educationContext', true, sentence, source, messageIndex);
  }
  const negatesEducationAdmissionsDecision = textExplicitlyNegatesEducationAdmissionsDecision(s);
  const affirmsEducationAdmissionsDecision = textExplicitlyAffirmsEducationAdmissionsDecision(s);
  if (affirmsEducationAdmissionsDecision) {
    addFact(facts, 'educationContext', true, sentence, source, messageIndex);
    addFact(facts, 'educationAdmissionsPurpose', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemPurpose', 'Support university admissions by scoring applicants and recommending acceptance, rejection, or waiting-list outcomes', sentence, source, messageIndex, 0.82);
  }
  if (affirmsEducationAdmissionsDecision && includesAny(s, [/\b(applicant scoring|scores? applicants?|applicant score|student applicant score|admissions score)\b/])) {
    addFact(facts, 'applicantScoring', true, sentence, source, messageIndex, 0.92);
    addFact(facts, 'producesIndividualRiskScore', true, sentence, source, messageIndex, 0.85);
    addFact(facts, 'profilesIndividualCharacteristic', true, sentence, source, messageIndex, 0.82);
  }
  if (textExplicitlyAffirmsAdmissionsOutcome(s)) {
    addFact(facts, 'recommendsAdmissionsOutcome', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'decisionsSupported', 'Acceptance, rejection, or waiting-list recommendation', sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\b(officers?|admissions officers?)\b.{0,80}\b(usually|normally|often|typically)\b.{0,80}\bfollow\b/])) {
    addFact(facts, 'officersUsuallyFollowRecommendation', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.7);
  }
  if (includesAny(s, [/\b(no|not|without)\b.{0,80}\b(formal )?(appeal|challenge|review) mechanism\b/])) {
    addFact(facts, 'noFormalAppealMechanism', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'appealMechanismAvailable', false, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(no|not|without)\b.{0,100}\b(clear|individual|score)\b.{0,80}\b(explanation|reasons?)\b/])) {
    addFact(facts, 'noClearIndividualExplanation', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'explanationAvailable', false, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\b(third[- ]party cloud|cloud provider|external cloud|processor|subprocessor|subcontractor)\b/])) {
    addFact(facts, 'usesThirdPartyCloudProvider', true, sentence, source, messageIndex, 0.88);
  }
  const demographicDataProcessingMention = includesAny(s, [
    /\b(use|uses|used|process|processes|processed|analy[sz]e|analy[sz]es|include|includes|included|collect|collects|collected)\b.{0,140}\b(demographic information|demographics|gender|age|region|socioeconomic|socio-economic|previous school|ethnic|race|racial|disability information)\b/,
    /\b(demographic information|demographics|gender|age|region|socioeconomic|socio-economic|previous school|ethnic|race|racial|disability information)\b.{0,100}\b(data|field|used|processed|analy[sz]ed|collected)\b/
  ]) && !includesAny(s, [/\bage[- ]appropriate\b|\bage[- ]verification\b|\bnot clearly defined\b/]);
  if (demographicDataProcessingMention) {
    addFact(facts, 'processesDemographicData', true, sentence, source, messageIndex, 0.85);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.8);
  }
  if (demographicDataProcessingMention && includesAny(s, [/\b(disability|disabled|health condition|special needs)\b/])) {
    addFact(facts, 'processesDisabilityData', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'dataFieldDisability', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.86);
  }
  if (demographicDataProcessingMention && includesAny(s, [/\bgender\b/])) {
    addFact(facts, 'dataFieldGender', true, sentence, source, messageIndex, 0.82);
  }
  if (demographicDataProcessingMention && includesAny(s, [/\bage\b/])) {
    addFact(facts, 'dataFieldAge', true, sentence, source, messageIndex, 0.78);
  }
  if (demographicDataProcessingMention && includesAny(s, [/\bregion|regional\b/])) {
    addFact(facts, 'dataFieldRegion', true, sentence, source, messageIndex, 0.78);
  }
  if (demographicDataProcessingMention && includesAny(s, [/\bsocioeconomic|socio-economic\b/])) {
    addFact(facts, 'dataFieldSocioeconomic', true, sentence, source, messageIndex, 0.82);
  }
  if (demographicDataProcessingMention && includesAny(s, [/\bprevious school\b/])) {
    addFact(facts, 'dataFieldPreviousSchool', true, sentence, source, messageIndex, 0.78);
  }
  if (includesAny(s, [/\bhistorical\b.{0,80}\b(bias|discrimination|unfairness)\b|\b(gender|socioeconomic|regional|disability)\b.{0,80}\bbias\b/])) {
    addFact(facts, 'historicalBiasEvidence', true, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(stress|wellbeing|well-being|counseling|counselling|counselor|counsellor)\b/])) {
    addFact(facts, 'studentWellbeingPurpose', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(hospital|doctor|doctors|clinical|patient|patients|triage|medical history|vital signs|laboratory results|doctor notes)\b/])) {
    addFact(facts, 'healthcareContext', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'deploymentContext', 'Healthcare or clinical support context', sentence, source, messageIndex, 0.78);
  }
  if (includesAny(s, [/\btriage\b.{0,120}\b(priority|recommendation|support|risk factor|doctor)\b|\b(patient triage|triage priority recommendation)\b/])) {
    addFact(facts, 'clinicalTriagePurpose', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemPurpose', 'Support doctors during patient triage', sentence, source, messageIndex, 0.86);
    addFact(facts, 'systemOutputs', 'Triage priority recommendation and clinical risk factors', sentence, source, messageIndex, 0.86);
    addFact(facts, 'primaryUsers', 'Doctors', sentence, source, messageIndex, 0.82);
    addFact(facts, 'affectedPersons', 'Patients', sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(patient symptoms?|medical history|current medications?|vital signs?|laboratory results?|doctor notes?|patient records?)\b/])) {
    addFact(facts, 'processesHealthRelatedData', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'processesPatientRecords', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(workforce|employee|employees|employment|hr staff|human resources|manager|managers)\b/])) {
    addFact(facts, 'employmentContext', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(job applicants?|candidates?|applicants?)\b/])) {
    addFact(facts, 'employmentContext', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'jobApplicantsAffected', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'affectedPersons', 'Job applicants', sentence, source, messageIndex, 0.88);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [
    /\b(rank|ranks|ranking|score|scores|scoring|prioriti[sz]e|prioriti[sz]es|shortlist|screen|evaluate|assess)\w*\b.{0,100}\b(job applicants?|candidates?|applicants?)\b/,
    /\b(job applicants?|candidates?|applicants?)\b.{0,100}\b(rank|ranks|ranking|score|scores|scoring|prioriti[sz]e|prioriti[sz]es|shortlist|screen|evaluate|assess)\w*\b/
  ])) {
    addFact(facts, 'employmentRecruitmentPurpose', true, sentence, source, messageIndex, 0.92);
    addFact(facts, 'applicantRankingPurpose', true, sentence, source, messageIndex, 0.92);
    addFact(facts, 'ranksJobApplicants', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'supportsHiringDecision', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'systemPurpose', 'Rank job applicants for recruitment or hiring review', sentence, source, messageIndex, 0.88);
    addFact(facts, 'systemOutputs', 'Applicant ranking or suitability score', sentence, source, messageIndex, 0.86);
    addFact(facts, 'decisionsSupported', 'Hiring or shortlisting decision support', sentence, source, messageIndex, 0.84);
    addFact(facts, 'producesIndividualRiskScore', true, sentence, source, messageIndex, 0.8);
    addFact(facts, 'profilesIndividualCharacteristic', true, sentence, source, messageIndex, 0.78);
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

  const negatesMedicalDiagnosis = includesAny(s, [
    /\b(does not|doesn't|do not|don't|not|no|without)\b.{0,100}\b(medical diagnos(?:is|e|tic)|diagnos(?:e|es|is|tic)(?: patients?)?)\b/,
    /\bnot for\b.{0,80}\bdiagnos(is|e|tic)\b/,
    /\bno\b.{0,40}\bdiagnos(is|e|tic)\b/
  ]);
  if (includesAny(s, [/\b(may|might|could|future|planned|pilot)\b.{0,80}\bdiagnos(is|e|tic)\b/]) && !negatesMedicalDiagnosis) {
    addFact(facts, 'providesMedicalDiagnosis', 'planned_or_uncertain', sentence, source, messageIndex, 0.75);
  } else if (negatesMedicalDiagnosis) {
    addFact(facts, 'providesMedicalDiagnosis', false, sentence, source, messageIndex);
  } else if (includesAny(s, [/\b(medical diagnosis|diagnose patients|diagnostic output|clinical diagnosis|disease prediction)\b/])) {
    addFact(facts, 'providesMedicalDiagnosis', true, sentence, source, messageIndex);
  }

  const negatesTreatmentDecision = includesAny(s, [/\b(does not|doesn't|do not|don't|not|no|without)\b.{0,100}\b(prescribe treatment|prescribe|treatment action|make final medical decisions?|medical decisions?)\b/]);
  if (negatesTreatmentDecision) {
    addFact(facts, 'influencesMedicalTreatment', false, sentence, source, messageIndex, 0.8);
  } else if (includesAny(s, [/\b(prescribes?|recommends?|decides?|selects?)\b.{0,80}\b(treatment|therapy|clinical treatment|prescription|medication)\b|\b(treatment|therapy|clinical treatment|prescription)\b.{0,80}\b(recommendation|decision|selection)\b/])) {
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
  const negatesAcademicGradeAssignment = textExplicitlyNegatesFinalGradeAssignment(s);
  if (negatesAcademicGradeAssignment) {
    addFact(facts, 'assignsAcademicGrade', false, sentence, source, messageIndex, 0.9);
    addFact(facts, 'fullyAutomatedDecision', false, sentence, source, messageIndex, 0.82);
  } else if (includesAny(s, [/\b(automated grading|assigns? grades?|academic grade|grades students)\b/])) {
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
  if (includesAny(s, [/\bdoes not use\b.{0,120}\b(biometric data|biometrics)\b|\b(no|not|without)\b.{0,60}\b(biometric data|biometrics)\b/])) {
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
  if (includesAny(s, [/\bcvs?\b|\bcurricula vitae\b|\bresumes?\b/])) {
    addFact(facts, 'processesApplicantCVs', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemInputs', 'CVs or resumes', sentence, source, messageIndex, 0.86);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\beducation\b|\beducational background\b|\bdegrees?\b|\bschools?\b|\buniversit(y|ies)\b/]) && includesAny(s, [/\b(job applicants?|candidates?|applicants?|cvs?|resumes?)\b/])) {
    addFact(facts, 'processesApplicantEducation', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'systemInputs', 'Applicant education history', sentence, source, messageIndex, 0.82);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\bwork experience\b|\bemployment history\b|\bexperience\b/]) && includesAny(s, [/\b(job applicants?|candidates?|applicants?|cvs?|resumes?)\b/])) {
    addFact(facts, 'processesApplicantWorkExperience', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'systemInputs', 'Applicant work experience', sentence, source, messageIndex, 0.84);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\bskills?\b|\bcompetenc(y|ies)\b/]) && includesAny(s, [/\b(job applicants?|candidates?|applicants?|cvs?|resumes?)\b/])) {
    addFact(facts, 'processesApplicantSkills', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'systemInputs', 'Applicant skills', sentence, source, messageIndex, 0.84);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.78);
  }
  if (includesAny(s, [/\bcover letters?\b|\bmotivation letters?\b/])) {
    addFact(facts, 'processesCoverLetters', true, sentence, source, messageIndex, 0.9);
    addFact(facts, 'systemInputs', 'Cover letters', sentence, source, messageIndex, 0.86);
    addFact(facts, 'processesPersonalData', true, sentence, source, messageIndex, 0.86);
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
  if (includesAny(s, [/\breview\b.{0,80}\b(ai[- ]generated )?(score|scores|feedback|recommendation|output)\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.86);
  }
  if (includesAny(s, [/\b(claims?\s+officer|officer|human reviewer)\b.{0,80}\breviews?\b.{0,80}\b(recommendation|claim|output)\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\b(hr|hr specialist|hr staff|human resources|recruiter|hiring manager)\b.{0,90}\breviews?\b.{0,90}\b(ranking|recommendation|candidates?|applicants?|output)\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\b(recommendation|claim|output)\b.{0,100}\breviewed\b.{0,80}\b(claims?\s+officer|human reviewer)\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [
    /\b(i|we|human|person|people|staff|agent|agents|support agent|support agents|officer|officers|manager|managers|reviewer|reviewers|specialist|specialists|team)\b.{0,100}\breview(s|ed)?\b.{0,100}\b(ai[- ]generated|AI|output|result|recommendation|ranking|score|flag|decision|assessment)\b/i,
    /\b(ai[- ]generated|AI|output|result|recommendation|ranking|score|flag|decision|assessment)\b.{0,100}\breviewed\b.{0,100}\b(i|we|human|person|people|staff|agent|agents|support agent|support agents|officer|officers|manager|managers|reviewer|reviewers|specialist|specialists|team)\b/i
  ])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.82);
  }
  if (includesAny(s, [/\b(ranking|recommendation|candidates?|applicants?|output)\b.{0,100}\breviewed\b.{0,80}\b(hr|hr specialist|hr staff|human resources|recruiter|hiring manager|human reviewer)\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (includesAny(s, [/\bhuman manager reviews\b|\bmanager reviews\b|\breviews every proposed schedule\b|\bmanual scheduling review\b/])) {
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(can override|override the system|override recommendations?|manual override|review and override)\b/])) {
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\b(i|teacher|human)\b.{0,100}\b(can|could|may)\b.{0,60}\b(change|modify|adjust)\b.{0,80}\b(ai'?s? )?(recommendation|score|feedback|output)\b/])) {
    addFact(facts, 'humanCanModify', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\b(i|we|human|person|people|staff|agent|agents|support agent|support agents|officer|officers|manager|managers|reviewer|reviewers|specialist|specialists|team)\b.{0,100}\b(can|could|may|have authority to|retains? authority to|retains? full authority to)\b.{0,70}\b(change|modify|adjust|override|edit|approve)\b.{0,90}\b(ai'?s? )?(output|result|recommendation|ranking|score|flag|decision|assessment|it)\b/i])) {
    addFact(facts, 'humanCanModify', true, sentence, source, messageIndex, 0.82);
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\b(i|hr|hr specialist|hr staff|human resources|recruiter|hiring manager|human)\b.{0,100}\b(can|could|may)\b.{0,60}\b(change|modify|adjust|override)\b.{0,80}\b(ai'?s? )?(ranking|recommendation|shortlist|score|output)\b/])) {
    addFact(facts, 'humanCanModify', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.84);
  }
  if (includesAny(s, [/\b(i|teacher|human)\b.{0,100}\b(can|could|may)\b.{0,60}\breject\b.{0,80}\b(ai'?s? )?(recommendation|score|feedback|output)\b/])) {
    addFact(facts, 'humanCanReject', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [/\b(i|we|human|person|people|staff|agent|agents|support agent|support agents|officer|officers|manager|managers|reviewer|reviewers|specialist|specialists|team)\b.{0,100}\b(can|could|may|have authority to|retains? authority to|retains? full authority to)\b.{0,70}\b(reject|ignore|disregard)\b.{0,90}\b(ai'?s? )?(output|result|recommendation|ranking|score|flag|decision|assessment|it)\b/i])) {
    addFact(facts, 'humanCanReject', true, sentence, source, messageIndex, 0.82);
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.78);
  }
  if (includesAny(s, [
    /\b(human|person|people|staff|agent|agents|support agent|support agents|officer|officers|manager|managers|reviewer|reviewers|specialist|specialists|team)\b.{0,100}\b(full authority|authority)\b.{0,120}\b(approve|edit|change|modify|adjust|override|reject|ignore|disregard)\b/i
  ])) {
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.82);
    if (includesAny(s, [/\b(edit|change|modify|adjust|approve)\b/])) {
      addFact(facts, 'humanCanModify', true, sentence, source, messageIndex, 0.78);
    }
    if (includesAny(s, [/\b(reject|ignore|disregard)\b/])) {
      addFact(facts, 'humanCanReject', true, sentence, source, messageIndex, 0.78);
    }
  }
  if (includesAny(s, [/\b(i|hr|hr specialist|hr staff|human resources|recruiter|hiring manager|human)\b.{0,100}\b(can|could|may)\b.{0,60}\b(reject|ignore|disregard)\b.{0,80}\b(ai'?s? )?(ranking|recommendation|shortlist|score|output)\b/])) {
    addFact(facts, 'humanCanReject', true, sentence, source, messageIndex, 0.88);
    addFact(facts, 'humanCanOverride', true, sentence, source, messageIndex, 0.84);
  }
  if (!negatesAutomatedDecision && includesAny(s, [/\b(ai|system|tool)\b.{0,80}\b(automatically|directly|without human|fully automated)\b.{0,80}\b(reject|shortlist|rank out|screen out)\w*\b.{0,80}\b(job applicants?|candidates?|applicants?)\b/])) {
    addFact(facts, 'fullyAutomatedDecision', true, sentence, source, messageIndex, 0.86);
    addFact(facts, 'makesHiringDecision', true, sentence, source, messageIndex, 0.8);
  }
  if (includesAny(s, [
    /\b(ai|system|tool)\b.{0,80}\b(does not|doesn't|do not|don't|never|not)\b.{0,80}\b(reject|shortlist|decide|hire|make hiring)\w*\b.{0,80}\b(job applicants?|candidates?|applicants?|hiring decisions?)\b/,
    /\b(i|hr|hr specialist|hr staff|human resources|recruiter|hiring manager|human)\b.{0,100}\b(decide|decides|make|makes)\b.{0,100}\b(final )?(hiring|shortlisting|selection|decision|outcome)\b.{0,100}\b(interview|shortlist|proceed|candidate|applicant|hiring)\b/,
    /\b(i|hr|hr specialist|hr staff|human resources|recruiter|hiring manager|human)\b.{0,100}\b(decide|decides|make|makes)\b.{0,80}\b(final )?(hiring|shortlisting|selection)\b/,
    /\bmake the final decision\b.{0,100}\b(who proceeds|interview stage|applicants?|candidates?)\b/
  ])) {
    addFact(facts, 'fullyAutomatedDecision', false, sentence, source, messageIndex, 0.86);
    addFact(facts, 'makesHiringDecision', false, sentence, source, messageIndex, 0.82);
    addFact(facts, 'humanReviewAvailable', true, sentence, source, messageIndex, 0.82);
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
  const negatesExplanation = includesAny(s, [
    /\b(no|not|without)\b.{0,100}\b(clear|individual|score)?\b.{0,80}\b(explanation|reasons?)\b/
  ]);
  if (!negatesExplanation && includesAny(s, [/\bview the reason\b|\breason for their assigned shifts?\b|\bexplanation\b|\breasons? for assigned shifts?\b/])) {
    addFact(facts, 'explanationAvailable', true, sentence, source, messageIndex);
  }
  if (includesAny(s, [/\brequest corrections?\b|\bcorrect inaccurate information\b|\bcorrection right\b|\bmay correct\b/])) {
    addFact(facts, 'correctionRightAvailable', true, sentence, source, messageIndex);
  }
  const negatesAppeal = includesAny(s, [
    /\b(no|not|without)\b.{0,80}\b(formal )?(appeal|challenge|review) mechanism\b/,
    /\b(no|not|without)\b.{0,80}\b(second )?manual review\b/
  ]);
  if (!negatesAppeal && includesAny(s, [/\bchallenge an assignment\b|\bchallenge\b.{0,60}\bassignment\b|\bappeal\b|\bcontest\b/])) {
    addFact(facts, 'challengeMechanismAvailable', true, sentence, source, messageIndex);
    addFact(facts, 'appealMechanismAvailable', true, sentence, source, messageIndex, 0.9);
  }
  if (!negatesAppeal && includesAny(s, [/\bmanual scheduling review\b|\bmanual review\b|\brequest a manual\b/])) {
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
  const retentionNotDefined = includesAny(s, [
    /\b(not yet documented|not documented|not defined|no documented|no defined|unknown|not provided)\b.{0,100}\b(retention period|data retention|retention)\b/,
    /\b(retention period|data retention|retention)\b.{0,100}\b(not yet documented|not documented|not defined|unknown|not provided)\b/
  ]);
  if (retentionNotDefined) {
    addFact(facts, 'retentionPeriodDefined', false, sentence, source, messageIndex, 0.86);
  } else if (includesAny(s, [/\bretention period\b|\bdata retention\b|\bretained for\b/])) {
    addFact(facts, 'retentionPeriodDefined', true, sentence, source, messageIndex, 0.85);
    const retentionMatch = sentence.match(/\bretained for\s+([^.;!?]+)/i);
    if (retentionMatch?.[1]) {
      addFact(facts, 'retentionPeriod', normalizeWhitespace(retentionMatch[1]), sentence, source, messageIndex, 0.9);
    }
  }
  if (includesAny(s, [/\bpseudonymi[sz]ation\b|\banonymi[sz]ation\b|\bde-identif(y|ied|ication)\b/])) {
    addFact(facts, 'pseudonymizationUsed', true, sentence, source, messageIndex, 0.85);
  }
  if (!negatesAppeal && includesAny(s, [/\bappeal\b|\bcontest\b|\bchallenge the decision\b|\breview request\b/])) {
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

function extractFactsFromText(text, source, messageIndex = null, sourceMessageId = null) {
  return splitSentences(text)
    .flatMap((sentence) => detectFactsInSentence(sentence, source, messageIndex))
    .map((fact) => (sourceMessageId ? { ...fact, sourceMessageId } : fact));
}

function getLastSystemTextBeforeLatestUser(messages) {
  const items = Array.isArray(messages) ? messages : [];
  let latestUserPosition = -1;

  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index]?.sender === 'user') {
      latestUserPosition = index;
      break;
    }
  }

  const end = latestUserPosition >= 0 ? latestUserPosition - 1 : items.length - 1;
  for (let index = end; index >= 0; index -= 1) {
    if (items[index]?.sender === 'system' && normalizeWhitespace(items[index].text)) {
      return normalizeWhitespace(items[index].text);
    }
  }

  return '';
}

function parseShortContextAnswer(text) {
  const normalized = normalizeWhitespace(text).toLowerCase().replace(/^["']+|["'.!?]+$/g, '');
  const normalizedAscii = normalized
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0131/g, 'i')
    .replace(/\u011f/g, 'g')
    .replace(/\u015f/g, 's')
    .replace(/\u00e7/g, 'c')
    .replace(/\u00f6/g, 'o')
    .replace(/\u00fc/g, 'u');
  if (!normalized || normalized.length > 80) return null;

  if (/^(?:fully automated decision\s*=\s*)?true(?:\s+is\s+correct)?$/.test(normalizedAscii)) {
    return { type: 'boolean', value: true };
  }
  if (/^(?:fully automated decision\s*=\s*)?false(?:\s+is\s+correct)?$/.test(normalizedAscii)) {
    return { type: 'boolean', value: false };
  }
  if (/^(?:yes|yeah|yep|correct|that is correct|evet|dogru|bu dogru)$/.test(normalizedAscii)) {
    return { type: 'yes' };
  }
  if (/^(?:no|nope|incorrect|hayir|yanlis|bu yanlis)$/.test(normalizedAscii)) {
    return { type: 'no' };
  }
  if (/^(?:the\s+)?(?:former|first|previous|old|earlier)(?:\s+(?:one|option|statement|answer))?$/.test(normalizedAscii) ||
    /^(?:option\s+)?(?:1|1st|one)$/.test(normalizedAscii) ||
    /^(?:ilk|ilk olan|birinci|birincisi|onceki|eski)(?:\s+(?:olan|cevap|ifade|secenek))?$/.test(normalizedAscii)) {
    return { type: 'existing' };
  }
  if (/^(?:the\s+)?(?:latter|second|new|latest|now|current)(?:\s+(?:one|option|statement|answer))?$/.test(normalizedAscii) ||
    /^(?:option\s+)?(?:2|2nd|two)$/.test(normalizedAscii) ||
    /^(?:ikinci|ikincisi|yeni|son|sonuncu|simdiki)(?:\s+(?:olan|cevap|ifade|secenek))?$/.test(normalizedAscii)) {
    return { type: 'incoming' };
  }

  return null;
}

function createContextualFact({ fact, value, latestUserMessage, pendingQuestion, confidence = 0.96 }) {
  return {
    ...createFactEvidence({
      fact,
      value,
      sourceText: latestUserMessage.text,
      source: 'USER_CONFIRMED',
      messageIndex: latestUserMessage.index,
      confidence
    }),
    sourceMessageId: latestUserMessage.sourceMessageId,
    extractionMethod: 'CONTEXTUAL_SHORT_REPLY',
    pendingQuestion
  };
}

function latestActionableContradiction(previousState) {
  const contradictions = (previousState?.contradictions || []).filter(isActionableContradiction);
  return contradictions.find((item) => item.normalizedField === FINAL_GRADE_FIELD) || contradictions[0] || null;
}

function resolveContradictionValue(contradiction, parsedAnswer) {
  if (!contradiction || !parsedAnswer) return null;

  if (parsedAnswer.type === 'existing') {
    return {
      fact: contradiction.existingFact || contradiction.fact,
      value: contradiction.existingRawValue
    };
  }

  if (parsedAnswer.type === 'incoming') {
    return {
      fact: contradiction.incomingFact || contradiction.fact,
      value: contradiction.incomingRawValue
    };
  }

  if (parsedAnswer.type === 'boolean' && STRICT_BOOLEAN_CONTRADICTION_FACTS.has(contradiction.normalizedField)) {
    return {
      fact: contradiction.normalizedField,
      value: parsedAnswer.value
    };
  }

  return null;
}

function isAutomationBoundaryQuestion(text) {
  return includesAny(normalizeWhitespace(text).toLowerCase(), [
    /\bfully automated decision\b/,
    /\bdirectly decide(?:s)? (?:an )?outcomes?\b/,
    /\bdoes the ai output directly decide\b/,
    /\bcan it automatically reject or shortlist\b/,
    /\bautomated final decision\b/
  ]);
}

function extractContextualFactsFromLatestAnswer({ messages, latestUserMessage, previousState }) {
  if (!latestUserMessage) return [];

  const parsedAnswer = parseShortContextAnswer(latestUserMessage.text);
  if (!parsedAnswer) return [];

  const pendingQuestion = getLastSystemTextBeforeLatestUser(messages);
  const pendingQuestionText = normalizeWhitespace(pendingQuestion).toLowerCase();
  const facts = [];

  if (/which one is correct\?*$/i.test(pendingQuestionText)) {
    const contradiction = latestActionableContradiction(previousState);
    const resolution = resolveContradictionValue(contradiction, parsedAnswer);
    if (resolution && isKnownFactValue(resolution.value)) {
      facts.push(createContextualFact({
        fact: resolution.fact,
        value: resolution.value,
        latestUserMessage,
        pendingQuestion
      }));
    }
    return facts;
  }

  if (isAutomationBoundaryQuestion(pendingQuestion) && parsedAnswer.type === 'boolean') {
    facts.push(createContextualFact({
      fact: 'fullyAutomatedDecision',
      value: parsedAnswer.value,
      latestUserMessage,
      pendingQuestion
    }));
  }

  return facts;
}

function contextualResolutionCandidates(contextualFacts) {
  return (contextualFacts || [])
    .map(contradictionCandidateForEntry)
    .filter(Boolean);
}

function factConflictsWithContextualResolution(entry, resolutions) {
  const candidate = contradictionCandidateForEntry(entry);
  if (!candidate) return false;

  return (resolutions || []).some((resolution) =>
    candidate.normalizedField === resolution.normalizedField &&
    candidate.normalizedValue !== resolution.normalizedValue
  );
}

function filterFactsForContextualResolutions(facts, resolutions) {
  if (!(resolutions || []).length) return facts;
  return (facts || []).filter((entry) => !factConflictsWithContextualResolution(entry, resolutions));
}

function applyContextualResolutionsToState(previousState, resolutions) {
  if (!(resolutions || []).length) return previousState;

  const confirmedFacts = { ...(previousState?.confirmedFacts || {}) };
  const factEvidence = filterFactsForContextualResolutions(previousState?.factEvidence || [], resolutions);
  const contradictions = (previousState?.contradictions || []).filter((item) =>
    !(resolutions || []).some((resolution) => resolution.normalizedField === item.normalizedField)
  );

  resolutions.forEach((resolution) => {
    if (resolution.fact && resolution.normalizedField !== FINAL_GRADE_FIELD) {
      confirmedFacts[resolution.fact] = resolution.rawValue;
    }
  });

  return {
    ...previousState,
    confirmedFacts,
    factEvidence,
    contradictions,
    contextualResolutionsApplied: resolutions.length
  };
}

function evidenceIdentity(item) {
  return [
    item.fact,
    String(item.value),
    item.source,
    item.sourceMessageId || '',
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

function normalizeComparableFactText(value) {
  return normalizeWhitespace(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function mergeAppendableFactValues(currentValue, incomingValue) {
  const values = [];
  const seen = new Set();

  [currentValue, incomingValue].forEach((value) => {
    listFromFact(value).forEach((item) => {
      const normalized = normalizeComparableFactText(item);
      if (!normalized || seen.has(normalized)) return;
      seen.add(normalized);
      values.push(item);
    });
  });

  return values.join('; ');
}

function textFactValuesCompatible(fact, currentValue, incomingValue) {
  if (!COMPATIBLE_TEXT_FACTS.has(fact)) return false;

  const currentText = normalizeWhitespace(currentValue).toLowerCase();
  const incomingText = normalizeWhitespace(incomingValue).toLowerCase();
  if (!currentText || !incomingText) return false;

  const currentCompact = normalizeComparableFactText(currentText);
  const incomingCompact = normalizeComparableFactText(incomingText);
  if (currentCompact === incomingCompact || currentCompact.includes(incomingCompact) || incomingCompact.includes(currentCompact)) {
    return true;
  }

  if (fact === 'userRole') {
    return ['teacher', 'student', 'officer', 'manager', 'reviewer', 'counselor', 'counsellor']
      .some((role) => currentText.includes(role) && incomingText.includes(role));
  }

  return ['education', 'university', 'school', 'insurance', 'claim', 'employment', 'workforce', 'manufacturing']
    .some((domain) => currentText.includes(domain) && incomingText.includes(domain));
}

function shouldPreferIncomingTextValue(currentValue, incomingValue, incomingIsUserConfirmed) {
  if (!incomingIsUserConfirmed) return false;
  return normalizeWhitespace(incomingValue).length > normalizeWhitespace(currentValue).length;
}

function isKnownFactValue(value) {
  return value !== undefined &&
    value !== null &&
    value !== '' &&
    value !== 'planned_or_uncertain' &&
    value !== 'unknown';
}

function textExplicitlyAffirmsFinalGradeAssignment(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  if (textExplicitlyNegatesFinalGradeAssignment(s)) return false;
  return includesAny(s, [
    /\b(ai|system|tool)\b.{0,100}\b(automatically|directly|without human|fully automated)\b.{0,100}\b(assign|determine|decide|give|set)s?\b.{0,80}\b(final )?grades?\b/,
    /\b(ai|system|tool)\b.{0,100}\b(assign|determine|decide|give|set)s?\b.{0,80}\b(final )?grades?\b/,
    /\bautomated grading\b/,
    /\bassigns? grades? to students?\b/
  ]);
}

function textExplicitlyNegatesFinalGradeAssignment(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  return includesAny(s, [
    /\b(ai|system|tool)\b.{0,100}\b(never|does not|doesn't|do not|don't|not)\b.{0,80}\b(assign|determine|decide|give|set)s?\b.{0,80}\b(final )?grades?\b/,
    /\bnever assigns? grades?\b/,
    /\b(does not|doesn't|do not|don't|never|not)\b.{0,80}\b(grade|grades|grading)\b.{0,40}\b(exams?|students?|assignments?)\b/,
    /\b(i|teacher|human)\b.{0,100}\b(decide|decides|make|makes)\b.{0,80}\b(final )?grades?\b/
  ]);
}

function textExplicitlyNegatesOfficialAcademicDecision(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  return includesAny(s, [
    /\b(does not|doesn't|do not|don't|never|not|not used for)\b.{0,220}\b(official grading|grade exams?|grade students?|examination evaluation|student ranking|rank students?|rank applicants?|admission|admissions|certification|direct measurement of academic achievement|make official academic decisions?|official academic decisions?)\b/,
    /\b(no|not|without)\b.{0,120}\b(official academic decision|formal academic decision|student ranking|admission|admissions decision|exam grading|certification)\b/
  ]);
}

function textExplicitlyNegatesEducationAdmissionsDecision(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  return includesAny(s, [
    /\b(does not|doesn't|do not|don't|never|not|not used for)\b.{0,220}\b(decide admissions?|make admissions? decisions?|admission|admissions|admissions? outcomes?|student ranking|rank students?|rank applicants?|applicant scoring|acceptance|rejection|waiting[- ]list|certification)\b/,
    /\b(no|not|without)\b.{0,140}\b(admission|admissions? decision|admissions? recommendation|student ranking|applicant scoring|waiting[- ]list|certification)\b/
  ]);
}

function textExplicitlyNegatesAutomatedDecision(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  return includesAny(s, [
    /\b(cannot|can't|does not|doesn't|do not|don't|never|not)\b.{0,80}\b(automatically|directly|without human|fully automated)\b.{0,100}\b(approve|reject|decide|determine|shortlist|rank|score|assign)\w*\b/,
    /\b(ai|system|tool|model)\b.{0,100}\b(cannot|can't|does not|doesn't|do not|don't|never|not)\b.{0,80}\b(approve|reject|decide|determine|shortlist|rank|score|assign|make)\w*\b/,
    /\b(automatically|directly)\b.{0,80}\b(cannot|can't|does not|doesn't|do not|don't|never|not)\b.{0,80}\b(approve|reject|decide|determine|shortlist|rank|score|assign)\w*\b/,
    /\b(automatically|directly)\b.{0,120}\b(?:but|while|whereas)\b.{0,100}\b(customers?|users?|people|humans?|agents?|support agents?|staff|officers?|managers?|reviewers?|specialists?|teachers?)\b.{0,80}\b(decide|decides|choose|chooses|approve|reject|change|modify|override|review)\w*\b/
  ]);
}

function textExplicitlyAffirmsAutomatedDecision(text) {
  const s = normalizeWhitespace(text).toLowerCase();
  if (!s) return false;
  if (textExplicitlyNegatesAutomatedDecision(s)) return false;
  if (textDescribesAutomatedEducationalContentWithoutFormalDecision(s)) return false;

  return includesAny(s, [
    /\b(ai|system|tool|model)\b.{0,100}\b(automatically|directly|fully automated|solely automated|without human|no human)\b.{0,100}\b(approve|reject|decide|determine|shortlist|rank|score|assign|make)\w*\b/,
    /\b(ai|system|tool|model)\b.{0,100}\b(approve|reject|decide|determine|shortlist|rank|score|assign|make)\w*\b.{0,100}\b(automatically|directly|fully automated|solely automated|without human|no human)\b/,
    /\b(automatically|directly|fully automated|solely automated)\b.{0,50}\b(approve|reject|decide|determine|shortlist|rank|score|assign)\w*\b.{0,100}\b(refunds?|returns?|requests?|tickets?|orders?|claims?|applications?|applicants?|candidates?|customers?|students?|employees?|grades?|shifts?|outcomes?|decisions?|coupons?)\b/,
    /\bwithout human\b.{0,80}\b(approval|review|intervention|decision)\b/,
    /\bno human\b.{0,80}\b(review|approval|intervention)\b/
  ]);
}

function systemNameLooksLikeHumanOrAffectedActor(value) {
  const s = normalizeWhitespace(value).toLowerCase();
  if (!s) return false;
  return includesAny(s, [
    /^(customers?|users?|students?|employees?|applicants?|candidates?|claimants?|patients?|citizens?|people|individuals)$/,
    /^(support agents?|agents?|officers?|claims?\s+officers?|hr staff|human resources|recruiters?|hiring managers?|managers?|reviewers?|specialists?|teachers?|counselors?|counsellors?|senior agents?)$/
  ]);
}

function llmFactSupportedByExplicitEvidence(entry) {
  if (!entry || entry.source !== 'LLM_EXTRACTED') return true;

  if ((APPENDABLE_FACTS.has(entry.fact) || COMPATIBLE_TEXT_FACTS.has(entry.fact) || ['systemName', 'retentionPeriod'].includes(entry.fact)) && typeof entry.value === 'boolean') {
    return false;
  }

  if (entry.fact === 'systemName' && systemNameLooksLikeHumanOrAffectedActor(entry.value)) {
    return false;
  }

  if (entry.fact === 'assignsAcademicGrade') {
    return entry.value === true
      ? textExplicitlyAffirmsFinalGradeAssignment(entry.sourceText)
      : textExplicitlyNegatesFinalGradeAssignment(entry.sourceText);
  }

  if (entry.fact === 'fullyAutomatedDecision' && entry.value === true) {
    return textExplicitlyAffirmsAutomatedDecision(entry.sourceText);
  }

  if (['educationAdmissionsPurpose', 'recommendsAdmissionsOutcome', 'applicantScoring'].includes(entry.fact) && entry.value === true) {
    return textExplicitlyAffirmsEducationAdmissionsDecision(entry.sourceText);
  }

  return true;
}

function sourceMessageRef(entry) {
  return entry?.sourceMessageId ||
    entry?.messageId ||
    (entry?.messageIndex === null || entry?.messageIndex === undefined ? 'project' : `user-message-${entry.messageIndex + 1}`);
}

function finalGradeContradictionCandidate(entry) {
  if (entry.fact === 'teacherFinalGradeDecision' && entry.value === true) {
    return {
      normalizedField: FINAL_GRADE_FIELD,
      normalizedValue: 'teacher_decides_final_grade',
      displayValue: 'you decide the final grade'
    };
  }

  if (entry.fact === 'assignsAcademicGrade') {
    if (entry.value === true) {
      return {
        normalizedField: FINAL_GRADE_FIELD,
        normalizedValue: 'ai_assigns_final_grade',
        displayValue: 'the AI assigns the final grade'
      };
    }
    if (entry.value === false) {
      return {
        normalizedField: FINAL_GRADE_FIELD,
        normalizedValue: 'ai_does_not_assign_final_grade',
        displayValue: 'the AI does not assign the final grade'
      };
    }
  }

  return null;
}

function genericBooleanContradictionCandidate(entry) {
  if (!STRICT_BOOLEAN_CONTRADICTION_FACTS.has(entry.fact)) return null;
  if (typeof entry.value !== 'boolean') return null;

  return {
    normalizedField: entry.fact,
    normalizedValue: entry.value ? 'true' : 'false',
    displayValue: `${FACT_LABELS[entry.fact] || entry.fact} is ${entry.value ? 'true' : 'false'}`
  };
}

function contradictionCandidateForEntry(entry) {
  if (!entry || entry.source !== 'USER_CONFIRMED' || !entry.fact || !isKnownFactValue(entry.value)) return null;

  const specialCandidate = finalGradeContradictionCandidate(entry);
  const genericCandidate = specialCandidate || genericBooleanContradictionCandidate(entry);
  if (!genericCandidate) return null;

  return {
    ...genericCandidate,
    fact: entry.fact,
    label: FACT_LABELS[entry.fact] || entry.fact,
    rawValue: entry.value,
    sourceText: entry.sourceText,
    source: entry.source,
    messageIndex: entry.messageIndex,
    sourceMessageId: sourceMessageRef(entry)
  };
}

function finalGradeValuesIncompatible(left, right) {
  const values = new Set([left.normalizedValue, right.normalizedValue]);
  return values.has('ai_assigns_final_grade') &&
    (values.has('teacher_decides_final_grade') || values.has('ai_does_not_assign_final_grade'));
}

function contradictionCandidatesIncompatible(left, right) {
  if (!left || !right) return false;
  if (left.normalizedField !== right.normalizedField) return false;
  if (!isKnownFactValue(left.normalizedValue) || !isKnownFactValue(right.normalizedValue)) return false;
  if (left.normalizedField === FINAL_GRADE_FIELD) return finalGradeValuesIncompatible(left, right);
  return left.normalizedValue !== right.normalizedValue;
}

function summarizeExplicitFact(entry) {
  const candidate = contradictionCandidateForEntry(entry);
  return {
    fact: entry.fact,
    label: FACT_LABELS[entry.fact] || entry.fact,
    value: entry.value,
    source: entry.source,
    messageIndex: entry.messageIndex,
    sourceMessageId: sourceMessageRef(entry),
    normalizedField: candidate?.normalizedField || entry.fact,
    normalizedValue: candidate?.normalizedValue ?? entry.value,
    sourceText: entry.sourceText
  };
}

function explicitFactsForLog(entries) {
  return (entries || [])
    .filter((entry) => entry?.source === 'USER_CONFIRMED' && entry.fact && isKnownFactValue(entry.value))
    .map(summarizeExplicitFact);
}

function factsForLifecycleLog(entries) {
  return (entries || [])
    .filter((entry) => entry?.fact)
    .map((entry) => ({
      fact: entry.fact,
      label: FACT_LABELS[entry.fact] || entry.fact,
      value: entry.value,
      source: entry.source,
      messageIndex: entry.messageIndex,
      sourceMessageId: sourceMessageRef(entry),
      sourceText: entry.sourceText
    }));
}

function contradictionForCandidates(existing, incoming) {
  const key = [
    incoming.normalizedField,
    existing.normalizedValue,
    incoming.normalizedValue,
    existing.sourceMessageId,
    incoming.sourceMessageId
  ].join('|');

  return {
    key,
    fact: incoming.fact,
    label: incoming.normalizedField === FINAL_GRADE_FIELD ? 'Final grade assignment' : (FACT_LABELS[incoming.fact] || incoming.fact),
    normalizedField: incoming.normalizedField,
    existingFact: existing.fact,
    incomingFact: incoming.fact,
    existingValue: existing.displayValue,
    incomingValue: incoming.displayValue,
    oldValue: existing.displayValue,
    newValue: incoming.displayValue,
    existingRawValue: existing.rawValue,
    incomingRawValue: incoming.rawValue,
    oldSourceMessageId: existing.sourceMessageId,
    newSourceMessageId: incoming.sourceMessageId,
    sourceMessageIds: [existing.sourceMessageId, incoming.sourceMessageId].filter(Boolean),
    previousSourceText: existing.sourceText,
    sourceText: incoming.sourceText,
    source: incoming.source,
    messageIndex: incoming.messageIndex,
    status: 'needs_clarification'
  };
}

function isActionableContradiction(item) {
  return item?.status === 'needs_clarification' &&
    normalizeWhitespace(item.normalizedField || item.fact) &&
    isKnownFactValue(item.existingValue) &&
    isKnownFactValue(item.incomingValue);
}

function formatContradictionQuestion(contradiction) {
  if (!isActionableContradiction(contradiction)) return null;

  if (contradiction.normalizedField === FINAL_GRADE_FIELD) {
    return `You previously said ${contradiction.existingValue}, but you now said that ${contradiction.incomingValue}. Which one is correct?`;
  }

  const formatAssertion = (value) => {
    const label = normalizeWhitespace(contradiction.label);
    const text = normalizeWhitespace(value);
    const labelPrefix = new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+is\\s+`, 'i');
    if (label && labelPrefix.test(text)) return text;
    if (/^(?:true|false)$/i.test(text)) return `${label} is ${text.toLowerCase()}`;
    return label ? `${label} is ${text}` : text;
  };

  return `You previously said ${formatAssertion(contradiction.existingValue)}, but you now said ${formatAssertion(contradiction.incomingValue)}. Which one is correct?`;
}

function isTextLikeFact(fact) {
  return APPENDABLE_FACTS.has(fact) ||
    COMPATIBLE_TEXT_FACTS.has(fact) ||
    ['systemName', 'retentionPeriod'].includes(fact);
}

function storedFactEvidenceInvalid(entry) {
  if (!entry?.fact) return false;
  if (isTextLikeFact(entry.fact) && typeof entry.value === 'boolean') return true;
  if (entry.fact === 'systemName' && systemNameLooksLikeHumanOrAffectedActor(entry.value)) return true;
  if (entry.fact === 'fullyAutomatedDecision' && entry.value === true) {
    return !textExplicitlyAffirmsAutomatedDecision(entry.sourceText);
  }
  if (entry.fact === 'assignsAcademicGrade' && entry.value === true) {
    return !textExplicitlyAffirmsFinalGradeAssignment(entry.sourceText);
  }
  return false;
}

function storedConfirmedFactInvalid(fact, value, factEvidence) {
  if (isTextLikeFact(fact) && typeof value === 'boolean') return true;
  if (fact === 'systemName' && systemNameLooksLikeHumanOrAffectedActor(value)) return true;

  const supportingEvidence = (factEvidence || []).filter((entry) => entry.fact === fact && entry.value === value);
  if (fact === 'fullyAutomatedDecision' && value === true && supportingEvidence.length) {
    return supportingEvidence.every(storedFactEvidenceInvalid);
  }
  if (fact === 'assignsAcademicGrade' && value === true && supportingEvidence.length) {
    return supportingEvidence.every(storedFactEvidenceInvalid);
  }
  return false;
}

function sanitizeConversationFactState(previousState) {
  const originalFacts = previousState?.confirmedFacts || {};
  const originalEvidence = previousState?.factEvidence || [];
  const factEvidence = originalEvidence.filter((entry) => !storedFactEvidenceInvalid(entry));
  const confirmedFacts = { ...originalFacts };

  Object.entries(confirmedFacts).forEach(([fact, value]) => {
    if (storedConfirmedFactInvalid(fact, value, originalEvidence)) {
      delete confirmedFacts[fact];
    }
  });

  return {
    confirmedFacts,
    unknownFacts: { ...(previousState?.unknownFacts || {}) },
    factEvidence,
    contradictions: previousState?.contradictions || [],
    sanitizedDroppedFactCount: Object.keys(originalFacts).length - Object.keys(confirmedFacts).length,
    sanitizedDroppedEvidenceCount: originalEvidence.length - factEvidence.length
  };
}

function mergeConversationFacts(previousState, newFacts, options = {}) {
  const confirmedFacts = { ...(previousState?.confirmedFacts || {}) };
  const unknownFacts = { ...UNKNOWN_FACTS, ...(previousState?.unknownFacts || {}) };
  const factEvidence = [...(previousState?.factEvidence || [])];
  const contradictions = [];
  const existingEvidence = new Set(factEvidence.map(evidenceIdentity));
  const contradictionCandidates = (previousState?.factEvidence || [])
    .map(contradictionCandidateForEntry)
    .filter(Boolean);
  const contradictionDebug = {
    chatId: options.chatId || null,
    previousExplicitFacts: explicitFactsForLog(previousState?.factEvidence || []),
    newlyExtractedFacts: explicitFactsForLog(newFacts),
    normalizedFields: contradictionCandidates.map((candidate) => ({
      field: candidate.normalizedField,
      value: candidate.normalizedValue,
      fact: candidate.fact,
      sourceMessageId: candidate.sourceMessageId
    })),
    conflicts: []
  };

  newFacts.forEach((entry) => {
    if (!entry || !entry.fact) return;

    const incomingCandidate = contradictionCandidateForEntry(entry);
    if (incomingCandidate) {
      contradictionDebug.normalizedFields.push({
        field: incomingCandidate.normalizedField,
        value: incomingCandidate.normalizedValue,
        fact: incomingCandidate.fact,
        sourceMessageId: incomingCandidate.sourceMessageId
      });

      const conflictingCandidate = contradictionCandidates.find((candidate) =>
        contradictionCandidatesIncompatible(candidate, incomingCandidate)
      );

      if (conflictingCandidate) {
        const contradiction = contradictionForCandidates(conflictingCandidate, incomingCandidate);
        if (!contradictions.some((item) => item.key === contradiction.key)) {
          contradictions.push(contradiction);
          contradictionDebug.conflicts.push({
            normalizedField: contradiction.normalizedField,
            exactConflictingField: contradiction.normalizedField,
            oldValue: contradiction.oldValue,
            newValue: contradiction.newValue,
            oldSourceMessageId: contradiction.oldSourceMessageId,
            newSourceMessageId: contradiction.newSourceMessageId,
            existingFact: contradiction.existingFact,
            incomingFact: contradiction.incomingFact
          });
        }

        const id = evidenceIdentity(entry);
        if (!existingEvidence.has(id)) {
          factEvidence.push(entry);
          existingEvidence.add(id);
        }
        contradictionCandidates.push(incomingCandidate);
        delete unknownFacts[entry.fact];
        return;
      }
    }

    const currentValue = confirmedFacts[entry.fact];
    const hasCurrentValue = currentValue !== undefined && currentValue !== null;
    const incomingIsUserConfirmed = entry.source === 'USER_CONFIRMED';
    const incomingIsLlmExtracted = entry.source === 'LLM_EXTRACTED';
    const currentIsUncertain = currentValue === 'planned_or_uncertain';
    const incomingIsMoreSpecific = entry.value !== 'planned_or_uncertain';

    if (hasCurrentValue && currentValue !== entry.value) {
      if (APPENDABLE_FACTS.has(entry.fact)) {
        confirmedFacts[entry.fact] = mergeAppendableFactValues(currentValue, entry.value);
      } else if (textFactValuesCompatible(entry.fact, currentValue, entry.value)) {
        if (shouldPreferIncomingTextValue(currentValue, entry.value, incomingIsUserConfirmed)) {
          confirmedFacts[entry.fact] = entry.value;
        }
      } else if (incomingIsUserConfirmed || (incomingIsLlmExtracted && currentIsUncertain && incomingIsMoreSpecific) || (currentIsUncertain && incomingIsMoreSpecific)) {
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

    if (incomingCandidate) {
      contradictionCandidates.push(incomingCandidate);
    }
  });

  Object.keys(UNKNOWN_FACTS).forEach((key) => {
    if (confirmedFacts[key] === undefined && unknownFacts[key] === undefined) {
      unknownFacts[key] = null;
    }
  });

  return { confirmedFacts, unknownFacts, factEvidence, contradictions, contradictionDebug };
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

function listItemDedupeKey(value) {
  const text = normalizeWhitespace(value).toLowerCase().replace(/^(and|their|his|her|its|the|a|an)\s+/, '');
  if (/\border[- ]tracking\b/.test(text) && /\breturns?\b/.test(text) && /\bproduct recommendations?\b/.test(text)) return 'order_returns_product_recommendations';
  if (/\border[- ]tracking\b/.test(text)) return 'order_tracking';
  if (/\breturns?\b|\brefunds?\b|\brefund recommendations?\b/.test(text)) return 'returns_or_refunds';
  if (/\bproduct recommendations?\b|\bpersonalized recommendations?\b/.test(text)) return 'product_recommendations';
  if (/\bbrowsing history\b|\bbrowser history\b/.test(text)) return 'browsing_history';
  if (/\bpurchase history\b|\bpurchasing history\b/.test(text)) return 'purchase_history';
  if (/\blive chats?\b|\bchat transcripts?\b/.test(text)) return 'live_chat';
  if (/\btickets?\b|\bsupport tickets?\b/.test(text)) return 'support_ticket';
  if (/\borders?\b|\border records?\b/.test(text)) return 'orders';
  if (/\b(cv|cvs|resume|resumes|curricula vitae)\b/.test(text)) return 'cv_or_resume';
  if (/\bcover letters?\b|\bmotivation letters?\b/.test(text)) return 'cover_letter';
  if (/\bwork experience\b|\bemployment history\b/.test(text)) return 'work_experience';
  if (/\beducation\b|\beducational background\b|\bdegrees?\b/.test(text)) return 'education';
  if (/\bskills?\b|\bcompetenc(y|ies)\b/.test(text)) return 'skills';
  if (/\bavailability\b/.test(text)) return 'availability';
  if (/\bworking[- ]hour preferences?\b|\bpreferred working hours?\b/.test(text)) return 'working_hour_preferences';
  if (/\bjob qualifications?\b|\bqualifications?\b/.test(text)) return 'job_qualifications';
  if (/\bprevious shift assignments?\b|\bshift records?\b|\bprevious shift records?\b/.test(text)) return 'previous_shift_assignments';
  if (/\bmaximum weekly working limits?\b|\bweekly working limits?\b|\bworking[- ]time limits?\b/.test(text)) return 'weekly_working_limits';
  return text.replace(/[^a-z0-9]+/g, '');
}

function uniqueReadableItems(items) {
  const seen = new Set();
  const values = [];

  (items || []).forEach((item) => {
    const cleaned = sentenceCase(item);
    const constituentKeys = cleaned
      .split(/\s*,\s*|\s+and\s+/i)
      .map((part) => listItemDedupeKey(part))
      .filter(Boolean);
    if (constituentKeys.length > 1 && constituentKeys.every((key) => seen.has(key))) return;

    const key = listItemDedupeKey(cleaned);
    if (!cleaned || !key || seen.has(key)) return;
    seen.add(key);
    values.push(cleaned);
  });

  return values;
}

function readableFactSummary(value) {
  const items = uniqueReadableItems(listFromFact(value));
  if (items.some((item) => listItemDedupeKey(item) === 'order_returns_product_recommendations')) {
    return items
      .filter((item) => listItemDedupeKey(item) !== 'product_recommendations')
      .join('; ');
  }
  return items.join('; ');
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
  const isRecruitment = isRecruitmentAssessment(facts);
  const inputs = [];
  if (facts.processesApplicantCVs) inputs.push('CVs or resumes');
  if (facts.processesApplicantEducation) inputs.push('Applicant education history');
  if (facts.processesApplicantWorkExperience) inputs.push('Applicant work experience');
  if (facts.processesApplicantSkills) inputs.push('Applicant skills');
  if (facts.processesCoverLetters) inputs.push('Cover letters');
  if (facts.processesEmployeeAvailability) inputs.push('Employee availability');
  if (facts.processesWorkingHourPreferences) inputs.push('Working-hour preferences');
  if (facts.processesJobQualifications) inputs.push('Job qualifications');
  if (facts.processesPreviousShiftAssignments) inputs.push('Previous shift assignments');
  if (facts.processesWeeklyWorkingLimits) inputs.push('Maximum weekly working limits');
  if (facts.processesHRRecords) inputs.push('HR records');
  if (facts.processesInsuranceClaimData) inputs.push('Insurance claim data');
  if (facts.processesClaimantData) inputs.push('Claimant data');
  if (facts.processesStudentWork) inputs.push('Student work');
  if (facts.processesDemographicData) inputs.push('Demographic information');
  if (facts.processesDisabilityData) inputs.push('Disability information');
  if (facts.dataFieldGender) inputs.push('Gender');
  if (facts.dataFieldAge) inputs.push('Age');
  if (facts.dataFieldRegion) inputs.push('Region');
  if (facts.dataFieldSocioeconomic) inputs.push('Socioeconomic information');
  if (facts.dataFieldPreviousSchool) inputs.push('Previous school information');
  if (facts.processesQuestionnaireData) inputs.push('Questionnaire responses');
  if (facts.processesJournalEntries) inputs.push('Written journal entries');
  if (facts.processesAttendanceRecords) inputs.push('Attendance records');
  if (facts.processesAcademicPerformanceData) inputs.push('Academic performance data');
  if (facts.processesWearableData) inputs.push('Optional smartwatch data');
  addListItems(inputs, facts.systemInputs);

  const outputs = [];
  addListItems(outputs, facts.systemOutputs);
  if (facts.ranksJobApplicants || facts.applicantRankingPurpose) outputs.push('Applicant ranking or suitability score');
  if (facts.recommendsMonthlyShiftSchedule) outputs.push('Recommended monthly shift schedule');
  if (facts.recommendsClaimAssessment) outputs.push('Claim assessment recommendation');
  if (facts.lessonPlanningPurpose) outputs.push(facts.systemOutputs || 'Lesson plans or learning materials');
  if (facts.feedbackSuggestionOnly) outputs.push('Feedback suggestions');
  if (facts.essayScoringPurpose) outputs.push('Essay score or evaluation');
  if (facts.recommendsAdmissionsOutcome) outputs.push('Acceptance, rejection, or waiting-list recommendation');
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
  if (isRecruitment) decisionsSupported.push('Hiring or shortlisting decision support');
  if (facts.recommendsMonthlyShiftSchedule || facts.workforceSchedulingPurpose) decisionsSupported.push('Employee shift allocation');
  if (facts.recommendsClaimAssessment || facts.insuranceClaimsPurpose) decisionsSupported.push('Insurance claim assessment');
  if (facts.assignmentEvaluationPurpose || facts.essayScoringPurpose) decisionsSupported.push('Educational assessment or feedback');
  if (facts.recommendsAdmissionsOutcome || facts.educationAdmissionsPurpose) decisionsSupported.push('University admissions outcome');
  if (facts.recommendsCounselorContact) decisionsSupported.push('Whether a student should be contacted by a university counselor');
  if (facts.producesIndividualRiskScore && facts.studentWellbeingPurpose) {
    decisionsSupported.push('Prioritization for student wellbeing intervention');
  } else if (facts.producesIndividualRiskScore) {
    decisionsSupported.push('Individual assessment or prioritization');
  }

  const affectedPersons = [];
  addListItems(affectedPersons, facts.affectedPersons);
  if (isRecruitment) affectedPersons.push('Job applicants');
  if (facts.employmentContext && !isRecruitment) affectedPersons.push('Employees');
  if (facts.insuranceContext || facts.insuranceClaimsPurpose || facts.processesClaimantData) affectedPersons.push('Claimants');
  if (facts.assignmentEvaluationPurpose || facts.essayScoringPurpose || facts.lessonPlanningPurpose) affectedPersons.push('Students');
  if (facts.educationAdmissionsPurpose) affectedPersons.push('Student applicants');
  if (facts.educationContext) affectedPersons.push('University students');

  const users = [];
  addListItems(users, facts.primaryUsers);
  if (isRecruitment) users.push('HR or recruitment staff');
  if (facts.authorizedHRAndManagersOnly || facts.processesHRRecords) users.push('HR staff');
  if (facts.manufacturingContext || (isWorkforceScheduling && facts.employmentContext && (facts.humanCanModify || facts.humanCanReject))) users.push('Manufacturing managers');
  if (facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) users.push('Claims officers');
  if (facts.userRole) users.push(String(facts.userRole));
  if (facts.educationAdmissionsPurpose) users.push('Admissions officers');
  if (facts.recommendsCounselorContact || (facts.educationContext && facts.humanReviewAvailable)) users.push('University counselors');

  let humanRole = 'Not yet established';
  if (facts.humanRoleDescription) {
    humanRole = String(facts.humanRoleDescription);
  } else if (isClaimAssessment && facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject)) {
    humanRole = 'A claims officer reviews the claim recommendation and can change, reject, or override it before the final claim decision.';
  } else if (isWorkforceScheduling && facts.humanReviewAvailable && facts.humanCanModify && facts.humanCanReject) {
    humanRole = 'A manager reviews, modifies or rejects every schedule before publication.';
  } else if (isRecruitment && facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.makesHiringDecision === false)) {
    humanRole = 'HR or recruitment staff review the AI ranking and can change, reject, or decide the final hiring or shortlisting outcome.';
  } else if (facts.educationAdmissionsPurpose && facts.officersUsuallyFollowRecommendation) {
    humanRole = 'Admissions officers review recommendations, but the user says officers usually follow them; meaningful independent review requires verification.';
  } else if (facts.teacherFinalGradeDecision) {
    humanRole = 'The teacher reviews the AI output and decides the final grade.';
  } else if (facts.feedbackSuggestionOnly) {
    humanRole = 'The AI suggests feedback; final use remains with the teacher.';
  } else if (facts.humanReviewAvailable && facts.humanCanOverride) {
    humanRole = isClaimAssessment
      ? 'A claims officer reviews and can override the recommendation.'
      : 'A human reviewer can review and override recommendations.';
  } else if (isClaimAssessment && facts.humanReviewAvailable) {
    humanRole = 'A claims officer reviews the claim recommendation, but override authority needs confirmation.';
  } else if (isRecruitment && facts.humanReviewAvailable) {
    humanRole = 'HR or recruitment staff review the applicant ranking, but final authority still needs confirmation.';
  } else if (facts.humanReviewAvailable) {
    humanRole = 'Human review is available, but override authority needs confirmation.';
  }

  let purpose = project?.fullDescription || project?.shortDescription || project?.title || 'Purpose not yet established.';
  if (facts.systemPurpose) {
    purpose = readableFactSummary(facts.systemPurpose) || String(facts.systemPurpose);
  } else if (facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) {
    purpose = 'Recommend fair monthly employee shift schedules while respecting availability, qualifications and working-time limits.';
  } else if (isRecruitment) {
    purpose = 'Rank job applicants for recruitment or hiring review using application materials.';
  } else if (facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) {
    purpose = 'Support insurance claim assessment with an advisory recommendation for human review.';
  } else if (facts.lessonPlanningPurpose) {
    purpose = 'Generate lesson plans or learning materials';
  } else if (facts.essayScoringPurpose) {
    purpose = 'Score or evaluate student essays';
  } else if (facts.assignmentEvaluationPurpose) {
    purpose = 'Evaluate student assignments or student work';
  } else if (facts.educationAdmissionsPurpose || facts.recommendsAdmissionsOutcome) {
    purpose = 'Support university admissions by scoring applicants and recommending acceptance, rejection, or waiting-list outcomes.';
  } else {
    const purposeEvidence = factEvidenceFor(state, ['studentWellbeingPurpose', 'producesIndividualRiskScore', 'recommendsCounselorContact']);
    purpose = purposeEvidence[0]?.sourceText || purpose;
  }

  let deploymentContext = 'Deployment context not yet established';
  if (facts.deploymentContext) {
    deploymentContext = String(facts.deploymentContext);
  } else if (facts.manufacturingContext && facts.workforceSchedulingPurpose) {
    deploymentContext = 'Manufacturing workforce scheduling';
  } else if (isRecruitment) {
    deploymentContext = 'Employment recruitment and applicant screening';
  } else if (facts.insuranceContext || facts.insuranceClaimsPurpose) {
    deploymentContext = 'Insurance claim handling';
  } else if (facts.educationAdmissionsPurpose) {
    deploymentContext = 'University admissions and access to education';
  } else if (facts.assignmentEvaluationPurpose || facts.lessonPlanningPurpose || facts.essayScoringPurpose) {
    deploymentContext = 'Education support or assessment';
  } else if (facts.employmentContext) {
    deploymentContext = 'Employment decision-support context';
  } else if (facts.educationContext) {
    deploymentContext = 'University education and student support context';
  }

  return {
    purpose,
    users: Array.from(new Set(users)),
    affectedPersons: Array.from(new Set(affectedPersons)),
    inputs: uniqueReadableItems(inputs),
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
  if (facts.educationAdmissionsPurpose) {
    classifications.push(conclusion('EducationAdmissionsAccess', 'confirmed', 0.93, 'The system is used in university admissions or access to education.', state, 'educationAdmissionsPurpose', ['RULE_EDU_ADMISSIONS_CONTEXT_01']));
  }
  if (facts.employmentContext) {
    classifications.push(conclusion('Employment', 'confirmed', 0.95, 'The system operates in an employment or workforce-management context.', state, 'employmentContext', ['RULE_EMPLOYMENT_DOMAIN_01']));
  }
  if (isRecruitmentAssessment(facts)) {
    classifications.push(conclusion('EmploymentRecruitment', 'confirmed', 0.94, 'The system is used for recruitment, applicant screening, or hiring support.', state, ['employmentRecruitmentPurpose', 'jobApplicantsAffected', 'supportsHiringDecision'], ['RULE_EMPLOYMENT_RECRUITMENT_01']));
    classifications.push(conclusion('RecruitmentDecisionSupport', 'confirmed', 0.9, 'The AI output supports hiring or shortlisting review, but final automation is not assumed unless explicitly confirmed.', state, ['supportsHiringDecision', 'applicantRankingPurpose', 'ranksJobApplicants'], ['RULE_RECRUITMENT_DECISION_SUPPORT_01']));
  }
  if (facts.ranksJobApplicants || facts.applicantRankingPurpose) {
    classifications.push(conclusion('ApplicantRanking', 'confirmed', 0.94, 'The system ranks or scores job applicants.', state, ['ranksJobApplicants', 'applicantRankingPurpose'], ['RULE_APPLICANT_RANKING_01']));
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
  if (facts.applicantScoring) {
    classifications.push(conclusion('ApplicantScoring', 'confirmed', 0.92, 'The system scores applicants for an admissions process.', state, 'applicantScoring', ['RULE_APPLICANT_SCORING_01']));
  }
  if (facts.recommendsAdmissionsOutcome) {
    classifications.push(conclusion('AdmissionsRecommendation', 'confirmed', 0.9, 'The system recommends acceptance, rejection, or waiting-list outcomes for human or institutional review.', state, 'recommendsAdmissionsOutcome', ['RULE_ADMISSIONS_RECOMMENDATION_01']));
    classifications.push(conclusion('DecisionSupport', 'confirmed', 0.88, 'The system supports an admissions decision process with a recommendation output.', state, ['recommendsAdmissionsOutcome', 'educationAdmissionsPurpose'], ['RULE_FUNCTION_ADMISSIONS_01']));
  }
  if (facts.educationAdmissionsPurpose && (facts.applicantScoring || facts.recommendsAdmissionsOutcome)) {
    classifications.push(conclusion('HighRiskEducationAccessAssessment', 'requires_verification', 0.76, 'This may match an EU AI Act Annex III education high-risk use case because it evaluates or influences access to educational institutions. Applicability timing and role-specific duties require retrieved current legal sources and provider/deployer verification.', state, ['educationAdmissionsPurpose', 'applicantScoring', 'recommendsAdmissionsOutcome'], ['RULE_EU_AI_ACT_ANNEX_III_EDU_ACCESS_01']));
  }
  if (isRecruitmentAssessment(facts) && (facts.ranksJobApplicants || facts.supportsHiringDecision)) {
    classifications.push(conclusion('HighRiskEmploymentRecruitmentAssessment', 'requires_verification', 0.74, 'Recruitment ranking may fall within employment high-risk AI categories if it materially influences access to work. Provider/deployer roles, jurisdiction, and current legal applicability still require verification.', state, ['employmentRecruitmentPurpose', 'ranksJobApplicants', 'supportsHiringDecision'], ['RULE_EU_AI_ACT_ANNEX_III_EMPLOYMENT_RECRUITMENT_01']));
  }
  if (facts.recommendsMonthlyShiftSchedule) {
    classifications.push(conclusion('ShiftRecommendation', 'confirmed', 0.94, 'The system recommends a monthly shift schedule rather than making unrelated employment decisions.', state, 'recommendsMonthlyShiftSchedule', ['RULE_SHIFT_RECOMMENDATION_01']));
    classifications.push(conclusion('DecisionSupport', 'confirmed', 0.9, 'The system supports employee shift allocation decisions with a recommendation reviewed by humans.', state, ['recommendsMonthlyShiftSchedule', 'humanReviewAvailable'], ['RULE_FUNCTION_03']));
  }
  if (facts.systemPurpose && isDecisionSupportAssessment(facts)) {
    classifications.push(conclusion('DecisionSupport', 'confirmed', 0.74, 'The system purpose or output supports an assessment, recommendation, ranking, flag, or decision process.', state, ['systemPurpose', 'systemOutputs', 'decisionsSupported'], ['RULE_GENERIC_DECISION_SUPPORT_01']));
  }
  if (facts.healthcareContext || facts.clinicalTriagePurpose) {
    classifications.push(conclusion('Healthcare', 'confirmed', 0.9, 'The system is used in a healthcare or clinical support context.', state, ['healthcareContext', 'deploymentContext'], ['RULE_HEALTHCARE_CONTEXT_01']));
  }
  if (facts.clinicalTriagePurpose) {
    classifications.push(conclusion('ClinicalTriageDecisionSupport', 'confirmed', 0.9, 'The system supports doctors by producing a triage priority recommendation or clinical risk-factor highlights.', state, ['clinicalTriagePurpose', 'systemOutputs', 'humanReviewAvailable'], ['RULE_CLINICAL_TRIAGE_SUPPORT_01']));
  }
  if ((facts.healthcareContext || facts.clinicalTriagePurpose) && (facts.processesHealthRelatedData || facts.processesPatientRecords)) {
    classifications.push(conclusion('HighRiskMedicalProductBoundary', 'requires_verification', 0.68, 'Clinical AI may fall under EU AI Act Article 6(1) if it is itself a medical-device product or a safety component of a regulated medical product requiring third-party conformity assessment.', state, ['healthcareContext', 'clinicalTriagePurpose', 'processesHealthRelatedData'], ['RULE_EU_AI_ACT_ARTICLE_6_1_MEDICAL_PRODUCT_BOUNDARY_01']));
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
    classifications.push(conclusion('HealthRelatedDataProcessing', 'likely', 0.82, facts.healthcareContext
      ? 'Patient symptoms, medical history, medications, vital signs, lab results, doctor notes, or patient records are health-related data.'
      : 'Stress, sleep, heart-rate, or wellbeing data may be health-related even when no medical diagnosis is made.', state, 'processesHealthRelatedData', ['RULE_DATA_02']));
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
  if (facts.processesApplicantCVs || facts.processesApplicantEducation || facts.processesApplicantWorkExperience || facts.processesApplicantSkills || facts.processesCoverLetters) {
    classifications.push(conclusion('CandidateApplicationDataProcessing', 'confirmed', 0.9, 'The system processes candidate application materials such as CVs, education, work experience, skills, or cover letters.', state, ['processesApplicantCVs', 'processesApplicantEducation', 'processesApplicantWorkExperience', 'processesApplicantSkills', 'processesCoverLetters'], ['RULE_CANDIDATE_APPLICATION_DATA_01']));
  }
  if (facts.processesInsuranceClaimData || facts.processesClaimantData) {
    classifications.push(conclusion('PersonalDataProcessing', 'confirmed', 0.88, 'The system processes insurance claim or claimant-related personal information.', state, ['processesInsuranceClaimData', 'processesClaimantData'], ['RULE_CLAIM_DATA_01']));
  }
  if (facts.processesDemographicData) {
    classifications.push(conclusion('DemographicDataProcessing', 'confirmed', 0.82, 'Demographic fields are processed and must be classified field by field before treating any field as special-category data.', state, ['processesDemographicData', 'dataFieldGender', 'dataFieldAge', 'dataFieldRegion', 'dataFieldSocioeconomic', 'dataFieldPreviousSchool'], ['RULE_DEMOGRAPHIC_DATA_FIELD_REVIEW_01']));
  }
  if (facts.processesDisabilityData) {
    classifications.push(conclusion('DisabilityDataProcessing', 'confirmed', 0.9, 'Disability information is processed and may qualify as special-category or sensitive personal data depending on jurisdiction and legal basis.', state, ['processesDisabilityData', 'dataFieldDisability'], ['RULE_DISABILITY_SPECIAL_CATEGORY_REVIEW_01']));
  }
  if (facts.usesThirdPartyCloudProvider) {
    classifications.push(conclusion('ThirdPartyCloudProcessing', 'confirmed', 0.84, 'A third-party cloud provider is involved, so controller/processor roles and transfer/security safeguards require verification.', state, 'usesThirdPartyCloudProvider', ['RULE_THIRD_PARTY_CLOUD_01']));
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
  const isRecruitment = isRecruitmentAssessment(facts);
  const primaryRisks = [];
  const nonApplicableRisks = [];

  if (facts.processesPersonalData) {
    primaryRisks.push(risk(
      'Personal data misuse or excessive processing',
      'likely',
      0.78,
      isRecruitment
        ? 'The system processes candidate application materials, so privacy, minimization, retention, and access controls need evidence.'
        : facts.employmentContext
          ? 'The system processes employee availability, preference, qualification, or HR records, so privacy, minimization, and access controls need evidence.'
        : facts.educationContext
          ? 'The system processes multiple student data sources, so privacy, minimization, and purpose limitation need evidence.'
          : 'The system processes personal data, so privacy, minimization, purpose limitation, and access controls need evidence.',
      state,
      ['processesPersonalData', 'processesQuestionnaireData', 'processesJournalEntries', 'processesAttendanceRecords', 'processesAcademicPerformanceData', 'processesEmployeeAvailability', 'processesWorkingHourPreferences', 'processesJobQualifications', 'processesPreviousShiftAssignments', 'processesHRRecords', 'processesApplicantCVs', 'processesApplicantEducation', 'processesApplicantWorkExperience', 'processesApplicantSkills', 'processesCoverLetters'],
      ['RISK_PRIVACY_01'],
      'data-protection'
    ));
  }
  if (isRecruitment && (facts.ranksJobApplicants || facts.applicantRankingPurpose)) {
    primaryRisks.push(risk(
      'Unfair applicant ranking or discriminatory screening',
      facts.historicalBiasEvidence ? 'likely' : 'possible',
      facts.historicalBiasEvidence ? 0.78 : 0.68,
      facts.historicalBiasEvidence
        ? 'The user described possible historical bias, so applicant ranking must be validated for disparate impact before HR relies on it.'
        : 'Applicant ranking can affect access to work; fairness validation is needed before treating the ranking as reliable.',
      state,
      ['employmentRecruitmentPurpose', 'applicantRankingPurpose', 'ranksJobApplicants', 'supportsHiringDecision', 'historicalBiasEvidence'],
      ['RISK_RECRUITMENT_BIAS_01'],
      'ethical'
    ));
    primaryRisks.push(risk(
      'Incorrect ranking from incomplete or misread application data',
      'possible',
      0.64,
      'CVs, education history, work experience, skills, and cover letters can be incomplete or parsed incorrectly, which may unfairly lower a candidate ranking.',
      state,
      ['processesApplicantCVs', 'processesApplicantEducation', 'processesApplicantWorkExperience', 'processesApplicantSkills', 'processesCoverLetters'],
      ['RISK_RECRUITMENT_DATA_ACCURACY_01'],
      'ethical'
    ));
    primaryRisks.push(risk(
      'Over-reliance by HR on applicant rankings',
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.makesHiringDecision === false) ? 'possible' : 'likely',
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.makesHiringDecision === false) ? 0.56 : 0.72,
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.makesHiringDecision === false)
        ? 'Confirmed human review or final HR authority reduces over-reliance risk, but review quality should still be evidenced.'
        : 'HR staff may over-rely on applicant rankings if review authority and automatic rejection or shortlisting boundaries are unclear.',
      state,
      ['applicantRankingPurpose', 'ranksJobApplicants', 'humanReviewAvailable', 'humanCanOverride', 'humanCanModify', 'humanCanReject', 'makesHiringDecision'],
      ['RISK_RECRUITMENT_OVERRELIANCE_01'],
      'legal-ethical'
    ));
  }
  if (!isRecruitment && facts.systemPurpose && isDecisionSupportAssessment(facts)) {
    primaryRisks.push(risk(
      'Incorrect AI-supported assessment or recommendation',
      'possible',
      0.62,
      'The AI output appears to support an assessment, recommendation, ranking, flag, or decision process, so errors in input data or model output could lead to unsuitable outcomes.',
      state,
      ['systemPurpose', 'systemOutputs', 'decisionsSupported', 'profilesIndividualCharacteristic', 'producesIndividualRiskScore'],
      ['RISK_GENERIC_ACCURACY_01'],
      'technical-safety'
    ));
    primaryRisks.push(risk(
      'Over-reliance on AI output',
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.fullyAutomatedDecision === false) ? 'possible' : 'likely',
      facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.fullyAutomatedDecision === false) ? 0.54 : 0.68,
      facts.humanReviewAvailable
        ? 'Human review is described, but the quality, independence, and authority of that review still need evidence.'
        : 'The AI output may be over-relied on if human review and override authority are not clear.',
      state,
      ['systemPurpose', 'decisionsSupported', 'humanReviewAvailable', 'humanCanOverride', 'humanCanModify', 'humanCanReject', 'fullyAutomatedDecision'],
      ['RISK_GENERIC_OVERRELIANCE_01'],
      'ethical'
    ));
  }
  if (!isRecruitment && facts.systemPurpose && isDecisionSupportAssessment(facts) && facts.affectedPersons && !facts.explanationAvailable && !facts.correctionRightAvailable && !facts.manualReviewAvailable && !facts.appealMechanismAvailable) {
    primaryRisks.push(risk(
      'Insufficient explanation or review path for affected people',
      'possible',
      0.58,
      'When an AI-supported output affects people, explanation, correction, or human-review routes should be evidenced.',
      state,
      ['systemPurpose', 'affectedPersons', 'explanationAvailable', 'correctionRightAvailable', 'manualReviewAvailable', 'appealMechanismAvailable'],
      ['RISK_GENERIC_CONTESTABILITY_01'],
      'legal-ethical'
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
  if (facts.educationAdmissionsPurpose && (facts.applicantScoring || facts.recommendsAdmissionsOutcome)) {
    primaryRisks.push(risk(
      'Unfair admissions outcome or discriminatory ranking',
      facts.historicalBiasEvidence ? 'likely' : 'possible',
      facts.historicalBiasEvidence ? 0.78 : 0.66,
      facts.historicalBiasEvidence
        ? 'The user described historical gender, socioeconomic, regional, or disability bias, so applicant scoring must be validated for disparate impact before recommendations are relied on.'
        : 'Admissions scoring can affect access to education; fairness evidence is required before treating the recommendation as reliable.',
      state,
      ['educationAdmissionsPurpose', 'applicantScoring', 'recommendsAdmissionsOutcome', 'historicalBiasEvidence', 'dataFieldGender', 'dataFieldSocioeconomic', 'dataFieldRegion', 'dataFieldDisability'],
      ['RISK_ADMISSIONS_BIAS_01'],
      'ethical'
    ));
  }
  if (facts.officersUsuallyFollowRecommendation) {
    primaryRisks.push(risk(
      'Formal human review may become rubber-stamping',
      'requires_verification',
      0.72,
      'Admissions officers usually following the recommendation raises a question whether human review is meaningful, independent, and capable of changing outcomes.',
      state,
      ['officersUsuallyFollowRecommendation', 'humanReviewAvailable', 'recommendsAdmissionsOutcome'],
      ['RISK_RUBBER_STAMPING_01'],
      'legal-ethical'
    ));
  }
  if (facts.noClearIndividualExplanation || facts.explanationAvailable === false) {
    primaryRisks.push(risk(
      'Insufficient individual explanation for score-driven outcomes',
      'likely',
      0.7,
      'The user reported no clear individual score explanation; transparency and contestability controls require improvement or verification.',
      state,
      ['noClearIndividualExplanation', 'explanationAvailable', 'applicantScoring'],
      ['RISK_EXPLANATION_GAP_01'],
      'legal-ethical'
    ));
  }
  if (facts.noFormalAppealMechanism || facts.appealMechanismAvailable === false) {
    primaryRisks.push(risk(
      'Missing appeal or review path for affected applicants',
      'likely',
      0.72,
      'No formal appeal mechanism was described for applicants affected by admissions recommendations.',
      state,
      ['noFormalAppealMechanism', 'appealMechanismAvailable', 'recommendsAdmissionsOutcome'],
      ['RISK_APPEAL_GAP_01'],
      'legal-ethical'
    ));
  }
  if (facts.retentionPeriodDefined && /five\s+years?|5\s+years?/i.test(String(facts.retentionPeriod || ''))) {
    primaryRisks.push(risk(
      'Five-year retention requires documented necessity and proportionality',
      'requires_verification',
      0.64,
      'A five-year retention period is not treated as automatically non-compliant, but purpose, legal obligation, necessity, deletion/anonymization, and schedule evidence must justify it.',
      state,
      ['retentionPeriodDefined', 'retentionPeriod'],
      ['RISK_RETENTION_JUSTIFICATION_01'],
      'data-protection'
    ));
  }
  if (facts.usesThirdPartyCloudProvider) {
    primaryRisks.push(risk(
      'Third-party cloud controls require verification',
      'requires_verification',
      0.62,
      'Cloud processing was described, but encryption, access controls, processor terms, audit rights, subcontractors, transfer mechanism, incident handling, and deletion controls were not all evidenced.',
      state,
      'usesThirdPartyCloudProvider',
      ['RISK_CLOUD_PROCESSOR_CONTROLS_01'],
      'technical-security'
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
  const isRecruitment = isRecruitmentAssessment(facts);
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
      : isRecruitment
        ? 'HR or recruitment staff'
        : 'A human reviewer';

  if (facts.humanReviewAvailable) addSafeguard(confirmed, 'HumanOversight', 'Human review is confirmed.', 'humanReviewAvailable', ['SAFEGUARD_OVERSIGHT_01']);
  if (facts.humanCanOverride) addSafeguard(confirmed, 'HumanCanOverride', `${humanActor} can override the proposed output.`, 'humanCanOverride', ['SAFEGUARD_OVERRIDE_01']);
  if (facts.humanCanModify) addSafeguard(confirmed, 'HumanCanModify', `${humanActor} can modify the proposed output.`, 'humanCanModify', ['SAFEGUARD_MODIFY_01']);
  if (facts.humanCanReject) addSafeguard(confirmed, 'HumanCanReject', `${humanActor} can reject the proposed output.`, 'humanCanReject', ['SAFEGUARD_REJECT_01']);
  const affectedGroup = isRecruitment ? 'Job applicants' : facts.employmentContext ? 'Employees' : facts.insuranceContext || facts.insuranceClaimsPurpose ? 'Claimants' : 'Affected people';
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
      ? isRecruitment
        ? 'Pseudonymization or minimization may be relevant for applicant CVs, cover letters, and ranking records and needs evidence.'
        : 'Pseudonymization or minimization may be relevant for employee scheduling and HR records and needs evidence.'
      : facts.educationContext
        ? 'Pseudonymization or anonymization is relevant for journal, wearable, or student records and needs evidence.'
        : facts.insuranceContext || facts.insuranceClaimsPurpose
          ? 'Pseudonymization, minimization, or access separation may be relevant for claim and claimant records and needs evidence.'
        : 'Pseudonymization, anonymization, or data minimization may be relevant for the processed personal data and needs evidence.', dataFactKeys, ['SAFEGUARD_PSEUDONYMIZATION_01']);
    if (!facts.securityMeasuresDocumented) addSafeguard(requiresEvidence, 'SecurityMeasures', facts.employmentContext
      ? isRecruitment
        ? 'Security controls are relevant for processed applicant data and ranking records and need evidence.'
        : 'Security controls are relevant for processed employee data and need evidence.'
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
  const isRecruitment = isRecruitmentAssessment(facts);
  const items = [];
  const processesPersonRelatedData = facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData;
  const generatedEducationSupport = facts.educationContext && (
    facts.lessonPlanningPurpose ||
    facts.adaptiveLearningSupport ||
    facts.learningProcessInfluence ||
    facts.systemPurpose ||
    /education|student|lesson|learning|tutor|explanation|feedback|quiz|study/i.test(String(facts.systemPurpose || facts.systemOutputs || ''))
  );
  const educationHighRiskBoundaryNeedsVerification = Boolean(
    facts.adaptiveLearningSupport ||
    facts.learningProcessInfluence ||
    facts.evaluatesLearningOutcome ||
    facts.assignmentEvaluationPurpose ||
    facts.essayScoringPurpose
  );

  if (generatedEducationSupport && !facts.educationAdmissionsPurpose && !facts.recommendsAdmissionsOutcome && !facts.assignsAcademicGrade) {
    items.push({
      value: 'EU AI Act Article 50 transparency obligations for educational chatbot or AI-generated support content',
      applicabilityStatus: 'likely_applicable_limited_risk',
      confidence: 0.72,
      reason: 'The current facts describe an education-support AI that interacts directly with students and generates explanations, examples, guidance, lesson materials, or feedback. This triggers an AI-interaction and AI-generated-content transparency review even where official grading or admissions decisions are excluded.',
      supportingFacts: ['educationContext', facts.systemPurpose ? 'systemPurpose' : null, facts.systemOutputs ? 'systemOutputs' : null, facts.lessonPlanningPurpose ? 'lessonPlanningPurpose' : null].filter(Boolean),
      missingConditions: ['clear notice that users interact with AI', 'age-appropriate transparency for students/minors if applicable', 'human escalation or teacher-supervision policy if used in school settings'],
      legalReferences: ['Regulation (EU) 2024/1689 Article 50(1)', 'Regulation (EU) 2024/1689 Article 50(2)', 'Regulation (EU) 2024/1689 Article 50(5)', 'Regulation (EU) 2024/1689 Article 4 AI literacy'],
      ...evidencePayload(state, ['educationContext', 'systemPurpose', 'systemOutputs', 'lessonPlanningPurpose', 'affectedPersons']),
      ruleIds: ['REG_EU_AI_ACT_TRANSPARENCY_CHATBOT_01', 'REG_EU_AI_ACT_AI_GENERATED_CONTENT_NOTICE_01']
    });

    items.push({
      value: 'EU AI Act Annex III education high-risk boundary review',
      applicabilityStatus: educationHighRiskBoundaryNeedsVerification ? 'requires_verification' : 'not_applicable_from_current_facts',
      confidence: educationHighRiskBoundaryNeedsVerification ? 0.74 : 0.7,
      reason: educationHighRiskBoundaryNeedsVerification
        ? 'The current facts exclude formal grading, ranking, admissions, certification, or other official academic decisions, but the system may adapt guidance to a student knowledge level or influence the learning process. Annex III education use cases should therefore be checked before calling this merely limited-risk.'
        : 'The current facts expressly exclude grading, ranking, admissions, certification, or other official academic decisions. If the system later evaluates learning outcomes, assigns grades, ranks students, or materially influences access to education, the classification must be revisited.',
      supportingFacts: ['assignsAcademicGrade', 'fullyAutomatedDecision', facts.adaptiveLearningSupport ? 'adaptiveLearningSupport' : null, facts.learningProcessInfluence ? 'learningProcessInfluence' : null].filter((key) => key && facts[key] !== undefined),
      missingConditions: ['whether the tool evaluates learning outcomes', 'whether it steers the learning process in an institution', 'whether outputs materially influence access to education or student opportunities', 'provider/deployer role and EU market/use context'],
      legalReferences: ['Regulation (EU) 2024/1689 Article 6(2)', 'Regulation (EU) 2024/1689 Article 6(3)', 'Regulation (EU) 2024/1689 Annex III point 3(a)', 'Regulation (EU) 2024/1689 Annex III point 3(b)', 'Regulation (EU) 2024/1689 Annex III point 3(c)'],
      ...evidencePayload(state, ['assignsAcademicGrade', 'fullyAutomatedDecision', 'systemPurpose', 'adaptiveLearningSupport', 'learningProcessInfluence']),
      ruleIds: ['REG_EU_AI_ACT_EDUCATION_HIGH_RISK_BOUNDARY_01']
    });
  }

  if (processesPersonRelatedData) {
    items.push({
      value: 'GDPR / KVKK personal-data principles',
      applicabilityStatus: facts.legalBasisDocumented ? 'likely_applicable_with_confirmed_basis' : 'likely_applicable_requires_basis_evidence',
      confidence: 0.82,
      reason: facts.employmentContext
        ? isRecruitment
          ? 'The system processes applicant-related personal data, so lawfulness, fairness, transparency, minimization, retention, and access control should be evidenced.'
          : 'The system processes employee-related personal data, so lawfulness, fairness, transparency, minimization, retention, and access control should be evidenced.'
        : facts.educationContext
          ? 'The system processes student-related personal data, so lawfulness, fairness, transparency, minimization, and purpose limitation should be evidenced.'
          : facts.insuranceContext || facts.insuranceClaimsPurpose
            ? 'The system processes claim or claimant-related personal data, so lawfulness, fairness, transparency, minimization, retention, and access control should be evidenced.'
      : 'The system processes personal data, so lawfulness, fairness, transparency, minimization, retention, and access control should be evidenced.',
      supportingFacts: ['processesPersonalData', facts.processesInsuranceClaimData ? 'processesInsuranceClaimData' : null, facts.processesClaimantData ? 'processesClaimantData' : null, facts.processesApplicantCVs ? 'processesApplicantCVs' : null, facts.processesCoverLetters ? 'processesCoverLetters' : null, facts.legalBasisDocumented ? 'legalBasisDocumented' : null, facts.purposeLimitation ? 'purposeLimitation' : null].filter(Boolean),
      missingConditions: ['retentionPeriodDefined', 'securityMeasuresDocumented', 'pseudonymizationUsed'].filter((key) => !facts[key]),
      legalReferences: ['GDPR Article 5', 'GDPR Article 6', 'GDPR Article 9 if special-category data is processed', 'GDPR Articles 13-14', 'GDPR Article 25', 'GDPR Article 32', 'GDPR Article 35 if processing is likely high risk', 'KVKK Law No. 6698 Articles 4, 5, 6, 10, 11, 12'],
      ...evidencePayload(state, ['processesPersonalData', 'processesInsuranceClaimData', 'processesClaimantData', 'processesApplicantCVs', 'processesCoverLetters', 'legalBasisDocumented', 'purposeLimitation', 'employeesInformed', 'affectedPersonsInformed', 'accessRestricted', 'retentionPeriodDefined']),
      ruleIds: ['REG_DATA_PROTECTION_01']
    });
  } else if (facts.educationContext && facts.affectedPersons) {
    items.push({
      value: 'GDPR / KVKK personal-data boundary check',
      applicabilityStatus: 'requires_verification',
      confidence: 0.58,
      reason: 'The current facts identify students as affected users, but do not establish whether names, accounts, chat histories, learning records, or other personal data are processed. Data-protection duties depend on that implementation detail.',
      supportingFacts: ['educationContext', 'affectedPersons'],
      missingConditions: ['whether student identifiers or accounts are processed', 'whether chat history is retained', 'whether learning records or profiles are used', 'retention and deletion rules if personal data is processed'],
      legalReferences: ['GDPR Article 5', 'GDPR Article 6', 'GDPR Articles 13-14', 'GDPR Article 35 if high-risk processing is likely', 'KVKK Law No. 6698 Articles 4, 5, 10, 11, 12'],
      ...evidencePayload(state, ['educationContext', 'affectedPersons']),
      ruleIds: ['REG_DATA_PROTECTION_BOUNDARY_01']
    });
  }
  if (facts.adaptiveLearningSupport || facts.learningProcessInfluence) {
    items.push({
      value: 'GDPR / KVKK learning analytics and profiling boundary',
      applicabilityStatus: 'possible_requires_effects_review',
      confidence: 0.62,
      reason: 'Adapting educational guidance to a student knowledge level may involve evaluating or predicting personal learning characteristics. This should be reviewed as learning analytics or profiling; GDPR Article 22-style safeguards become more important if outputs are solely automated and materially affect the student.',
      supportingFacts: [facts.adaptiveLearningSupport ? 'adaptiveLearningSupport' : null, facts.learningProcessInfluence ? 'learningProcessInfluence' : null].filter(Boolean),
      missingConditions: ['whether student profiles are stored', 'whether personalization materially affects educational opportunities', 'whether students can understand, correct, or challenge the profile'],
      legalReferences: ['GDPR Article 4(4) profiling definition', 'GDPR Article 22 if solely automated and similarly significant effects arise', 'GDPR Articles 13-15 transparency/access rights', 'KVKK Law No. 6698 Article 11(1)(g)'],
      ...evidencePayload(state, ['adaptiveLearningSupport', 'learningProcessInfluence', 'systemPurpose', 'affectedPersons']),
      ruleIds: ['REG_LEARNING_ANALYTICS_PROFILING_BOUNDARY_01']
    });
  }
  if (facts.processesHealthRelatedData) {
    items.push({
      value: facts.healthcareContext ? 'GDPR / KVKK health-data and patient-records review' : 'Special-category or sensitive wellbeing data review',
      applicabilityStatus: 'possible',
      confidence: facts.healthcareContext ? 0.82 : 0.68,
      reason: facts.healthcareContext
        ? 'Patient symptoms, medical history, medications, vital signs, lab results, doctor notes, or patient records are health-related personal data. Lawful basis, special-category conditions, clinical confidentiality, access control, retention, and security need evidence.'
        : 'Stress, sleep, heart-rate, and journal data may require sensitive-data analysis depending on jurisdiction and implementation.',
      supportingFacts: ['processesHealthRelatedData', facts.processesPatientRecords ? 'processesPatientRecords' : null].filter(Boolean),
      missingConditions: ['data category legal qualification', 'securityMeasuresDocumented'].filter((item) => item !== 'securityMeasuresDocumented' || !facts.securityMeasuresDocumented),
      legalReferences: ['GDPR Article 9', 'GDPR Article 5', 'GDPR Article 6', 'GDPR Article 32', 'GDPR Article 35', 'KVKK Law No. 6698 Article 6', 'KVKK Law No. 6698 Article 12'],
      ...evidencePayload(state, 'processesHealthRelatedData'),
      ruleIds: ['REG_SENSITIVE_DATA_01']
    });
  }
  if (facts.healthcareContext || facts.clinicalTriagePurpose) {
    items.push({
      value: 'EU AI Act Article 6(1) medical-device / clinical safety boundary review',
      applicabilityStatus: 'requires_verification',
      confidence: 0.68,
      reason: 'Clinical triage support may be high-risk under the EU AI Act if the AI system is itself a regulated medical-device product, or a safety component of such a product, and the product requires third-party conformity assessment. If high-risk, the requirements in Articles 9-15, including Article 15 on accuracy, robustness, and cybersecurity, should be evidenced.',
      supportingFacts: ['healthcareContext', facts.clinicalTriagePurpose ? 'clinicalTriagePurpose' : null, facts.processesHealthRelatedData ? 'processesHealthRelatedData' : null].filter(Boolean),
      missingConditions: ['whether the AI is a medical device or safety component', 'applicable MDR/IVDR classification', 'third-party conformity assessment requirement', 'clinical validation evidence', 'post-market monitoring and incident process'],
      legalReferences: ['Regulation (EU) 2024/1689 Article 6(1)', 'Regulation (EU) 2024/1689 Annex I', 'Regulation (EU) 2017/745 Medical Device Regulation if applicable', 'Regulation (EU) 2017/746 In Vitro Diagnostic Medical Devices Regulation if applicable', 'Regulation (EU) 2024/1689 Articles 9-15 for high-risk requirements', 'Regulation (EU) 2024/1689 Article 15 accuracy, robustness, and cybersecurity', 'Regulation (EU) 2024/1689 Article 26 deployer obligations'],
      ...evidencePayload(state, ['healthcareContext', 'clinicalTriagePurpose', 'processesHealthRelatedData', 'providesMedicalDiagnosis', 'influencesMedicalTreatment']),
      ruleIds: ['REG_EU_AI_ACT_ARTICLE_6_1_MEDICAL_PRODUCT_BOUNDARY_01']
    });
  }
  if (facts.processesDemographicData || facts.processesDisabilityData) {
    items.push({
      value: 'Field-by-field demographic and special-category data review',
      applicabilityStatus: facts.processesDisabilityData ? 'likely_applicable_requires_legal_basis_review' : 'requires_field_level_verification',
      confidence: facts.processesDisabilityData ? 0.78 : 0.64,
      reason: 'Demographic data must not be treated as one undifferentiated special category. Disability information may be special-category or sensitive data; gender, age, region, socioeconomic status, and previous school require separate legal classification and purpose review.',
      supportingFacts: ['processesDemographicData', facts.processesDisabilityData ? 'processesDisabilityData' : null, facts.dataFieldGender ? 'dataFieldGender' : null, facts.dataFieldAge ? 'dataFieldAge' : null, facts.dataFieldRegion ? 'dataFieldRegion' : null, facts.dataFieldSocioeconomic ? 'dataFieldSocioeconomic' : null, facts.dataFieldPreviousSchool ? 'dataFieldPreviousSchool' : null].filter(Boolean),
      missingConditions: ['field-level lawful basis', 'special-category condition if disability or health data is used', 'data minimization evidence'],
      legalReferences: ['GDPR Article 5(1)(c)', 'GDPR Article 9', 'Regulation (EU) 2024/1689 Article 10(5) for high-risk AI bias detection where applicable', 'KVKK Law No. 6698 Article 6'],
      ...evidencePayload(state, ['processesDemographicData', 'processesDisabilityData', 'dataFieldDisability', 'dataFieldGender', 'dataFieldAge', 'dataFieldRegion', 'dataFieldSocioeconomic', 'dataFieldPreviousSchool']),
      ruleIds: ['REG_FIELD_LEVEL_DATA_CLASSIFICATION_01']
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
      legalReferences: ['GDPR Article 22', 'GDPR Article 15(1)(h)', 'GDPR Articles 13(2)(f) and 14(2)(g)', 'KVKK Law No. 6698 Article 11(1)(g)'],
      ...evidencePayload(state, ['producesIndividualRiskScore', 'profilesIndividualCharacteristic', 'humanReviewAvailable', 'humanCanOverride']),
      ruleIds: ['REG_PROFILING_01']
    });
  }
  if (facts.recommendsAdmissionsOutcome || facts.officersUsuallyFollowRecommendation || facts.fullyAutomatedDecision || isRecruitment) {
    items.push({
      value: 'GDPR Article 22 / KVKK automated decision review',
      applicabilityStatus: facts.fullyAutomatedDecision === true
        ? 'possibly_applicable_requires_effects_review'
        : isRecruitment
          ? 'requires_solely_automated_decision_verification'
        : facts.officersUsuallyFollowRecommendation
          ? 'conditional_rubber_stamping_review'
          : 'requires_solely_automated_decision_verification',
      confidence: 0.68,
      reason: isRecruitment
        ? 'Article 22 or KVKK automated-decision restrictions are not automatically triggered merely because AI ranks applicants. They may become relevant if the ranking effectively determines rejection, shortlisting, or hiring without meaningful human review.'
        : 'Article 22 or KVKK automated-decision restrictions are not automatically violated merely because AI supports admissions. They may become applicable if human review is merely formal and the AI recommendation effectively determines an outcome with legal or similarly significant effects.',
      supportingFacts: ['recommendsAdmissionsOutcome', facts.officersUsuallyFollowRecommendation ? 'officersUsuallyFollowRecommendation' : null, isRecruitment ? 'employmentRecruitmentPurpose' : null, facts.ranksJobApplicants ? 'ranksJobApplicants' : null, facts.humanReviewAvailable ? 'humanReviewAvailable' : null].filter(Boolean),
      missingConditions: ['solely automated final decision', 'meaningful independent human review', 'human authority and competence to override', 'legal or similarly significant effects'],
      legalReferences: ['GDPR Article 22', 'GDPR Articles 13(2)(f), 14(2)(g), and 15(1)(h)', 'KVKK Law No. 6698 Article 11(1)(g)'],
      ...evidencePayload(state, ['recommendsAdmissionsOutcome', 'officersUsuallyFollowRecommendation', 'employmentRecruitmentPurpose', 'ranksJobApplicants', 'humanReviewAvailable', 'humanCanOverride', 'fullyAutomatedDecision']),
      ruleIds: ['REG_GDPR_ARTICLE_22_CONDITIONAL_01', 'REG_KVKK_AUTOMATED_DECISION_CONDITIONAL_01']
    });
  }
  if (facts.educationAdmissionsPurpose && (facts.applicantScoring || facts.recommendsAdmissionsOutcome)) {
    items.push({
      value: 'EU AI Act education-access high-risk classification candidate',
      applicabilityStatus: 'requires_verification',
      confidence: 0.74,
      reason: 'The use case may match an Annex III education high-risk category because it evaluates or influences access to educational institutions. Provider and deployer duties must be separated, and applicability timing must be verified against retrieved current legal sources.',
      supportingFacts: ['educationAdmissionsPurpose', facts.applicantScoring ? 'applicantScoring' : null, facts.recommendsAdmissionsOutcome ? 'recommendsAdmissionsOutcome' : null].filter(Boolean),
      missingConditions: ['provider identity', 'deployer identity', 'current retrieved EU AI Act source with version/date', 'whether the system determines or materially influences access'],
      legalReferences: ['Regulation (EU) 2024/1689 Article 6(2)', 'Regulation (EU) 2024/1689 Annex III point 3(a)', 'Regulation (EU) 2024/1689 Articles 9-15 for high-risk requirements', 'Regulation (EU) 2024/1689 Article 26 deployer obligations', 'Regulation (EU) 2024/1689 Article 27 fundamental-rights impact assessment where applicable'],
      ...evidencePayload(state, ['educationAdmissionsPurpose', 'applicantScoring', 'recommendsAdmissionsOutcome']),
      ruleIds: ['REG_EU_AI_ACT_ANNEX_III_EDU_ACCESS_01']
    });
  }
  if (isRecruitment && (facts.ranksJobApplicants || facts.supportsHiringDecision)) {
    items.push({
      value: 'EU AI Act employment recruitment high-risk classification candidate',
      applicabilityStatus: 'requires_verification',
      confidence: 0.72,
      reason: 'Applicant ranking for recruitment may materially influence access to work. The assessment should verify provider/deployer roles, whether the AI output is used for selection or shortlisting, and the current legal applicability date.',
      supportingFacts: ['employmentRecruitmentPurpose', facts.ranksJobApplicants ? 'ranksJobApplicants' : null, facts.supportsHiringDecision ? 'supportsHiringDecision' : null].filter(Boolean),
      missingConditions: ['provider identity', 'deployer identity', 'current retrieved EU AI Act source with version/date', 'whether ranking determines or materially influences shortlisting or hiring'],
      ...evidencePayload(state, ['employmentRecruitmentPurpose', 'ranksJobApplicants', 'supportsHiringDecision']),
      ruleIds: ['REG_EU_AI_ACT_ANNEX_III_EMPLOYMENT_RECRUITMENT_01']
    });
  }
  if (facts.retentionPeriodDefined) {
    items.push({
      value: 'Data-retention necessity and proportionality review',
      applicabilityStatus: 'requires_justification',
      confidence: 0.66,
      reason: 'The defined retention period is not treated as automatically non-compliant. It requires evidence of documented purpose, legal obligation or necessity, proportionality, deletion/anonymization procedure, and retention schedule.',
      supportingFacts: ['retentionPeriodDefined', facts.retentionPeriod ? 'retentionPeriod' : null].filter(Boolean),
      missingConditions: ['documented purpose', 'legal obligation or necessity', 'deletion or anonymization procedure', 'retention schedule'],
      legalReferences: ['GDPR Article 5(1)(e)', 'GDPR Article 17', 'KVKK Law No. 6698 Article 7', 'Personal Data Deletion, Destruction or Anonymization Regulation where Turkish law applies'],
      ...evidencePayload(state, ['retentionPeriodDefined', 'retentionPeriod']),
      ruleIds: ['REG_RETENTION_REVIEW_01']
    });
  }
  if (facts.usesThirdPartyCloudProvider) {
    items.push({
      value: 'Third-party cloud processor and transfer-safeguard review',
      applicabilityStatus: 'requires_verification',
      confidence: 0.64,
      reason: 'Third-party cloud use requires role, processor, security, subcontractor, incident, audit, transfer, and deletion evidence. Localization or missing encryption is not assumed without user evidence.',
      supportingFacts: ['usesThirdPartyCloudProvider'],
      missingConditions: ['controller/processor roles', 'data-processing agreement', 'encryption/access controls', 'audit rights', 'subprocessors', 'international transfer mechanism', 'processor retention/deletion'],
      ...evidencePayload(state, 'usesThirdPartyCloudProvider'),
      ruleIds: ['REG_CLOUD_PROCESSOR_REVIEW_01']
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

  return uniqueByValue(items).slice(0, 10);
}

function buildMissingInformation(state) {
  const facts = state.confirmedFacts || {};
  const isRecruitment = isRecruitmentAssessment(facts);
  const questions = [];
  const processesPersonRelatedData = facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData;

  if ((state.contradictions || []).some(isActionableContradiction)) {
    questions.push('Please clarify the contradictory statement before the assessment is finalized.');
  }
  if ((processesPersonRelatedData || facts.processesHealthRelatedData) && !facts.retentionPeriodDefined) {
    questions.push(facts.employmentContext
      ? isRecruitment
        ? 'What is the retention period for applicant CVs, cover letters, ranking records, and related recruitment data?'
        : 'What is the retention period for employee availability, preference, qualification, and shift assignment records?'
      : facts.educationContext
        ? 'What is the retention period for questionnaire, journal, academic, attendance, and wearable data?'
        : facts.insuranceContext || facts.insuranceClaimsPurpose
          ? 'What is the retention period for claim and claimant records?'
        : 'How long is the processed personal data retained?');
  }
  if ((processesPersonRelatedData || facts.processesHealthRelatedData) && !facts.pseudonymizationUsed) {
    questions.push(facts.employmentContext
      ? isRecruitment
        ? 'Are applicant records minimized, pseudonymized where possible, or otherwise protected from unnecessary identification?'
        : 'Are employee scheduling records minimized, pseudonymized, or otherwise protected from unnecessary identification?'
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
  if (facts.educationAdmissionsPurpose && facts.officersUsuallyFollowRecommendation) {
    questions.push('How do admissions officers independently examine and override recommendations, and how is rubber-stamping prevented?');
  }
  if (facts.educationAdmissionsPurpose && !facts.explanationAvailable) {
    questions.push('What individual explanation is provided for applicant scores and admissions recommendations?');
  }
  if (facts.educationAdmissionsPurpose && !facts.appealMechanismAvailable) {
    questions.push('What appeal, correction, or second-review mechanism is available to applicants?');
  }
  if (isRecruitment && facts.fullyAutomatedDecision !== true && facts.makesHiringDecision !== false && !facts.humanReviewAvailable) {
    questions.push('Does the AI ranking only support HR review, or can it automatically reject or shortlist applicants?');
  }
  if (isRecruitment && facts.humanReviewAvailable && !facts.explanationAvailable && !facts.correctionRightAvailable && !facts.manualReviewAvailable && !facts.appealMechanismAvailable) {
    questions.push('Can applicants receive an explanation, correct inaccurate application data, or request a human review of a ranking?');
  }
  if (!isRecruitment && facts.systemPurpose && isDecisionSupportAssessment(facts) && !facts.humanReviewAvailable && facts.fullyAutomatedDecision !== true && facts.fullyAutomatedDecision !== false) {
    questions.push('Does a person review the AI output and have authority to change or reject it before it affects the outcome?');
  }
  if (!isRecruitment && facts.systemPurpose && isDecisionSupportAssessment(facts) && facts.affectedPersons && !facts.explanationAvailable && !facts.correctionRightAvailable && !facts.manualReviewAvailable && !facts.appealMechanismAvailable) {
    questions.push('Can affected people receive an explanation or request human review if the AI output is wrong?');
  }
  if (facts.usesThirdPartyCloudProvider) {
    questions.push('What processor agreement, encryption, access-control, audit, subcontractor, transfer, incident, and deletion controls exist for the cloud provider?');
  }
  if ((facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) && !facts.challengeMechanismAvailable) {
    questions.push('Can employees challenge a shift assignment or request manual scheduling review?');
  }
  if ((processesPersonRelatedData || facts.processesHealthRelatedData) && !facts.securityMeasuresDocumented) {
    questions.push(facts.employmentContext
      ? isRecruitment
        ? 'Which access controls, audit logs, or security measures protect applicant records and ranking outputs?'
        : 'Which access controls, audit logs, or security measures protect employee scheduling and HR records?'
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
  const isRecruitment = isRecruitmentAssessment(facts);
  const actions = [];
  const affectedGroup = isRecruitment ? 'job applicants' : facts.employmentContext ? 'employees' : facts.insuranceContext || facts.insuranceClaimsPurpose ? 'claimants' : 'affected people';

  if (facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) {
    actions.push('Validate shift allocation fairness across night, weekend, workload, qualification, and availability constraints.');
    actions.push('Keep manager review, modification, and rejection before schedule publication as mandatory controls.');
  }
  if (isRecruitment) {
    actions.push('Validate applicant ranking for bias, data-quality errors, and disparate impact before using it for shortlisting or hiring.');
    actions.push('Document whether the ranking is advisory only or can automatically reject or shortlist applicants.');
    actions.push('Provide applicants with appropriate explanation, correction, and human-review channels for AI-supported rankings.');
  }
  if (facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) {
    actions.push('Document which claim data inputs influence the recommendation and which checks prevent inaccurate claim outcomes.');
    actions.push('Keep claims-officer review and override authority explicit for every recommendation.');
  }
  if (
    facts.systemPurpose &&
    isDecisionSupportAssessment(facts) &&
    !isRecruitment &&
    !facts.workforceSchedulingPurpose &&
    !facts.recommendsMonthlyShiftSchedule &&
    !facts.insuranceClaimsPurpose &&
    !facts.recommendsClaimAssessment &&
    !facts.educationAdmissionsPurpose &&
    !facts.recommendsAdmissionsOutcome &&
    !facts.assignmentEvaluationPurpose &&
    !facts.essayScoringPurpose
  ) {
    actions.push('Document the AI inputs, outputs, intended use, and limits before relying on the result.');
    actions.push('Define whether the AI is advisory only or can directly determine an outcome.');
    actions.push('Keep explanation, correction, and human-review routes available when people are affected.');
  }
  if (facts.educationAdmissionsPurpose || facts.recommendsAdmissionsOutcome) {
    actions.push('Document provider and deployer roles separately before assigning EU AI Act obligations.');
    actions.push('Verify the education-access high-risk classification against a retrieved current EU AI Act source.');
    actions.push('Document how admissions officers independently review, override, and record departures from recommendations.');
    actions.push('Provide applicants with score explanations, correction rights, and an appeal or second-review path.');
  }
  if (facts.historicalBiasEvidence || facts.processesDemographicData || facts.processesDisabilityData) {
    actions.push('Validate admissions scoring for disparate impact across disability, gender, socioeconomic, regional, and previous-school groups.');
    actions.push('Classify each data field separately before treating it as GDPR Article 9 or KVKK special-category data.');
  }
  if (facts.processesPersonalData || facts.processesInsuranceClaimData || facts.processesClaimantData || facts.processesHealthRelatedData) {
    actions.push(facts.employmentContext
      ? isRecruitment
        ? 'Document retention, access control, security, and minimization evidence for each applicant data source.'
        : 'Document retention, access control, security, and minimization evidence for each employee data source.'
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
  if (facts.usesThirdPartyCloudProvider) {
    actions.push('Collect cloud-processor evidence: DPA, access controls, encryption, audit rights, subprocessors, transfer mechanism, incident handling, and deletion guarantees.');
  }

  return Array.from(new Set(actions)).slice(0, 10);
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
        method: 'Project/user-scoped facts are merged with previous confirmed facts; appendable facts are combined and current-turn contradictions are kept for clarification.'
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
  const isRecruitment = isRecruitmentAssessment(facts);
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
  } else if (isRecruitment) {
    summaryParts.push('The AI use is understood as employment recruitment decision support for ranking job applicants.');
  } else if (facts.insuranceContext || facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) {
    summaryParts.push(projectId
      ? 'The selected project is understood as an insurance claim assessment decision-support system.'
      : 'This general ontology chat is understood as an insurance claim assessment decision-support system.');
  } else if (facts.educationAdmissionsPurpose || facts.recommendsAdmissionsOutcome) {
    summaryParts.push('The selected project is understood as a university admissions decision-support system that may influence access to education.');
  } else if (facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) {
    summaryParts.push('The AI use is understood as education assessment support for student work, including scoring or feedback.');
  } else if (facts.educationContext && facts.studentWellbeingPurpose) {
    summaryParts.push('The selected project is understood as an education-context student wellbeing decision-support system.');
  } else if (facts.systemPurpose) {
    summaryParts.push(`The AI use is understood as: ${facts.systemPurpose}.`);
  } else {
    summaryParts.push(projectId
      ? 'The selected project assessment is based on the selected project metadata and confirmed conversation facts.'
      : 'Please describe what the AI system does and who is affected so the ontology assessment can stay grounded in confirmed facts.');
  }
  if (isRecruitment && facts.ranksJobApplicants) {
    summaryParts.push('It ranks applicants from application materials and is not treated as an automated rejection, shortlisting, or hiring system unless that authority is explicitly confirmed.');
  }
  if (facts.recommendsMonthlyShiftSchedule) {
    summaryParts.push('It recommends monthly shift schedules for human review and is not treated as an automated hiring, firing, promotion, salary, or disciplinary decision system.');
  }
  if (facts.recommendsClaimAssessment) {
    summaryParts.push('It produces claim assessment recommendations and is not treated as making final claim approval or rejection decisions unless that authority is confirmed.');
  }
  if (facts.recommendsAdmissionsOutcome) {
    summaryParts.push('It recommends admissions outcomes; confirmed legal non-compliance is not asserted without evidence of solely automated or rubber-stamped final decisions.');
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
  if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && facts.teacherFinalGradeDecision) {
    summaryParts.push('The teacher remains the final decision-maker for grading, so the AI is not treated as determining the final grade by itself.');
  }
  if (isWorkforceScheduling && facts.humanReviewAvailable && (facts.humanCanModify || facts.humanCanReject)) {
    summaryParts.push('Human review, modification, and rejection rights are confirmed safeguards and reduce residual scheduling risk.');
  } else if (isClaimAssessment && facts.humanReviewAvailable && (facts.humanCanModify || facts.humanCanReject) && !facts.humanCanOverride) {
    summaryParts.push('Claims-officer review, change, and rejection rights are confirmed safeguards and reduce automation risk.');
  }
  if (facts.legalBasisDocumented && facts.explicitConsent) {
    summaryParts.push('Legal basis and explicit or informed consent are confirmed and preserved across turns.');
  }

  const report = {
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
    domains: classifications.filter((item) => ['Education', 'StudentWellbeing', 'EducationAdmissionsAccess', 'Healthcare', 'Employment', 'EmploymentRecruitment', 'Manufacturing', 'Insurance'].includes(item.value)),
    systemFunctions: classifications.filter((item) => ['RiskScoring', 'DecisionSupport', 'ClinicalTriageDecisionSupport', 'WorkforceScheduling', 'ShiftRecommendation', 'InsuranceClaimsSupport', 'ClaimAssessmentRecommendation', 'ApplicantScoring', 'AdmissionsRecommendation', 'RecruitmentDecisionSupport', 'ApplicantRanking', 'HumanReviewedAI'].includes(item.value)),
    dataProcessingFunctions: classifications.filter((item) => item.value.endsWith('Processing') || item.value === 'JournalTextProcessing' || item.value === 'AcademicRecordProcessing' || item.value === 'HRDataProcessing' || item.value === 'CandidateApplicationDataProcessing'),
    decisionEffects: facts.recommendsAdmissionsOutcome || facts.educationAdmissionsPurpose
      ? [
          conclusion('AdmissionsRecommendation', 'confirmed', 0.84, 'The system supports admissions decisions through applicant scoring or acceptance, rejection, or waiting-list recommendations.', state, ['educationAdmissionsPurpose', 'applicantScoring', 'recommendsAdmissionsOutcome'], ['RULE_DECISION_EFFECT_ADMISSIONS_01']),
          facts.officersUsuallyFollowRecommendation
            ? conclusion('HumanReviewEffectivenessRequiresVerification', 'requires_verification', 0.72, 'Admissions officers usually follow the recommendation, so meaningful independent human review must be verified.', state, ['officersUsuallyFollowRecommendation', 'humanReviewAvailable'], ['RULE_DECISION_EFFECT_ADMISSIONS_02'])
            : null
        ].filter(Boolean)
      : facts.recommendsCounselorContact
      ? [
          conclusion('CounselorInterventionPrioritization', 'likely', 0.76, 'The system may prioritize students for counselor intervention.', state, ['recommendsCounselorContact', 'producesIndividualRiskScore'], ['RULE_DECISION_EFFECT_01']),
          facts.humanReviewAvailable && facts.humanCanOverride
            ? conclusion('NonBindingRecommendation', 'confirmed', 0.88, 'The human reviewer can override the recommendation.', state, ['humanReviewAvailable', 'humanCanOverride'], ['RULE_DECISION_EFFECT_02'])
            : null
        ].filter(Boolean)
      : isRecruitment
      ? [
          conclusion('ApplicantRanking', 'confirmed', 0.86, 'The system ranks job applicants and may influence hiring or shortlisting review.', state, ['employmentRecruitmentPurpose', 'applicantRankingPurpose', 'ranksJobApplicants'], ['RULE_DECISION_EFFECT_RECRUITMENT_01']),
          facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.makesHiringDecision === false)
            ? conclusion('HumanReviewedAI', 'confirmed', 0.88, 'HR or recruitment staff can review or change the ranking before the final hiring or shortlisting outcome.', state, ['humanReviewAvailable', 'humanCanOverride', 'humanCanModify', 'humanCanReject', 'makesHiringDecision'], ['RULE_DECISION_EFFECT_RECRUITMENT_02'])
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

  return report;
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
  if (facts.educationContext || facts.studentWellbeingPurpose || facts.recommendsCounselorContact || facts.educationAdmissionsPurpose || facts.recommendsAdmissionsOutcome) groups.add('education');
  if (facts.insuranceContext || facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment || facts.processesInsuranceClaimData || facts.processesClaimantData) groups.add('insurance');
  if (facts.employmentContext || facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule || isRecruitmentAssessment(facts)) groups.add('employment');
  if (facts.manufacturingContext) groups.add('employment');
  return groups;
}

function useCaseGroupsForFacts(facts) {
  const groups = new Set();
  if (facts.lessonPlanningPurpose) groups.add('lesson_planning');
  if (facts.assignmentEvaluationPurpose || facts.essayScoringPurpose || facts.evaluatesLearningOutcome || facts.assignsAcademicGrade) groups.add('student_assessment');
  if (facts.educationAdmissionsPurpose || facts.applicantScoring || facts.recommendsAdmissionsOutcome) groups.add('education_admissions');
  if (facts.studentWellbeingPurpose || facts.recommendsCounselorContact) groups.add('student_wellbeing');
  if (facts.insuranceClaimsPurpose || facts.recommendsClaimAssessment) groups.add('insurance_claims');
  if (facts.workforceSchedulingPurpose || facts.recommendsMonthlyShiftSchedule) groups.add('workforce_scheduling');
  if (isRecruitmentAssessment(facts)) groups.add('employment_recruitment');
  return groups;
}

function setsOverlap(left, right) {
  return Array.from(left).some((item) => right.has(item));
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

  const previousUseCases = useCaseGroupsForFacts(previousFacts);
  const incomingUseCases = useCaseGroupsForFacts(incomingFactMap);
  if (!previousName && incomingName && previousUseCases.size && incomingUseCases.size && !setsOverlap(previousUseCases, incomingUseCases)) {
    return {
      reset: true,
      reason: 'incoming_named_system_differs_from_previous_use_case',
      incomingSystemName: incomingFactMap.systemName,
      previousUseCases: Array.from(previousUseCases),
      incomingUseCases: Array.from(incomingUseCases)
    };
  }

  const previousDomains = domainGroupsForFacts(previousFacts);
  const incomingDomains = domainGroupsForFacts(incomingFactMap);
  if (previousDomains.size && incomingDomains.size) {
    if (!setsOverlap(incomingDomains, previousDomains)) {
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

function firstNonEmpty(...values) {
  return values.find((value) => normalizeWhitespace(value));
}

function factEvidenceSummary(state, keys) {
  return factEvidenceFor(state, keys)
    .map((item) => ({
      fact: item.fact,
      value: item.value,
      source: item.source,
      evidence: item.sourceText
    }))
    .filter((item) => item.evidence || item.value !== undefined);
}

function booleanStatus(value) {
  if (value === true) return 'provided';
  if (value === false) return 'provided_negative';
  return 'unknown';
}

function isTeacherRole(value) {
  return /\bteacher\b/i.test(String(value || ''));
}

function isRecruitmentAssessment(facts) {
  return Boolean(
    facts.employmentRecruitmentPurpose ||
    facts.applicantRankingPurpose ||
    facts.ranksJobApplicants ||
    facts.supportsHiringDecision ||
    facts.processesApplicantCVs ||
    facts.processesCoverLetters ||
    facts.jobApplicantsAffected
  );
}

function buildConversationStateSnapshot(state, ontologyResult) {
  const facts = state.confirmedFacts || {};
  const system = ontologyResult?.systemUnderstanding || {};
  const hasEducation = Boolean(facts.educationContext || facts.assignmentEvaluationPurpose || facts.lessonPlanningPurpose || facts.essayScoringPurpose);
  const hasRecruitment = isRecruitmentAssessment(facts);
  const hasSensitiveData = Boolean(facts.processesHealthData || facts.processesHealthRelatedData || facts.processesBiometricData || facts.processesDisabilityData);
  const hasFeedbackGeneration = /feedback/i.test(String(facts.systemPurpose || '')) ||
    (system.outputs || []).some((item) => /feedback/i.test(String(item)));
  const hasEssayScoring = Boolean(facts.essayScoringPurpose || /essay/i.test(String(facts.systemPurpose || '')));
  const outputText = (() => {
    if (hasRecruitment && (facts.ranksJobApplicants || facts.applicantRankingPurpose)) return 'applicant ranking or suitability score';
    if (hasEssayScoring && hasFeedbackGeneration) return 'score and feedback';
    if (hasEssayScoring) return 'score';
    if (hasFeedbackGeneration) return 'feedback';
    return (system.outputs || [])[0] || null;
  })();
  const decisionImpact = facts.teacherFinalGradeDecision
    ? 'Teacher decides the final grade'
    : facts.assignsAcademicGrade === true || facts.fullyAutomatedDecision === true
      ? 'AI may directly determine or affect the final grade'
      : (facts.assignmentEvaluationPurpose || facts.essayScoringPurpose)
        ? null
        : hasRecruitment
          ? facts.fullyAutomatedDecision === true || facts.makesHiringDecision === true
            ? 'AI may automatically reject, shortlist, or determine a hiring outcome'
            : facts.makesHiringDecision === false || facts.fullyAutomatedDecision === false
              ? 'HR or recruitment staff decide the hiring or shortlisting outcome'
              : 'Applicant ranking may influence hiring or shortlisting'
          : firstNonEmpty((system.decisionsSupported || [])[0], facts.decisionsSupported) || null;

  const knownSafeguards = [];
  if (facts.teacherFinalGradeDecision || facts.humanReviewAvailable) knownSafeguards.push('Human review');
  if (facts.humanCanOverride) knownSafeguards.push('Human can override or change the AI output');
  if (facts.feedbackSuggestionOnly) knownSafeguards.push('AI output is advisory feedback only');
  if (facts.explanationAvailable) knownSafeguards.push('Explanation available');
  if (facts.correctionRightAvailable || facts.manualReviewAvailable) knownSafeguards.push('Correction or review request available');
  if (facts.accessRestricted || facts.authorizedStaffOnly || facts.authorizedHRAndManagersOnly) knownSafeguards.push('Access restriction');

  const unknownFields = [];
  if (!facts.systemPurpose && !facts.lessonPlanningPurpose && !facts.assignmentEvaluationPurpose && !facts.essayScoringPurpose && !facts.recommendsAdmissionsOutcome && !facts.recommendsClaimAssessment && !facts.recommendsMonthlyShiftSchedule && !hasRecruitment) {
    unknownFields.push('ai_purpose');
  }
  if (hasRecruitment && facts.fullyAutomatedDecision !== true && facts.makesHiringDecision !== false && !facts.humanReviewAvailable) {
    unknownFields.push('automation_boundary');
  }
  if (hasRecruitment && facts.explanationAvailable === undefined) unknownFields.push('explanation_available');
  if (hasRecruitment && !facts.correctionRightAvailable && !facts.manualReviewAvailable && facts.appealMechanismAvailable === undefined) {
    unknownFields.push('applicant_review_or_correction_available');
  }
  if ((facts.assignmentEvaluationPurpose || facts.essayScoringPurpose) && !decisionImpact) unknownFields.push('decision_impact');
  if ((facts.assignmentEvaluationPurpose || facts.essayScoringPurpose || facts.lessonPlanningPurpose) && facts.processesPersonalData !== true && facts.studentNamesUsed === undefined) {
    unknownFields.push('personal_data');
  }
  if ((facts.assignmentEvaluationPurpose || facts.essayScoringPurpose) && facts.explanationAvailable === undefined) unknownFields.push('explanation_available');
  if ((facts.assignmentEvaluationPurpose || facts.essayScoringPurpose) && !facts.correctionRightAvailable && !facts.manualReviewAvailable && facts.appealMechanismAvailable === undefined) {
    unknownFields.push('correction_or_review_available');
  }

  return {
    user_role: facts.userRole || null,
    domain: hasEducation ? 'education' : facts.insuranceContext ? 'insurance' : facts.employmentContext || hasRecruitment ? 'employment' : null,
    ai_system_name: facts.systemName || null,
    ai_purpose: firstNonEmpty(system.purpose, facts.systemPurpose) || null,
    ai_secondary_purpose: hasFeedbackGeneration ? 'feedback generation' : null,
    input_data: system.inputs || [],
    output: outputText,
    ai_output: outputText,
    affected_stakeholders: system.affectedPersons || [],
    decision_impact: decisionImpact,
    human_oversight: facts.teacherFinalGradeDecision || facts.humanReviewAvailable ? 'provided' : 'unknown',
    human_review: facts.humanReviewAvailable ? 'present' : 'unknown',
    override_authority: facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject ? 'present' : 'unknown',
    final_decision_maker: facts.teacherFinalGradeDecision ? 'teacher' : facts.assignsAcademicGrade === true || facts.makesHiringDecision === true ? 'AI system' : facts.makesHiringDecision === false ? 'human reviewer' : 'unknown',
    final_grade_automated: facts.assignsAcademicGrade === false || facts.fullyAutomatedDecision === false || facts.teacherFinalGradeDecision ? false : facts.assignsAcademicGrade === true ? true : null,
    personal_data: facts.processesPersonalData === true ? 'provided' : 'unknown',
    sensitive_data: hasSensitiveData ? 'provided' : 'unknown',
    explanation_available: booleanStatus(facts.explanationAvailable),
    appeal_available: facts.correctionRightAvailable || facts.manualReviewAvailable || facts.appealMechanismAvailable ? 'provided' : facts.appealMechanismAvailable === false ? 'provided_negative' : 'unknown',
    known_safeguards: Array.from(new Set(knownSafeguards)),
    known_risks: (ontologyResult?.primaryRisks || []).map((item) => item.value).filter(Boolean).slice(0, 4),
    unknown_fields: unknownFields
  };
}

function hasEnoughEducationAssessmentContext(facts) {
  const knowsPurpose = Boolean(facts.systemPurpose || facts.assignmentEvaluationPurpose || facts.essayScoringPurpose);
  const knowsAffectedPeople = Boolean(facts.affectedPersons || facts.educationContext);
  const knowsOutput = Boolean(facts.systemOutputs || facts.essayScoringPurpose || facts.feedbackSuggestionOnly);
  const knowsHumanBoundary = Boolean(facts.teacherFinalGradeDecision || facts.assignsAcademicGrade === true || facts.assignsAcademicGrade === false || facts.fullyAutomatedDecision === false);
  const knowsControl = Boolean(facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.teacherFinalGradeDecision));
  const knowsAtLeastOneAccountabilityDetail = Boolean(
    facts.explanationAvailable !== undefined ||
    facts.correctionRightAvailable ||
    facts.manualReviewAvailable ||
    facts.appealMechanismAvailable !== undefined ||
    facts.studentNamesUsed !== undefined ||
    facts.studentNamesUseUnknown ||
    facts.historicalBiasEvidence
  );

  return knowsPurpose && knowsAffectedPeople && knowsOutput && knowsHumanBoundary && knowsControl && knowsAtLeastOneAccountabilityDetail;
}

function hasEnoughRecruitmentAssessmentContext(facts) {
  const knowsPurpose = Boolean(facts.systemPurpose || facts.employmentRecruitmentPurpose || facts.applicantRankingPurpose || facts.ranksJobApplicants);
  const knowsAffectedPeople = Boolean(facts.affectedPersons || facts.jobApplicantsAffected);
  const knowsOutput = Boolean(facts.systemOutputs || facts.ranksJobApplicants || facts.applicantRankingPurpose);
  const knowsHumanBoundary = Boolean(
    facts.humanReviewAvailable ||
    facts.fullyAutomatedDecision === true ||
    facts.fullyAutomatedDecision === false ||
    facts.makesHiringDecision === true ||
    facts.makesHiringDecision === false
  );
  const knowsControl = Boolean(
    facts.humanReviewAvailable &&
    (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.makesHiringDecision === false)
  );
  const knowsAtLeastOneAccountabilityDetail = Boolean(
    facts.explanationAvailable !== undefined ||
    facts.correctionRightAvailable ||
    facts.manualReviewAvailable ||
    facts.appealMechanismAvailable !== undefined ||
    facts.challengeMechanismAvailable ||
    facts.processesPersonalData === true ||
    facts.retentionPeriodDefined ||
    facts.securityMeasuresDocumented ||
    facts.historicalBiasEvidence
  );

  return knowsPurpose && knowsAffectedPeople && knowsOutput && knowsHumanBoundary && (knowsControl || facts.fullyAutomatedDecision === true || facts.makesHiringDecision === true) && knowsAtLeastOneAccountabilityDetail;
}

function isDecisionSupportAssessment(facts) {
  const purposeText = [facts.systemPurpose, facts.systemOutputs, facts.decisionsSupported].filter(Boolean).join(' ');
  return Boolean(
    facts.producesIndividualRiskScore ||
    facts.profilesIndividualCharacteristic ||
    facts.fullyAutomatedDecision === true ||
    facts.decisionsSupported ||
    genericPurposeLooksDecisionRelevant(purposeText)
  );
}

function hasEnoughGenericAssessmentContext(facts) {
  if (!facts.systemPurpose) return false;
  const decisionRelevant = isDecisionSupportAssessment(facts);
  const knowsOutput = Boolean(facts.systemOutputs || facts.decisionsSupported);
  const knowsAffectedOrInputs = Boolean(facts.affectedPersons || facts.systemInputs || facts.processesPersonalData !== undefined);
  const knowsDecisionBoundary = !decisionRelevant || Boolean(
    facts.humanReviewAvailable ||
    facts.fullyAutomatedDecision === true ||
    facts.fullyAutomatedDecision === false
  );
  const knowsAtLeastOneAccountabilityDetail = Boolean(
    facts.explanationAvailable !== undefined ||
    facts.correctionRightAvailable ||
    facts.manualReviewAvailable ||
    facts.appealMechanismAvailable !== undefined ||
    facts.challengeMechanismAvailable ||
    facts.processesPersonalData !== undefined ||
    facts.retentionPeriodDefined ||
    facts.securityMeasuresDocumented ||
    facts.historicalBiasEvidence
  );

  return knowsOutput && knowsAffectedOrInputs && knowsDecisionBoundary && knowsAtLeastOneAccountabilityDetail;
}

function hasMinimumOutputContext(facts) {
  const isRecruitment = isRecruitmentAssessment(facts);
  const knowsPurpose = Boolean(
    facts.systemPurpose ||
    facts.lessonPlanningPurpose ||
    facts.assignmentEvaluationPurpose ||
    facts.essayScoringPurpose ||
    facts.recommendsAdmissionsOutcome ||
    facts.recommendsClaimAssessment ||
    facts.recommendsMonthlyShiftSchedule ||
    facts.studentWellbeingPurpose ||
    isRecruitment
  );
  const knowsAffectedOrInputs = Boolean(
    facts.affectedPersons ||
    facts.primaryUsers ||
    facts.systemInputs ||
    facts.educationContext ||
    facts.employmentContext ||
    facts.insuranceContext ||
    facts.deploymentContext
  );
  const knowsOutputOrFunction = Boolean(
    facts.systemOutputs ||
    facts.decisionsSupported ||
    facts.lessonPlanningPurpose ||
    facts.assignmentEvaluationPurpose ||
    facts.essayScoringPurpose ||
    facts.recommendsAdmissionsOutcome ||
    facts.recommendsClaimAssessment ||
    facts.recommendsMonthlyShiftSchedule ||
    facts.studentWellbeingPurpose ||
    facts.systemPurpose
  );
  const requiresDecisionBoundary = Boolean(
    isRecruitment ||
    facts.assignmentEvaluationPurpose ||
    facts.essayScoringPurpose ||
    isDecisionSupportAssessment(facts)
  );
  const knowsDecisionBoundary = !requiresDecisionBoundary || Boolean(
    facts.teacherFinalGradeDecision ||
    facts.assignsAcademicGrade === true ||
    facts.assignsAcademicGrade === false ||
    facts.humanReviewAvailable ||
    facts.fullyAutomatedDecision === true ||
    facts.fullyAutomatedDecision === false ||
    facts.makesHiringDecision === true ||
    facts.makesHiringDecision === false
  );

  return knowsPurpose && knowsAffectedOrInputs && knowsOutputOrFunction && knowsDecisionBoundary;
}

function selectClarificationQuestion(facts, snapshot) {
  const isRecruitment = isRecruitmentAssessment(facts);
  const isGenericDecisionSupport = isDecisionSupportAssessment(facts);
  const knowsPurpose = Boolean(
    facts.systemPurpose ||
    facts.lessonPlanningPurpose ||
    facts.assignmentEvaluationPurpose ||
    facts.essayScoringPurpose ||
    facts.recommendsAdmissionsOutcome ||
    facts.recommendsClaimAssessment ||
    facts.recommendsMonthlyShiftSchedule ||
    isRecruitment ||
    facts.studentWellbeingPurpose
  );

  if (!knowsPurpose) {
    return 'What do you use the AI for - for example, preparing lesson materials, evaluating assignments, or communicating with students?';
  }

  if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && !facts.teacherFinalGradeDecision && facts.assignsAcademicGrade !== true) {
    return 'Does the AI score directly determine the final grade, or do you review it and decide yourself?';
  }

  if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && hasEnoughEducationAssessmentContext(facts)) {
    return null;
  }

  if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && facts.teacherFinalGradeDecision && facts.explanationAvailable === undefined && !facts.correctionRightAvailable && !facts.manualReviewAvailable && facts.appealMechanismAvailable === undefined) {
    return 'Can students ask for an explanation or request that you review a score if they think an AI-assisted assessment is wrong?';
  }

  if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && facts.teacherFinalGradeDecision && facts.explanationAvailable === undefined) {
    return 'Do students receive any explanation of how the AI-assisted score or feedback was produced?';
  }

  if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && facts.teacherFinalGradeDecision && !facts.correctionRightAvailable && !facts.manualReviewAvailable && facts.appealMechanismAvailable === undefined) {
    return 'Can students ask for a correction or human review if they think an AI-assisted result is wrong?';
  }

  if ((facts.lessonPlanningPurpose || facts.assignmentEvaluationPurpose || facts.essayScoringPurpose) && snapshot.personal_data === 'unknown' && !facts.studentNamesUseUnknown) {
    return 'Do you enter student names, grades, or other personal information into the tool?';
  }

  if (isRecruitment && hasEnoughRecruitmentAssessmentContext(facts)) {
    return null;
  }

  if (isRecruitment && facts.fullyAutomatedDecision !== true && facts.makesHiringDecision !== false && !facts.humanReviewAvailable) {
    return 'Does the AI ranking only support HR review, or can it automatically reject or shortlist applicants?';
  }

  if (isRecruitment && facts.humanReviewAvailable && facts.explanationAvailable === undefined && !facts.correctionRightAvailable && !facts.manualReviewAvailable && facts.appealMechanismAvailable === undefined) {
    return 'Can applicants receive an explanation, correct inaccurate application data, or request a human review of a ranking?';
  }

  if (isRecruitment && facts.processesPersonalData === true && !facts.retentionPeriodDefined) {
    return 'How long are applicant CVs, cover letters, ranking records, and related recruitment data retained?';
  }

  if (isRecruitment && facts.processesPersonalData === true && !facts.securityMeasuresDocumented) {
    return 'Which access controls, audit logs, or security measures protect applicant records and ranking outputs?';
  }

  if (!isRecruitment && facts.systemPurpose && hasEnoughGenericAssessmentContext(facts)) {
    return null;
  }

  if (!isRecruitment && facts.systemPurpose && isGenericDecisionSupport && !facts.humanReviewAvailable && facts.fullyAutomatedDecision !== true && facts.fullyAutomatedDecision !== false) {
    return 'Does the AI output directly decide an outcome, or does a person review it and have authority to change or reject it?';
  }

  if (!isRecruitment && facts.systemPurpose && !facts.affectedPersons && !facts.systemInputs) {
    return 'Who or what is affected by the AI output, and what information does the system use?';
  }

  if (!isRecruitment && facts.systemPurpose && facts.processesPersonalData !== true && snapshot.personal_data === 'unknown') {
    return 'Does the system use personal data, such as names, records, profiles, or behavior history?';
  }

  if (!isRecruitment && facts.systemPurpose && isGenericDecisionSupport && facts.humanReviewAvailable && facts.explanationAvailable === undefined && !facts.correctionRightAvailable && !facts.manualReviewAvailable && facts.appealMechanismAvailable === undefined) {
    return 'Can affected people receive an explanation or request human review if the AI output is wrong?';
  }

  return null;
}

function ontologyItemLabels(items, limit = 4) {
  return (items || [])
    .map((item) => item?.label || item?.value || item?.name || item)
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.toLowerCase() === item.toLowerCase()) === index)
    .slice(0, limit);
}

function ontologySafeguardLabels(safeguards, limit = 4) {
  return ontologyItemLabels(safeguards?.confirmed || safeguards || [], limit);
}

function ontologyLegalReferenceLabels(regulatoryConsiderations, limit = 8) {
  return Array.from(new Set((regulatoryConsiderations || []).flatMap((item) => item?.legalReferences || [])))
    .map((item) => normalizeWhitespace(item))
    .filter(Boolean)
    .sort((a, b) => {
      const rank = (value) => {
        if (/Regulation \(EU\) 2024\/1689/i.test(value)) return 0;
        if (/Regulation \(EU\) 2017\/745|Regulation \(EU\) 2017\/746/i.test(value)) return 1;
        if (/GDPR/i.test(value)) return 2;
        if (/KVKK/i.test(value)) return 3;
        return 4;
      };
      return rank(a) - rank(b);
    })
    .slice(0, limit);
}

function formatOntologyFinalOutput({ facts, snapshot, ontologyResult }) {
  if (!ontologyResult) return '';

  const mappedConcepts = ontologyItemLabels(ontologyResult.classifications, 5);
  const risks = ontologyItemLabels(ontologyResult.primaryRisks, 4);
  const safeguards = ontologySafeguardLabels(ontologyResult.safeguards, 4);
  const nextActions = ontologyItemLabels(ontologyResult.recommendedActions || ontologyResult.missingInformation, 3);
  const legalReferences = ontologyLegalReferenceLabels(ontologyResult.regulatoryConsiderations, 5);
  const boundary = facts.fullyAutomatedDecision === true
    ? 'Fully automated decision: true for the described AI-decided outcomes.'
    : facts.fullyAutomatedDecision === false
      ? 'Fully automated decision: false for binding or official outcomes; no consequential AI-decided outcome is established from the current facts.'
      : snapshot.decision_impact
        ? `Decision effect: ${snapshot.decision_impact}.`
        : '';

  const lines = ['Ontology output:'];
  if (mappedConcepts.length) lines.push(`- Mapped concepts: ${mappedConcepts.join(', ')}.`);
  if (boundary) lines.push(`- Decision boundary: ${boundary}`);
  if (risks.length) lines.push(`- Main risks: ${risks.join('; ')}.`);
  if (legalReferences.length) lines.push(`- Legal references: ${legalReferences.join('; ')}.`);
  if (safeguards.length) lines.push(`- Confirmed safeguards: ${safeguards.join(', ')}.`);
  if (nextActions.length) lines.push(`- Next checks: ${nextActions.join('; ')}.`);

  return lines.length > 1 ? lines.join('\n') : '';
}

function buildGroundedConversationResponse({ state, ontologyResult, hasFacts, hasContradictions }) {
  const facts = state.confirmedFacts || {};
  const snapshot = buildConversationStateSnapshot(state, ontologyResult);
  const hasMinimumContext = hasMinimumOutputContext(facts);
  const userIsTeacher = isTeacherRole(facts.userRole);
  const isRecruitment = isRecruitmentAssessment(facts);
  const actionableContradictions = (state.contradictions || []).filter(isActionableContradiction);
  const actionableContradiction = actionableContradictions.find((item) => item.normalizedField === FINAL_GRADE_FIELD) ||
    actionableContradictions[0];
  const contradictionQuestion = actionableContradiction ? formatContradictionQuestion(actionableContradiction) : null;
  const followUpQuestion = null;
  const usedFactKeys = Object.keys(facts);
  let answer = '';

  if (hasContradictions && contradictionQuestion) {
    answer = contradictionQuestion;
  } else if (!hasFacts) {
    answer = 'Tell me briefly what the AI system does and who uses it. I can then map it to the relevant ontology concepts and ask only for details that materially affect the answer.';
  } else if (userIsTeacher && !facts.systemPurpose && !facts.lessonPlanningPurpose && !facts.assignmentEvaluationPurpose && !facts.essayScoringPurpose) {
    answer = 'I understand that you are a teacher using AI in an education context. I do not yet know what the AI does in your workflow, so I should not infer risks or safeguards beyond that.';
  } else if (facts.studentNamesUseUnknown) {
    answer = 'Understood. I will keep student-name and personal-data use as unknown. I cannot say names are used, and I also cannot say they are not used, from the information available so far.';
  } else if (facts.lessonPlanningPurpose && !facts.assignmentEvaluationPurpose && !facts.essayScoringPurpose) {
    answer = 'Using AI to draft lesson plans or learning materials is usually lower impact than using it to grade students or decide outcomes. The practical checks are accuracy, age suitability, curriculum fit, and whether you put any student information into the tool.';
  } else if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && !facts.teacherFinalGradeDecision && facts.assignsAcademicGrade !== true) {
    answer = 'Using AI to score or evaluate student work is an educational assessment use case. The key issue is not just that AI is involved, but whether its score affects a student outcome and whether a teacher meaningfully reviews it.';
  } else if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && facts.teacherFinalGradeDecision && (facts.correctionRightAvailable || facts.manualReviewAvailable)) {
    answer = 'Based on what you have described so far, the AI is advisory: it helps with student work, you decide the final grade, and students can ask you to review an incorrect score. Those are useful safeguards. The remaining practical concerns are consistency, bias across student groups, and making sure you can explain or correct a result when needed.';
  } else if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && facts.teacherFinalGradeDecision && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject)) {
    answer = 'Your review and ability to change or reject the AI recommendation are important safeguards, because the AI does not determine the final grade by itself. The remaining concerns include whether the scores are accurate and fair and whether students can challenge an incorrect assessment.';
  } else if ((facts.essayScoringPurpose || facts.assignmentEvaluationPurpose) && facts.teacherFinalGradeDecision) {
    answer = 'Your review and authority to decide the final grade are important safeguards. The remaining concerns are whether the AI is accurate, whether it disadvantages particular students, and whether students can understand or challenge an incorrect result.';
  } else if (isRecruitment && facts.humanReviewAvailable && (facts.humanCanOverride || facts.humanCanModify || facts.humanCanReject || facts.makesHiringDecision === false)) {
    answer = 'This is an employment recruitment decision-support use case: the AI ranks job applicants from application materials, while human review or final HR authority reduces the risk that the ranking decides the outcome by itself. The remaining concerns are bias in ranking, errors in CV or cover-letter interpretation, transparency for applicants, and whether incorrect rankings can be challenged.';
  } else if (isRecruitment) {
    const inputSummary = (snapshot.input_data || []).length
      ? (snapshot.input_data || []).join(', ')
      : 'application materials';
    answer = `This is an employment recruitment use case: the AI ranks job applicants using ${inputSummary}. That can affect access to work, so the main issues are bias, accuracy of applicant-data interpretation, privacy, transparency, and over-reliance on the ranking.`;
  } else if (facts.systemPurpose) {
    const purposeSummary = readableFactSummary(facts.systemPurpose) || String(facts.systemPurpose);
    const concerns = ['accuracy of the AI output'];
    if (facts.affectedPersons || facts.processesPersonalData || facts.profilesIndividualCharacteristic || facts.producesIndividualRiskScore) {
      concerns.push('fairness or bias for affected people');
    }
    if (facts.processesPersonalData) {
      concerns.push('privacy and data minimization');
    }
    if (isDecisionSupportAssessment(facts)) {
      concerns.push(facts.humanReviewAvailable ? 'quality of human review' : 'whether the AI directly decides an outcome');
      concerns.push('explanation or review when the output is wrong');
    }
    const affected = (snapshot.affected_stakeholders || []).length
      ? ` The affected group appears to be ${(snapshot.affected_stakeholders || []).join(', ')}.`
      : '';
    const inputs = (snapshot.input_data || []).length
      ? ` It uses ${(snapshot.input_data || []).join(', ')}.`
      : '';
    answer = `I understand the AI use as: ${purposeSummary}.${inputs}${affected} The main issues to assess are ${Array.from(new Set(concerns)).join(', ')}.`;
  } else if (ontologyResult?.executiveSummary) {
    const firstRisk = (ontologyResult.primaryRisks || [])[0];
    answer = `${ontologyResult.executiveSummary} ${firstRisk?.value ? `The main point to watch is ${String(firstRisk.value).toLowerCase()}.` : ''}`.trim();
  } else {
    answer = 'Based on what you have described so far, I can keep building the assessment incrementally. I will avoid assuming missing facts and will ask only for details that change the answer.';
  }

  const ontologyFinalOutput = !hasContradictions && hasMinimumContext && hasFacts
    ? formatOntologyFinalOutput({ facts, snapshot, ontologyResult })
    : '';

  const answerWithFinalOutput = ontologyFinalOutput && !answer.includes('Ontology output:')
    ? `${answer}\n\n${ontologyFinalOutput}`
    : answer;

  const finalAnswer = followUpQuestion && !answerWithFinalOutput.includes(followUpQuestion)
    ? `${answerWithFinalOutput}\n\n${followUpQuestion}`
    : answerWithFinalOutput;

  return {
    answer: finalAnswer,
    follow_up_question: followUpQuestion,
    conversation_state: snapshot,
    used_facts: factEvidenceSummary(state, usedFactKeys),
    ontology_inferences: (ontologyResult?.classifications || []).map((item) => ({
      class: item.value,
      status: item.status,
      evidence: item.evidence || []
    })).slice(0, 8),
    unknown_but_relevant: snapshot.unknown_fields,
    unsupported_claims_removed: []
  };
}

function assessOntologyChat({ project, messages = [], previousState = {}, newMessage = '', messageIndex = null, llmFacts = [], geminiExtraction = null, chatId = null }) {
  const sanitizedPreviousStateBase = sanitizeConversationFactState(previousState);
  const projectText = getProjectText(project);
  const projectFacts = extractFactsFromText(projectText, 'PROJECT_METADATA', null);
  const userMessages = messages
    .filter((message) => message.sender === 'user')
    .map((message, index) => ({
      sender: message.sender,
      text: String(message.text || ''),
      _id: message._id || message.id || null,
      userMessageIndex: index,
      sourceMessageId: String(message._id || message.id || `user-message-${index + 1}`)
    }));
  const baseUserFacts = newMessage
    ? extractFactsFromText(newMessage, 'USER_CONFIRMED', messageIndex, `incoming-message-${messageIndex ?? userMessages.length + 1}`)
    : userMessages.flatMap((message) => extractFactsFromText(message.text, 'USER_CONFIRMED', message.userMessageIndex, message.sourceMessageId));
  const latestUserMessage = newMessage
    ? { text: newMessage, index: messageIndex ?? userMessages.length, sourceMessageId: `incoming-message-${messageIndex ?? userMessages.length + 1}` }
    : userMessages.length
      ? { text: userMessages[userMessages.length - 1].text, index: userMessages[userMessages.length - 1].userMessageIndex, sourceMessageId: userMessages[userMessages.length - 1].sourceMessageId }
      : null;
  const baseLatestMessageFacts = latestUserMessage
    ? extractFactsFromText(latestUserMessage.text, 'USER_CONFIRMED', latestUserMessage.index, latestUserMessage.sourceMessageId)
    : [];
  const contextualLatestFacts = extractContextualFactsFromLatestAnswer({
    messages,
    latestUserMessage,
    previousState: sanitizedPreviousStateBase
  });
  const contextualResolutions = contextualResolutionCandidates(contextualLatestFacts);
  const sanitizedPreviousState = applyContextualResolutionsToState(sanitizedPreviousStateBase, contextualResolutions);
  const userFacts = filterFactsForContextualResolutions([...baseUserFacts, ...contextualLatestFacts], contextualResolutions);
  const latestMessageFacts = filterFactsForContextualResolutions([...baseLatestMessageFacts, ...contextualLatestFacts], contextualResolutions);

  const llmFactCandidates = Array.isArray(llmFacts) ? llmFacts.filter((fact) => fact && fact.fact && fact.source === 'LLM_EXTRACTED') : [];
  const validLlmFacts = filterFactsForContextualResolutions(llmFactCandidates.filter(llmFactSupportedByExplicitEvidence), contextualResolutions);
  const unsupportedLlmFacts = llmFactCandidates.filter((fact) => !llmFactSupportedByExplicitEvidence(fact));
  const latestLlmFacts = latestUserMessage
    ? validLlmFacts.filter((fact) => Number(fact.messageIndex) === latestUserMessage.index)
    : [];
  const factsForReset = latestMessageFacts.length || latestLlmFacts.length
    ? [...latestMessageFacts, ...latestLlmFacts]
    : [...userFacts, ...validLlmFacts];
  const resetInfo = getPreviousStateResetInfo(sanitizedPreviousState, factsForReset);
  const mergeBaseState = resetInfo.reset ? {} : sanitizedPreviousState;
  const userFactsForMerge = resetInfo.reset ? latestMessageFacts : userFacts;
  const llmFactsForMerge = resetInfo.reset ? latestLlmFacts : validLlmFacts;
  const state = mergeConversationFacts(mergeBaseState, [...projectFacts, ...userFactsForMerge, ...llmFactsForMerge], { chatId });
  const stateMergeStats = {
    chatId,
    projectId: getProjectId(project) || null,
    projectAttached: Boolean(getProjectId(project)),
    priorUserMessagesLoaded: Math.max(0, userMessages.length - (latestUserMessage ? 1 : 0)),
    priorMessagesLoaded: Math.max(0, messages.length - (latestUserMessage ? 1 : 0)),
    existingFactsLoaded: Object.keys(sanitizedPreviousState?.confirmedFacts || {}).length,
    previousFactsSanitizedDropped: sanitizedPreviousState.sanitizedDroppedFactCount || 0,
    previousEvidenceSanitizedDropped: sanitizedPreviousState.sanitizedDroppedEvidenceCount || 0,
    newFactsExtracted: latestMessageFacts.length,
    contextualFactsExtracted: contextualLatestFacts.length,
    contextualResolutionsApplied: sanitizedPreviousState.contextualResolutionsApplied || 0,
    llmFactsAccepted: validLlmFacts.length,
    llmFactsDroppedByEvidenceGuard: unsupportedLlmFacts.length,
    llmFactsRejected: geminiExtraction?.rejectedFacts?.length || 0,
    llmExtractionStatus: geminiExtraction?.status || 'not_run',
    semanticCandidatesAccepted: geminiExtraction?.acceptedSemanticCandidates?.length || 0,
    semanticCandidatesRejected: geminiExtraction?.rejectedSemanticCandidates?.length || 0,
    previousStateReset: resetInfo.reset,
    previousStateResetReason: resetInfo.reason,
    resetMergedLatestMessageOnly: Boolean(resetInfo.reset),
    totalExtractedFactsThisRun: projectFacts.length + userFactsForMerge.length + llmFactsForMerge.length,
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
  const hasContradictions = (state.contradictions || []).some(isActionableContradiction);
  const hasMinimumContext = hasMinimumOutputContext(state.confirmedFacts || {});
  const status = hasContradictions || !hasFacts || !hasMinimumContext ? 'needs_more_information' : 'completed';
  const conversationalResponse = buildGroundedConversationResponse({
    state,
    ontologyResult,
    hasFacts,
    hasContradictions
  });
  ontologyResult.conversationState = conversationalResponse.conversation_state;
  ontologyResult.conversationalGrounding = {
    usedFacts: conversationalResponse.used_facts,
    ontologyInferences: conversationalResponse.ontology_inferences,
    unknownButRelevant: conversationalResponse.unknown_but_relevant,
    unsupportedClaimsRemoved: conversationalResponse.unsupported_claims_removed
  };

  return {
    status,
    reply: conversationalResponse.answer,
    state,
    ontologyResult,
    raw: {
      assessmentVersion: ASSESSMENT_VERSION,
      projectId: getProjectId(project),
      factCount: Object.keys(state.confirmedFacts || {}).length,
      stateMergeStats,
      geminiExtraction,
      unsupportedLlmFacts,
      contradictionDebug: state.contradictionDebug || null,
      stateLifecycle: {
        chat_id: chatId,
        loaded_previous_state: {
          confirmedFacts: sanitizedPreviousState?.confirmedFacts || {},
          factEvidenceCount: (sanitizedPreviousState?.factEvidence || []).length,
          contradictions: sanitizedPreviousState?.contradictions || [],
          sanitizedDroppedFactCount: sanitizedPreviousState.sanitizedDroppedFactCount || 0,
          sanitizedDroppedEvidenceCount: sanitizedPreviousState.sanitizedDroppedEvidenceCount || 0
        },
        latest_extracted_facts: factsForLifecycleLog([...latestMessageFacts, ...latestLlmFacts]),
        merged_state: state.confirmedFacts || {},
        pending_question: contextualLatestFacts[0]?.pendingQuestion || null,
        selected_next_question: conversationalResponse.follow_up_question || null,
        state_storage_key: chatId ? `ontology-chat:${chatId}` : null,
        state_save_result: null
      },
      keywordCandidates,
      conversationalResponse,
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
