# 🧠 Intelligence Over Voice

This project is a voice-based AI assistant powered by Twilio, AI, Integrated DB[Firebase as of now].

---

## 🛠️ Prerequisites

- A Twilio account with a phone number
- Devphone setup
- OpenAI API key (GPT-4 recommended)
- Firebase project (Cloud Firestore enabled) []
- Node.js (v16 or above)
- ngrok (for local development)

---

Create a `.env` file in the root with the following:
OPENAI_API_KEY=<key>
---

FireBase Setup
1. Go to Firebase Console
2. Create a new project
3. Enable Cloud Firestore
4. Go to Project Settings → Service Accounts → Generate new private key → Download JSON
---

## Insert Demo Data
Edit seedFirestore.js with desired user records.
node seedFirestore.js
---

## Run the Voice Server
npm install
node server.js
---

## Expose with ngrok
npx ngrok http 3000

Copy the https://<subdomain>.ngrok.io/voice URL.
---
## Configure Twilio Number
1. Go to Twilio Console → Phone Numbers
2. Choose your number  
3. Under Voice & Fax, set:
    - Webhook: https://<your-ngrok-url>/voice
    - Method: POST
---
## Test the Flow
Call your configured Twilio number from Dev phone:
 1. Enter User ID via keypad
 2. Enter Passcode via keypad
 3. Start asking questions (e.g., "When will my order arrive?", "What is my refund status?")
---

Slides - https://drive.google.com/file/d/1HmbMTSmDDAsJpde-NSx0Ev3VyEmLW4pB/view

## Action Items
- integration for different DB [research industry wide which DB is used in contactcenters,{salesforce, SQL, mongo}]
- integrate different AI
- tweak the call flow [as soon as user enters userid and password, OTP from phone should be one more validation step]
- Add support to take actions using webhooks and functions. [upgrading account, cancell a request - etc {configurable}]
- UI to configure DB, Prompt, AI, Webhooks & Functions.
