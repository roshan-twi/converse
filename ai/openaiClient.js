// ai/openaiClient.js
const dotenv = require('dotenv');
const OpenAI = require('openai');
const { detectActionIntent, triggerWebhook } = require('./actionHandler');

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAIResponse(userData, userQuestion) {
  const contextText = Object.entries(userData)
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${JSON.stringify(value)}`)
    .join("\n");

  const messages = [
    {
      role: "system",
      content: `You're a Inteligent helpful AI assistant. Use the user data below to answer any questions, 
      if any question is not related to the user's data, do not answer. 
      If the customer asks to perform an action, then be aware that they need to say, you can ask them to say
      renew subscription - to renew the subscription, 
      cancel order - to cancel the order
      currently only these actions are allowed.
      don't answer the questions where there is an action needed, just say you have done it. \n\n
      ${contextText}`,
    },
    {
      role: "user",
      content: userQuestion,
    },
  ];

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
  });

  const aiReply = chatCompletion.choices[0].message.content.trim();

  // Check for action
  const action = detectActionIntent(userQuestion);
  if (action) {
    await triggerWebhook(action, userData);
  }

  return aiReply;
}

module.exports = { getAIResponse };
