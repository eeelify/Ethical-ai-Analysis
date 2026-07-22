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

function allText(value) {
  return JSON.stringify(value);
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

runStressLensRegression();
runShiftFairRegression();
