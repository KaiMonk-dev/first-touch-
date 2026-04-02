/**
 * Speed-to-Lead Auto-Response
 * Ascension First — api/speed-to-lead.js
 *
 * Called by GHL workflow when a NEW contact is created from the website
 * chat widget or form. Sends immediate SMS + email within 60 seconds.
 * Industry data: responding within 5 min = 21x higher conversion.
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
    const { contactId, contactName, contactPhone, contactEmail, source } = req.body;

    if (!contactId) {
      return res.status(400).json({ error: 'contactId is required' });
    }

    const hdrs = HEADERS(GHL_API_KEY);
    const firstName = (contactName || 'there').split(' ')[0];

    // 1. Immediate SMS (if phone available)
    if (contactPhone) {
      await fetch(`${GHL_BASE}/conversations/messages`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({
          type: 'SMS',
          contactId,
          message: `Hi ${firstName}, this is Kai from Ascension First. Thank you for reaching out — I'd welcome the chance to learn about your business and show you how First Touch works. Would you have 20 minutes this week for a brief call? Here's my calendar: https://link.ascensionfirst.com/widget/bookings/strategy-and-demo`,
        }),
      });
    }

    // 2. Immediate Email (if email available)
    if (contactEmail) {
      await fetch(`${GHL_BASE}/conversations/messages`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({
          type: 'Email',
          contactId,
          subject: `${firstName}, thanks for reaching out`,
          message: `Hi ${firstName},\n\nThank you for checking out Ascension First. I noticed you came through ${source || 'our website'} — glad to see you're exploring ways to elevate your customer experience.\n\nI'd welcome the chance to connect for a brief 20-minute call to learn about your business and walk you through exactly how First Touch handles calls, books appointments, and follows up with every lead.\n\nHere's my calendar when you're ready: https://link.ascensionfirst.com/widget/bookings/strategy-and-demo\n\nOr simply reply to this email and we'll find a time that works.\n\nLooking forward to it,\nKai\nAscension First`,
        }),
      });
    }

    // 3. Add note
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        body: `⚡ Speed-to-Lead auto-response sent via ${contactPhone ? 'SMS' : ''}${contactPhone && contactEmail ? ' + ' : ''}${contactEmail ? 'Email' : ''} (source: ${source || 'unknown'})`,
      }),
    });

    // 4. Tag contact
    await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers: hdrs,
      body: JSON.stringify({ tags: ['Speed-to-Lead Sent', 'Website Lead'] }),
    });

    console.log(`⚡ Speed-to-Lead fired for ${contactId} (${contactPhone || contactEmail})`);
    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('Speed-to-lead error:', err);
    return res.status(500).json({ error: err.message });
  }
}
