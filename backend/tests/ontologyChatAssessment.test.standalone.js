const assert = require('assert');
const {
  assessOntologyChat
} = require('../services/ontologyChatAssessmentService');

const forbiddenTerms = [
  'HTC Vive',
  'Plux OpenBAN',
  'eye-tracking',
  'eye tracking',
  'EDA/GSR',
  'industrial VR'
];

const projectA = {
  _id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
  title: 'Industrial VR Safety Study',
  shortDescription: 'Uses HTC Vive, eye tracking, EDA/GSR and Plux OpenBAN in industrial VR training.',
  fullDescription: 'This project is intentionally unrelated and must never contaminate Project B.'
};

const projectB = {
  _id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
  title: 'StressLens',
  shortDescription: 'Student stress support system',
  fullDescription: ''
};

const firstMessage = 'StressLens is an AI-based system designed to identify university students who may be experiencing high levels of stress. It analyzes questionnaire responses, written journal entries, attendance records, academic performance data, and optional smartwatch data such as heart rate and sleep patterns. The system generates a stress risk score and recommends whether the student should be contacted by a university counselor. It does not make a medical diagnosis, but students with high-risk scores may be prioritized for intervention. Counselors can review and override the system\'s recommendations. Students are informed about the analysis, but participation in the smartwatch data collection is optional.';

const followUpMessage = 'Yes. The system has a documented legal basis for processing personal data. Explicit and informed consent is obtained before collecting questionnaire responses, journal entries, or smartwatch data. Participation is voluntary, and students can withdraw their consent at any time without losing access to university counseling services. Academic and attendance data are processed only under the university\'s documented educational authorization and are not used for unrelated purposes.';

const shiftFairProject = {
  _id: 'cccccccccccccccccccccccc',
  title: 'ShiftFair',
  shortDescription: 'Manufacturing workforce scheduling support',
  fullDescription: ''
};

const shiftFairInitialMessage = 'ShiftFair is an AI-based workforce scheduling system used by a manufacturing company. It analyzes employees’ declared availability, job qualifications, preferred working hours, previous shift assignments, and maximum weekly working limits to recommend a monthly shift schedule. The system does not make hiring, firing, promotion, salary, or disciplinary decisions. It does not use facial recognition, emotion detection, health data, or biometric data. A human manager reviews every proposed schedule and can modify or reject it before publication. Employees can view the reason for their assigned shifts, request corrections, and challenge an assignment. The system is intended to distribute night and weekend shifts fairly and prevent excessive workloads.';

const shiftFairFollowUpMessage = 'Employees are informed about the data used by the system. Availability and working-hour preferences are provided directly by employees, while qualifications and previous shift records come from the company’s HR system. Access is limited to authorized HR staff and managers. Scheduling records are retained for one year. Employees may correct inaccurate information and can request a manual scheduling review without being penalized.';

const eduSelectProject = {
  _id: 'dddddddddddddddddddddddd',
  title: 'EduSelect',
  shortDescription: 'University admissions decision-support',
  fullDescription: ''
};

const eduSelectMessage = 'EduSelect is a university admissions decision-support system. It performs applicant scoring and recommends acceptance, rejection, or waiting-list outcomes. It uses demographic information including gender, age, region, socioeconomic information, previous school information, and disability information. The university has historical gender, socioeconomic, regional, and disability bias in admissions data. Admissions officers review the recommendation but usually follow it. There is no formal appeal mechanism and no clear individual score explanation. Applicant records are retained for five years. A third-party cloud provider hosts the system.';

const claimAssistProject = {
  _id: 'eeeeeeeeeeeeeeeeeeeeeeee',
  title: 'ClaimAssist',
  shortDescription: 'Motor insurance claim decision support',
  fullDescription: ''
};

const claimAssistMessage = 'ClaimAssist is a motor insurance claim decision support system. It supports insurance claim assessment and provides claim recommendations. Every recommendation is reviewed by a trained claims officer. The claims officer can modify, override, or reject the recommendation before any final claim decision. Claimants can request an explanation, correct inaccurate information, and request a second manual review. Access is limited to authorized staff only. Claim records are retained for two years. The system does not use facial recognition, biometrics, emotion detection, or health data.';

function allText(value) {
  return JSON.stringify(value);
}

function mongooseLikeMessage({ sender, text, _id }) {
  const message = {};
  Object.defineProperty(message, 'sender', { value: sender, enumerable: false });
  Object.defineProperty(message, 'text', { value: text, enumerable: false });
  Object.defineProperty(message, '_id', { value: _id, enumerable: false });
  return message;
}

function listValues(items) {
  return (items || []).map((item) => item.value);
}

function flattenConclusions(report) {
  return [
    ...(report.classifications || []),
    ...(report.excludedClassifications || []),
    ...(report.primaryRisks || []),
    ...(report.regulatoryConsiderations || [])
  ];
}

function assertNoForbiddenTerms(report) {
  const text = allText(report);
  forbiddenTerms.forEach((term) => {
    assert.strictEqual(text.includes(term), false, `${term} leaked into Project B assessment`);
  });
  assert.strictEqual(allText(projectA).includes('HTC Vive'), true, 'Project A fixture should contain contamination data');
}

function assertNoDuplicateValues(items, label) {
  const values = listValues(items).map((value) => String(value).toLowerCase());
  assert.strictEqual(values.length, new Set(values).size, `${label} contains duplicate values`);
}

function runStressLensRegression() {
  const first = assessOntologyChat({
    project: projectB,
    messages: [{ sender: 'user', text: firstMessage }],
    previousState: {}
  });

  const second = assessOntologyChat({
    project: projectB,
    messages: [
      { sender: 'user', text: firstMessage },
      { sender: 'system', text: first.reply },
      { sender: 'user', text: followUpMessage }
    ],
    previousState: first.state
  });

  const report = second.ontologyResult;
  const facts = second.state.confirmedFacts;
  const classifications = listValues(report.classifications);
  const excluded = listValues(report.excludedClassifications);
  const riskText = allText(report.primaryRisks);
  const safeguardsText = allText(report.safeguards);

  assertNoForbiddenTerms(report);

  assert.strictEqual(facts.providesMedicalDiagnosis, false, 'providesMedicalDiagnosis should remain false');
  assert.strictEqual(facts.humanReviewAvailable, true, 'Human oversight should be confirmed');
  assert.strictEqual(facts.humanCanOverride, true, 'Human override should be confirmed');
  assert.strictEqual(facts.explicitConsent, true, 'Explicit consent should be confirmed after follow-up');
  assert.strictEqual(facts.legalBasisDocumented, true, 'Legal basis should be confirmed after follow-up');

  assert.ok(excluded.includes('MedicalDiagnosisAI'), 'MedicalDiagnosisAI should be excluded');
  assert.strictEqual(classifications.includes('AutomatedGradingAI'), false, 'AutomatedGradingAI must not be inferred');
  assert.strictEqual(classifications.includes('RemoteProctoringAI'), false, 'RemoteProctoringAI must not be inferred');
  assert.strictEqual(classifications.includes('ContentRecommendationAI'), false, 'ContentRecommendationAI must not be inferred');

  assert.strictEqual(/filter bubble/i.test(riskText), false, 'Filter-bubble risk must not be included');
  assert.strictEqual(/misdiagnosis|clinical treatment/i.test(riskText), false, 'Clinical treatment and misdiagnosis risks must not be included');

  assert.ok(safeguardsText.includes('HumanOversight'), 'HumanOversight should be in confirmed safeguards');
  assert.ok(safeguardsText.includes('HumanCanOverride'), 'HumanCanOverride should be in confirmed safeguards');
  assert.ok(safeguardsText.includes('ExplicitConsent'), 'ExplicitConsent should be in confirmed safeguards');
  assert.ok(safeguardsText.includes('LegalBasis'), 'LegalBasis should be in confirmed safeguards');
  assert.strictEqual(safeguardsText.includes('Missing: HumanOversight'), false, 'HumanOversight must not also be missing');

  const profiling = (report.classifications || []).find((item) => item.value === 'ProfilingAI');
  assert.ok(profiling, 'ProfilingAI should be considered from individual scoring');
  assert.ok(/individual.*score|scores an individual/i.test(`${profiling.reason} ${profiling.evidence.join(' ')}`), 'Profiling must be justified by individual scoring, not just personal data');

  flattenConclusions(report).forEach((item) => {
    assert.ok(Array.isArray(item.evidence), `${item.value} must include evidence`);
    assert.ok(Array.isArray(item.sources), `${item.value} must include provenance sources`);
    assert.ok(item.ruleIds && item.ruleIds.length > 0, `${item.value} must include rule IDs`);
  });

  assertNoDuplicateValues(report.classifications, 'classifications');
  assertNoDuplicateValues(report.excludedClassifications, 'excludedClassifications');
  assertNoDuplicateValues(report.primaryRisks, 'primaryRisks');
  assertNoDuplicateValues(report.regulatoryConsiderations, 'regulatoryConsiderations');

  assert.ok(report.executiveSummary.split(/[.!?]+/).filter(Boolean).length <= 7, 'Executive summary should be concise');
  assert.ok((report.primaryRisks || []).length <= 8, 'Primary risks should be limited');
  assert.ok((report.missingInformation || []).length <= 4, 'Follow-up questions should be limited');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(report, 'scoreBreakdown'), false, 'Ontology chat report should not include scoreBreakdown');

  console.log('StressLens ontology chat regression passed.');
  console.log(JSON.stringify({
    facts: second.state.confirmedFacts,
    executiveSummary: report.executiveSummary,
    classifications: report.classifications,
    excludedClassifications: report.excludedClassifications,
    primaryRisks: report.primaryRisks,
    safeguards: report.safeguards
  }, null, 2));
}

