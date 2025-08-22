const express = require('express');
const bodyParser = require('body-parser');
const { VoiceResponse } = require('twilio').twiml;
const dotenv = require('dotenv');
const fetchCustomerData = require('./utils/fetchCustomerData');
const { getAIResponse } = require('./ai/openaiClient');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 3000;
const session = {};

app.post('/voice', async (req, res) => {
  const twiml = new VoiceResponse();
  const callSid = req.body.CallSid;
  const dtmfDigits = req.body.Digits?.trim();
  const speechResult = req.body.SpeechResult?.trim();
  const state = session[callSid]?.state || 'start';

  // Step 1: Ask for user ID
  if (!session[callSid]) {
    session[callSid] = {
      state: 'awaiting_user_id',
    };

    const gather = twiml.gather({
      input: 'dtmf',
      numDigits: 5,
      action: '/voice',
      method: 'POST',
    });
    gather.say('Welcome. Please enter your 5-digit user ID using the keypad.');
    return res.type('text/xml').send(twiml.toString());
  }

  // Step 2: Handle user ID input
  if (state === 'awaiting_user_id') {
    if (!dtmfDigits) {
      const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 5,
        action: '/voice',
        method: 'POST',
      });
      gather.say('Sorry, I didn’t receive your user ID. Please enter it again.');
      return res.type('text/xml').send(twiml.toString());
    }

    session[callSid].userId = dtmfDigits;
    session[callSid].state = 'awaiting_passcode';

    const gather = twiml.gather({
      input: 'dtmf',
      numDigits: 5,
      action: '/voice',
      method: 'POST',
    });
    gather.say('Thank you. Now enter your 5-digit passcode.');
    return res.type('text/xml').send(twiml.toString());
  }

  // Step 3: Handle passcode + fetch data
  if (state === 'awaiting_passcode') {
    if (!dtmfDigits) {
      const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 5,
        action: '/voice',
        method: 'POST',
      });
      gather.say('Passcode not received. Please enter your 5-digit passcode again.');
      return res.type('text/xml').send(twiml.toString());
    }

    const userId = session[callSid].userId;
    const passcode = dtmfDigits;
    const userData = await fetchCustomerData(userId, passcode);

    if (userData) {
      session[callSid].state = 'chat';
      session[callSid].userData = userData;

      twiml.say('Authentication successful. You can now ask questions about your data.');
      const gather = twiml.gather({
        input: 'speech',
        action: '/voice',
        method: 'POST',
        timeout: 5,
      });
      gather.say('Please go ahead and ask your first question.');
    } else {
      session[callSid].state = 'awaiting_user_id';
      const gather = twiml.gather({
        input: 'dtmf',
        numDigits: 5,
        action: '/voice',
        method: 'POST',
      });
      gather.say('Invalid credentials. Please enter your user ID again.');
    }

    return res.type('text/xml').send(twiml.toString());
  }

  // Step 4: AI Q&A interaction
  if (state === 'chat') {
    if (!speechResult) {
      const gather = twiml.gather({
        input: 'speech',
        action: '/voice',
        method: 'POST',
        timeout: 5,
      });
      gather.say("I didn’t catch that. Could you please repeat your question?");
      return res.type('text/xml').send(twiml.toString());
    }

    try {
      const aiReply = await getAIResponse(session[callSid].userData, speechResult);
      const gather = twiml.gather({
        input: 'speech',
        action: '/voice',
        method: 'POST',
        timeout: 5,
      });
      gather.say(aiReply);
    } catch (err) {
      console.error('OpenAI error:', err);
      twiml.say('Sorry, there was an error processing your request.');
    }

    return res.type('text/xml').send(twiml.toString());
  }

  // Step 5: Fallback
  twiml.say('Unexpected error occurred. Ending the call.');
  twiml.hangup();
  return res.type('text/xml').send(twiml.toString());
});

app.listen(PORT, () => {
  console.log(`Voice AI server running at http://localhost:${PORT}`);
});
