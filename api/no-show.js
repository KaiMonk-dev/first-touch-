/**
 * No-Show Handler
 * Ascension First — api/no-show.js
 *
 * Called by GHL workflow when appointment status → "no show".
 * Sends an immediate reschedule text + follow-up email via GHL.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const HEADERS = (key) => ({
  Authorization: `Bearer ${key}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_API_KEY  = process.env.GHL_API_KEY;
  const GHL_LOCATION = process.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY || !GHL_LOCATION) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const { contactId, contactName, appointmentTime } = req.body;

    if (!contactId) {
      return res.status(400).json({ error: 'contactId is required' });
    }

    const hdrs = HEADERS(GHL_API_KEY);
    const firstName = (contactName || 'there').split(' ')[0];

    // 1. Send immediate SMS
    await fetch(`${GHL_BASE}/conversations/messages`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        type: 'SMS',
        contactId,
        message: `Hey ${firstName}, looks like we missed each other for our call today! No worries at all — things come up. Here's a link to grab another time that works for you: https://link.ascensionfirst.com/widget/booking/strategy-and-demo\n\nLooking forward to connecting! - Kai`,
      }),
    });

    // 2. Add note to contact
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        body: `❌ No-show for appointment${appointmentTime ? ` at ${appointmentTime}` : ''}. Auto-sent reschedule text.`,
      }),
    });

    // 3. Tag contact
    await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers: hdrs,
      body: JSON.stringify({ tags: ['No Show'] }),
    });

    console.log(`✅ No-show handled for contact ${contactId}`);
    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('No-show handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
