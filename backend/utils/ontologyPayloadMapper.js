/**
 * Mapper for translating Ethical AI Evaluation Platform data
 * into the required format for the Ontology Python Backend.
 */

const mapToOntologyPayload = (project, expertAnswers = [], tensions = [], systemDescription = '') => {
  return {
    system_name: project?.title || 'Unknown System',
    description: systemDescription || project?.shortDescription || 'No description provided.',
    expert_answers: mapExpertAnswers(expertAnswers),
    ethical_tensions: mapTensions(tensions),
    safeguards: extractSafeguards(expertAnswers, tensions),
    risk_triggers: extractRiskTriggers(expertAnswers, tensions),
    metadata: {
      project_id: project?._id?.toString() || project?.id?.toString(),
      stage: project?.stage || 'unknown',
      status: project?.status || 'unknown',
      mapped_at: new Date().toISOString()
    }
  };
};

const mapExpertAnswers = (answers) => {
  if (!Array.isArray(answers)) return [];
  return answers.map(ans => ({
    question_id: ans.questionId || ans.question_id || null,
    text: ans.answer || ans.text || '',
    expert_role: ans.role || 'expert',
    confidence_score: ans.confidence || null,
    risk_score: ans.riskScore || ans.risk_score || null
  }));
};

const mapTensions = (tensions) => {
  if (!Array.isArray(tensions)) return [];
  return tensions.map(t => ({
    tension_id: t._id?.toString() || t.id?.toString(),
    title: t.title || 'Untitled Tension',
    description: t.description || '',
    related_principles: t.principles || [],
    severity: t.severity || 'medium',
    status: t.status || 'open'
  }));
};

const extractSafeguards = (answers, tensions) => {
  // Mock logic to extract safeguards if not explicitly provided
  // In a real scenario, this might come from a specific 'safeguards' collection or field
  const safeguards = [];
  if (Array.isArray(tensions)) {
    tensions.forEach(t => {
      if (t.mitigation_strategy || t.mitigationStrategy) {
        safeguards.push(t.mitigation_strategy || t.mitigationStrategy);
      }
    });
  }
  return safeguards;
};

const extractRiskTriggers = (answers, tensions) => {
  // Extract risk triggers from high severity tensions or high risk answers
  const triggers = [];
  if (Array.isArray(tensions)) {
    tensions.forEach(t => {
      if ((t.severity || '').toLowerCase() === 'high' || (t.severity || '').toLowerCase() === 'critical') {
        triggers.push(`High severity tension: ${t.title}`);
      }
    });
  }
  if (Array.isArray(answers)) {
    answers.forEach(ans => {
      if (ans.riskScore >= 4) {
        triggers.push(`High risk answer in question ${ans.questionId}`);
      }
    });
  }
  return triggers;
};

module.exports = {
  mapToOntologyPayload
};
