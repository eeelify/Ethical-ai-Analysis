const { generateChatResponse } = require('./services/geminiService');

async function test() {
  try {
    console.log('Testing generateChatResponse...');
    const result = await generateChatResponse([
      { sender: 'user', text: 'Give me information about personal data security.' }
    ], { primaryRisks: [], recommendedActions: [] });
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
