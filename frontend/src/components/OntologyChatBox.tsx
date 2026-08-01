import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, ClipboardList, Loader2, MessageSquareText, Plus, RefreshCw, Send, Trash2, User as UserIcon } from 'lucide-react';
import { api } from '../api';
import { Project, User } from '../types';

type OntologyChatStatus = 'not_started' | 'needs_more_information' | 'completed' | 'error';
type OntologyPanel = 'chat' | 'output';

interface OntologyChatMessage {
  _id?: string;
  sender: 'user' | 'system';
  text: string;
  status?: OntologyChatStatus;
  ontologyResult?: Record<string, unknown> | null;
  createdAt?: string;
}

interface OntologyChatResponse {
  conversationId: string | null;
  title?: string;
  projectId?: string | null;
  projectTitle?: string | null;
  status: OntologyChatStatus;
  messages: OntologyChatMessage[];
  ontologyResult: Record<string, unknown> | null;
  confirmedFacts?: Record<string, unknown>;
  unknownFacts?: Record<string, unknown>;
  factEvidence?: unknown[];
  contradictions?: unknown[];
  assessmentVersion?: string;
  error?: string;
}

interface OntologyChatSummary {
  conversationId: string;
  title: string;
  projectId?: string | null;
  projectTitle?: string | null;
  status: OntologyChatStatus;
  messageCount?: number;
  lastMessage?: string;
  updatedAt?: string;
}

interface OntologyChatBoxProps {
  project?: Project | null;
  currentUser: User;
}

const getProjectId = (project?: Project | null) => (project ? (project.id || (project as any)._id || '').toString() : '');

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
  return true;
};

const normalizeLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function ValueBlock({ value }: { value: unknown }) {
  if (!hasValue(value)) {
    return <span className="text-slate-500">Not returned by ontology service</span>;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <span className="whitespace-pre-wrap text-slate-300">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="rounded-lg border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-slate-300">
            <ValueBlock value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="space-y-2">
        {Object.entries(value as Record<string, unknown>)
          .filter(([, item]) => hasValue(item))
          .map(([key, item]) => (
            <div key={key} className="text-sm">
              <div className="mb-1 text-xs font-semibold uppercase text-slate-500">{normalizeLabel(key)}</div>
              <ValueBlock value={item} />
            </div>
          ))}
      </div>
    );
  }

  return <span className="text-slate-300">{String(value)}</span>;
}

function ResultSection({ title, value }: { title: string; value: unknown }) {
  if (!hasValue(value)) return null;

  return (
    <section className="rounded-lg border border-white/10 bg-[#0a1122] p-4">
      <h4 className="mb-2 text-sm font-semibold text-white">{title}</h4>
      <ValueBlock value={value} />
    </section>
  );
}

function formatTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

type OverviewField = {
  label: string;
  value: string | string[];
};

type MainRisk = {
  title: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  reason: string;
  impact: string;
  existingSafeguard?: string;
};

type RegulatoryItem = {
  area: string;
  status: 'Likely applicable' | 'Possibly applicable' | 'Requires further assessment' | 'Not applicable';
  explanation: string;
  additionalInformation: string;
};

type BoundaryItem = {
  title: string;
  status: string;
  explanation: string;
};

type UserFacingReport = {
  title: string;
  overallAssessment: 'Low residual risk' | 'Moderate residual risk' | 'High residual risk' | 'Critical residual risk' | 'Insufficient information';
  overallExplanation: string;
  executiveSummary: string;
  overview: OverviewField[];
  risks: MainRisk[];
  safeguards: string[];
  missingQuestions: string[];
  regulatory: RegulatoryItem[];
  actions: string[];
  boundaries: BoundaryItem[];
  technicalSections: Array<[string, unknown]>;
};

const SCORE_FIELD_KEYS = new Set([
  'scoreBreakdown',
  'scoreComponents',
  'compositeScore',
  'overallRiskScore',
  'riskScore',
  'numericScore',
  'weightedScore',
  'scoreFormula',
  'safeguardAdjustments'
]);

const FRIENDLY_LABELS: Record<string, string> = {
  humanCanOverride: 'Human ability to override the recommendation',
  humanCanModify: 'Human ability to modify the recommendation',
  humanCanReject: 'Human ability to reject the recommendation',
  humanReviewAvailable: 'Human review before the final decision',
  decisionPublishedOnlyAfterHumanReview: 'Output published only after human review',
  explanationAvailable: 'Explanation available to the affected person',
  correctionRightAvailable: 'Right to correct inaccurate information',
  challengeMechanismAvailable: 'Challenge mechanism available',
  manualReviewAvailable: 'Manual reconsideration available',
  nonPenaltyForReviewRequest: 'No penalty for requesting manual review',
  accessRestricted: 'Restricted access to personal data',
  authorizedHRAndManagersOnly: 'Access limited to authorized staff',
  retentionPeriodDefined: 'Defined data-retention period',
  retentionPeriod: 'Defined data-retention period',
  employeesInformed: 'Affected people are informed about the data used',
  explicitConsent: 'Explicit or informed consent',
  legalBasisDocumented: 'Documented legal basis',
  purposeLimitation: 'Purpose limitation',
  withdrawalAvailable: 'Withdrawal right',
  participationVoluntary: 'Voluntary participation',
  wearableDataOptional: 'Optional wearable-data collection',
  WorkingTimeLimitControl: 'Working-time limit control',
  HumanOversight: 'Human review before the final decision',
  HumanCanOverride: 'Human ability to override the recommendation',
  HumanCanModify: 'Human ability to modify the recommendation',
  HumanCanReject: 'Human ability to reject the recommendation',
  TransparencyNotice: 'Clear notice about data use',
  ExplanationAvailable: 'Explanation available to the affected person',
  CorrectionRight: 'Right to correct inaccurate information',
  ChallengeMechanism: 'Challenge mechanism available',
  ManualReview: 'Manual reconsideration available',
  AccessControl: 'Restricted access to personal data',
  LimitedAuthorizedAccess: 'Access limited to authorized staff',
  RetentionPeriod: 'Defined data-retention period',
  NonPenaltyForReviewRequest: 'No penalty for requesting manual review',
  ExplicitConsent: 'Explicit or informed consent',
  LegalBasis: 'Documented legal basis',
  VoluntaryParticipation: 'Voluntary participation',
  WithdrawalRight: 'Withdrawal right',
  PurposeLimitation: 'Purpose limitation',
  PseudonymizationOrAnonymization: 'Pseudonymization, anonymization, or minimization',
  SecurityMeasures: 'Security controls for processed data'
};

