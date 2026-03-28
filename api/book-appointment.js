/**
 * Book Appointment Handler
 * Ascension First — api/book-appointment.js
 *
 * Receives booking form data from /book.html and creates
 * an appointment + contact in GHL.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const HEADERS = (key) => ({
  Authorization: `Bearer ${key}`,
  Version: '2021-04-15',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_API_KEY  = process.env.GHL_API_KEY;
  const GHL_LOCATION = process.env.GHL_LOCATION_ID;
  const CALENDAR_ID  = 'rZxC4FfjMwwcl3NAqJJg';

  if (!GHL_API_KEY || !GHL_LOCATION) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const { firstName, lastName, email, phone, businessName, date, time } = req.body;

    if (!firstName || !email || !date || !time) {
      return res.status(400).json({ error: 'firstName, email, date, and time are required' });
    }

    const hdrs = HEADERS(GHL_API_KEY);

    // 1. Find or create contact
    let contactId = null;
    const searchRes = await fetch(
      `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&email=${encodeURIComponent(email)}&limit=1`,
      { headers: { ...hdrs, Version: '2021-07-28' } }
    );
    const searchData = await searchRes.json();

    if (searchData.contacts?.length > 0) {
      contactId = searchData.contacts[0].id;
      // Update existing contact
      await fetch(`${GHL_BASE}/contacts/${contactId}`, {
        method: 'PUT',
        headers: { ...hdrs, Version: '2021-07-28' },
        body: JSON.stringify({
          firstName,
          lastName: lastName || '',
          phone: phone || undefined,
          companyName: businessName || undefined,
          tags: ['Website Booking', 'Demo Scheduled'],
          source: 'Website Booking Page',
        }),
      });
    } else {
      // Create new contact
      const createRes = await fetch(`${GHL_BASE}/contacts/`, {
        method: 'POST',
        headers: { ...hdrs, Version: '2021-07-28' },
        body: JSON.stringify({
          locationId: GHL_LOCATION,
          firstName,
          lastName: lastName || '',
          email,
          phone: phone || undefined,
          companyName: businessName || undefined,
          tags: ['Website Booking', 'Demo Scheduled'],
          source: 'Website Booking Page',
        }),
      });
      const createData = await createRes.json();
      contactId = createData.contact?.id;
    }

    if (!contactId) {
      return res.status(500).json({ error: 'Failed to create contact' });
    }

    // 2. Build appointment time
    // date = "2026-03-31", time = "11:00 AM"
    const [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const startTime = new Date(`${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00-07:00`);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    // 3. Create appointment in GHL
    const appointmentRes = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        calendarId: CALENDAR_ID,
        locationId: GHL_LOCATION,
        contactId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        title: `Strategy & Demo: ${firstName} ${lastName || ''}`.trim(),
        appointmentStatus: 'confirmed',
        assignedUserId: 'Hx9y67DfhSPvKLyH1P8N',
      }),
    });

    const appointmentData = await appointmentRes.json();

    if (!appointmentData.id && !appointmentData.event?.id) {
      console.error('Appointment creation failed:', appointmentData);
      return res.status(500).json({ error: 'Appointment creation failed', detail: appointmentData });
    }

    console.log(`✅ Booking confirmed — ${firstName} ${lastName || ''} on ${date} at ${time}`);
    return res.status(200).json({
      success: true,
      contactId,
      appointmentId: appointmentData.id || appointmentData.event?.id,
      date,
      time,
    });

  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ error: err.message });
  }
}
