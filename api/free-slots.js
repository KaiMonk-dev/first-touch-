/**
 * Free Slots Proxy
 * Ascension First — api/free-slots.js
 *
 * Proxies GHL calendar availability to the booking page
 * so we show real-time availability, not hardcoded slots.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_API_KEY = process.env.GHL_API_KEY;
  const CALENDAR_ID = 'rZxC4FfjMwwcl3NAqJJg';

  if (!GHL_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate query params required (epoch ms)' });
    }

    const url = `${GHL_BASE}/calendars/${CALENDAR_ID}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=America/Los_Angeles`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GHL free-slots error:', data);
      return res.status(response.status).json({ error: 'Failed to fetch availability', detail: data });
    }

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);

  } catch (err) {
    console.error('Free slots error:', err);
    return res.status(500).json({ error: err.message });
  }
}