const SAFEGUARD_FACT_KEYS = new Set([
  'humanCanOverride',
  'humanCanModify',
  'humanCanReject',
  'humanReviewAvailable',
  'decisionPublishedOnlyAfterHumanReview',
  'explanationAvailable',
  'correctionRightAvailable',
  'challengeMechanismAvailable',
  'manualReviewAvailable',
  'nonPenaltyForReviewRequest',
  'accessRestricted',
  'authorizedHRAndManagersOnly',
  'authorizedStaffOnly',
  'retentionPeriodDefined',
  'employeesInformed',
  'affectedPersonsInformed',
  'explicitConsent',
  'legalBasisDocumented',
  'purposeLimitation',
  'withdrawalAvailable',
  'participationVoluntary',
  'wearableDataOptional',
  'WorkingTimeLimitControl'
]);

const CONTEXT_PATTERNS = [
  { field: 'deploymentContext', value: 'Property-management deployment context', patterns: [/rental/i, /tenant/i, /property manager/i, /landlord/i] },
  { field: 'deploymentContext', value: 'Manufacturing workforce scheduling', patterns: [/manufacturing/i, /shift schedul/i, /workforce schedul/i] },
  { field: 'deploymentContext', value: 'Education and student-support context', patterns: [/student/i, /university/i, /school/i, /academic/i] },
  { field: 'deploymentContext', value: 'Healthcare or clinical support context', patterns: [/patient/i, /clinical/i, /medical/i, /diagnos/i] }
];

const INPUT_PATTERNS = [
  { value: 'Income information', patterns: [/income/i] },
  { value: 'Employment information', patterns: [/employment/i, /job status/i] },
  { value: 'Rental history', patterns: [/rental history/i, /tenant history/i] },
  { value: 'Household information', patterns: [/household/i] },
  { value: 'Landlord references', patterns: [/landlord reference/i, /reference/i] },
  { value: 'Applicant records', patterns: [/applicant/i, /application data/i] },
  { value: 'Employee availability', patterns: [/availability/i] },
  { value: 'Working-hour preferences', patterns: [/working-hour/i, /working hour/i, /preferred working hours/i] },
  { value: 'Job qualifications', patterns: [/qualification/i] },
  { value: 'Previous shift assignments', patterns: [/previous shift/i, /shift record/i] },
  { value: 'Maximum weekly working limits', patterns: [/weekly working limit/i, /working-time limit/i] },
  { value: 'HR records', patterns: [/\bHR\b/i, /human resources/i] },
  { value: 'Questionnaire responses', patterns: [/questionnaire/i] },
  { value: 'Written journal entries', patterns: [/journal/i] },
  { value: 'Attendance records', patterns: [/attendance/i] },
  { value: 'Academic performance data', patterns: [/academic performance/i] },
  { value: 'Wearable-device data', patterns: [/wearable/i, /smartwatch/i, /heart rate/i, /sleep pattern/i] }
];

const USER_PATTERNS = [
  { value: 'Property managers', patterns: [/property manager/i] },
  { value: 'HR staff', patterns: [/\bHR\b/i, /human resources/i] },
  { value: 'Managers', patterns: [/manager/i] },
  { value: 'University counselors', patterns: [/counselor/i, /counsellor/i] },
  { value: 'Clinical staff', patterns: [/clinician/i, /doctor/i, /nurse/i] }
];

const AFFECTED_PATTERNS = [
  { value: 'Rental applicants', patterns: [/rental applicant/i, /applicant/i, /tenant applicant/i] },
  { value: 'Employees', patterns: [/employee/i] },
  { value: 'Students', patterns: [/student/i] },
  { value: 'Patients', patterns: [/patient/i] },
  { value: 'Customers', patterns: [/customer/i] }
];

const OUTPUT_PATTERNS = [
  { value: 'Application suitability score', patterns: [/suitability score/i, /application score/i, /rental score/i] },
  { value: 'Recommendation', patterns: [/recommend/i] },
  { value: 'Recommended monthly shift schedule', patterns: [/monthly shift schedule/i, /shift schedule/i] },
  { value: 'Individual assessment score', patterns: [/\bscore\b/i] },
  { value: 'Explanation for the outcome', patterns: [/explanation/i, /reason/i] }
];

const DECISION_PATTERNS = [
  { value: 'Rental application review', patterns: [/rental application/i, /tenant application/i] },
  { value: 'Employee shift allocation', patterns: [/shift allocation/i, /shift schedule/i] },
  { value: 'Insurance claim assessment', patterns: [/claim assessment/i, /insurance claim/i] },
  { value: 'Student support prioritization', patterns: [/student/i, /counselor/i, /intervention/i] },
  { value: 'Individual suitability assessment', patterns: [/suitability/i, /\bindividual risk score\b/i, /\bassessment score\b/i] }
];

const toRecord = (value: unknown): Record<string, any> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};

const toArray = (value: unknown): any[] => Array.isArray(value) ? value : [];

const readableText = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
};

const isProvidedText = (value: unknown) => {
  const text = readableText(value);
  return Boolean(text && !/not yet established|purpose not yet established|deployment context not yet established/i.test(text));
};

const uniqueStrings = (items: Array<string | null | undefined>) =>
  Array.from(new Set(items.map((item) => readableText(item)).filter(Boolean)));

const labelize = (value: unknown): string => {
  const raw = readableText(value);
  if (!raw) return '';
  const mapped = FRIENDLY_LABELS[raw];
  if (mapped) return mapped;
  return normalizeLabel(raw)
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bHr\b/g, 'HR')
    .replace(/\bGdpr\b/g, 'GDPR')
    .replace(/\bKvkk\b/g, 'KVKK')
    .replace(/\bEu\b/g, 'EU')
    .replace(/^./, (letter) => letter.toUpperCase());
};

const readStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return uniqueStrings(value.map((item) => readableText(item)));
  const text = readableText(value);
  return text ? [text] : [];
};

const matchesAny = (text: string, patterns: RegExp[]) => patterns.some((pattern) => pattern.test(text));

const collectConversationText = (project: Project | null | undefined, messages: OntologyChatMessage[]) => [
  project?.title,
  (project as any)?.shortDescription,
  (project as any)?.fullDescription,
  ...messages.filter((item) => item.sender === 'user').map((item) => item.text)
].map((item) => readableText(item)).filter(Boolean).join(' ');

const inferListFromText = (text: string, patterns: Array<{ value: string; patterns: RegExp[] }>) =>
  uniqueStrings(patterns.filter((item) => matchesAny(text, item.patterns)).map((item) => item.value));

function confirmedFactMap(result: Record<string, unknown> | null): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  const raw = result?.confirmedFacts;
  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      const record = toRecord(item);
      if (record.fact) map[String(record.fact)] = record.value;
      if (record.value && typeof record.value === 'string' && record.value in FRIENDLY_LABELS) {
        map[String(record.value)] = true;
      }
    });
  } else if (raw && typeof raw === 'object') {
    Object.assign(map, raw as Record<string, unknown>);
  }
  return map;
}

function hasConfirmedSafeguard(labels: string[], patterns: RegExp[]) {
  return labels.some((label) => matchesAny(label, patterns));
}

function sanitizeTechnicalValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeTechnicalValue).filter((item) => hasValue(item));
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !SCORE_FIELD_KEYS.has(key))
      .map(([key, item]) => [key, sanitizeTechnicalValue(item)] as [string, unknown])
      .filter(([, item]) => hasValue(item));
    return Object.fromEntries(entries);
  }
  return value;
}

function buildSystemOverview(result: Record<string, unknown> | null, project: Project | null | undefined, messages: OntologyChatMessage[]) {
  const understanding = toRecord(result?.systemUnderstanding);
  const text = collectConversationText(project, messages);
  const inferredUsers = inferListFromText(text, USER_PATTERNS);
  const inferredAffected = inferListFromText(text, AFFECTED_PATTERNS);
  const inferredInputs = inferListFromText(text, INPUT_PATTERNS);
  const inferredOutputs = inferListFromText(text, OUTPUT_PATTERNS);
  const inferredDecisions = inferListFromText(text, DECISION_PATTERNS);
  const inferredContext = CONTEXT_PATTERNS.find((item) => matchesAny(text, item.patterns))?.value || '';

  const purpose = isProvidedText(understanding.purpose)
    ? readableText(understanding.purpose)
    : readableText((project as any)?.fullDescription || (project as any)?.shortDescription || project?.title);

  const users = uniqueStrings([...readStringArray(understanding.users), ...inferredUsers]);
  const affectedPersons = uniqueStrings([...readStringArray(understanding.affectedPersons), ...inferredAffected]);
  const inputs = uniqueStrings([...readStringArray(understanding.inputs), ...inferredInputs]);
  const resultOutputs = readStringArray(understanding.outputs);
  const resultDecisions = readStringArray(understanding.decisionsSupported);
  const outputs = uniqueStrings(resultOutputs.length ? resultOutputs : inferredOutputs);
  const decisionsSupported = uniqueStrings(resultDecisions.length ? resultDecisions : inferredDecisions);
  const humanRole = isProvidedText(understanding.humanRole) ? readableText(understanding.humanRole) : '';
  const deploymentContext = isProvidedText(understanding.deploymentContext) ? readableText(understanding.deploymentContext) : inferredContext;

  return {
    purpose,
    users,
    affectedPersons,
    inputs,
    outputs,
    decisionsSupported,
    humanRole,
    deploymentContext
  };
}

function isUnsupportedForCurrentContext(text: string, contextText: string) {
  const lower = text.toLowerCase();
  const context = contextText.toLowerCase();
  const educationTerms = ['student', 'counselor', 'counsellor', 'grading', 'proctoring', 'academic', 'stress'];
  const healthTerms = ['medical diagnosis', 'clinical', 'treatment', 'misdiagnosis'];
  const contentTerms = ['filter bubble', 'content recommendation'];
  const hasEducationContext = /(student|university|school|academic|counselor|counsellor|stress|proctor|grading)/i.test(context);
  const hasHealthContext = /(medical|clinical|patient|diagnos|treatment|health data|biometric)/i.test(context);
  const hasContentContext = /(content recommendation|news feed|personalized content|filter bubble)/i.test(context);
  if (!hasEducationContext && educationTerms.some((term) => lower.includes(term))) return true;
  if (!hasHealthContext && healthTerms.some((term) => lower.includes(term))) return true;
  if (!hasContentContext && contentTerms.some((term) => lower.includes(term))) return true;
  return false;
}

function severityForRisk(risk: Record<string, any>, safeguardLabels: string[]): MainRisk['severity'] {
  const status = readableText(risk.severity || risk.status).toLowerCase();
  const text = `${risk.value || ''} ${risk.reason || ''}`.toLowerCase();
  const hasHumanControl = hasConfirmedSafeguard(safeguardLabels, [/human/i, /manual/i, /override/i, /modify/i, /reject/i]);
  const hasDataControls = hasConfirmedSafeguard(safeguardLabels, [/access/i, /retention/i, /security/i, /restricted/i]);

  if (/critical|prohibited|severe/.test(status) || /prohibited|severe harm/.test(text)) return 'Critical';
  if (/high/.test(status)) return 'High';
  if (/privacy|unauthorized|personal data/.test(text) && !hasDataControls) return 'High';
  if (/discriminat|bias|unfair/.test(text) && !hasHumanControl) return 'High';
  if (/likely/.test(status)) return 'Moderate';
  if (/possible|requires/.test(status)) return 'Moderate';
  return 'Low';
}

function impactForRisk(title: string) {
  const text = title.toLowerCase();
  if (/discriminat|bias|unfair|fair/.test(text)) {
    return 'Affected people may receive systematically worse outcomes or reduced access to the opportunity.';
  }
  if (/incorrect|inaccurate|outdated|quality|unsuitable/.test(text)) {
    return 'A decision-maker may rely on wrong information and produce an unsuitable outcome.';
  }
  if (/privacy|access|personal data|record/.test(text)) {
    return 'Personal records may be exposed, accessed by unauthorized people, or used beyond the stated purpose.';
  }
  if (/explanation|transparency/.test(text)) {
    return 'Affected people may not understand the outcome or how to challenge it.';
  }
  if (/over-reliance|automation|human review/.test(text)) {
    return 'Human reviewers may follow the AI output without enough independent assessment.';
  }
  if (/workload|working-time|shift/.test(text)) {
    return 'Affected people may receive assignments that create avoidable burden or rule violations.';
  }
  return 'Affected people may experience an unfair, incorrect, or insufficiently explained outcome.';
}

function safeguardForRisk(title: string, labels: string[]) {
  const text = title.toLowerCase();
  const candidates = [
    { patterns: [/privacy|access|record|personal data/], labels: [/access/i, /retention/i, /security/i, /restricted/i] },
    { patterns: [/incorrect|inaccurate|outdated|quality/], labels: [/correct/i, /challenge/i, /manual/i] },
    { patterns: [/over-reliance|automation|decision|review/], labels: [/human/i, /override/i, /modify/i, /reject/i, /manual/i] },
    { patterns: [/explanation|transparency/], labels: [/explanation/i, /notice/i, /informed/i] },
    { patterns: [/discriminat|bias|unfair|fair/], labels: [/human/i, /fairness/i, /review/i, /challenge/i] },
    { patterns: [/workload|working-time|shift/], labels: [/working-time/i, /human/i, /review/i] }
  ];
  const match = candidates.find((item) => matchesAny(text, item.patterns));
  if (!match) return labels[0];
  return labels.find((label) => matchesAny(label, match.labels));
}

function buildSafeguardLabels(result: Record<string, unknown> | null, facts: Record<string, unknown>) {
  const confirmed = toArray(toRecord(result?.safeguards).confirmed);
  const fromResult = confirmed.map((item) => {
    const record = toRecord(item);
    const base = labelize(record.value || record.fact || record.label);
    if ((record.value || record.fact) === 'RetentionPeriod' && facts.retentionPeriod) {
      return `${base} (${facts.retentionPeriod})`;
    }
    return base;
  });
  const fromFacts = Object.entries(facts)
    .filter(([key, value]) => value === true && SAFEGUARD_FACT_KEYS.has(key))
    .map(([key]) => labelize(key))
    .filter(Boolean);
  if (facts.retentionPeriod && !fromResult.some((label) => /retention/i.test(label))) {
    fromResult.push(`Defined data-retention period (${facts.retentionPeriod})`);
  }
  return uniqueStrings([...fromResult, ...fromFacts]);
}