function assertFacts(facts, expected) {
  Object.entries(expected).forEach(([fact, value]) => {
    assert.deepStrictEqual(facts[fact], value, `${fact} should be ${JSON.stringify(value)}`);
  });
}

function assertEveryFactHasEvidence(report, expectedFacts) {
  expectedFacts.forEach((fact) => {
    const item = (report.confirmedFacts || []).find((entry) => entry.fact === fact);
    assert.ok(item, `${fact} should be present in confirmed facts`);
    assert.ok(Array.isArray(item.evidence) && item.evidence.length > 0, `${fact} should preserve evidence`);
    assert.ok(Array.isArray(item.sources) && item.sources.includes('USER_CONFIRMED'), `${fact} should preserve USER_CONFIRMED source`);
  });
}

function runShiftFairRegression() {
  const first = assessOntologyChat({
    project: shiftFairProject,
    messages: [{ sender: 'user', text: shiftFairInitialMessage }],
    previousState: {}
  });

  const second = assessOntologyChat({
    project: shiftFairProject,
    messages: [
      { sender: 'user', text: shiftFairInitialMessage },
      { sender: 'system', text: first.reply },
      { sender: 'user', text: shiftFairFollowUpMessage }
    ],
    previousState: first.state
  });

  const report = second.ontologyResult;
  const facts = second.state.confirmedFacts;
  const classifications = listValues(report.classifications);
  const excluded = listValues(report.excludedClassifications);
  const risksText = allText(report.primaryRisks);
  const safeguardsText = allText(report.safeguards);
  const reportText = allText(report);

  assertFacts(facts, {
    employmentContext: true,
    manufacturingContext: true,
    workforceSchedulingPurpose: true,
    recommendsMonthlyShiftSchedule: true,
    fairShiftDistributionObjective: true,
    preventsExcessiveWorkload: true,
    processesEmployeeAvailability: true,
    processesWorkingHourPreferences: true,
    processesJobQualifications: true,
    processesPreviousShiftAssignments: true,
    processesWeeklyWorkingLimits: true,
    processesHRRecords: true,
    processesPersonalData: true,
    humanReviewAvailable: true,
    humanCanModify: true,
    humanCanReject: true,
    decisionPublishedOnlyAfterHumanReview: true,
    explanationAvailable: true,
    correctionRightAvailable: true,
    challengeMechanismAvailable: true,
    manualReviewAvailable: true,
    nonPenaltyForReviewRequest: true,
    employeesInformed: true,
    accessRestricted: true,
    authorizedHRAndManagersOnly: true,
    retentionPeriodDefined: true,
    retentionPeriod: 'one year',
    makesHiringDecision: false,
    makesFiringDecision: false,
    makesPromotionDecision: false,
    makesSalaryDecision: false,
    makesDisciplinaryDecision: false,
    usesFacialRecognition: false,
    usesEmotionDetection: false,
    processesHealthData: false,
    processesBiometricData: false
  });

  assertEveryFactHasEvidence(report, [
    'employmentContext',
    'workforceSchedulingPurpose',
    'processesEmployeeAvailability',
    'humanCanModify',
    'humanCanReject',
    'employeesInformed',
    'retentionPeriodDefined',
    'retentionPeriod',
    'processesBiometricData'
  ]);

  assert.notStrictEqual(report.systemUnderstanding.purpose, 'Purpose not yet established.', 'ShiftFair purpose should be populated');
  assert.deepStrictEqual(report.systemUnderstanding.inputs.slice(0, 5), [
    'Employee availability',
    'Working-hour preferences',
    'Job qualifications',
    'Previous shift assignments',
    'Maximum weekly working limits'
  ]);
  assert.ok(report.systemUnderstanding.users.includes('HR staff'), 'HR staff should be a user');
  assert.ok(report.systemUnderstanding.users.includes('Manufacturing managers'), 'Manufacturing managers should be a user');
  assert.ok(report.systemUnderstanding.affectedPersons.includes('Employees'), 'Employees should be affected persons');
  assert.ok(report.systemUnderstanding.outputs.includes('Recommended monthly shift schedule'), 'Monthly shift schedule should be an output');
  assert.ok(report.systemUnderstanding.outputs.includes('Reasons for assigned shifts'), 'Reasons should be an output');
  assert.ok(report.systemUnderstanding.decisionsSupported.includes('Employee shift allocation'), 'Shift allocation should be decision supported');
  assert.strictEqual(report.systemUnderstanding.humanRole, 'A manager reviews, modifies or rejects every schedule before publication.');
  assert.strictEqual(report.systemUnderstanding.deploymentContext, 'Manufacturing workforce scheduling');

  [
    'Employment',
    'Manufacturing',
    'WorkforceScheduling',
    'DecisionSupport',
    'ShiftRecommendation',
    'PersonalDataProcessing',
    'HRDataProcessing',
    'HumanReviewedAI'
  ].forEach((value) => assert.ok(classifications.includes(value), `${value} should be classified`));
  assert.strictEqual(classifications.includes('AutomatedEmploymentDecisionAI'), false, 'ShiftFair must not be classified as fully automated employment decision AI');

  [
    'HiringDecisionAI',
    'FiringDecisionAI',
    'PromotionDecisionAI',
    'SalaryDecisionAI',
    'DisciplinaryDecisionAI',
    'FacialRecognitionAI',
    'EmotionRecognitionAI',
    'HealthDataProcessing',
    'BiometricDataProcessing'
  ].forEach((value) => assert.ok(excluded.includes(value), `${value} should be excluded with evidence`));

  [
    'AutomatedGradingAI',
    'RemoteProctoringAI',
    'ContentRecommendationAI',
    'MedicalDiagnosisAI'
  ].forEach((value) => assert.strictEqual(excluded.includes(value), false, `${value} should not appear for ShiftFair`));

  assert.strictEqual(/grading|proctoring|filter bubble|medical diagnosis|clinical|student wellbeing|counselor/i.test(risksText), false, 'ShiftFair risks must not include unrelated education, content, or clinical risks');
  assert.strictEqual(/student|counselor|grading|proctoring|filter bubble|medical diagnosis|clinical/i.test(reportText), false, 'ShiftFair report must not include unrelated student, counselor, grading, proctoring, content, or clinical language');
  [
    'Unfair distribution of night or weekend shifts',
    'Unsuitable assignments from inaccurate availability or qualification data',
    'Excessive workload or working-time limit violations',
    'Unauthorized access to employee records',
    'Over-reliance by managers on recommended schedules'
  ].forEach((value) => assert.ok((report.primaryRisks || []).some((risk) => risk.value === value), `${value} should be a ShiftFair risk`));

  [
    'HumanOversight',
    'HumanCanModify',
    'HumanCanReject',
    'TransparencyNotice',
    'ExplanationAvailable',
    'CorrectionRight',
    'ChallengeMechanism',
    'ManualReview',
    'AccessControl',
    'LimitedAuthorizedAccess',
    'RetentionPeriod',
    'NonPenaltyForReviewRequest',
    'WorkingTimeLimitControl'
  ].forEach((value) => assert.ok(safeguardsText.includes(value), `${value} should be confirmed`));

  assert.strictEqual(Object.prototype.hasOwnProperty.call(report, 'scoreBreakdown'), false, 'Ontology chat report should not include scoreBreakdown');
  assert.strictEqual(report.reasoningTrace.projectContext.projectAttached, true, 'Project context should be attached for project chat');
  assert.strictEqual(report.reasoningTrace.projectContext.projectId, shiftFairProject._id, 'Reasoning trace projectId should match selected project');
  assert.strictEqual(report.projectScope.metadataUsed, true, 'Project scope should report metadata usage consistently');

  const stats = second.raw.stateMergeStats;
  assert.strictEqual(stats.projectId, shiftFairProject._id, 'state merge stats should include project ID');
  assert.strictEqual(stats.priorUserMessagesLoaded, 1, 'follow-up assessment should load the initial user message');
  assert.ok(stats.existingFactsLoaded > 0, 'follow-up assessment should load existing facts');
  assert.ok(stats.newFactsExtracted >= 8, 'follow-up message should extract new facts');
  assert.ok(stats.mergedFactsUsed >= 35, 'final assessment should use merged facts from both messages');

  assert.strictEqual(/Purpose not yet established/i.test(reportText), false, 'Purpose fallback must not appear');
  assert.strictEqual(/selected project metadata/.test(report.reasoningTrace.projectContext.projectAttached ? '' : reportText), false, 'Trace and summary should not conflict about selected project metadata');

  console.log('ShiftFair ontology chat regression passed.');
  console.log(JSON.stringify({
    facts: second.state.confirmedFacts,
    systemUnderstanding: report.systemUnderstanding,
    classifications: report.classifications,
    excludedClassifications: report.excludedClassifications,
    primaryRisks: report.primaryRisks,
    safeguards: report.safeguards,
    stateMergeStats: second.raw.stateMergeStats
  }, null, 2));
}

