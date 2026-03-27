/**
 * Calendly → GHL Bridge
 * Ascension First — api/calendly-webhook.js
 *
 * Fires when someone books via Calendly.
 * Creates/updates the GHL contact, adds a note, and enrolls them in the
 * "Calendly Demo Appointment Workflow" so every booking is tracked in GHL.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const HEADERS = (key) => ({
  Authorization: `Bearer ${key}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GHL_API_KEY    = process.env.GHL_API_KEY;
  const GHL_LOCATION   = process.env.GHL_LOCATION_ID;
  const GHL_WORKFLOW   = process.env.GHL_CALENDLY_WORKFLOW_ID;
  const GHL_USER_ID    = process.env.GHL_USER_ID; // Kai's GHL user ID

  if (!GHL_API_KEY || !GHL_LOCATION) {
    console.error('Missing GHL env vars');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const body = req.body;
    const eventType = body?.event;

    // Handle both invitee.created and invitee.canceled
    if (!['invitee.created', 'invitee.canceled'].includes(eventType)) {
      return res.status(200).json({ received: true, skipped: true });
    }

    const invitee   = body?.payload?.invitee;
    const eventData = body?.payload?.event;

    if (!invitee?.email) {
      return res.status(400).json({ error: 'Missing invitee email' });
    }

    // ── Parse invitee name ──────────────────────────────────────────────────
    const rawName   = (invitee.name || '').trim();
    const nameParts = rawName.split(/\s+/);
    const firstName = nameParts[0] || 'Unknown';
    const lastName  = nameParts.slice(1).join(' ') || '';

    // ── Parse custom question answers ───────────────────────────────────────
    const answers = invitee.questions_and_answers || [];
    const prepNote = answers
      .map(qa => `Q: ${qa.question}\nA: ${qa.answer || '(no answer)'}`)
      .join('\n\n');

    const hdrs = HEADERS(GHL_API_KEY);

    // ── 1. Look up existing contact by email ────────────────────────────────
    let contactId = null;
    const searchRes = await fetch(
      `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&email=${encodeURIComponent(invitee.email)}&limit=1`,
      { headers: hdrs }
    );
    const searchData = await searchRes.json();
    if (searchData.contacts?.length > 0) {
      contactId = searchData.contacts[0].id;
    }

    // ── 2. Build contact payload ─────────────────────────────────────────────
    const tags = eventType === 'invitee.created'
      ? ['Calendly Booking', 'Demo Scheduled']
      : ['Calendly Canceled'];

    const contactPayload = {
      locationId: GHL_LOCATION,
      firstName,
      lastName,
      email: invitee.email,
      tags,
      source: 'Calendly',
    };

    // ── 3. Create or update contact ─────────────────────────────────────────
    let upsertRes;
    if (contactId) {
      upsertRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
        method: 'PUT',
        headers: hdrs,
        body: JSON.stringify(contactPayload),
      });
    } else {
      upsertRes = await fetch(`${GHL_BASE}/contacts/`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify(contactPayload),
      });
    }

    const upsertData = await upsertRes.json();
    contactId = upsertData.contact?.id || contactId;

    if (!contactId) {
      console.error('Failed to create/update contact', upsertData);
      return res.status(500).json({ error: 'Contact upsert failed', detail: upsertData });
    }

    // ── 4. Add note with full booking context ───────────────────────────────
    const startTime  = eventData?.start_time || 'Unknown';
    const canceledAt = invitee?.canceled_at   || null;

    const noteBody = eventType === 'invitee.created'
      ? [
          `📅 Calendly Demo Booked`,
          `Time: ${startTime}`,
          `Timezone: ${invitee.timezone || 'Unknown'}`,
          `Booking URL: ${invitee.event_memberships?.[0]?.event_user_scheduling_url || ''}`,
          prepNote ? `\nPre-call notes:\n${prepNote}` : '',
        ].filter(Boolean).join('\n')
      : [
          `❌ Calendly Demo Canceled`,
          `Canceled at: ${canceledAt || 'Unknown'}`,
          `Original booking time: ${startTime}`,
          `Reason: ${invitee.cancel_url ? 'Self-canceled' : 'Unknown'}`,
        ].join('\n');

    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: hdrs,
      body: JSON.stringify({
        body: noteBody,
        userId: GHL_USER_ID || undefined,
      }),
    });

    // ── 5. Enroll in GHL workflow (only on booking, not cancellation) ────────
    if (eventType === 'invitee.created' && GHL_WORKFLOW) {
      const enrollRes = await fetch(
        `${GHL_BASE}/contacts/${contactId}/workflow/${GHL_WORKFLOW}/subscribe`,
        {
          method: 'POST',
          headers: hdrs,
          body: JSON.stringify({}),
        }
      );
      const enrollData = await enrollRes.json();
      console.log('Workflow enrollment:', enrollData);
    }

    console.log(`✅ Calendly ${eventType} processed — contact ${contactId}`);
    return res.status(200).json({ success: true, contactId, event: eventType });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
}