function buildRisks(result: Record<string, unknown> | null, overview: ReturnType<typeof buildSystemOverview>, facts: Record<string, unknown>, safeguardLabels: string[], contextText: string): MainRisk[] {
  const rawRisks = toArray(result?.primaryRisks)
    .filter((item) => {
      const record = toRecord(item);
      return !isUnsupportedForCurrentContext(`${record.value || ''} ${record.reason || ''}`, contextText);
    })
    .map((item) => {
      const record = toRecord(item);
      const title = labelize(record.title || record.value || 'Potential harm');
      return {
        title,
        severity: severityForRisk(record, safeguardLabels),
        reason: readableText(record.reason) || 'The available facts indicate that this concern may apply to the current system.',
        impact: readableText(record.impact) || impactForRisk(title),
        existingSafeguard: safeguardForRisk(title, safeguardLabels)
      };
    });

  if (rawRisks.length) {
    return rawRisks.slice(0, 8);
  }

  const text = contextText.toLowerCase();
  const generated: MainRisk[] = [];
  const hasPersonalData = Boolean(facts.processesPersonalData) || /(personal data|income|employment|rental history|household|applicant|employee|student|patient)/i.test(contextText);
  const hasHumanReview = hasConfirmedSafeguard(safeguardLabels, [/human/i, /manual/i, /manager/i, /override/i, /modify/i, /reject/i]) || /human|manager|manual review|final decision/i.test(contextText);
  const hasExplanation = hasConfirmedSafeguard(safeguardLabels, [/explanation/i, /reason/i]);
  const isRental = /rental|tenant|property manager|landlord|applicant/.test(text);

  if (isRental) {
    generated.push({
      title: 'Discriminatory rental outcomes',
      severity: hasHumanReview ? 'Moderate' : 'High',
      reason: 'Applicant data can indirectly disadvantage protected or vulnerable groups if the suitability recommendation is not tested for unfair patterns.',
      impact: 'Qualified applicants may receive systematically lower suitability assessments.',
      existingSafeguard: safeguardForRisk('Discriminatory rental outcomes', safeguardLabels)
    });
    generated.push({
      title: 'Incorrect or outdated applicant information',
      severity: 'Moderate',
      reason: 'Income, employment, rental-history, household, or reference data may be incomplete or outdated.',
      impact: 'A qualified applicant may be rejected or ranked lower because the recommendation relies on inaccurate information.',
      existingSafeguard: safeguardForRisk('Incorrect applicant information', safeguardLabels)
    });
    generated.push({
      title: 'Excessive reliance on the suitability score',
      severity: hasHumanReview ? 'Moderate' : 'High',
      reason: 'Property managers may treat the AI score as decisive unless review expectations are clearly documented.',
      impact: 'The final decision may become effectively automated even when human review is expected.',
      existingSafeguard: safeguardForRisk('Excessive reliance on the score', safeguardLabels)
    });
  }

  if (hasPersonalData) {
    generated.push({
      title: 'Privacy or unauthorized access',
      severity: hasConfirmedSafeguard(safeguardLabels, [/access/i, /restricted/i]) ? 'Moderate' : 'High',
      reason: 'The system uses personal data and therefore needs clear access, retention, deletion, and security controls.',
      impact: 'Personal records may be exposed or used beyond the purpose described to affected people.',
      existingSafeguard: safeguardForRisk('Privacy or unauthorized access', safeguardLabels)
    });
  }
  if ((overview.outputs.length || overview.decisionsSupported.length) && !hasExplanation) {
    generated.push({
      title: 'Insufficient explanation of the outcome',
      severity: 'Moderate',
      reason: 'Affected people need to understand the main reasons for an AI-supported outcome that can affect them.',
      impact: 'Affected people may be unable to identify mistakes or challenge an unsuitable outcome.',
      existingSafeguard: safeguardForRisk('Insufficient explanation of the outcome', safeguardLabels)
    });
  }
  if ((overview.decisionsSupported.length || overview.outputs.length) && !hasHumanReview) {
    generated.push({
      title: 'Unclear human review',
      severity: 'High',
      reason: 'The current facts do not clearly establish who makes the final decision or whether they can reject the AI output.',
      impact: 'The AI output may become more influential than intended.',
      existingSafeguard: safeguardForRisk('Unclear human review', safeguardLabels)
    });
  }

  const merged = [...rawRisks, ...generated].filter((risk, index, items) =>
    items.findIndex((item) => item.title.toLowerCase() === risk.title.toLowerCase()) === index
  );
  return merged.slice(0, 8);
}

function buildMissingQuestions(overview: ReturnType<typeof buildSystemOverview>, facts: Record<string, unknown>, safeguardLabels: string[], contextText: string) {
  const questions: string[] = [];
  const hasPersonalData = Boolean(facts.processesPersonalData) || /(personal data|income|employment|rental history|household|applicant|employee|student|patient)/i.test(contextText);
  const affected = overview.affectedPersons[0] || 'affected people';
  const isRental = /rental|tenant|property manager|landlord|applicant/i.test(contextText);

  if (!overview.purpose) questions.push('What is the main purpose of the AI system?');
  if (!overview.affectedPersons.length) questions.push('Which people are affected by the AI-supported outcome?');
  if (hasPersonalData && !hasConfirmedSafeguard(safeguardLabels, [/access/i, /restricted/i])) {
    questions.push(isRental ? 'Who can access applicant records?' : 'Who can access the personal data used by the system?');
  }
  if (hasPersonalData && !hasConfirmedSafeguard(safeguardLabels, [/retention/i])) {
    questions.push(isRental ? 'How long is application data retained?' : 'How long is the processed personal data retained?');
  }
  if ((overview.outputs.length || overview.decisionsSupported.length) && !hasConfirmedSafeguard(safeguardLabels, [/human/i, /manual/i, /override/i, /modify/i, /reject/i])) {
    questions.push('Who makes the final decision, and can they ignore or override the AI output?');
  }
  if ((overview.outputs.length || overview.decisionsSupported.length) && !hasConfirmedSafeguard(safeguardLabels, [/explanation/i, /reason/i])) {
    questions.push(`What explanation is provided to ${affected.toLowerCase()} about the outcome?`);
  }
  if (!hasConfirmedSafeguard(safeguardLabels, [/correct/i, /challenge/i, /appeal/i, /manual reconsideration/i])) {
    questions.push(`Can ${affected.toLowerCase()} correct inaccurate information or request a manual review?`);
  }
  if (isRental) {
    questions.push('Is the system regularly tested for discriminatory rental outcomes?');
    questions.push('Is applicant data used to train future models?');
  }

  return uniqueStrings(questions).slice(0, 4);
}

