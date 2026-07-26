/**
 * CANONICAL RISK CLASSIFICATION FUNCTION
 * 
 * RULES (EU AI Act Aligned):
 * - 0 to <1 = MINIMAL_RISK
 * - 1 to <2 = LIMITED_RISK
 * - 2 to <3 = HIGH_RISK
 * - 3 to 4+ = UNACCEPTABLE_RISK
 * 
 * Higher numeric score = Higher ethical risk
 * 
 * @param {number|null|undefined} score - Risk score (0-4) or null/undefined
 * @returns {string} Risk classification: "MINIMAL_RISK" | "LIMITED_RISK" | "HIGH_RISK" | "UNACCEPTABLE_RISK" | "N/A"
 */
function classifyRisk(score) {
  // NULL/undefined means not evaluated
  if (score === null || score === undefined || isNaN(score)) {
    return "N/A";
  }

  // Validate range (>= 0 only - CUMULATIVE RISK IS UNBOUNDED)
  if (score < 0) {
    throw new Error(`INVALID RISK SCORE: ${score} is negative. Score must be >= 0.`);
  }

  // CORRECT SCALE: Higher score = Higher risk (UNBOUNDED)
  if (score >= 3) return "UNACCEPTABLE_RISK"; // 3+ = Unacceptable
  if (score >= 2) return "HIGH_RISK"; // 2+ = High
  if (score >= 1) return "LIMITED_RISK"; // 1+ = Limited
  return "MINIMAL_RISK"; // score < 1
}

/**
 * Get human-readable risk label (for display)
 * @param {number|null|undefined} score - Risk score (0-4) or null/undefined
 * @returns {string} Human-readable label
 */
function getRiskLabel(score) {
  const classification = classifyRisk(score);
  const labels = {
    "MINIMAL_RISK": "Minimal Risk",
    "LIMITED_RISK": "Limited Risk",
    "HIGH_RISK": "High Risk",
    "UNACCEPTABLE_RISK": "Unacceptable Risk",
    "N/A": "Not Evaluated"
  };
  return labels[classification] || "Unknown";
}

/**
 * Validate that a risk classification matches the score
 * Throws error if classification contradicts the score
 * @param {number|null|undefined} score - Risk score
 * @param {string} classification - Risk classification string
 * @throws {Error} If classification contradicts score
 */
function validateRiskClassification(score, classification) {
  const correctClassification = classifyRisk(score);

  if (correctClassification !== classification) {
    throw new Error(
      `RISK CLASSIFICATION INCONSISTENCY: Score ${score} was classified as "${classification}" ` +
      `but correct classification is "${correctClassification}". ` +
      `Risk classification must match the score.`
    );
  }
}

/**
 * CUMULATIVE RISK CLASSIFICATION (NORMALIZED)
 * 
 * For cumulative/aggregated risk values that represent the SUM of multiple
 * finalRiskContribution values, we NORMALIZE by question count before
 * applying the bounded 0-4 thresholds.
 * 
 * This prevents inflation where principles with many questions always
 * appear as CRITICAL even when individual answers are low-risk.
 * 
 * Formula: normalizedRisk = cumulativeRisk / questionCount
 * 
 * @param {number} cumulativeScore - Sum of finalRiskContribution values
 * @param {number} questionCount - Number of questions contributing to this sum
 * @returns {string} Risk classification: "MINIMAL_RISK" | "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK" | "MAX_RISK" | "N/A"
 */
function classifyCumulativeRisk(cumulativeScore, questionCount) {
  // NULL/undefined means not evaluated
  if (cumulativeScore === null || cumulativeScore === undefined || isNaN(cumulativeScore)) {
    return "N/A";
  }

  // No questions = N/A
  if (!questionCount || questionCount <= 0) {
    return "N/A";
  }

  // Normalize: average risk per question
  const normalizedRisk = cumulativeScore / questionCount;

  // Apply standard 0-4 thresholds to normalized value
  if (normalizedRisk >= 3) return "UNACCEPTABLE_RISK";
  if (normalizedRisk >= 2) return "HIGH_RISK";
  if (normalizedRisk >= 1) return "LIMITED_RISK";
  return "MINIMAL_RISK";
}

/**
 * Get human-readable label for cumulative risk (normalized)
 * @param {number} cumulativeScore - Sum of finalRiskContribution values
 * @param {number} questionCount - Number of questions
 * @returns {string} Human-readable label
 */
function getCumulativeRiskLabel(cumulativeScore, questionCount) {
  const classification = classifyCumulativeRisk(cumulativeScore, questionCount);
  const labels = {
    "MINIMAL_RISK": "Minimal Risk",
    "LOW_RISK": "Low Risk",
    "MEDIUM_RISK": "Medium Risk",
    "HIGH_RISK": "High Risk",
    "MAX_RISK": "Critical Risk",
    "N/A": "Not Evaluated"
  };
  return labels[classification] || "Unknown";
}

module.exports = {
  classifyRisk,
  getRiskLabel,
  validateRiskClassification,
  classifyCumulativeRisk,
  getCumulativeRiskLabel
};
