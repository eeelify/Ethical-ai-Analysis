const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ontologyService = require('../services/ontologyService');
const { mapToOntologyPayload } = require('../utils/ontologyPayloadMapper');

const Project = mongoose.model('Project');
const Tension = mongoose.model('Tension');
const GeneralQuestionsAnswers = mongoose.model('GeneralQuestionsAnswers');

// GET /api/ontology/health
router.get('/health', async (req, res) => {
  try {
    const health = await ontologyService.checkHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(503).json({ success: false, error: error.message });
  }
});

// POST /api/ontology/report
// Generates a report through the ontology API
router.post('/report', async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId is required' });
    }

    // 1. Fetch Project data
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // 2. Fetch all Tensions
    const tensions = await Tension.find({ project: projectId }).lean();

    // 3. Fetch Expert Answers (General Questions as a proxy for all expert answers in this MVP mapping)
    // Note: depending on the exact schema, you might need to query 'Response' or 'Evaluation' too
    const expertAnswers = await GeneralQuestionsAnswers.find({ projectId }).lean();

    // 4. Map to Ontology Payload
    const payload = mapToOntologyPayload(project, expertAnswers, tensions, project.shortDescription);

    // 5. Call Ontology Service
    const reportData = await ontologyService.generateReport(payload);

    // 6. Return report to frontend
    res.json({ success: true, report: reportData });
  } catch (error) {
    console.error('Error generating ontology report:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate ontology report' });
  }
});

// POST /api/ontology/assess
// Sends data to start assessment on Ontology API
router.post('/assess', async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId is required' });
    }

    const project = await Project.findById(projectId).lean();
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    const tensions = await Tension.find({ project: projectId }).lean();
    const expertAnswers = await GeneralQuestionsAnswers.find({ projectId }).lean();

    const payload = mapToOntologyPayload(project, expertAnswers, tensions, project.shortDescription);

    const result = await ontologyService.startAssessment(payload);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error starting ontology assessment:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to start ontology assessment' });
  }
});

module.exports = router;