function runEduSelectRegression() {
  const result = assessOntologyChat({
    project: eduSelectProject,
    messages: [{ sender: 'user', text: eduSelectMessage }],
    previousState: {}
  });

  const report = result.ontologyResult;
  const facts = result.state.confirmedFacts;
  const reportText = allText(report);
  const legalText = allText(report.regulatoryConsiderations);

  assert.strictEqual(facts.educationAdmissionsPurpose, true, 'EduSelect should be recognized as admissions/access context');
  assert.strictEqual(facts.applicantScoring, true, 'Applicant scoring should be extracted');
  assert.strictEqual(facts.recommendsAdmissionsOutcome, true, 'Admissions recommendation should be extracted');
  assert.strictEqual(facts.processesDisabilityData, true, 'Disability data should be extracted separately');
  assert.strictEqual(facts.processesDemographicData, true, 'Demographic data should be extracted');
  assert.strictEqual(facts.officersUsuallyFollowRecommendation, true, 'Rubber-stamping signal should be extracted');
  assert.strictEqual(facts.appealMechanismAvailable, false, 'No formal appeal should not be treated as a positive safeguard');
  assert.strictEqual(facts.explanationAvailable, false, 'No clear explanation should not be treated as a positive safeguard');
  assert.strictEqual(facts.retentionPeriod, 'five years', 'Five-year retention should be extracted');
  assert.strictEqual(facts.usesThirdPartyCloudProvider, true, 'Third-party cloud use should be extracted');

  assert.ok((report.classifications || []).some((item) => item.value === 'HighRiskEducationAccessAssessment' && item.status === 'requires_verification'), 'EU AI Act education access high-risk candidate should require verification');
  assert.ok(/GDPR Article 22|KVKK automated decision/.test(legalText), 'Article 22 / KVKK review should be present');
  assert.ok(/may become applicable|not automatically violated|requires_solely_automated|conditional/i.test(legalText), 'Article 22 language must be conditional');
  assert.ok(/Field-by-field demographic/.test(legalText), 'Field-by-field demographic data review should be present');
  assert.ok(/Data-retention necessity/.test(legalText), 'Retention should require justification, not automatic unlawfulness');
  assert.ok(/Third-party cloud processor/.test(legalText), 'Cloud controls should require verification');
  assert.strictEqual(/confirmed violation|unlawful|illegal/i.test(reportText), false, 'EduSelect must not assert confirmed legal violations');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(report, 'structuredAssessment'), false, 'Ontology chat should not generate a formal structured audit report');
  assert.strictEqual(/pdf_available|pdf_url|PDF Report/i.test(reportText), false, 'Ontology chat should not expose PDF fields or PDF report text');

  console.log('EduSelect ontology chat regression passed.');
}

function runClaimAssistRegression() {
  const result = assessOntologyChat({
    project: claimAssistProject,
    messages: [{ sender: 'user', text: claimAssistMessage }],
    previousState: {}
  });

  const report = result.ontologyResult;
  const facts = result.state.confirmedFacts;
  const reportText = allText(report);
  const safeguardsText = allText(report.safeguards.confirmed);

  assert.strictEqual(facts.insuranceClaimsPurpose, true, 'ClaimAssist should be insurance claims support');
  assert.strictEqual(facts.humanReviewAvailable, true, 'Claims officer review should be confirmed');
  assert.strictEqual(facts.humanCanModify, true, 'Officer modification should be confirmed');
  assert.strictEqual(facts.humanCanOverride, true, 'Officer override should be confirmed');
  assert.strictEqual(facts.humanCanReject, true, 'Officer rejection should be confirmed');
  assert.strictEqual(facts.explanationAvailable, true, 'Explanation should be recognized');
  assert.strictEqual(facts.correctionRightAvailable, true, 'Correction right should be recognized');
  assert.strictEqual(facts.manualReviewAvailable, true, 'Manual review should be recognized');
  assert.strictEqual(facts.accessRestricted, true, 'Authorized-staff-only access should be recognized');
  assert.strictEqual(facts.retentionPeriod, 'two years', 'Two-year retention should be extracted');
  assert.strictEqual(facts.usesFacialRecognition, false, 'Facial recognition should be excluded');
  assert.strictEqual(facts.processesBiometricData, false, 'Biometrics should be excluded');
  assert.strictEqual(facts.usesEmotionDetection, false, 'Emotion detection should be excluded');
  assert.strictEqual(facts.processesHealthData, false, 'Health data should be excluded');

  assert.ok(safeguardsText.includes('HumanOversight'), 'Human oversight should be a positive safeguard');
  assert.ok(safeguardsText.includes('HumanCanOverride'), 'Override should be a positive safeguard');
  assert.ok(safeguardsText.includes('ExplanationAvailable'), 'Explanation should be a positive safeguard');
  assert.ok(safeguardsText.includes('CorrectionRight'), 'Correction should be a positive safeguard');
  assert.ok(safeguardsText.includes('ManualReview'), 'Manual review should be a positive safeguard');
  assert.strictEqual(/HighRiskEducationAccessAssessment|demographic bias|university admissions|Article 22.*violated|confirmed violation/i.test(reportText), false, 'ClaimAssist must not inherit EduSelect risks or automatic legal violations');
  assert.ok(/Over-reliance on claim recommendation/i.test(reportText), 'Residual automation bias should remain present');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(report, 'structuredAssessment'), false, 'Ontology chat should not generate a formal structured audit report');
  assert.strictEqual(/pdf_available|pdf_url|PDF Report/i.test(reportText), false, 'Ontology chat should not expose PDF fields or PDF report text');

  console.log('ClaimAssist ontology chat regression passed.');
}

function assertConversationalReply(result, label) {
  assert.strictEqual(/Structured AI Risk Assessment|Executive Summary|Risk Matrix|Download PDF|PDF Report/i.test(result.reply), false, `${label} should not return a formal report or PDF text`);
  assert.strictEqual(/student support prioritization|insurance claims|biometric|medical diagnosis/i.test(result.reply), false, `${label} should not mention unrelated domains`);
}

function runConversationalEducationFlow() {
  const teacherOnly = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: 'I am a teacher and I use AI.' }],
    previousState: {}
  });

  assert.strictEqual(teacherOnly.state.confirmedFacts.userRole, 'Teacher', 'Teacher role should be retained');
  assert.strictEqual(teacherOnly.state.confirmedFacts.educationContext, true, 'Teacher message should establish education context');
  assert.ok(/what do you use the ai for/i.test(teacherOnly.reply), 'Teacher-only message should ask what the AI is used for');
  assertConversationalReply(teacherOnly, 'teacher-only');

  const lessonPlans = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'I am a teacher and I use AI.' },
      { sender: 'system', text: teacherOnly.reply },
      { sender: 'user', text: 'I use it to generate lesson plans.' }
    ],
    previousState: teacherOnly.state
  });

  assert.strictEqual(lessonPlans.state.confirmedFacts.lessonPlanningPurpose, true, 'Lesson planning purpose should be extracted');
  assert.ok(/lower impact|accuracy|suitability/i.test(lessonPlans.reply), 'Lesson planning should receive short practical advice');
  assert.ok(/student names|personal information/i.test(lessonPlans.reply), 'Lesson planning should ask only the relevant personal-data question');
  assertConversationalReply(lessonPlans, 'lesson-plans');

  const essayStart = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'I am a teacher and I use AI.' },
      { sender: 'system', text: teacherOnly.reply },
      { sender: 'user', text: 'I use it to score student essays.' }
    ],
    previousState: teacherOnly.state
  });

  assert.strictEqual(essayStart.state.confirmedFacts.essayScoringPurpose, true, 'Essay scoring should be extracted');
  assert.strictEqual(essayStart.state.confirmedFacts.evaluatesLearningOutcome, true, 'Essay scoring should map to educational assessment');
  assert.ok(/educational assessment/i.test(essayStart.reply), 'Essay scoring should be recognized as educational assessment');
  assert.ok(/directly determine the final grade|review it and decide/i.test(essayStart.reply), 'Essay scoring should ask about final-grade impact');
  assertConversationalReply(essayStart, 'essay-start');

  const humanReview = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'I am a teacher and I use AI.' },
      { sender: 'system', text: teacherOnly.reply },
      { sender: 'user', text: 'I use it to score student essays.' },
      { sender: 'system', text: essayStart.reply },
      { sender: 'user', text: 'I review every score and decide the final grade myself.' }
    ],
    previousState: essayStart.state
  });

  assert.strictEqual(humanReview.state.confirmedFacts.essayScoringPurpose, true, 'Essay context should be preserved across turns');
  assert.strictEqual(humanReview.state.confirmedFacts.teacherFinalGradeDecision, true, 'Teacher final decision should be retained');
  assert.strictEqual(humanReview.state.confirmedFacts.humanReviewAvailable, true, 'Human oversight should be inferred from teacher review');
  assert.strictEqual(/directly determine the final grade/i.test(humanReview.reply), false, 'The bot must not ask the final-grade question again');
  assert.ok(/explanation|students receive/i.test(humanReview.reply), 'After final decision is known, the next question should move to explanation or recourse');
  assertConversationalReply(humanReview, 'human-review');

  const correction = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'I am a teacher and I use AI.' },
      { sender: 'system', text: teacherOnly.reply },
      { sender: 'user', text: 'I use it to score student essays.' },
      { sender: 'system', text: essayStart.reply },
      { sender: 'user', text: 'I review every score and decide the final grade myself.' },
      { sender: 'system', text: humanReview.reply },
      { sender: 'user', text: 'Students can ask me to review an incorrect score.' }
    ],
    previousState: humanReview.state
  });

  assert.strictEqual(correction.state.confirmedFacts.correctionRightAvailable, true, 'Student review request should be recognized as correction/recourse');
  assert.ok(/students can ask|safeguards|review an incorrect score/i.test(correction.reply), 'Correction reply should use the accumulated context');
  assertConversationalReply(correction, 'correction');

  const unknownNames = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'I am a teacher and I use AI.' },
      { sender: 'system', text: teacherOnly.reply },
      { sender: 'user', text: 'I use it to score student essays.' },
      { sender: 'system', text: essayStart.reply },
      { sender: 'user', text: 'I have not told you whether student names are used.' }
    ],
    previousState: essayStart.state
  });

  assert.strictEqual(unknownNames.state.confirmedFacts.studentNamesUseUnknown, true, 'Unknown student-name usage should be marked as unknown');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(unknownNames.state.confirmedFacts, 'studentNamesUsed'), false, 'Unknown names must not become a negative or positive fact');
  assert.ok(/unknown|cannot say/i.test(unknownNames.reply), 'Reply should explicitly keep student-name usage unknown');
  assert.strictEqual(/names are not used|no student names are used/i.test(unknownNames.reply), false, 'Unknown personal data must not be treated as absent');
  assertConversationalReply(unknownNames, 'unknown-names');

  console.log('Conversational education flow regression passed.');
}

