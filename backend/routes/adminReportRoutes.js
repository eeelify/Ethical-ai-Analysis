const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Helper to check object id
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Ensure the user is an admin
async function requireAdmin(req, res, next) {
  const userId = req.body?.userId || req.query?.userId || req.headers?.['x-user-id'];
  
  if (!userId || !isValidObjectId(userId)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing userId' });
  }

  const User = mongoose.model('User');
  const user = await User.findById(userId).lean();
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Access denied: Admins only' });
  }
  
  req.adminUser = user;
  next();
}

/**
 * GET /api/projects/:projectId/admin-reports
 * Fetch both Expert Report and Ontology Chat Report for a project
 */
router.get('/:projectId/admin-reports', requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ success: false, error: 'Invalid projectId' });
    }

    const Project = mongoose.model('Project');
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // 1. Get Expert Report
    const Report = mongoose.model('Report');
    const expertReport = await Report.findOne({ projectId })
      .sort({ createdAt: -1, generatedAt: -1 })
      .lean();

    // 2. Get Ontology Chat Report
    const OntologyChatConversation = mongoose.model('OntologyChatConversation');
    const ontologyReport = await OntologyChatConversation.findOne({ projectId })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    res.json({
      success: true,
      expertReport,
      ontologyReport,
      projectDetails: {
        title: project.title,
        adminReviewComment: project.adminReviewComment,
        reportsPublished: project.reportsPublished
      }
    });

  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin reports' });
  }
});

/**
 * POST /api/projects/:projectId/admin-reports/compare-with-ai
 * Ask Gemini to compare Expert Report and Ontology Report
 */
router.post('/:projectId/admin-reports/compare-with-ai', requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { expertReportContent, ontologyReportContent } = req.body;

    if (!expertReportContent || !ontologyReportContent) {
      return res.status(400).json({ success: false, error: 'Both expert and ontology report contents are required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `
You are an expert AI Ethicist and AI Auditor assisting an administrator.
Below are two reports generated for an AI project:
1. Expert Questionnaire Report (based on human expert evaluations)
2. Ontology Chatbot Report (based on semantic graph inference and use-case owner chat)

Please read both reports and provide a clear, concise comparison in ENGLISH.
Format your response using Markdown.
Highlight:
- Key similarities in risks or tensions found.
- Critical differences or contradictions between the two reports.
- Overarching safety or ethical concerns the Admin should note.
- A brief recommendation for the final decision.

--- EXPERT REPORT ---
${JSON.stringify(expertReportContent, null, 2)}

--- ONTOLOGY REPORT ---
${JSON.stringify(ontologyReportContent, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, aiComparison: text });

  } catch (error) {
    console.error('Error during AI comparison:', error);
    res.status(500).json({ success: false, error: 'AI comparison failed: ' + error.message });
  }
});

/**
 * POST /api/projects/:projectId/admin-reports/chat-with-ai
 * Interactive chat with Gemini about the reports
 */
router.post('/:projectId/admin-reports/chat-with-ai', requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { messages, expertReportContent, ontologyReportContent } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'Messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Construct system prompt context
    const systemInstruction = `
You are an expert AI Ethicist and AI Auditor assisting an administrator.
Below are two reports generated for an AI project:
1. Expert Questionnaire Report:
${expertReportContent ? JSON.stringify(expertReportContent) : 'Not available'}

2. Ontology Chatbot Report:
${ontologyReportContent ? JSON.stringify(ontologyReportContent) : 'Not available'}

Answer the administrator's questions about these reports concisely and professionally in ENGLISH.
`;

    // Convert messages for Gemini format (model/user)
    const geminiHistory = [];
    // We start with the system instruction as the first user message, then a model acknowledgment
    geminiHistory.push({ role: 'user', parts: [{ text: systemInstruction }] });
    geminiHistory.push({ role: 'model', parts: [{ text: 'Understood. How can I help you analyze these reports?' }] });

    // Append the actual chat history
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      geminiHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    res.json({ success: true, response: responseText });

  } catch (error) {
    console.error('Error chatting with AI:', error);
    res.status(500).json({ success: false, error: 'Failed to chat with AI' });
  }
});

/**
 * POST /api/projects/:projectId/admin-reports/approve
 * Save admin comment and publish the reports
 */
router.post('/:projectId/admin-reports/approve', requireAdmin, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { adminReviewComment } = req.body;

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ success: false, error: 'Invalid projectId' });
    }

    const Project = mongoose.model('Project');
    
    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { 
        adminReviewComment: adminReviewComment || '',
        reportsPublished: true
      },
      { new: true }
    ).lean();

    if (!updatedProject) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, message: 'Reports successfully approved and published', project: updatedProject });

  } catch (error) {
    console.error('Error approving admin reports:', error);
    res.status(500).json({ success: false, error: 'Failed to approve reports' });
  }
});

module.exports = router;
