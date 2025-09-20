// controllers/sosController.js
const db = require('../config/db');
const { sendWhatsApp } = require('../services/twilioService');

/**
 * POST /api/sos
 * Body: { user_id: number, latitude: number, longitude: number, extra_message?: string }
 */
async function sendSOS(req, res) {
  const { user_id, latitude, longitude, extra_message } = req.body;

  if (!user_id || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Missing user_id or latitude/longitude' });
  }

  try {
    // 1) Get user info (optional, for personalised message)
    const [userRows] = await db.query(
      'SELECT user_id, username, firstname, lastname, phone FROM users WHERE user_id = ? LIMIT 1',
      [user_id]
    );
    const user = userRows[0] || null;

    // 2) Get trusted contacts
    const [contacts] = await db.query(
      'SELECT id, contact_name, phone FROM trusted_contacts WHERE user_id = ?',
      [user_id]
    );

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ error: 'No trusted contacts found for this user' });
    }

    // 3) Build message text
    const name = user ? `${user.firstname || user.username || 'User'}` : 'User';
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`;
    const baseMessage =
      `🚨 SOS Alert!\n\n${name} may need help.\nLocation: ${mapsLink}\n\n`;
    const extra = extra_message ? (`Note: ${extra_message}\n\n`) : '';
    const signature = 'Sent by SmartBlindStick';

    const messageBody = `${baseMessage}${extra}${signature}`;

    // 4) Send messages to each contact (serially or in parallel)
    const results = [];
    for (const c of contacts) {
      const phone = c.phone; // should be in international format e.g. +911234567890
      try {
        const twResp = await sendWhatsApp(phone, messageBody);
        results.push({
          contact_id: c.id,
          contact_name: c.contact_name,
          phone,
          success: true,
          sid: twResp.sid,
        });
      } catch (err) {
        results.push({
          contact_id: c.id,
          contact_name: c.contact_name,
          phone,
          success: false,
          error: err.message || err.toString(),
        });
      }
    }

    // 5) Optionally: you can save an sos_log row in DB here (timestamp, payload, results)
    // Example insert:
    // await db.query('INSERT INTO sos_logs (user_id, latitude, longitude, results_json) VALUES (?, ?, ?, ?)', [user_id, latitude, longitude, JSON.stringify(results)]);

    return res.json({ message: 'SOS messages processed', results });
  } catch (err) {
    console.error('sendSOS error:', err);
    return res.status(500).json({ error: 'Failed to process SOS', details: err.message });
  }
}

module.exports = { sendSOS };
