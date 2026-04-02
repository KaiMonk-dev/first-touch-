/**
 * Update Contact Handler
 * Ascension First — api/update-contact.js
 *
 * After a prospect books via the GHL widget (which handles notifications
 * + Google Calendar sync natively), this endpoint updates the contact
 * with additional fields (Business Name, Goals) collected in the pre-screen.
 *
 * Called from BookingModal.jsx after GHL widget booking completes,
 * or can be called with a known email/contactId.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';

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

    // If we have an email but no contactId, search for the contact
    if (!resolvedContactId && email) {
      const searchUrl = `${GHL_BASE}/contacts/?locationId=${GHL_LOCATION}&query=${encodeURIComponent(email.trim())}&limit=1`;
      const searchRes = await fetch(searchUrl, { headers: hdrs });
      const searchData = await searchRes.json();
      if (searchData.contacts?.length > 0) {
        resolvedContactId = searchData.contacts[0].id;
      }
    }

    // If still no contactId, get the most recently created contact (from GHL widget booking)
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

    // Build update payload
    const updatePayload = {};
    if (businessName?.trim()) {
      updatePayload.companyName = businessName.trim();
      updatePayload.customFields = [
        { id: 'Nq2GRdlOmKDw4jbpfLM3', value: businessName.trim() },
      ];
    }
    if (businessName?.trim() || goals?.trim()) {
      updatePayload.tags = ['Website Booking', 'Demo Scheduled'];
      updatePayload.source = 'Website Booking Page';
    }

    // Update contact
    const updateRes = await fetch(`${GHL_BASE}/contacts/${resolvedContactId}`, {
      method: 'PUT',
      headers: hdrs,
      body: JSON.stringify(updatePayload),
    });
    const updateData = await updateRes.json();

    // Add goals as a note on the contact
    if (goals?.trim()) {
      try {
        const noteBody = `🎯 PRE-CALL GOALS (from website booking):\n${goals.trim()}\n\n📋 Business: ${businessName?.trim() || 'Not provided'}`;
        await fetch(`${GHL_BASE}/contacts/${resolvedContactId}/notes`, {
          method: 'POST',
          headers: hdrs,
          body: JSON.stringify({
            body: noteBody,
            userId: 'Hx9y67DfhSPvKLyH1P8N', // Kai
          }),
        });
      } catch (noteErr) {
        console.error('Note creation failed (non-blocking):', noteErr.message);
      }
    }

    console.log(`✅ Contact ${resolvedContactId} updated with business info: ${businessName}`);
    return res.status(200).json({ success: true, contactId: resolvedContactId });

  } catch (err) {
    console.error('Update contact error:', err);
    return res.status(500).json({ error: 'Failed to update contact' });
  }
}
