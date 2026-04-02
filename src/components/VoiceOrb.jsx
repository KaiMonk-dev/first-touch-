/**
 * VoiceOrb — Premium floating "Talk to Alex" button.
 * Gold-accented pulsing orb that opens the First Touch Live voice widget.
 */
export function VoiceOrb() {
  const handleClick = () => {
    // Try to open the GHL Voice AI widget
    const widgetButton = document.querySelector('[class*="chat-widget"] button')
      || document.querySelector('.lc_text-widget--trigger')
      || document.querySelector('[data-widget-id] button')
    if (widgetButton) {
      widgetButton.click()
    } else {
      // Fallback: direct call
      window.location.href = 'tel:+18587326535'
    }
  }

  return (
    <div
      className="voice-orb"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Talk to Alex"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
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

      <span className="voice-orb-label">Talk to Alex</span>
    </div>
  )
}
