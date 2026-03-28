/**
 * Feedback Webhook Handler
 * Ascension First — api/feedback-webhook.js
 *
 * Receives feedback from /feedback.html and creates a note on the
 * contact in GHL. Also tags them based on rating for automation.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const HEADERS = (key) => ({
  Authorization: `Bearer ${key}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  // CORS for the feedback form
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_API_KEY  = process.env.GHL_API_KEY;
  const GHL_LOCATION = process.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY || !GHL_LOCATION) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const { rating, standout, improve, contactEmail, contactId, timestamp } = req.body;

    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }

    const hdrs = HEADERS(GHL_API_KEY);
    let cid = contactId;

    // If contactEmail provided but no contactId, look up the contact
    if (!cid && contactEmail) {
      const searchRes = await fetch(
        `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&email=${encodeURIComponent(contactEmail)}&limit=1`,
        { headers: hdrs }
      );
      const searchData = await searchRes.json();
      if (searchData.contacts?.length > 0) {
        cid = searchData.contacts[0].id;
      }
    }

    // Build the feedback note
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const noteBody = [
      `📋 Post-Call Feedback`,
      `Rating: ${stars} (${rating}/5)`,
      standout ? `\nWhat stood out: ${standout}` : '',
      improve ? `\nCould improve: ${improve}` : '',
      `\nSubmitted: ${timestamp || new Date().toISOString()}`,
    ].filter(Boolean).join('\n');

    // Determine tag based on rating
    const ratingTag = rating >= 4 ? 'Positive Feedback' : rating >= 3 ? 'Neutral Feedback' : 'Needs Attention';

    if (cid) {
      // Add note to contact
      await fetch(`${GHL_BASE}/contacts/${cid}/notes`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ body: noteBody }),
      });

      // Tag contact based on rating
      await fetch(`${GHL_BASE}/contacts/${cid}`, {
        method: 'PUT',
        headers: hdrs,
        body: JSON.stringify({ tags: [ratingTag, 'Feedback Received'] }),
      });

      // If 4-5 stars, tag for Google Review request
      if (rating >= 4) {
        await fetch(`${GHL_BASE}/contacts/${cid}`, {
          method: 'PUT',
          headers: hdrs,
          body: JSON.stringify({ tags: ['Ask For Review'] }),
        });
      }
    }

    console.log(`✅ Feedback received — rating: ${rating}/5${cid ? `, contact: ${cid}` : ''}`);
    return res.status(200).json({ success: true, rating });

  } catch (err) {
    console.error('Feedback webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
