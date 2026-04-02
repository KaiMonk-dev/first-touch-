/**
 * One-time setup: Create notifications on GHL calendar
 * POST /calendars/{calendarId}/notifications
 * API Version: 2021-04-15
 *
 * Creates 4 notifications:
 * 1. Booking confirmation email → contact
 * 2. Booking confirmation email → team (hello@)
 * 3. Reminder email → contact (1hr before)
 * 4. Booking in-app notification → assigned user
 *
 * Run once via GET /api/setup-calendar-notifications, then delete this file.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const CALENDAR_ID = 'rZxC4FfjMwwcl3NAqJJg';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const GHL_API_KEY = (process.env.GHL_API_KEY || '').trim();

  if (!GHL_API_KEY) {
    return res.status(500).json({ error: 'Missing GHL_API_KEY' });
  }

  const hdrs = {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: '2021-04-15',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const notifications = [
      {
        receiverType: 'contact',
        channel: 'email',
        notificationType: 'confirmation',
        isActive: true,
        subject: 'Your Strategy & Demo Call is Confirmed — {{appointment.start_time}}',
        body: `<div style="font-family:Arial,sans-serif;color:#333;max-width:600px;">
<p>Hi {{contact.firstName}},</p>
<p>Your <strong>Strategy & Demo Call</strong> with Ascension First is confirmed.</p>
<table style="margin:16px 0;border-collapse:collapse;">
<tr><td style="padding:4px 12px 4px 0;color:#888;">Date & Time</td><td>{{appointment.start_time}}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#888;">Duration</td><td>30 minutes</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#888;">Meeting Link</td><td><a href="https://meet.google.com/wnj-zvyq-mkv">Join Google Meet</a></td></tr>
</table>
<p>We look forward to learning about <strong>{{contact.companyName}}</strong> and showing you how we can help recover lost revenue.</p>
<p>If you need to reschedule, just reply to this email.</p>
<p style="margin-top:24px;color:#888;font-size:13px;">— Ascension First<br>(858) 434-7041</p>
</div>`,
        fromName: 'Ascension First',
      },
      {
        receiverType: 'assignedUser',
        channel: 'email',
        notificationType: 'booked',
        isActive: true,
        subject: 'New Booking: {{contact.firstName}} {{contact.lastName}} — {{contact.companyName}}',
        body: `<div style="font-family:Arial,sans-serif;color:#333;max-width:600px;">
<p><strong>New Strategy & Demo Call booked:</strong></p>
<table style="margin:16px 0;border-collapse:collapse;">
<tr><td style="padding:4px 12px 4px 0;color:#888;">Name</td><td>{{contact.firstName}} {{contact.lastName}}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#888;">Email</td><td>{{contact.email}}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#888;">Phone</td><td>{{contact.phone}}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#888;">Business</td><td>{{contact.companyName}}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#888;">Date & Time</td><td>{{appointment.start_time}}</td></tr>
</table>
<p><a href="https://meet.google.com/wnj-zvyq-mkv">Join Google Meet</a></p>
</div>`,
        fromName: 'Ascension First Bookings',
      },
      {
        receiverType: 'contact',
        channel: 'email',
        notificationType: 'reminder',
        isActive: true,
        subject: 'Reminder: Your Strategy & Demo Call is in 1 hour',
        body: `<div style="font-family:Arial,sans-serif;color:#333;max-width:600px;">
<p>Hi {{contact.firstName}},</p>
<p>Just a friendly reminder — your <strong>Strategy & Demo Call</strong> starts in 1 hour.</p>
<p><strong>Meeting Link:</strong> <a href="https://meet.google.com/wnj-zvyq-mkv">Join Google Meet</a></p>
<p>See you soon!</p>
<p style="margin-top:24px;color:#888;font-size:13px;">— Ascension First<br>(858) 434-7041</p>
</div>`,
        beforeTime: [{ timeOffset: 1, unit: 'hours' }],
        fromName: 'Ascension First',
      },
      {
        receiverType: 'assignedUser',
        channel: 'inApp',
        notificationType: 'booked',
        isActive: true,
      },
    ];

    const createUrl = `${GHL_BASE}/calendars/${CALENDAR_ID}/notifications`;
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify(notifications),
    });
    const createData = await createRes.json();

    // Verify by getting calendar
    const hdrs2 = { ...hdrs, Version: '2021-07-28' };
    const verifyRes = await fetch(`${GHL_BASE}/calendars/${CALENDAR_ID}`, { headers: hdrs2 });
    const verifyData = await verifyRes.json();

    return res.status(200).json({
      createStatus: createRes.status,
      createResponse: createData,
      calendarNotificationsAfter: verifyData?.calendar?.notifications || verifyData?.notifications,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
