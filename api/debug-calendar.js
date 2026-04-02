/**
 * Debug endpoint — fetch full GHL calendar config
 * TEMPORARY — remove after debugging
 */
const GHL_BASE = 'https://services.leadconnectorhq.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const GHL_API_KEY = (process.env.GHL_API_KEY || '').trim();
  const CALENDAR_ID = 'rZxC4FfjMwwcl3NAqJJg';

  const hdrs = {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    // Get calendar config
    const calRes = await fetch(`${GHL_BASE}/calendars/${CALENDAR_ID}`, { headers: hdrs });
    const calData = await calRes.json();

    // Get recent appointments
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const apptRes = await fetch(
      `${GHL_BASE}/calendars/events?calendarId=${CALENDAR_ID}&startTime=${weekAgo.toISOString()}&endTime=${now.toISOString()}`,
      { headers: hdrs }
    );
    const apptData = await apptRes.json();

    // Get recent contacts
    const GHL_LOCATION = (process.env.GHL_LOCATION_ID || '').trim();
    const contactRes = await fetch(
      `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&sortBy=date_added&sortOrder=desc&limit=5`,
      { headers: hdrs }
    );
    const contactData = await contactRes.json();

    return res.status(200).json({
      calendar: calData,
      recentAppointments: apptData,
      recentContacts: contactData?.contacts?.map(c => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        companyName: c.companyName,
        source: c.source,
        tags: c.tags,
        dateAdded: c.dateAdded,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