function readableRegulatoryStatus(value: unknown): RegulatoryItem['status'] {
  const status = readableText(value).toLowerCase();
  if (/not/.test(status)) return 'Not applicable';
  if (/likely/.test(status)) return 'Likely applicable';
  if (/possible/.test(status)) return 'Possibly applicable';
  return 'Requires further assessment';
}

function buildRegulatoryItems(result: Record<string, unknown> | null, facts: Record<string, unknown>, contextText: string): RegulatoryItem[] {
  const fromResult = toArray(result?.regulatoryConsiderations)
    .filter((item) => !isUnsupportedForCurrentContext(`${toRecord(item).value || ''} ${toRecord(item).reason || ''}`, contextText))
    .map((item) => {
      const record = toRecord(item);
      const missing = readStringArray(record.missingConditions).map(labelize).join(', ');
      return {
        area: labelize(record.value || 'Regulatory review'),
        status: readableRegulatoryStatus(record.applicabilityStatus || record.status),
        explanation: readableText(record.reason) || 'This legal area may apply depending on implementation details.',
        additionalInformation: missing || 'No additional information identified from the current facts.'
      };
    });

  if (fromResult.length) {
    return fromResult.slice(0, 5);
  }

  const generated: RegulatoryItem[] = [];
  if (facts.processesPersonalData || /(personal data|income|employment|rental history|household|applicant)/i.test(contextText)) {
    generated.push({
      area: 'Data protection and privacy law',
      status: 'Likely applicable',
      explanation: 'The system appears to process personal data and should evidence lawfulness, transparency, minimization, access control, retention, and deletion controls.',
      additionalInformation: 'Confirm lawful basis, access permissions, retention period, deletion process, and whether data is reused for training.'
    });
  }
  if (/(score|recommend|rank|prioriti|suitability|decision)/i.test(contextText)) {
    generated.push({
      area: 'Automated decision-support and profiling review',
      status: 'Requires further assessment',
      explanation: 'The system may support a decision about a person, but legal classification depends on the effect of the output and the human decision process.',
      additionalInformation: 'Confirm whether the output is advisory or binding, who makes the final decision, and whether affected people can challenge it.'
    });
  }

  return [...fromResult, ...generated]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.area.toLowerCase() === item.area.toLowerCase()) === index)
    .slice(0, 5);
}

function buildRecommendedActions(result: Record<string, unknown> | null, overview: ReturnType<typeof buildSystemOverview>, risks: MainRisk[], safeguardLabels: string[], contextText: string) {
  const fromResult = toArray(result?.recommendedActions)
    .map((item) => {
      const record = toRecord(item);
      return readableText(record.value || record.action || record.recommendation || item);
    })
    .filter((action) => action && !isUnsupportedForCurrentContext(action, contextText));

  if (fromResult.length) {
    return uniqueStrings(fromResult).slice(0, 7);
  }

  const actions: string[] = [];
  const decision = overview.decisionsSupported[0] || 'AI-supported outcome';
  const inputPhrase = overview.inputs.length ? overview.inputs.slice(0, 4).join(', ') : 'each input';
  const affected = overview.affectedPersons[0] || 'affected people';
  const hasPersonalData = /(personal data|income|employment|rental history|household|applicant|employee|student|patient)/i.test(contextText);

  actions.push(`Document how ${inputPhrase} affects the ${decision.toLowerCase()}.`);
  if (risks.some((risk) => /discriminat|bias|unfair|fair/i.test(risk.title))) {
    actions.push(`Test outcomes across relevant ${affected.toLowerCase()} groups for unfair patterns.`);
  }
  if (overview.outputs.length || overview.decisionsSupported.length) {
    actions.push('Require human decision-makers to record the reason for the final outcome.');
  }
  if (hasPersonalData) {
    actions.push('Define access, retention, deletion, and security controls for the personal data used by the system.');
  }
  if (!hasConfirmedSafeguard(safeguardLabels, [/explanation/i, /reason/i])) {
    actions.push(`Provide ${affected.toLowerCase()} with a clear explanation of the AI-supported outcome.`);
  }
  if (!hasConfirmedSafeguard(safeguardLabels, [/correct/i, /challenge/i, /appeal/i, /manual reconsideration/i])) {
    actions.push(`Provide ${affected.toLowerCase()} with a correction and manual-review process.`);
  }
  if (/train|training|retrain|model improvement|reuse/i.test(contextText)) {
    actions.push('Document whether current data may be reused for model training and apply restrictions where needed.');
  }

  return uniqueStrings(actions).slice(0, 7);
}

function buildBoundaries(result: Record<string, unknown> | null, overview: ReturnType<typeof buildSystemOverview>, facts: Record<string, unknown>, safeguardLabels: string[], contextText: string): BoundaryItem[] {
  const boundaries: BoundaryItem[] = [];
  const hasHumanFinalRole = overview.humanRole || hasConfirmedSafeguard(safeguardLabels, [/human/i, /manual/i, /override/i, /modify/i, /reject/i]);
  if (hasHumanFinalRole && (overview.outputs.length || overview.decisionsSupported.length)) {
    boundaries.push({
      title: 'Fully automated decision',
      status: 'Not applicable',
      explanation: `The AI output is treated as decision support; ${overview.humanRole || 'a human reviewer remains responsible for the final outcome'}.`
    });
  }

  const excluded = toArray(result?.excludedClassifications || result?.excludedUseCases)
    .filter((item) => {
      const record = toRecord(item);
      const combined = `${record.value || ''} ${record.reason || ''}`;
      if (isUnsupportedForCurrentContext(combined, contextText)) return false;
      return /medical|diagnosis|hiring|firing|promotion|salary|disciplinary|facial|emotion|biometric|health/i.test(combined);
    });

  const employmentExcluded = excluded.filter((item) => /HiringDecisionAI|FiringDecisionAI|PromotionDecisionAI|SalaryDecisionAI|DisciplinaryDecisionAI/i.test(readableText(toRecord(item).value)));
  if (employmentExcluded.length) {
    boundaries.push({
      title: 'Hiring, firing, salary, promotion, or disciplinary decisions',
      status: 'Not applicable',
      explanation: 'The current facts explicitly exclude these employment decisions from the system boundary.'
    });
  }
  const biometricExcluded = excluded.filter((item) => /FacialRecognitionAI|EmotionRecognitionAI|BiometricDataProcessing/i.test(readableText(toRecord(item).value)));
  if (biometricExcluded.length) {
    boundaries.push({
      title: 'Biometric, facial, or emotion-recognition processing',
      status: 'Not applicable',
      explanation: 'The current facts explicitly state that this functionality is not used.'
    });
  }
  if (excluded.some((item) => /MedicalDiagnosisAI|HealthDataProcessing/i.test(readableText(toRecord(item).value)))) {
    boundaries.push({
      title: 'Medical diagnosis or health-data processing',
      status: 'Not applicable',
      explanation: 'The current facts explicitly exclude medical diagnosis or health-data processing from the system boundary.'
    });
  }

  return boundaries.filter((item, index, items) => items.findIndex((candidate) => candidate.title === item.title) === index).slice(0, 4);
}