function runStickyConflictRecoveryRegression() {
  const staleConflict = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: 'I am a teacher and I use an AI tool in my classes.' }],
    previousState: {
      confirmedFacts: {
        userRole: 'Teacher',
        educationContext: true
      },
      unknownFacts: {},
      factEvidence: [
        {
          fact: 'userRole',
          value: 'Teacher',
          source: 'USER_CONFIRMED',
          sourceText: 'I am a teacher and I use an AI tool in my classes.',
          messageIndex: 0
        }
      ],
      contradictions: [
        {
          fact: 'systemPurpose',
          existingValue: 'Generate lesson plans',
          incomingValue: 'Score essays',
          status: 'needs_clarification'
        }
      ]
    }
  });

  assert.strictEqual((staleConflict.state.contradictions || []).length, 0, 'Stale contradictions should not keep the chat stuck');
  assert.strictEqual(/conflict|contradictory/i.test(staleConflict.reply), false, 'Stale conflict state should not be repeated to the user');
  assert.ok(/what do you use the ai for/i.test(staleConflict.reply), 'Teacher-only recovery should ask for the AI purpose');

  const compatibleRole = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: 'I am a high school teacher and I use an AI tool in my classes.' }],
    previousState: {
      confirmedFacts: {
        userRole: 'Teacher',
        educationContext: true
      },
      unknownFacts: {},
      factEvidence: [
        {
          fact: 'userRole',
          value: 'Teacher',
          source: 'USER_CONFIRMED',
          sourceText: 'I am a teacher and I use an AI tool in my classes.',
          messageIndex: 0
        }
      ]
    },
    llmFacts: [
      {
        fact: 'userRole',
        value: 'High school teacher',
        source: 'LLM_EXTRACTED',
        sourceText: 'I am a high school teacher and I use an AI tool in my classes.',
        messageIndex: 0
      }
    ]
  });

  assert.strictEqual((compatibleRole.state.contradictions || []).length, 0, 'Teacher and high school teacher should be treated as compatible');
  assert.strictEqual(/conflict|contradictory/i.test(compatibleRole.reply), false, 'Compatible role refinement should not produce a conflict response');

  const teacherOnly = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: 'I am a teacher and I use AI.' }],
    previousState: {}
  });
  const essayStart = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'I am a teacher and I use AI.' },
      { sender: 'system', text: teacherOnly.reply },
      { sender: 'user', text: 'I am a high school teacher, and I use an AI tool to evaluate student essays and suggest scores and feedback.' }
    ],
    previousState: teacherOnly.state
  });
  const eduSelectSwitch = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'I am a teacher and I use AI.' },
      { sender: 'system', text: teacherOnly.reply },
      { sender: 'user', text: 'I am a high school teacher, and I use an AI tool to evaluate student essays and suggest scores and feedback.' },
      { sender: 'system', text: essayStart.reply },
      { sender: 'user', text: eduSelectMessage }
    ],
    previousState: essayStart.state
  });

  assert.strictEqual(eduSelectSwitch.raw.stateMergeStats.previousStateReset, true, 'A named system with a different use case should reset previous ad hoc teacher context');
  assert.strictEqual(eduSelectSwitch.state.confirmedFacts.systemName, 'EduSelect', 'Named system should be captured from the latest message');
  assert.strictEqual(eduSelectSwitch.state.confirmedFacts.educationAdmissionsPurpose, true, 'EduSelect admissions purpose should be retained after reset');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(eduSelectSwitch.state.confirmedFacts, 'essayScoringPurpose'), false, 'Old essay-scoring facts should not be merged back after reset');
  assert.strictEqual(/conflict|contradictory/i.test(eduSelectSwitch.reply), false, 'New named scenario should not be answered with a stale conflict response');

  console.log('Sticky conflict recovery regression passed.');
}

function runExplicitContradictionRegression() {
  const input = 'I am a high school teacher. I use an AI tool to score student essays and generate feedback.';
  const result = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: input }],
    previousState: {},
    llmFacts: [
      {
        fact: 'assignsAcademicGrade',
        value: true,
        source: 'LLM_EXTRACTED',
        sourceText: input,
        messageIndex: 0,
        sourceMessageId: 'user-message-1'
      }
    ],
    chatId: 'teacher-chat'
  });

  const facts = result.state.confirmedFacts;
  const purposeText = String(facts.systemPurpose || '');

  assert.strictEqual((result.state.contradictions || []).length, 0, 'Essay scoring plus feedback generation must not be a contradiction');
  assert.strictEqual(/conflict|contradictory/i.test(result.reply), false, 'The bot must not return a conflict response for essay scoring and feedback');
  assert.strictEqual(facts.userRole, 'High school teacher', 'High-school teacher role should be retained specifically');
  assert.strictEqual(facts.educationContext, true, 'Teacher essay scoring should be in the education domain');
  assert.ok(/essay/i.test(purposeText) && /feedback/i.test(purposeText), 'Purpose should include essay scoring and feedback generation');
  assert.strictEqual(facts.assignsAcademicGrade, undefined, 'Unsupported LLM grade-assignment inference from essay scoring should be dropped');
  assert.ok(/directly determine the final grade|review it and decide/i.test(result.reply), 'The next question should ask whether the AI score determines the final grade');

  const first = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: 'The AI automatically assigns the final grade.' }],
    previousState: {},
    chatId: 'contradiction-chat'
  });
  const second = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: 'The AI automatically assigns the final grade.', _id: 'auto-grade-message' },
      { sender: 'system', text: first.reply },
      { sender: 'user', text: 'The AI never assigns grades; I decide the final grade.', _id: 'teacher-grade-message' }
    ],
    previousState: first.state,
    chatId: 'contradiction-chat'
  });

  assert.ok((second.state.contradictions || []).some((item) => item.normalizedField === 'final_grade_assignment'), 'Real final-grade contradiction should be detected');
  assert.ok(/previously said the AI assigns the final grade/i.test(second.reply), 'Contradiction reply should name the previous exact fact');
  assert.ok(/now said that you decide the final grade/i.test(second.reply), 'Contradiction reply should name the new exact fact');
  assert.strictEqual(/I found two pieces of information that conflict/i.test(second.reply), false, 'Generic contradiction response must not be used');

  console.log('Explicit contradiction regression passed.');
}

