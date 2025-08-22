// ai/actionHandler.js
const axios = require('axios');

const ACTION_KEYWORDS = {
  'renew subscription': 'RENEW_SUBSCRIPTION',
  'cancel order': 'CANCEL_ORDER',
};

/**
 * Identify if a question intends an action.
 */
function detectActionIntent(text) {
  for (const [phrase, action] of Object.entries(ACTION_KEYWORDS)) {
    if (text.toLowerCase().includes(phrase)) {
        console.log(`Detected action intent: ${action}`);
      return action;
    }
  }
  return null;
}

/**
 * Trigger webhook for the detected action.
 */
async function triggerWebhook(actionType, userData) {
  const webhookUrl = process.env[`WEBHOOK_${actionType}`];
  console.log(`Triggering webhook for action: ${actionType}`);
  if (!webhookUrl) throw new Error(`Webhook URL not defined for ${actionType}`);

  const response = await axios.post(webhookUrl, userData);
  return response.data;
}

module.exports = {
  detectActionIntent,
  triggerWebhook,
};
