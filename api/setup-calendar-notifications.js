/**
 * One-time setup: Add notifications to GHL calendar
 * Ascension First — api/setup-calendar-notifications.js
 *
 * The GHL calendar currently has notifications: [] (empty).
 * This adds confirmation + reminder notifications.
 * Run once, then delete this file.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const GHL_API_KEY = (process.env.GHL_API_KEY || '').trim();
  const CALENDAR_ID = 'rZxC4FfjMwwcl3NAqJJg';

  if (!GHL_API_KEY) {
    return res.status(500).json({ error: 'Missing GHL_API_KEY' });
  }

  const hdrs = {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    // First, get current calendar config
    const getRes = await fetch(`${GHL_BASE}/calendars/${CALENDAR_ID}`, { headers: hdrs });
    const calendarData = await getRes.json();

    console.log('Current calendar config:', JSON.stringify(calendarData, null, 2));

    // Update calendar with notifications
    const updatePayload = {
      notifications: [
        {
          type: 'confirmation',
          status: 'confirmed',
          channel: 'email',
          template: '',
        },
        {
          type: 'confirmation',
          status: 'confirmed',
          channel: 'sms',
          template: '',
        },
        {
          type: 'reminder',
          status: 'confirmed',
          channel: 'email',
          timing: 1440,
          timingType: 'minutes',
          template: '',
        },
        {
          type: 'reminder',
          status: 'confirmed',
          channel: 'sms',
          timing: 60,
          timingType: 'minutes',
          template: '',
        },
      ],
      googleInvitationEmails: true,
    };

    const updateRes = await fetch(`${GHL_BASE}/calendars/${CALENDAR_ID}`, {
      method: 'PUT',
      headers: hdrs,
      body: JSON.stringify(updatePayload),
    });
    const updateData = await updateRes.json();

    // Verify
    const verifyRes = await fetch(`${GHL_BASE}/calendars/${CALENDAR_ID}`, { headers: hdrs });
    const verifyData = await verifyRes.json();

    return res.status(200).json({
      message: 'Calendar notifications updated',
      before: calendarData?.calendar?.notifications || calendarData?.notifications,
      updateResponse: updateData,
      after: verifyData?.calendar?.notifications || verifyData?.notifications,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