function runSessionIsolationRegression() {
  const eduSelect = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: eduSelectMessage, _id: 'eduselect-message' }],
    previousState: {},
    chatId: 'eduselect-chat'
  });

  const newTeacherChat = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: 'I am a high school teacher. I use an AI tool to score student essays and generate feedback.', _id: 'teacher-message' }],
    previousState: {},
    chatId: 'teacher-chat'
  });

  assert.strictEqual(newTeacherChat.raw.stateMergeStats.chatId, 'teacher-chat', 'New chat should report its own chat ID');
  assert.strictEqual(newTeacherChat.state.confirmedFacts.systemName, undefined, 'New teacher chat must not inherit EduSelect system name');
  assert.strictEqual(newTeacherChat.state.confirmedFacts.educationAdmissionsPurpose, undefined, 'New teacher chat must not inherit EduSelect admissions facts');
  assert.strictEqual(newTeacherChat.state.confirmedFacts.applicantScoring, undefined, 'New teacher chat must not inherit applicant scoring');
  assert.strictEqual(newTeacherChat.state.confirmedFacts.recommendsAdmissionsOutcome, undefined, 'New teacher chat must not inherit admissions recommendations');

  const selectedEduSelect = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: eduSelectMessage, _id: 'eduselect-message' },
      { sender: 'system', text: eduSelect.reply },
      { sender: 'user', text: 'Applicants can request a second manual review.', _id: 'eduselect-follow-up' }
    ],
    previousState: eduSelect.state,
    chatId: 'eduselect-chat'
  });

  assert.strictEqual(selectedEduSelect.state.confirmedFacts.systemName, 'EduSelect', 'Selecting EduSelect chat should load only EduSelect state');
  assert.strictEqual(Object.prototype.hasOwnProperty.call(selectedEduSelect.state.confirmedFacts, 'essayScoringPurpose'), false, 'Selecting EduSelect chat must not mix teacher essay facts');

  console.log('Session isolation regression passed.');
}

function runExactTeacherReviewMultiTurnRegression() {
  const firstMessage = 'I am a high school teacher. I use an AI tool to score student essays and generate feedback.';
  const first = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: firstMessage, _id: 'teacher-turn-1' }],
    previousState: {},
    chatId: 'teacher-review-chat'
  });

  assert.ok(/directly determine the final grade|review it and decide/i.test(first.reply), 'First response should ask the final-grade clarification');

  const secondMessage = 'I review every AI-generated score and feedback before using it. I can change or reject the AI’s recommendation, and I make the final grading decision myself.';
  const second = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'teacher-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-turn-1' },
      { sender: 'user', text: secondMessage, _id: 'teacher-turn-2' }
    ],
    previousState: first.state,
    chatId: 'teacher-review-chat'
  });

  const facts = second.state.confirmedFacts;
  const snapshot = second.ontologyResult.conversationState || {};
  const text = allText(second);

  assert.strictEqual(facts.userRole, 'High school teacher', 'Second turn should preserve the high-school teacher role');
  assert.strictEqual(facts.educationContext, true, 'Second turn should preserve education domain');
  assert.strictEqual(facts.essayScoringPurpose, true, 'Second turn should preserve essay scoring purpose from the first message');
  assert.ok(/feedback/i.test(String(facts.systemPurpose)), 'Second turn should preserve feedback generation purpose');
  assert.strictEqual(facts.affectedPersons, 'Students', 'Second turn should preserve students as affected stakeholders');
  assert.ok(/score/i.test(String(facts.systemOutputs)) && /feedback/i.test(String(facts.systemOutputs)), 'Second turn should preserve score and feedback outputs');
  assert.strictEqual(facts.humanReviewAvailable, true, 'Human review should be recognized');
  assert.strictEqual(facts.humanCanModify, true, 'Change authority should be recognized');
  assert.strictEqual(facts.humanCanReject, true, 'Reject authority should be recognized');
  assert.strictEqual(facts.humanCanOverride, true, 'Override authority should be recognized');
  assert.strictEqual(facts.teacherFinalGradeDecision, true, 'Teacher final decision should be recognized');
  assert.strictEqual(facts.assignsAcademicGrade, false, 'Final grade should not be automated');
  assert.strictEqual(facts.fullyAutomatedDecision, false, 'Fully automated decision should be false');

  assert.strictEqual(snapshot.user_role, 'High school teacher', 'Conversation snapshot should expose user_role');
  assert.strictEqual(snapshot.domain, 'education', 'Conversation snapshot should expose education domain');
  assert.ok(/essay/i.test(String(snapshot.ai_purpose)), 'Conversation snapshot should expose essay scoring purpose');
  assert.strictEqual(snapshot.ai_secondary_purpose, 'feedback generation', 'Conversation snapshot should expose feedback generation');
  assert.ok((snapshot.affected_stakeholders || []).some((item) => /students/i.test(String(item))), 'Conversation snapshot should expose students');
  assert.strictEqual(snapshot.ai_output, 'score and feedback', 'Conversation snapshot should expose score and feedback output');
  assert.strictEqual(snapshot.human_review, 'present', 'Conversation snapshot should expose human review');
  assert.strictEqual(snapshot.override_authority, 'present', 'Conversation snapshot should expose override authority');
  assert.strictEqual(snapshot.final_decision_maker, 'teacher', 'Conversation snapshot should expose teacher as final decision-maker');
  assert.strictEqual(snapshot.final_grade_automated, false, 'Conversation snapshot should expose non-automated final grade');

  assert.ok(/change or reject/i.test(second.reply), 'Second response should use change/reject authority from the second message');
  assert.ok(/does not determine the final grade/i.test(second.reply), 'Second response should recognize that AI does not decide the final grade');
  assert.strictEqual(/what do you use the ai for/i.test(second.reply), false, 'Second response must not ask the purpose again');
  assert.strictEqual(/EduSelect|ClaimAssist|admissions|insurance claim/i.test(text), false, 'Teacher review chat must not contain data from other chats');
  assert.ok(/explanation|review a score|correction|appeal|personal data|fair|fairness/i.test(second.reply), 'Next question should concern explanation, correction, appeal, personal data, or fairness');
  assert.strictEqual(second.raw.stateLifecycle.chat_id, 'teacher-review-chat', 'Lifecycle log should carry the stable chat ID');
  assert.strictEqual(second.raw.stateLifecycle.state_storage_key, 'ontology-chat:teacher-review-chat', 'Lifecycle log should carry the state storage key');
  assert.ok(Object.keys(second.raw.stateLifecycle.loaded_previous_state.confirmedFacts || {}).length > 0, 'Lifecycle log should show previous state was loaded');
  assert.ok(Object.keys(second.raw.stateLifecycle.merged_state || {}).length >= Object.keys(first.state.confirmedFacts || {}).length, 'Lifecycle log should show merged state');
  assert.ok(second.raw.stateLifecycle.selected_next_question, 'Lifecycle log should show selected next question');

  console.log('Exact teacher review multi-turn regression passed.');
}

function runRecruitmentRankingContinuationRegression() {
  const firstMessage = 'I am an HR specialist. I use an AI tool to rank job applicants based on their CVs, education, work experience, skills, and cover letters.';
  const first = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: firstMessage, _id: 'hr-turn-1' }],
    previousState: {},
    chatId: 'hr-recruitment-chat'
  });

  const firstFacts = first.state.confirmedFacts;
  const firstText = allText(first);

  assert.strictEqual(firstFacts.userRole, 'HR specialist', 'HR role should be extracted');
  assert.strictEqual(firstFacts.employmentContext, true, 'Recruitment should establish employment domain');
  assert.strictEqual(firstFacts.employmentRecruitmentPurpose, true, 'Recruitment purpose should be extracted');
  assert.strictEqual(firstFacts.applicantRankingPurpose, true, 'Applicant ranking purpose should be extracted');
  assert.strictEqual(firstFacts.ranksJobApplicants, true, 'Applicant ranking should be extracted');
  assert.strictEqual(firstFacts.jobApplicantsAffected, true, 'Job applicants should be marked as affected stakeholders');
  assert.strictEqual(firstFacts.processesPersonalData, true, 'Candidate application materials are personal data');
  assert.strictEqual(firstFacts.processesApplicantCVs, true, 'CV input should be extracted');
  assert.strictEqual(firstFacts.processesApplicantEducation, true, 'Education input should be extracted');
  assert.strictEqual(firstFacts.processesApplicantWorkExperience, true, 'Work experience input should be extracted');
  assert.strictEqual(firstFacts.processesApplicantSkills, true, 'Skills input should be extracted');
  assert.strictEqual(firstFacts.processesCoverLetters, true, 'Cover letters input should be extracted');
  assert.ok(/employment recruitment|job applicants|applicant/i.test(first.reply), 'First response should recognize recruitment ranking');
  assert.ok(/automatically reject|shortlist|HR review/i.test(first.reply), 'First response should ask about HR review or automatic rejection/shortlisting');
  assert.strictEqual(/I can continue the assessment from the facts you have provided so far/i.test(first.reply), false, 'First response must not use the generic continuation fallback');
  assert.strictEqual(/EduSelect|student essays|insurance claim|workforce scheduling/i.test(firstText), false, 'Recruitment chat must not contain unrelated project data');

  const second = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'hr-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-hr-turn-1' },
      { sender: 'user', text: 'continue then', _id: 'hr-turn-2' }
    ],
    previousState: first.state,
    chatId: 'hr-recruitment-chat'
  });

  const secondFacts = second.state.confirmedFacts;
  const secondText = allText(second);

  assert.strictEqual(secondFacts.userRole, 'HR specialist', 'Second turn should preserve HR role');
  assert.strictEqual(secondFacts.applicantRankingPurpose, true, 'Second turn should preserve applicant ranking purpose');
  assert.strictEqual(secondFacts.processesApplicantCVs, true, 'Second turn should preserve CV input');
  assert.strictEqual(secondFacts.processesCoverLetters, true, 'Second turn should preserve cover-letter input');
  assert.ok(/employment recruitment|job applicants|applicant ranking|access to work/i.test(second.reply), 'Second response should use preserved recruitment facts');
  assert.ok(/automatically reject|shortlist|HR review|explanation|correct|human review|fairness|retained|security/i.test(second.reply), 'Second response should ask a material recruitment follow-up');
  assert.strictEqual(/what do you use the ai for/i.test(second.reply), false, 'Second response must not ask the purpose again');
  assert.strictEqual(/I can continue the assessment from the facts you have provided so far/i.test(second.reply), false, 'Second response must not repeat the generic continuation fallback');
  assert.strictEqual(/EduSelect|student essays|insurance claim|manufacturing/i.test(secondText), false, 'Second recruitment turn must not contain data from other chats');
  assert.strictEqual(second.raw.stateLifecycle.chat_id, 'hr-recruitment-chat', 'Lifecycle log should carry the HR chat ID');
  assert.strictEqual(second.raw.stateLifecycle.state_storage_key, 'ontology-chat:hr-recruitment-chat', 'Lifecycle log should carry the HR state storage key');
  assert.ok(Object.keys(second.raw.stateLifecycle.loaded_previous_state.confirmedFacts || {}).length > 0, 'Lifecycle log should show previous HR state was loaded');
  assert.ok(Object.keys(second.raw.stateLifecycle.merged_state || {}).length >= Object.keys(first.state.confirmedFacts || {}).length, 'Lifecycle log should show HR state was merged, not replaced');

  console.log('Recruitment ranking continuation regression passed.');
}

