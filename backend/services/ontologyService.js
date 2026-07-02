const axios = require('axios');
const ontologyConfig = require('../config/ontologyConfig');

/**
 * Creates an Axios instance with configured base URL and timeout
 */
const createClient = () => {
  return axios.create({
    baseURL: ontologyConfig.baseUrl,
    timeout: ontologyConfig.timeoutMs,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * Health check for the Python Ontology API
 */
const checkHealth = async () => {
  if (!ontologyConfig.enabled) return { status: 'disabled' };
  try {
    const client = createClient();
    const response = await client.get('/health');
    return response.data;
  } catch (error) {
    console.error('Ontology API Health Check Failed:', error.message);
    throw new Error('Ontology service is unavailable: ' + error.message);
  }
};

/**
 * Send assessment data to the Ontology API
 */
const startAssessment = async (payload) => {
  if (!ontologyConfig.enabled) throw new Error('Ontology service is disabled.');
  try {
    const client = createClient();
    const response = await client.post('/assess', payload);
    return response.data;
  } catch (error) {
    console.error('Ontology API Assess Failed:', error.message);
    throw new Error('Failed to start assessment in Ontology service: ' + error.message);
  }
};

/**
 * Generate a report via the Ontology API (Replacing Gemini flow)
 */
const generateReport = async (payload) => {
  if (!ontologyConfig.enabled) throw new Error('Ontology service is disabled.');
  try {
    const client = createClient();
    const response = await client.post('/report', payload);
    return response.data;
  } catch (error) {
    console.error('Ontology API Generate Report Failed:', error.message);
    // Determine if it is a timeout or connection refused
    if (error.code === 'ECONNABORTED') {
      throw new Error('Report generation timed out. The Ontology service took too long to respond.');
    } else if (error.response) {
      throw new Error(`Ontology service error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error('Could not connect to Ontology service: ' + error.message);
    }
  }
};

/**
 * Get ethical violations for a specific system
 */
const getViolations = async (systemName) => {
  if (!ontologyConfig.enabled) return [];
  try {
    const client = createClient();
    const response = await client.get(`/violations/${encodeURIComponent(systemName)}`);
    return response.data;
  } catch (error) {
    console.error('Ontology API Get Violations Failed:', error.message);
    throw new Error('Failed to retrieve violations: ' + error.message);
  }
};

/**
 * Get ethical tensions for a specific system
 */
const getTensions = async (systemName) => {
  if (!ontologyConfig.enabled) return [];
  try {
    const client = createClient();
    const response = await client.get(`/tensions/${encodeURIComponent(systemName)}`);
    return response.data;
  } catch (error) {
    console.error('Ontology API Get Tensions Failed:', error.message);
    throw new Error('Failed to retrieve tensions: ' + error.message);
  }
};

module.exports = {
  checkHealth,
  startAssessment,
  generateReport,
  getViolations,
  getTensions
};
