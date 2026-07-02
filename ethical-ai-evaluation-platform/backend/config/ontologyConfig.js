require('dotenv').config();

module.exports = {
  // Use environment variable, fallback to localhost for dev
  baseUrl: process.env.ONTOLOGY_API_URL || 'http://localhost:8000',
  timeoutMs: parseInt(process.env.ONTOLOGY_API_TIMEOUT_MS, 10) || 60000,
  enabled: process.env.ENABLE_ONTOLOGY_ASSESSMENT !== 'false'
};