function runExactRecruitmentHumanReviewRegression() {
  const firstMessage = 'I am an HR specialist. I use an AI tool to rank job applicants based on their CVs, education, work experience, skills, and cover letters.';
  const first = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: firstMessage, _id: 'hr-exact-turn-1' }],
    previousState: {},
    chatId: 'hr-exact-chat'
  });

  const secondMessage = 'The AI cannot automatically reject or shortlist applicants. I review every ranking, can change or ignore the recommendation, and I make the final decision about who proceeds to the interview stage.';
  const second = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'hr-exact-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-hr-exact-turn-1' },
      { sender: 'user', text: secondMessage, _id: 'hr-exact-turn-2' }
    ],
    previousState: first.state,
    chatId: 'hr-exact-chat'
  });

  const facts = second.state.confirmedFacts;
  const text = allText(second);

  assert.strictEqual((second.state.contradictions || []).length, 0, 'Negated automatic rejection must not create a contradiction');
  assert.strictEqual(facts.userRole, 'HR specialist', 'Second HR turn should preserve role');
  assert.strictEqual(facts.applicantRankingPurpose, true, 'Second HR turn should preserve applicant-ranking purpose');
  assert.strictEqual(facts.processesApplicantCVs, true, 'Second HR turn should preserve CV input');
  assert.strictEqual(facts.processesCoverLetters, true, 'Second HR turn should preserve cover-letter input');
  assert.strictEqual(facts.fullyAutomatedDecision, false, 'Negated automatic rejection should set fully automated decision to false');
  assert.strictEqual(facts.makesHiringDecision, false, 'Human final interview-stage decision should be recognized');
  assert.strictEqual(facts.humanReviewAvailable, true, 'Every ranking review should be recognized');
  assert.strictEqual(facts.humanCanModify, true, 'Change authority should be recognized');
  assert.strictEqual(facts.humanCanReject, true, 'Ignore/reject authority should be recognized');
  assert.strictEqual(facts.humanCanOverride, true, 'Override authority should be recognized');
  assert.ok(/human review|final HR authority|does not|reduces the risk|challenge/i.test(second.reply), 'Second HR response should use human oversight facts');
  assert.strictEqual(/what do you use the ai for/i.test(second.reply), false, 'Second HR response must not ask the purpose again');
  assert.strictEqual(/I found two pieces of information that conflict/i.test(second.reply), false, 'Second HR response must not use generic contradiction text');
  assert.strictEqual(/EduSelect|student essays|insurance claim|manufacturing/i.test(text), false, 'Exact HR chat must not contain unrelated chat data');

  const poisonedPreviousState = {
    ...second.state,
    confirmedFacts: {
      ...second.state.confirmedFacts,
      fullyAutomatedDecision: true
    },
    factEvidence: [
      ...(second.state.factEvidence || []),
      {
        fact: 'fullyAutomatedDecision',
        value: true,
        source: 'USER_CONFIRMED',
        sourceText: secondMessage,
        messageIndex: 1,
        sourceMessageId: 'old-bad-hr-automation'
      }
    ]
  };
  const recovered = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'hr-exact-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-hr-exact-turn-1' },
      { sender: 'user', text: secondMessage, _id: 'hr-exact-turn-2' },
      { sender: 'system', text: second.reply, _id: 'assistant-hr-exact-turn-2' },
      { sender: 'user', text: 'continue then', _id: 'hr-exact-turn-3' }
    ],
    previousState: poisonedPreviousState,
    chatId: 'hr-exact-chat'
  });

  assert.strictEqual(recovered.state.confirmedFacts.fullyAutomatedDecision, false, 'Stored false-positive automation should be sanitized and recomputed as false');
  assert.strictEqual((recovered.state.contradictions || []).length, 0, 'Stored false-positive automation should not force a later contradiction');
  assert.ok(recovered.raw.stateMergeStats.previousFactsSanitizedDropped >= 1, 'HR recovery should report sanitized stored facts');
  assert.strictEqual(/what do you use the ai for/i.test(recovered.reply), false, 'Recovered HR response must not ask purpose again');

  console.log('Exact recruitment human-review regression passed.');
}

