// services/twilioService.js
require('dotenv').config();
const Twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+1415XXXXXXX"

if (!accountSid || !authToken || !fromWhatsApp) {
  console.warn('Twilio environment variables not fully configured. WhatsApp sending will fail until set.');
}

const client = new Twilio(accountSid, authToken);

/**
 * sendWhatsApp
 * @param {string} toPhone - phone number in international format e.g. "+9199xxxx..."
 * @param {string} message - text message body
 * @returns {Promise<object>} Twilio message response
 */
async function sendWhatsApp(toPhone, message) {
  const to = toPhone.startsWith('whatsapp:') ? toPhone : `whatsapp:${toPhone}`;

  return client.messages.create({
    from: fromWhatsApp,
    to,
    body: message,
  });
}

module.exports = { sendWhatsApp };
