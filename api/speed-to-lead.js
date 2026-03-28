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
          message: `Hey ${firstName}! This is Kai from Ascension First. Thanks for reaching out — I'd love to learn about your business and show you how First Touch works. Got 20 minutes for a quick call this week? Here's my calendar: https://link.ascensionfirst.com/widget/bookings/strategy-and-demo`,
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
          message: `Hey ${firstName},\n\nThanks for checking out Ascension First. I saw you came through ${source || 'our website'} — love that you're thinking about leveling up your customer experience.\n\nI'd love to hop on a quick 20-minute call to learn about your business and show you exactly how First Touch handles calls, books appointments, and follows up — automatically.\n\nHere's my calendar if you want to grab a time: https://link.ascensionfirst.com/widget/bookings/strategy-and-demo\n\nOr just reply to this email and we'll figure out a time.\n\nTalk soon,\nKai\nAscension First`,
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