function buildExecutiveSummary(report: {
  overview: ReturnType<typeof buildSystemOverview>;
  risks: MainRisk[];
  safeguards: string[];
}) {
  const { overview, risks, safeguards } = report;
  const sentences = [];
  if (overview.purpose) sentences.push(`The system is described as: ${overview.purpose}`);
  if (overview.users.length || overview.affectedPersons.length) {
    sentences.push(`${overview.users.length ? overview.users.join(', ') : 'The project team'} use it, and ${overview.affectedPersons.length ? overview.affectedPersons.join(', ') : 'affected people'} may be affected.`);
  }
  if (overview.outputs.length || overview.decisionsSupported.length) {
    sentences.push(`It produces ${overview.outputs.length ? overview.outputs.join(', ').toLowerCase() : 'AI-supported outputs'} for ${overview.decisionsSupported.length ? overview.decisionsSupported.join(', ').toLowerCase() : 'a decision-support process'}.`);
  }
  sentences.push(overview.humanRole ? `The AI output appears advisory because ${overview.humanRole}` : 'The final human decision role is not yet clearly established.');
  if (risks[0]) sentences.push(`The main concern is ${risks[0].title.toLowerCase()}.`);
  if (safeguards[0]) sentences.push(`The strongest confirmed safeguard is ${safeguards[0].toLowerCase()}.`);
  return sentences.slice(0, 5).join(' ');
}

function determineOverallAssessment(overview: ReturnType<typeof buildSystemOverview>, risks: MainRisk[], safeguards: string[], missingQuestions: string[], facts: Record<string, unknown>) {
  const humanControl = hasConfirmedSafeguard(safeguards, [/human/i, /manual/i, /override/i, /modify/i, /reject/i]) || Boolean(overview.humanRole);
  const meaningfulImpact = Boolean(overview.decisionsSupported.length || overview.outputs.length || facts.producesIndividualRiskScore);
  const sensitiveOrIntrusive = Boolean(facts.processesHealthRelatedData || facts.processesHealthData === true || facts.processesBiometricData === true || facts.usesFacialRecognition === true || facts.usesEmotionDetection === true);
  const highRisk = risks.some((risk) => risk.severity === 'High');
  const criticalRisk = risks.some((risk) => risk.severity === 'Critical');

  if (!overview.purpose || !overview.affectedPersons.length || (!overview.inputs.length && !facts.processesPersonalData) || (meaningfulImpact && !overview.humanRole && !humanControl)) {
    return {
      value: 'Insufficient information' as const,
      explanation: 'The purpose, affected people, processed data, decision effect, or human role is not yet established clearly enough for a final qualitative assessment.'
    };
  }
  if (criticalRisk || (sensitiveOrIntrusive && !humanControl)) {
    return {
      value: 'Critical residual risk' as const,
      explanation: 'Severe or highly intrusive harm remains plausible and meaningful human control or protection is not sufficiently established.'
    };
  }
  if (highRisk || (!humanControl && meaningfulImpact) || missingQuestions.some((question) => /human|final decision|access|retained|discriminatory/i.test(question))) {
    return {
      value: 'High residual risk' as const,
      explanation: 'Important fairness, privacy, or decision-impact concerns remain and at least one key safeguard still needs evidence.'
    };
  }
  if (facts.processesPersonalData || meaningfulImpact || risks.some((risk) => risk.severity === 'Moderate')) {
    return {
      value: 'Moderate residual risk' as const,
      explanation: 'The system may affect people or process personal data, but confirmed safeguards make the remaining concerns manageable.'
    };
  }
  return {
    value: 'Low residual risk' as const,
    explanation: 'The current facts indicate limited impact, low data sensitivity, meaningful human control, and no major missing safeguards.'
  };
}

function buildUserFacingReport({
  result,
  project,
  messages,
  conversationTitle,
  conversationProjectTitle
}: {
  result: Record<string, unknown>;
  project?: Project | null;
  messages: OntologyChatMessage[];
  conversationTitle: string;
  conversationProjectTitle: string | null;
}): UserFacingReport {
  const facts = confirmedFactMap(result);
  const contextText = collectConversationText(project, messages);
  const overview = buildSystemOverview(result, project, messages);
  const safeguards = buildSafeguardLabels(result, facts);
  const risks = buildRisks(result, overview, facts, safeguards, contextText);
  const missingQuestions = buildMissingQuestions(overview, facts, safeguards, contextText);
  const regulatory = buildRegulatoryItems(result, facts, contextText);
  const actions = buildRecommendedActions(result, overview, risks, safeguards, contextText);
  const boundaries = buildBoundaries(result, overview, facts, safeguards, contextText);
  const overall = determineOverallAssessment(overview, risks, safeguards, missingQuestions, facts);
  const overviewFields: OverviewField[] = [
    { label: 'Purpose', value: overview.purpose || 'Not yet provided' },
    { label: 'Primary users', value: overview.users.length ? overview.users : 'Not yet provided' },
    { label: 'Affected people', value: overview.affectedPersons.length ? overview.affectedPersons : 'Not yet provided' },
    { label: 'Main inputs', value: overview.inputs.length ? overview.inputs : 'Not yet provided' },
    { label: 'Main outputs', value: overview.outputs.length ? overview.outputs : 'Not yet provided' },
    { label: 'Decision supported', value: overview.decisionsSupported.length ? overview.decisionsSupported : 'Not yet provided' },
    { label: 'Human role', value: overview.humanRole || 'Not yet provided' },
    { label: 'Deployment context', value: overview.deploymentContext || 'Not yet provided' }
  ];

  return {
    title: `${conversationProjectTitle || project?.title || conversationTitle || 'Ontology'} Assessment`,
    overallAssessment: overall.value,
    overallExplanation: overall.explanation,
    executiveSummary: buildExecutiveSummary({ overview, risks, safeguards }),
    overview: overviewFields,
    risks,
    safeguards,
    missingQuestions,
    regulatory,
    actions,
    boundaries,
    technicalSections: [
      ['Structured facts', sanitizeTechnicalValue(result.confirmedFacts)],
      ['Safeguards and evidence', sanitizeTechnicalValue(result.safeguards)],
      ['Classifications and boundaries', sanitizeTechnicalValue({
        classifications: result.classifications,
        excludedClassifications: result.excludedClassifications || result.excludedUseCases,
        decisionEffects: result.decisionEffects,
        nonApplicableRisks: result.nonApplicableRisks
      })],
      ['Regulatory raw findings', sanitizeTechnicalValue(result.regulatoryConsiderations)],
      ['Reasoning trace', sanitizeTechnicalValue(result.reasoningTrace)]
    ]
  };
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0">
      <h4 className="mb-3 border-b border-white/10 pb-2 text-sm font-semibold text-white">{title}</h4>
      {children}
    </section>
  );
}

