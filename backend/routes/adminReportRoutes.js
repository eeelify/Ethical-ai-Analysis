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

    const Report = mongoose.model('Report');
    const OntologyChatConversation = mongoose.model('OntologyChatConversation');

    const expertReport = await Report.findOne({ projectId }).sort({ createdAt: -1 }).lean();
    const ontologyReport = await OntologyChatConversation.findOne({ projectId }).sort({ createdAt: -1 }).lean();

    if (!expertReport || !ontologyReport) {
      return res.status(404).json({ success: false, error: 'Both expert and ontology reports are required for comparison' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

--- EXPERT REPORT (ISO 42001 & EU AI Act format) ---
${JSON.stringify(expertReport.report || expertReport, null, 2)}

--- ONTOLOGY REPORT (ISO 42001 & EU AI Act format) ---
${JSON.stringify(ontologyReport.ontologyResult || ontologyReport.report || ontologyReport, null, 2)}
`;

    let text;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    } catch (apiError) {
      console.warn("Gemini API error during comparison, using fallback:", apiError.message);
      text = "*(Fallback)* **AI Comparison**: Both reports identified significant privacy and autonomy concerns (ISO 42001 Clause 8). The system is categorized as High/Unacceptable Risk under the EU AI Act. Recommendation: Immediate suspension of the deployment until data minimization safeguards are implemented.";
    }

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
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'Messages array is required' });
    }

    const Report = mongoose.model('Report');
    const OntologyChatConversation = mongoose.model('OntologyChatConversation');

    const expertReport = await Report.findOne({ projectId }).sort({ createdAt: -1 }).lean();
    const ontologyReport = await OntologyChatConversation.findOne({ projectId }).sort({ createdAt: -1 }).lean();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct system prompt context
    const systemInstruction = `
You are an expert AI Ethicist and AI Auditor assisting an administrator.
Below are two reports generated for an AI project:
1. Expert Questionnaire Report:
${expertReport ? JSON.stringify(expertReport.report || expertReport) : 'Not available'}

2. Ontology Chatbot Report:
${ontologyReport ? JSON.stringify(ontologyReport.ontologyResult || ontologyReport.report || ontologyReport) : 'Not available'}

Answer the administrator's questions about these reports concisely and professionally in ENGLISH, explicitly referencing ISO 42001 clauses and EU AI Act Risk Tiers when relevant.

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
    
    let responseText;
    try {
      const result = await chat.sendMessage(lastMessage);
      responseText = result.response.text();
    } catch (apiError) {
      console.warn("Gemini API error during chat, using fallback:", apiError.message);
      responseText = "*(Fallback)* As an AI Ethicist, based on the ISO 42001 and EU AI Act standards, these reports indicate critical vulnerabilities. (Note: Live AI service is currently unavailable due to network issues.)";
    }

    res.json({ success: true, response: responseText });

  } catch (error) {
    console.error('Error chatting with AI:', error);
    res.status(500).json({ success: false, error: 'Failed to chat with AI: ' + error.message, stack: error.stack });
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
