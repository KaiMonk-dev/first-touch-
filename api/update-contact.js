/**
 * Update Contact + Trigger Notifications
 * Ascension First — api/update-contact.js
 *
 * After a prospect books via the GHL widget (which handles Google Calendar sync),
 * this endpoint:
 *   1. Finds the most recently created contact
 *   2. Updates them with Business Name + Goals from the pre-screen
 *   3. Triggers the Demo Reminder workflow (sends confirmation to prospect)
 *   4. Triggers the Team Notification workflow (notifies hello@)
 *   5. Adds a booking note with goals
 *
 * This is needed because the GHL calendar has notifications: [] (empty),
 * so the widget alone doesn't send any emails/SMS. The workflows handle that.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const DEMO_REMINDER_WORKFLOW = '3a18dff7-1934-418a-8261-d091c837630a';
const TEAM_NOTIFY_WORKFLOW = 'fb72240a-5a08-453c-b330-6676b7f05698';
const ASSIGNED_USER = 'Hx9y67DfhSPvKLyH1P8N'; // Kai

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_API_KEY  = (process.env.GHL_API_KEY || '').trim();
  const GHL_LOCATION = (process.env.GHL_LOCATION_ID || '').trim();

  if (!GHL_API_KEY || !GHL_LOCATION) {
    console.error('Missing env vars: GHL_API_KEY or GHL_LOCATION_ID');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const hdrs = {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  try {
    const { email, contactId, businessName, goals } = req.body;

    if (!businessName?.trim() && !goals?.trim()) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    let resolvedContactId = contactId;

    // If we have an email, search for the contact
    if (!resolvedContactId && email) {
      const searchUrl = `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&query=${encodeURIComponent(email.trim())}&limit=1`;
      const searchRes = await fetch(searchUrl, { headers: hdrs });
      const searchData = await searchRes.json();
      if (searchData.contacts?.length > 0) {
        resolvedContactId = searchData.contacts[0].id;
      }
    }

    // Fallback: get the most recently created contact (from GHL widget booking)
    if (!resolvedContactId) {
      const recentUrl = `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&sortBy=date_added&sortOrder=desc&limit=1`;
      const recentRes = await fetch(recentUrl, { headers: hdrs });
      const recentData = await recentRes.json();
      if (recentData.contacts?.length > 0) {
        resolvedContactId = recentData.contacts[0].id;
        console.log(`Using most recent contact: ${resolvedContactId} (${recentData.contacts[0].email})`);
      }
    }

    if (!resolvedContactId) {
      return res.status(404).json({ error: 'No contact found to update' });
    }

    // ─── 1. Update contact with business info ───
    const updatePayload = {
      tags: ['Website Booking', 'Demo Scheduled'],
      source: 'Website Booking Page',
    };
    if (businessName?.trim()) {
      updatePayload.companyName = businessName.trim();
      updatePayload.customFields = [
        { id: 'Nq2GRdlOmKDw4jbpfLM3', value: businessName.trim() },
      ];
    }

    const updateRes = await fetch(`${GHL_BASE}/contacts/${resolvedContactId}`, {
      method: 'PUT',
      headers: hdrs,
      body: JSON.stringify(updatePayload),
    });
    const updateData = await updateRes.json();
    console.log(`✅ Contact ${resolvedContactId} updated with business info: ${businessName}`);

    // ─── 2. Get appointment info for workflow trigger ───
    let appointmentStartTime = null;
    try {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead
      const apptUrl = `${GHL_BASE}/contacts/${resolvedContactId}/appointments?startDate=${now.toISOString()}&endDate=${futureDate.toISOString()}`;
      const apptRes = await fetch(apptUrl, { headers: hdrs });
      const apptData = await apptRes.json();
      if (apptData.events?.length > 0) {
        appointmentStartTime = apptData.events[0].startTime;
        console.log(`Found appointment starting: ${appointmentStartTime}`);
      }
    } catch (apptErr) {
      console.error('Appointment lookup failed (non-blocking):', apptErr.message);
    }

    // ─── 3. Trigger Demo Appointment Reminder workflow (sends to prospect) ───
    try {
      await fetch(`${GHL_BASE}/contacts/${resolvedContactId}/workflow/${DEMO_REMINDER_WORKFLOW}`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({
          ...(appointmentStartTime && { eventStartTime: appointmentStartTime }),
        }),
      });
      console.log(`✅ Demo Reminder workflow triggered for ${resolvedContactId}`);
    } catch (wfErr) {
      console.error('Demo Reminder workflow failed (non-blocking):', wfErr.message);
    }

    // ─── 4. Trigger Team Notification workflow (sends to hello@) ───
    try {
      await fetch(`${GHL_BASE}/contacts/${resolvedContactId}/workflow/${TEAM_NOTIFY_WORKFLOW}`, {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify({
          ...(appointmentStartTime && { eventStartTime: appointmentStartTime }),
        }),
      });
      console.log(`✅ Team notification workflow triggered for ${resolvedContactId}`);
    } catch (teamErr) {
      console.error('Team notification failed (non-blocking):', teamErr.message);
    }

    // ─── 5. Add goals note to contact ───
    if (goals?.trim()) {
      try {
        const noteBody = `🎯 PRE-CALL GOALS (from website booking):\n${goals.trim()}\n\n📋 Business: ${businessName?.trim() || 'Not provided'}`;
        await fetch(`${GHL_BASE}/contacts/${resolvedContactId}/notes`, {
          method: 'POST',
          headers: hdrs,
          body: JSON.stringify({ body: noteBody, userId: ASSIGNED_USER }),
        });
        console.log(`✅ Goals note added for ${resolvedContactId}`);
      } catch (noteErr) {
        console.error('Note creation failed (non-blocking):', noteErr.message);
      }
    }

    return res.status(200).json({ success: true, contactId: resolvedContactId });

  } catch (err) {
    console.error('Update contact error:', err);
    return res.status(500).json({ error: 'Failed to update contact' });
  }
}