function runEcommerceSupportContinuationRegression() {
  const firstMessage = 'An e-commerce customer support AI system designed to handle order tracking, returns, and product recommendations. The system interacts with Customers and Support Agents. Customers place Orders, which contain multiple Products and are processed through a Payment Gateway. Each Order has a status (e.g., Processing, Shipped, Delivered, Refunded) and is handled by a Shipping Carrier. Customers can submit Tickets or initiate Live Chats regarding specific Orders or Products. Support Agents review these Tickets, process Refund Requests, and issue Coupons when applicable. Additionally, the AI system continuously analyzes Customer Browsing History and Purchase History to generate personalized Product Recommendations.';
  const first = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: firstMessage, _id: 'ecommerce-turn-1' }],
    previousState: {},
    llmFacts: [
      {
        fact: 'systemName',
        value: 'e-commerce customer support AI system',
        source: 'LLM_EXTRACTED',
        sourceText: firstMessage,
        messageIndex: 0,
        sourceMessageId: 'ecommerce-turn-1'
      },
      {
        fact: 'systemPurpose',
        value: true,
        source: 'LLM_EXTRACTED',
        sourceText: firstMessage,
        messageIndex: 0,
        sourceMessageId: 'ecommerce-turn-1'
      }
    ],
    chatId: 'ecommerce-support-chat'
  });

  const firstFacts = first.state.confirmedFacts;
  assert.ok(/order tracking/i.test(String(firstFacts.systemPurpose)), 'E-commerce purpose should include order tracking');
  assert.ok(/returns/i.test(String(firstFacts.systemPurpose)), 'E-commerce purpose should include returns');
  assert.ok(/product recommendations/i.test(String(firstFacts.systemPurpose)), 'E-commerce purpose should include product recommendations');
  assert.strictEqual(String(firstFacts.systemPurpose).includes('true'), false, 'Boolean LLM systemPurpose must be rejected');
  assert.ok(/Customer Browsing History/i.test(String(firstFacts.systemInputs)), 'Browsing history input should be extracted');
  assert.ok(/Purchase History/i.test(String(firstFacts.systemInputs)), 'Purchase history input should be extracted');
  assert.ok(/Customers/i.test(String(firstFacts.affectedPersons)), 'Customers should be affected stakeholders');
  assert.ok(/Support agents/i.test(String(firstFacts.primaryUsers)), 'Support agents should be primary users');
  assert.ok(/directly decide|person review|change or reject/i.test(first.reply), 'First e-commerce response should ask about outcome decision boundary');
  assert.strictEqual(/what do you use the ai for/i.test(first.reply), false, 'First e-commerce response must not ask purpose again');

  const secondMessage = 'The AI system does not directly decide outcomes. It provides suggestions (such as response drafts or refund recommendations), but a human support agent reviews the AI output and retains full authority to approve, edit, or reject it before any action is executed.';
  const second = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'ecommerce-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-ecommerce-turn-1' },
      { sender: 'user', text: secondMessage, _id: 'ecommerce-turn-2' }
    ],
    previousState: {
      ...first.state,
      confirmedFacts: {
        ...first.state.confirmedFacts,
        systemPurpose: true
      },
      factEvidence: [
        ...(first.state.factEvidence || []),
        {
          fact: 'systemPurpose',
          value: true,
          source: 'LLM_EXTRACTED',
          sourceText: firstMessage,
          messageIndex: 0,
          sourceMessageId: 'old-bad-ecommerce-purpose'
        }
      ]
    },
    llmFacts: [
      {
        fact: 'systemOutputs',
        value: 'personalized Product Recommendations; Order-tracking information',
        source: 'LLM_EXTRACTED',
        sourceText: 'Order-tracking information and product recommendations are shown automatically, but refund decisions are reviewed by a support agent.',
        messageIndex: 1,
        sourceMessageId: 'ecommerce-turn-2'
      },
      {
        fact: 'systemName',
        value: 'support agent',
        source: 'LLM_EXTRACTED',
        sourceText: 'The agent can approve, reject, or override the AI recommendation.',
        messageIndex: 1,
        sourceMessageId: 'ecommerce-turn-2'
      },
      {
        fact: 'systemName',
        value: 'customers',
        source: 'LLM_EXTRACTED',
        sourceText: 'Customers can request human review if they believe the result is incorrect.',
        messageIndex: 1,
        sourceMessageId: 'ecommerce-turn-2'
      }
    ],
    chatId: 'ecommerce-support-chat'
  });

  const secondFacts = second.state.confirmedFacts;
  const secondText = allText(second);

  assert.strictEqual((second.state.contradictions || []).length, 0, 'Human-reviewed e-commerce suggestions must not create a contradiction');
  assert.strictEqual(second.raw.stateMergeStats.previousStateReset, false, 'Actor names from LLM extraction must not reset the e-commerce chat state');
  assert.strictEqual(second.state.confirmedFacts.systemName, 'e-commerce customer support AI system', 'System name should not be overwritten by support agent or customers');
  assert.ok(/order tracking/i.test(String(secondFacts.systemPurpose)), 'Second e-commerce turn should preserve order-tracking purpose');
  assert.ok(/Customer Browsing History/i.test(String(secondFacts.systemInputs)), 'Second e-commerce turn should preserve browsing-history input');
  assert.strictEqual(secondFacts.fullyAutomatedDecision, false, 'Does not directly decide outcomes should set fully automated decision to false');
  assert.strictEqual(secondFacts.humanReviewAvailable, true, 'Human support-agent review should be recognized');
  assert.strictEqual(secondFacts.humanCanOverride, true, 'Full authority should be recognized as override authority');
  assert.strictEqual(secondFacts.humanCanModify, true, 'Edit authority should be recognized');
  assert.strictEqual(secondFacts.humanCanReject, true, 'Reject authority should be recognized');
  assert.ok(/quality of human review|accuracy|privacy|explanation|review/i.test(second.reply), 'Second e-commerce response should use accumulated facts');
  assert.strictEqual(/what do you use the ai for/i.test(second.reply), false, 'Second e-commerce response must not ask purpose again');
  assert.strictEqual(/"systemPurpose":true|as: true/i.test(secondText), false, 'E-commerce response and state must not contain systemPurpose=true');
  assert.strictEqual(/EduSelect|student essays|job applicants|insurance claim/i.test(secondText), false, 'E-commerce chat must not contain unrelated chat data');
  assert.strictEqual(second.raw.stateLifecycle.chat_id, 'ecommerce-support-chat', 'Lifecycle log should carry the e-commerce chat ID');
  assert.ok(Object.keys(second.raw.stateLifecycle.loaded_previous_state.confirmedFacts || {}).length > 0, 'Lifecycle log should show previous e-commerce state was loaded');
  assert.ok(Object.keys(second.raw.stateLifecycle.merged_state || {}).length >= Object.keys(first.state.confirmedFacts || {}).length, 'Lifecycle log should show e-commerce state was merged, not replaced');
  assert.ok(second.raw.stateMergeStats.previousFactsSanitizedDropped >= 1, 'E-commerce recovery should report sanitized stored text facts');

  const transcriptSecondMessage = 'The AI system does not make final, binding decisions on important outcomes. It may automatically provide order status information and product recommendations, but customers decide whether to follow those recommendations. Refund requests, returns, coupon issuance, and disputed or uncertain cases are reviewed by an authorized Support Agent, who can approve, reject, or change the AI’s suggested response. Customers can also request human review if the AI output is incorrect.';
  const transcriptSecond = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'ecommerce-transcript-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-ecommerce-transcript-turn-1' },
      { sender: 'user', text: transcriptSecondMessage, _id: 'ecommerce-transcript-turn-2' }
    ],
    previousState: first.state,
    llmFacts: [
      {
        fact: 'fullyAutomatedDecision',
        value: true,
        source: 'LLM_EXTRACTED',
        sourceText: 'It may automatically provide order status information and product recommendations, but customers decide whether to follow those recommendations.',
        messageIndex: 1,
        sourceMessageId: 'ecommerce-transcript-turn-2'
      }
    ],
    chatId: 'ecommerce-support-chat'
  });

  assert.strictEqual((transcriptSecond.state.contradictions || []).length, 0, 'Automatic status display must not be treated as a fully automated decision contradiction');
  assert.strictEqual(transcriptSecond.state.confirmedFacts.fullyAutomatedDecision, false, 'Non-binding e-commerce automation should keep fullyAutomatedDecision false');
  assert.ok(transcriptSecond.raw.unsupportedLlmFacts.length >= 1, 'LLM fullyAutomatedDecision=true must be rejected without decisive evidence');
  assert.strictEqual(/Which one is correct/i.test(transcriptSecond.reply), false, 'Transcript e-commerce follow-up must not ask a false contradiction question');
  assert.strictEqual(/what do you use the ai for/i.test(transcriptSecond.reply), false, 'Transcript e-commerce follow-up must not lose the original purpose');
  assert.ok(/Ontology output:/i.test(transcriptSecond.reply), 'Completed e-commerce assessment should include final ontology output');
  assert.ok(/Mapped concepts:/i.test(transcriptSecond.reply), 'Final ontology output should include mapped ontology concepts');
  assert.ok(/Fully automated decision: false/i.test(transcriptSecond.reply), 'Final ontology output should state the automation boundary');

  const automatedLowRiskMessage = 'The AI directly decides outcomes for low-risk actions like standard returns, tracking updates, and product recommendations without human review. Support Agents only intervene if a customer explicitly escalates a ticket. Customers can request an explanation after an automated return decision.';
  const automatedLowRisk = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'ecommerce-automated-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-ecommerce-automated-turn-1' },
      { sender: 'user', text: automatedLowRiskMessage, _id: 'ecommerce-automated-turn-2' }
    ],
    previousState: first.state,
    chatId: 'ecommerce-automated-chat'
  });

  assert.strictEqual(automatedLowRisk.state.confirmedFacts.fullyAutomatedDecision, true, 'Direct AI-decided low-risk actions should set fullyAutomatedDecision true');
  assert.strictEqual((automatedLowRisk.state.contradictions || []).length, 0, 'Direct automation case should not create a contradiction');
  assert.ok(/Ontology output:/i.test(automatedLowRisk.reply), 'Automated e-commerce assessment should include final ontology output');
  assert.ok(/Fully automated decision: true/i.test(automatedLowRisk.reply), 'Automated e-commerce final output should state true automation boundary');
  assert.ok(/Main risks:/i.test(automatedLowRisk.reply), 'Automated e-commerce final output should include ontology-derived risks');
  assert.strictEqual(/what do you use the ai for/i.test(automatedLowRisk.reply), false, 'Automated e-commerce final output must not restart the chat');

  const staleContradictionState = {
    ...first.state,
    confirmedFacts: {
      ...first.state.confirmedFacts,
      fullyAutomatedDecision: false,
      humanReviewAvailable: true
    },
    factEvidence: [
      ...(first.state.factEvidence || []),
      {
        fact: 'fullyAutomatedDecision',
        label: 'Fully automated decision',
        value: false,
        source: 'USER_CONFIRMED',
        sourceText: 'The AI system does not make final, binding decisions on important outcomes.',
        messageIndex: 1,
        sourceMessageId: 'ecommerce-transcript-turn-2'
      },
      {
        fact: 'fullyAutomatedDecision',
        label: 'Fully automated decision',
        value: true,
        source: 'USER_CONFIRMED',
        sourceText: 'It may automatically provide order status information and product recommendations, but customers decide whether to follow those recommendations.',
        messageIndex: 1,
        sourceMessageId: 'old-bad-ecommerce-automation'
      }
    ],
    contradictions: [
      {
        fact: 'fullyAutomatedDecision',
        label: 'Fully automated decision',
        normalizedField: 'fullyAutomatedDecision',
        existingFact: 'fullyAutomatedDecision',
        incomingFact: 'fullyAutomatedDecision',
        existingValue: 'Fully automated decision is false',
        incomingValue: 'Fully automated decision is true',
        existingRawValue: false,
        incomingRawValue: true,
        oldValue: 'Fully automated decision is false',
        newValue: 'Fully automated decision is true',
        status: 'needs_clarification'
      }
    ]
  };
  const resolvedShortAnswer = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'ecommerce-transcript-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-ecommerce-transcript-turn-1' },
      { sender: 'user', text: transcriptSecondMessage, _id: 'ecommerce-transcript-turn-2' },
      { sender: 'system', text: 'You previously said Fully automated decision was Fully automated decision is false, but you now said it was Fully automated decision is true. Which one is correct?', _id: 'assistant-ecommerce-transcript-turn-2' },
      { sender: 'user', text: 'true', _id: 'ecommerce-transcript-turn-3' }
    ],
    previousState: staleContradictionState,
    chatId: 'ecommerce-support-chat'
  });

  assert.strictEqual(resolvedShortAnswer.state.confirmedFacts.fullyAutomatedDecision, true, 'Short true answer should resolve the pending boolean contradiction');
  assert.strictEqual((resolvedShortAnswer.state.contradictions || []).length, 0, 'Short contradiction resolution should clear stale contradictions');
  assert.ok(/order tracking/i.test(String(resolvedShortAnswer.state.confirmedFacts.systemPurpose)), 'Short contradiction resolution must preserve prior e-commerce purpose');
  assert.strictEqual(/what do you use the ai for/i.test(resolvedShortAnswer.reply), false, 'Short contradiction resolution must not restart the chat');
  assert.ok(resolvedShortAnswer.raw.stateMergeStats.contextualResolutionsApplied >= 1, 'Lifecycle stats should report contextual resolution');

  console.log('E-commerce support continuation regression passed.');
}

