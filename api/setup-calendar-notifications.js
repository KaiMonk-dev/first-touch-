/**
 * One-time setup: Fix GHL calendar notes + notification templates
 *
 * Problems found:
 * 1. Calendar `notes` field has blank Name/Business (no merge fields) → Google Calendar shows no info
 * 2. Notification templates don't include phone or business
 *
 * Fixes:
 * 1. PUT calendar `notes` with proper merge fields
 * 2. PUT each notification template to include all prospect info
 *
 * Run once via GET /api/setup-calendar-notifications?v=3, then delete this file.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const CALENDAR_ID = 'rZxC4FfjMwwcl3NAqJJg';

// Notification IDs (from existing calendar config)
const NOTIF_CONFIRM_CONTACT = '69bdbca03cac1e6178c695a6';   // confirmation → contact
const NOTIF_BOOKED_USER     = '69bdbcbec09ae8622e02a1e8';   // booked → assignedUser
const NOTIF_REMINDER_CONTACT = '69c5f23a87a170687f08ae5c';  // reminder → contact

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const GHL_API_KEY = (process.env.GHL_API_KEY || '').trim();
  if (!GHL_API_KEY) return res.status(500).json({ error: 'Missing GHL_API_KEY' });

  const hdrs = {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: '2021-04-15',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const results = {};

  try {
    // ─── 1. Update calendar notes (appears in Google Calendar event description) ───
    const calHdrs = { ...hdrs, Version: '2021-04-15' };
    const notesUpdate = await fetch(`${GHL_BASE}/calendars/${CALENDAR_ID}`, {
      method: 'PUT',
      headers: calHdrs,
      body: JSON.stringify({
        notes: `PROSPECT INFO\nName: {{contact.first_name}} {{contact.last_name}}\nBusiness: {{contact.company_name}}\nPhone: {{contact.phone}}\nEmail: {{contact.email}}\n\nNeed to make a change? Call (858) 434-7041`,
        eventTitle: 'Strategy & Demo: {{contact.first_name}} {{contact.last_name}}',
        googleInvitationEmails: true,
      }),
    });
    results.calendarUpdate = {
      status: notesUpdate.status,
      data: await notesUpdate.json(),
    };

    // ─── 2. Update confirmation email → contact ───
    const confirmUpdate = await fetch(
      `${GHL_BASE}/calendars/${CALENDAR_ID}/notifications/${NOTIF_CONFIRM_CONTACT}`,
      {
        method: 'PUT',
        headers: hdrs,
        body: JSON.stringify({
          receiverType: 'contact',
          channel: 'email',
          notificationType: 'confirmation',
          isActive: true,
          subject: 'Your Strategy & Demo Call is Confirmed — {{appointment.start_time}}',
          body: `<div style="font-family:Arial,sans-serif;color:#333;max-width:600px;padding:20px;">
<p style="font-size:16px;">Hi {{contact.first_name}},</p>
<p>Your <strong>Strategy & Demo Call</strong> with Ascension First is confirmed!</p>

<table style="margin:20px 0;border-collapse:collapse;width:100%;">
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Date & Time</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{appointment.start_time}} ({{appointment.timezone}})</td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Duration</td><td style="padding:8px 0;border-bottom:1px solid #eee;">30 minutes</td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Meeting Link</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="{{appointment.meeting_location}}" style="color:#c9a84c;">Join Meeting</a></td></tr>
</table>

<p>We look forward to learning about your business and showing you how we can help recover lost revenue.</p>

<p>If you need to reschedule, just reply to this email or call us.</p>

<div style="margin-top:28px;text-align:left;">
<p style="font-weight:500;margin-bottom:8px;">Add to Calendar</p>
<a href="{{base_url}}/google/calendar/add-event/{{event_id}}" target="_blank" style="display:inline-block;padding:10px 16px;border-radius:8px;border:1px solid #D0D5DD;color:#344054;cursor:pointer;text-decoration:none;margin-right:8px;">Google</a>
<a href="{{base_url}}/google/calendar/get-ics/{{event_id}}" target="_blank" style="display:inline-block;padding:10px 16px;border-radius:8px;border:1px solid #D0D5DD;color:#344054;cursor:pointer;text-decoration:none;">Outlook / iCal</a>
</div>

<p style="margin-top:32px;color:#888;font-size:13px;">— Ascension First<br>(858) 434-7041<br>ascensionfirst.com</p>
</div>`,
          fromName: 'Ascension First',
        }),
      }
    );
    results.confirmationUpdate = {
      status: confirmUpdate.status,
      data: await confirmUpdate.json(),
    };

    // ─── 3. Update booked notification → assignedUser (team) ───
    const bookedUpdate = await fetch(
      `${GHL_BASE}/calendars/${CALENDAR_ID}/notifications/${NOTIF_BOOKED_USER}`,
      {
        method: 'PUT',
        headers: hdrs,
        body: JSON.stringify({
          receiverType: 'assignedUser',
          channel: 'email',
          notificationType: 'booked',
          isActive: true,
          subject: 'New Booking: {{contact.first_name}} {{contact.last_name}} — {{contact.company_name}}',
          body: `<div style="font-family:Arial,sans-serif;color:#333;max-width:600px;padding:20px;">
<p style="font-size:16px;font-weight:600;">New Strategy & Demo Call Booked</p>

<table style="margin:16px 0;border-collapse:collapse;width:100%;">
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>{{contact.first_name}} {{contact.last_name}}</strong></td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{contact.email}}</td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{contact.phone}}</td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Business</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{contact.company_name}}</td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Date & Time</td><td style="padding:8px 0;border-bottom:1px solid #eee;">{{appointment.start_time}} ({{appointment.timezone}})</td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;border-bottom:1px solid #eee;">Meeting Link</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="{{appointment.meeting_location}}">Join</a></td></tr>
</table>

<p><a href="{{appointment_link}}" style="display:inline-block;padding:12px 24px;background:#c9a84c;color:#fff;text-decoration:none;border-radius:8px;">View Appointment</a></p>
</div>`,
          fromName: 'Ascension First Bookings',
        }),
      }
    );
    results.bookedUpdate = {
      status: bookedUpdate.status,
      data: await bookedUpdate.json(),
    };

    // ─── 4. Update reminder email → contact ───
    const reminderUpdate = await fetch(
      `${GHL_BASE}/calendars/${CALENDAR_ID}/notifications/${NOTIF_REMINDER_CONTACT}`,
      {
        method: 'PUT',
        headers: hdrs,
        body: JSON.stringify({
          receiverType: 'contact',
          channel: 'email',
          notificationType: 'reminder',
          isActive: true,
          subject: 'Reminder: Your Strategy & Demo Call is coming up',
          body: `<div style="font-family:Arial,sans-serif;color:#333;max-width:600px;padding:20px;">
<p style="font-size:16px;">Hi {{contact.first_name}},</p>
<p>Just a friendly reminder — your <strong>Strategy & Demo Call</strong> is coming up soon.</p>

<table style="margin:16px 0;border-collapse:collapse;width:100%;">
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;">Date & Time</td><td style="padding:8px 0;">{{appointment.start_time}} ({{appointment.timezone}})</td></tr>
<tr><td style="padding:8px 16px 8px 0;color:#888;font-size:14px;">Meeting Link</td><td style="padding:8px 0;"><a href="{{appointment.meeting_location}}" style="color:#c9a84c;">Join Meeting</a></td></tr>
</table>

<p>See you soon!</p>
<p style="margin-top:24px;color:#888;font-size:13px;">— Ascension First<br>(858) 434-7041</p>
</div>`,
          beforeTime: [{ timeOffset: 1, unit: 'hours' }],
          fromName: 'Ascension First',
        }),
      }
    );
    results.reminderUpdate = {
      status: reminderUpdate.status,
      data: await reminderUpdate.json(),
    };

    // ─── 5. Verify calendar state ───
    const verifyHdrs = { ...hdrs, Version: '2021-07-28' };
    const verifyRes = await fetch(`${GHL_BASE}/calendars/${CALENDAR_ID}`, { headers: verifyHdrs });
    const verifyData = await verifyRes.json();
    results.calendarAfter = {
      notes: verifyData?.calendar?.notes || verifyData?.notes,
      eventTitle: verifyData?.calendar?.eventTitle || verifyData?.eventTitle,
    };

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message, results });
  }
}