function InlineList({ value }: { value: string | string[] }) {
  const items = Array.isArray(value) ? value : [value];
  return <span>{items.join(', ')}</span>;
}

function OntologyOutputPanel({ report }: { report: UserFacingReport }) {
  const regulatoryItems = [...report.regulatory, ...report.boundaries].slice(0, 6);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-cyan-500/20 bg-[#071927] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-white">Ontology output</h4>
            <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-300">{report.executiveSummary}</p>
          </div>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
            {report.overallAssessment}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">{report.overallExplanation}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <ReportSection title="System Mapping">
            <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              {report.overview.map((field) => (
                <div key={field.label} className="min-h-[92px] rounded-lg border border-white/10 bg-[#050b14] p-3">
                  <div className="mb-1 text-xs font-semibold uppercase text-slate-500">{field.label}</div>
                  <InlineList value={field.value} />
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Main Risks">
            {report.risks.length ? (
              <div className="space-y-3">
                {report.risks.slice(0, 4).map((risk) => (
                  <div key={risk.title} className="rounded-lg border border-white/10 bg-[#050b14] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium text-white">{risk.title}</div>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-300">{risk.severity}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{risk.reason}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{risk.impact}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No material risks identified from the current facts.</p>
            )}
          </ReportSection>

          {regulatoryItems.length ? (
            <ReportSection title="Regulatory Boundaries">
              <div className="grid gap-3 lg:grid-cols-2">
                {regulatoryItems.map((item: any) => (
                  <div key={`${item.area || item.title}-${item.status}`} className="rounded-lg border border-white/10 bg-[#050b14] p-3">
                    <div className="text-sm font-medium text-white">{item.area || item.title}</div>
                    <div className="mt-1 text-xs font-semibold uppercase text-slate-500">{item.status}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </ReportSection>
          ) : null}
        </div>

        <div className="space-y-6">
          <ReportSection title="Safeguards">
            {report.safeguards.length ? (
              <ul className="space-y-2 text-sm text-slate-300">
                {report.safeguards.slice(0, 6).map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-[#050b14] px-3 py-2">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No confirmed safeguards yet.</p>
            )}
          </ReportSection>

          <ReportSection title="Next Actions">
            {report.actions.length ? (
              <ul className="space-y-2 text-sm text-slate-300">
                {report.actions.slice(0, 6).map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-[#050b14] px-3 py-2">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No additional action generated.</p>
            )}
          </ReportSection>

          {report.missingQuestions.length ? (
            <ReportSection title="Open Questions">
              <ul className="space-y-2 text-sm text-slate-300">
                {report.missingQuestions.map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-[#050b14] px-3 py-2">{item}</li>
                ))}
              </ul>
            </ReportSection>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function OntologyChatBox({ project, currentUser }: OntologyChatBoxProps) {
  const projectId = getProjectId(project);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationTitle, setConversationTitle] = useState('New ontology chat');
  const [conversationProjectId, setConversationProjectId] = useState<string | null>(null);
  const [conversationProjectTitle, setConversationProjectTitle] = useState<string | null>(null);
  const [conversations, setConversations] = useState<OntologyChatSummary[]>([]);
  const [messages, setMessages] = useState<OntologyChatMessage[]>([]);
  const [status, setStatus] = useState<OntologyChatStatus>('not_started');
  const [ontologyResult, setOntologyResult] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<OntologyPanel>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const statusClass = {
    not_started: 'border-slate-700 bg-[#0b1221]/5 text-slate-300',
    needs_more_information: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    completed: 'border-green-500/30 bg-green-500/10 text-green-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300'
  }[status];

  const statusLabel = {
    not_started: 'Not started',
    needs_more_information: 'Needs more information',
    completed: 'Completed',
    error: 'Service error'
  }[status];

  const userReport = useMemo(() => {
    if (!ontologyResult) return null;
    return buildUserFacingReport({
      result: ontologyResult,
      project,
      messages,
      conversationTitle,
      conversationProjectTitle
    });
  }, [ontologyResult, project, messages, conversationTitle, conversationProjectTitle]);

  const applyResponse = (payload: OntologyChatResponse) => {
    setConversationId(payload.conversationId || null);
    setConversationTitle(payload.title || 'New ontology chat');
    setConversationProjectId(payload.projectId || null);
    setConversationProjectTitle(payload.projectTitle || null);
    setMessages(payload.messages || []);
    setStatus(payload.status || 'not_started');
    setOntologyResult(payload.ontologyResult || null);
    setActivePanel(payload.status === 'completed' && payload.ontologyResult ? 'output' : 'chat');
  };

  const applyEmptyChat = () => {
    applyResponse({
      conversationId: null,
      title: 'New ontology chat',
      projectId: projectId || null,
      projectTitle: project?.title || null,
      status: 'not_started',
      messages: [],
      ontologyResult: null
    });
  };

  const loadConversationById = async (nextConversationId: string) => {
    const response = await fetch(api(`/api/ontology-chat/${nextConversationId}?userId=${encodeURIComponent(currentUser.id)}`));
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `Request failed with ${response.status}`);
    }
    applyResponse(payload);
  };

  const loadConversations = async (preferredConversationId?: string | null) => {
    if (!currentUser.id) return;

    setLoadingHistory(true);
    setError(null);
    try {
      const response = await fetch(api(`/api/ontology-chat?userId=${encodeURIComponent(currentUser.id)}`));
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `Request failed with ${response.status}`);
      }

      setConversations(payload.conversations || []);
      if (preferredConversationId) {
        await loadConversationById(preferredConversationId);
      } else {
        applyEmptyChat();
      }
    } catch (err: any) {
      setError(err.message || 'Ontology chat could not be loaded.');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUser.id, projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const createConversation = async () => {
    const endpoint = projectId ? `/api/projects/${projectId}/ontology-chat` : '/api/ontology-chat';
    const response = await fetch(api(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        ...(projectId ? { projectId } : {})
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `Request failed with ${response.status}`);
    }
    applyResponse(payload);
    await loadConversations(payload.conversationId || null);
    return payload as OntologyChatResponse;
  };

  const createNewChat = async () => {
    if (creating) return;

    setCreating(true);
    setError(null);
    try {
      await createConversation();
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'New chat could not be created.');
    } finally {
      setCreating(false);
    }
  };

  const selectConversation = async (nextConversationId: string) => {
    if (!nextConversationId) {
      applyEmptyChat();
      setMessage('');
      return;
    }
    if (nextConversationId === conversationId) return;

    setLoadingHistory(true);
    setError(null);
    try {
      await loadConversationById(nextConversationId);
    } catch (err: any) {
      setError(err.message || 'Conversation could not be loaded.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setError(null);
    setMessage('');

    try {
      let activeConversationId = conversationId;
      let activeProjectId = activeConversationId ? conversationProjectId : projectId;
      if (!activeConversationId) {
        const createdConversation = await createConversation();
        activeConversationId = createdConversation.conversationId;
        activeProjectId = createdConversation.projectId || null;
      }

      if (!activeConversationId) {
        throw new Error('A chat conversation could not be opened.');
      }

      const endpoint = activeProjectId
        ? `/api/projects/${activeProjectId}/ontology-chat/${activeConversationId}/messages`
        : `/api/ontology-chat/${activeConversationId}/messages`;
      const response = await fetch(api(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          ...(activeProjectId ? { projectId: activeProjectId } : {}),
          message: trimmed
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (payload.messages) {
        applyResponse(payload);
      }

      if (!response.ok) {
        throw new Error(payload.error || payload.reply || `Request failed with ${response.status}`);
      }
      await loadConversations(payload.conversationId || activeConversationId);
    } catch (err: any) {
      setError(err.message || 'Message could not be sent.');
      setMessage(trimmed);
    } finally {
      setSending(false);
    }
  };

  const clearConversation = async () => {
    if (clearing || !conversationId) return;
    const confirmed = window.confirm('Delete this ontology chat?');
    if (!confirmed) return;

    setClearing(true);
    setError(null);
    try {
      const endpoint = conversationProjectId
        ? `/api/projects/${conversationProjectId}/ontology-chat/${conversationId}?userId=${encodeURIComponent(currentUser.id)}`
        : `/api/ontology-chat/${conversationId}?userId=${encodeURIComponent(currentUser.id)}`;
      const response = await fetch(api(endpoint), {
        method: 'DELETE'
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `Request failed with ${response.status}`);
      }
      setConversations(payload.conversations || []);
      applyEmptyChat();
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Conversation could not be deleted.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-white">Ontology Assessment</h3>
          <p className="text-sm text-slate-400">
            {conversationProjectTitle
              ? `Project context: ${conversationProjectTitle}`
              : project?.title
                ? `New chats will use: ${project.title}`
                : 'General ontology chat'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusClass}`}>
            {status === 'completed' ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : null}
            {status === 'error' ? <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> : null}
            {statusLabel}
          </span>
          <button
            onClick={createNewChat}
            disabled={creating || loadingHistory}
            className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-[#0b1221]/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            New chat
          </button>
          <button
            onClick={clearConversation}
            disabled={clearing || loadingHistory || !conversationId}
            className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-[#0b1221]/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {clearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete chat
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="ontology-history-panel flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a1122]">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-white">Chat history</h4>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400">{conversations.length}</span>
            </div>
          </div>

          <div className="ontology-scroll flex-1 space-y-2 overflow-y-scroll p-3">
            {conversations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/10 bg-[#050b14] px-3 py-4 text-sm text-slate-500">
                No previous ontology chats yet.
              </div>
            ) : (
              conversations.map((conversation) => {
                const isActive = conversation.conversationId === conversationId;
                return (
                  <button
                    key={conversation.conversationId}
                    onClick={() => selectConversation(conversation.conversationId)}
                    disabled={loadingHistory}
                    className={`w-full rounded-lg border px-3 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      isActive
                        ? 'border-cyan-500/40 bg-cyan-500/10'
                        : 'border-white/10 bg-[#050b14] hover:border-cyan-500/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="truncate text-sm font-medium text-white">
                      {conversation.title || 'Ontology chat'}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="truncate">{conversation.projectTitle || 'General chat'}</span>
                      <span className="flex-shrink-0">{formatTime(conversation.updatedAt)}</span>
                    </div>
                    {conversation.lastMessage ? (
                      <div className="ontology-history-preview mt-2 text-xs leading-5 text-slate-400">
                        {conversation.lastMessage}
                      </div>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="ontology-main-panel flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a1122]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center text-sm font-medium text-slate-300">
                <Bot className="mr-2 h-4 w-4 flex-shrink-0 text-cyan-400" />
                <span className="truncate">{conversationTitle || 'Ontology conversation'}</span>
              </div>
              {loadingHistory && (
                <span className="mt-1 inline-flex items-center text-xs text-slate-500">
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Loading
                </span>
              )}
            </div>

            <div className="inline-flex rounded-lg border border-white/10 bg-[#050b14] p-1">
              <button
                onClick={() => setActivePanel('chat')}
                className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors ${
                  activePanel === 'chat' ? 'bg-cyan-500/15 text-cyan-100' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquareText className="mr-1.5 h-4 w-4" />
                Chat
              </button>
              <button
                onClick={() => setActivePanel('output')}
                className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors ${
                  activePanel === 'output' ? 'bg-cyan-500/15 text-cyan-100' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardList className="mr-1.5 h-4 w-4" />
                Output
                {userReport ? <span className="ml-2 h-1.5 w-1.5 rounded-full bg-green-400" /> : null}
              </button>
            </div>
          </div>

          {activePanel === 'chat' ? (
            <>
              <div className="ontology-scroll flex-1 space-y-4 overflow-y-scroll p-4">
                {!loadingHistory && messages.length === 0 && (
                  <div className="flex h-full min-h-[280px] items-center justify-center text-center">
                    <div>
                      <Bot className="mx-auto mb-3 h-9 w-9 text-slate-600" />
                      <p className="text-sm text-slate-400">
                        Describe the AI system to start a new ontology chat.
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((item, index) => {
                  const isUser = item.sender === 'user';
                  return (
                    <div key={item._id || index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div className={`max-w-[82%] rounded-lg border px-4 py-3 text-sm shadow-sm ${
                        isUser
                          ? 'border-blue-500/30 bg-blue-500/15 text-blue-50'
                          : 'border-white/10 bg-[#050b14] text-slate-300'
                      }`}>
                        <div className="whitespace-pre-wrap leading-6">{item.text}</div>
                        {item.createdAt && (
                          <div className={`mt-2 text-[11px] ${isUser ? 'text-blue-200/70' : 'text-slate-500'}`}>
                            {formatTime(item.createdAt)}
                          </div>
                        )}
                      </div>
                      {isUser && (
                        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                          <UserIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {sending && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ontology service is processing
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/10 bg-[#08101f] p-4">
                <div className="flex flex-col gap-3 md:flex-row">
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="min-h-[92px] flex-1 resize-none rounded-lg border border-white/10 bg-[#050b14] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder={project?.title
                      ? `Describe the AI system for ${project.title}.`
                      : 'Describe the AI system, or select a project to attach project context.'}
                    disabled={sending || loadingHistory}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || sending || loadingHistory}
                    className="inline-flex min-w-[130px] items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="ontology-scroll flex-1 overflow-y-scroll p-4">
              {userReport ? (
                <OntologyOutputPanel report={userReport} />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-center">
                  <div>
                    <ClipboardList className="mx-auto mb-3 h-9 w-9 text-slate-600" />
                    <p className="text-sm text-slate-400">No ontology output yet.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
