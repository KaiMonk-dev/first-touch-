/**
 * Calculator Lead Capture
 * Ascension First — api/calculator-lead.js
 *
 * Creates a GHL contact when someone submits their email
 * from the revenue calculator. Stores their personalized
 * numbers as a contact note for follow-up context.
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
    const { email, missedCalls, avgJobValue, monthlyLost, annualLost, roi } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const hdrs = HEADERS(GHL_API_KEY);

    // 1. Create or update contact in GHL
    const contactRes = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        locationId: GHL_LOCATION,
        email,
        source: 'Revenue Calculator',
        tags: ['Revenue Calculator Lead', 'Website Lead', 'status-cold-lead'],
      }),
    });

    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    if (!contactId) {
      console.error('GHL contact creation failed:', contactData);
      return res.status(500).json({ error: 'Failed to create contact' });
    }

    // 2. Add note with their personalized calculator numbers
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        body: `📊 Revenue Calculator Submission\n\nMissed calls/week: ${missedCalls}\nAvg job value: $${avgJobValue}\nEstimated monthly loss: $${monthlyLost?.toLocaleString()}\nEstimated annual loss: $${annualLost?.toLocaleString()}\nROI vs First Touch ($597/mo): ${roi}x\n\nSource: ascensionfirst.com revenue calculator`,
      }),
    });

    console.log(`📊 Calculator lead captured: ${email} (${missedCalls} calls/wk, $${avgJobValue}/job, $${monthlyLost}/mo lost)`);
    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('Calculator lead error:', err);
    return res.status(500).json({ error: err.message });
  }
}
