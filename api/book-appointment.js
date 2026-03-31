/**
 * Book Appointment Handler
 * Ascension First — api/book-appointment.js
 *
 * Receives booking form data from /book.html, creates
 * a contact + appointment in GHL, and triggers the
 * Demo Appointment Reminder workflow for email/SMS confirmations.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_API_KEY  = process.env.GHL_API_KEY;
  const GHL_LOCATION = process.env.GHL_LOCATION_ID;
  const CALENDAR_ID  = 'rZxC4FfjMwwcl3NAqJJg';
  const ASSIGNED_USER = 'Hx9y67DfhSPvKLyH1P8N'; // Kai
  const DEMO_REMINDER_WORKFLOW = '3a18dff7-1934-418a-8261-d091c837630a'; // Demo Appointment Reminder

  if (!GHL_API_KEY || !GHL_LOCATION) {
    console.error('Missing env vars: GHL_API_KEY or GHL_LOCATION_ID');
    return res.status(500).json({ error: 'Server misconfiguration — contact support' });
  }

  const hdrs = {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    const { firstName, lastName, email, phone, businessName, date, time } = req.body;

    // Strict validation — all fields required
    const missing = [];
    if (!firstName?.trim()) missing.push('firstName');
    if (!lastName?.trim()) missing.push('lastName');
    if (!email?.trim()) missing.push('email');
    if (!phone?.trim()) missing.push('phone');
    if (!businessName?.trim()) missing.push('businessName');
    if (!date) missing.push('date');
    if (!time) missing.push('time');

    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // ─── 1. Find or create contact ───
    let contactId = null;

    const searchRes = await fetch(
      `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&email=${encodeURIComponent(email.trim())}&limit=1`,
      { headers: hdrs }
    );
    const searchData = await searchRes.json();

    if (searchData.contacts?.length > 0) {
      contactId = searchData.contacts[0].id;
      // Update existing contact with latest info
      await fetch(`${GHL_BASE}/contacts/${contactId}`, {
        method: 'PUT',
        headers: hdrs,
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          companyName: businessName.trim(),
          tags: ['Website Booking', 'Demo Scheduled'],
          source: 'Website Booking Page',
        }),
      });
    } else {
      const createRes = await fetch(`${GHL_BASE}/contacts/`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({
          locationId: GHL_LOCATION,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          companyName: businessName.trim(),
          tags: ['Website Booking', 'Demo Scheduled'],
          source: 'Website Booking Page',
        }),
      });
      const createData = await createRes.json();
      contactId = createData.contact?.id;

      if (!contactId) {
        console.error('Contact creation failed:', createData);
        return res.status(500).json({ error: 'Failed to create contact in CRM' });
      }
    }

    // ─── 2. Build appointment time (PST → ISO) ───
    const [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    // Build date in America/Los_Angeles (PST/PDT)
    // March 31, 2026 is in PDT (-07:00)
    const dateObj = new Date(`${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);

    // Calculate UTC offset for Los Angeles on the selected date
    // Using -07:00 for PDT (March-November) and -08:00 for PST (November-March)
    const month = parseInt(date.split('-')[1], 10);
    const offset = (month >= 3 && month <= 10) ? '-07:00' : '-08:00';

    const startTimeStr = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00${offset}`;
    const startTime = new Date(startTimeStr);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30-min slot

    // ─── 3. Create appointment in GHL ───
    const appointmentRes = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        calendarId: CALENDAR_ID,
        locationId: GHL_LOCATION,
        contactId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        title: `Strategy & Demo: ${firstName.trim()} ${lastName.trim()}`,
        appointmentStatus: 'confirmed',
        assignedUserId: ASSIGNED_USER,
      }),
    });

    const appointmentData = await appointmentRes.json();

    if (!appointmentRes.ok) {
      console.error('Appointment creation failed:', appointmentData);
      return res.status(500).json({
        error: 'Failed to book appointment — please call us at (858) 434-7041',
        detail: appointmentData,
      });
    }

    const appointmentId = appointmentData.id || appointmentData.event?.id;

    // ─── 4. Trigger Demo Appointment Reminder workflow ───
    try {
      await fetch(`${GHL_BASE}/contacts/${contactId}/workflow/${DEMO_REMINDER_WORKFLOW}`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ eventStartTime: startTime.toISOString() }),
      });
      console.log(`✅ Demo Reminder workflow triggered for ${contactId}`);
    } catch (wfErr) {
      console.error('Workflow trigger failed (non-blocking):', wfErr.message);
      // Don't fail the booking — appointment is already created
    }

    // ─── 5. Add booking note to contact ───
    try {
      const noteBody = `📅 WEBSITE BOOKING\nDate: ${date}\nTime: ${time} PST\nBusiness: ${businessName.trim()}\nPhone: ${phone.trim()}\nEmail: ${email.trim()}\nAppointment ID: ${appointmentId}`;
      await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({ body: noteBody, userId: ASSIGNED_USER }),
      });
    } catch (noteErr) {
      console.error('Note creation failed (non-blocking):', noteErr.message);
    }

    console.log(`✅ Booking confirmed — ${firstName} ${lastName} on ${date} at ${time} | Contact: ${contactId} | Appt: ${appointmentId}`);
    return res.status(200).json({
      success: true,
      contactId,
      appointmentId,
      date,
      time,
    });

  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: 'Something went wrong — please call us at (858) 434-7041' });
  }
}
