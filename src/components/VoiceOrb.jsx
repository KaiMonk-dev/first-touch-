/**
 * VoiceOrb — Premium floating "Talk to Alex" visual mask.
 * Sits directly on top of the GHL Voice AI widget trigger.
 * pointer-events: none lets clicks pass through to the real GHL button.
 */
export function VoiceOrb() {
  return (
    <div
      className="voice-orb"
      aria-hidden="true"
    >
      <div className="voice-orb-button">
        <span className="voice-orb-ring" />
        <span className="voice-orb-ring-inner" />

        {/* Phone icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(201, 169, 110, 0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </div>
    </div>
  )
}