function runMongooseMessageStateRegression() {
  const firstMessage = 'An e-commerce customer support AI system designed to handle order tracking, returns, and product recommendations. The system interacts with Customers and Support Agents. Customers place Orders, which contain multiple Products and are processed through a Payment Gateway. Customers can submit Tickets or initiate Live Chats regarding specific Orders or Products. Support Agents review these Tickets, process Refund Requests, and issue Coupons when applicable. Additionally, the AI system continuously analyzes Customer Browsing History and Purchase History to generate personalized Product Recommendations.';
  const secondMessage = 'The AI does not have final authority over significant outcomes. Order-tracking information and product recommendations are shown automatically, but refund decisions are reviewed by a support agent. The agent can approve, reject, or override the AI recommendation. High-value or unusual refund requests are escalated to a senior agent, and customers can request human review if they believe the result is incorrect.';

  const first = assessOntologyChat({
    project: null,
    messages: [
      mongooseLikeMessage({ sender: 'user', text: firstMessage, _id: 'mongoose-ecommerce-turn-1' })
    ],
    previousState: {},
    chatId: 'mongoose-ecommerce-chat'
  });

  assert.ok(/order tracking/i.test(String(first.state.confirmedFacts.systemPurpose)), 'Mongoose-like first message should preserve text for purpose extraction');
  assert.strictEqual(first.state.confirmedFacts.processesPersonalData, true, 'Mongoose-like first message should extract browsing and purchase history as personal-data relevant');
  assert.ok(/Customer Browsing History/i.test(String(first.state.confirmedFacts.systemInputs)), 'Mongoose-like first message should extract input data');

  const second = assessOntologyChat({
    project: null,
    messages: [
      mongooseLikeMessage({ sender: 'user', text: firstMessage, _id: 'mongoose-ecommerce-turn-1' }),
      mongooseLikeMessage({ sender: 'system', text: first.reply, _id: 'assistant-mongoose-ecommerce-turn-1' }),
      mongooseLikeMessage({ sender: 'user', text: secondMessage, _id: 'mongoose-ecommerce-turn-2' })
    ],
    previousState: first.state,
    chatId: 'mongoose-ecommerce-chat'
  });

  const facts = second.state.confirmedFacts;
  assert.strictEqual(second.raw.stateMergeStats.previousStateReset, false, 'Mongoose-like messages must not cause state reset');
  assert.ok(second.raw.stateMergeStats.totalExtractedFactsThisRun > 0, 'Mongoose-like messages must still feed deterministic fact extraction');
  assert.ok(/order tracking/i.test(String(facts.systemPurpose)), 'Second Mongoose-like turn should preserve first-turn purpose');
  assert.strictEqual(facts.processesPersonalData, true, 'Second Mongoose-like turn should preserve personal-data context');
  assert.strictEqual(facts.humanReviewAvailable, true, 'Second Mongoose-like turn should recognize human review');
  assert.strictEqual(facts.humanCanOverride, true, 'Second Mongoose-like turn should recognize override authority');
  assert.strictEqual(facts.humanCanReject, true, 'Second Mongoose-like turn should recognize reject authority');
  assert.strictEqual(/what do you use the ai for/i.test(second.reply), false, 'Mongoose-like continuation must not ask purpose again');
  assert.strictEqual(/Does the system use personal data/i.test(second.reply), false, 'Mongoose-like continuation must not ask an already answered personal-data question');
  assert.strictEqual(/Please describe what the AI system does/i.test(second.reply), false, 'Mongoose-like continuation must not use the old fallback');

  console.log('Mongoose message state regression passed.');
}

function runGenericSystemContinuationRegression() {
  const firstMessage = 'I am a compliance officer. I use an AI system to flag suspicious transactions based on customer profiles, payment history, IP address, and transaction amount.';
  const first = assessOntologyChat({
    project: null,
    messages: [{ sender: 'user', text: firstMessage, _id: 'generic-turn-1' }],
    previousState: {},
    chatId: 'generic-compliance-chat'
  });

  const firstFacts = first.state.confirmedFacts;
  const firstText = allText(first);

  assert.strictEqual(firstFacts.userRole, 'Compliance officer', 'Generic role should be extracted');
  assert.ok(/flag suspicious transactions/i.test(String(firstFacts.systemPurpose)), 'Generic purpose should be extracted');
  assert.ok(/customer profiles/i.test(String(firstFacts.systemInputs)), 'Generic input should include customer profiles');
  assert.ok(/payment history/i.test(String(firstFacts.systemInputs)), 'Generic input should include payment history');
  assert.ok(/IP address/i.test(String(firstFacts.systemInputs)), 'Generic input should include IP address');
  assert.ok(/transaction amount/i.test(String(firstFacts.systemInputs)), 'Generic input should include transaction amount');
  assert.ok(/Flag, detection, or classification/i.test(String(firstFacts.systemOutputs)), 'Generic output should be extracted');
  assert.ok(/Customers/i.test(String(firstFacts.affectedPersons)), 'Affected customers should be extracted');
  assert.strictEqual(firstFacts.processesPersonalData, true, 'Customer profile and transaction data should be treated as personal-data relevant');
  assert.ok(/flag suspicious transactions|accuracy|privacy|human review|directly decide/i.test(first.reply), 'Generic first response should be specific and ask a material next question');
  assert.strictEqual(/what do you use the ai for/i.test(first.reply), false, 'Generic first response must not ask the purpose again');
  assert.strictEqual(/I can continue the assessment from the facts you have provided so far/i.test(first.reply), false, 'Generic first response must not use the generic continuation fallback');
  assert.strictEqual(/EduSelect|student essays|job applicants|insurance claim/i.test(firstText), false, 'Generic chat must not contain unrelated project data');

  const second = assessOntologyChat({
    project: null,
    messages: [
      { sender: 'user', text: firstMessage, _id: 'generic-turn-1' },
      { sender: 'system', text: first.reply, _id: 'assistant-generic-turn-1' },
      { sender: 'user', text: 'continue then', _id: 'generic-turn-2' }
    ],
    previousState: first.state,
    chatId: 'generic-compliance-chat'
  });

  const secondFacts = second.state.confirmedFacts;
  const secondText = allText(second);

  assert.strictEqual(secondFacts.userRole, 'Compliance officer', 'Generic second turn should preserve role');
  assert.ok(/flag suspicious transactions/i.test(String(secondFacts.systemPurpose)), 'Generic second turn should preserve purpose');
  assert.ok(/customer profiles/i.test(String(secondFacts.systemInputs)), 'Generic second turn should preserve inputs');
  assert.ok(/flag suspicious transactions|accuracy|privacy|human review|directly decide|explanation|review/i.test(second.reply), 'Generic continuation should use preserved facts and continue assessment');
  assert.strictEqual(/what do you use the ai for/i.test(second.reply), false, 'Generic continuation must not ask the purpose again');
  assert.strictEqual(/I can continue the assessment from the facts you have provided so far/i.test(second.reply), false, 'Generic continuation must not use the old fallback');
  assert.strictEqual(/EduSelect|student essays|job applicants|insurance claim/i.test(secondText), false, 'Generic continuation must not contain unrelated chat data');
  assert.strictEqual(second.raw.stateLifecycle.chat_id, 'generic-compliance-chat', 'Lifecycle log should carry the generic chat ID');
  assert.strictEqual(second.raw.stateLifecycle.state_storage_key, 'ontology-chat:generic-compliance-chat', 'Lifecycle log should carry the generic state storage key');
  assert.ok(Object.keys(second.raw.stateLifecycle.loaded_previous_state.confirmedFacts || {}).length > 0, 'Lifecycle log should show previous generic state was loaded');
  assert.ok(Object.keys(second.raw.stateLifecycle.merged_state || {}).length >= Object.keys(first.state.confirmedFacts || {}).length, 'Lifecycle log should show generic state was merged, not replaced');

  console.log('Generic system continuation regression passed.');
}

runStressLensRegression();
runShiftFairRegression();
runEduSelectRegression();
runClaimAssistRegression();
runConversationalEducationFlow();
runStickyConflictRecoveryRegression();
runExplicitContradictionRegression();
runSessionIsolationRegression();
runExactTeacherReviewMultiTurnRegression();
runRecruitmentRankingContinuationRegression();
runExactRecruitmentHumanReviewRegression();
runEcommerceSupportContinuationRegression();
runMongooseMessageStateRegression();
runGenericSystemContinuationRegression();
