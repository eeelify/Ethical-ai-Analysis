const mongoose = require('mongoose');
const path = require('path');
const Response = require('./backend/models/response');
const Question = require('./backend/models/question');
const User = require('./backend/models/user');

async function checkData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ethical-ai-eval');
    console.log('Connected to MongoDB');

    // Find a user who is an expert
    const expert = await User.findOne({ role: 'ethical-expert' });
    if (!expert) {
      console.log('No ethical-expert found');
      return;
    }
    console.log(`Expert: ${expert.name} (${expert.email}, ID: ${expert._id})`);

    // Find responses for this user
    const responses = await Response.find({ userId: expert._id });
    console.log(`Found ${responses.length} responses for this expert`);
    
    responses.forEach(r => {
      console.log(`- Questionnaire: ${r.questionnaireKey}, Project: ${r.projectId}`);
      r.answers.forEach(a => {
        console.log(`  - ${a.questionCode}: ${JSON.stringify(a.answer)} (Score: ${a.score})`);
      });
    });

    // Check questions
    const questions = await Question.find({ questionnaireKey: { $in: ['general-v1', 'ethical-expert-v1'] } });
    console.log(`Found ${questions.length} relevant questions`);
    questions.forEach(q => {
      console.log(`- ${q.code}: ${q.text?.en || q.text} (${q.questionnaireKey})`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
