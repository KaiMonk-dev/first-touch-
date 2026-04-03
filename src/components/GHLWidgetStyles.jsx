import { useEffect } from 'react'

/**
 * Injects premium styles into the GHL Voice AI widget's shadow DOM.
 * External CSS cannot penetrate shadow DOM boundaries, so we inject
 * a <style> tag directly into the shadow root once the widget loads.
 */

const PREMIUM_STYLES = `
  /* ═══════════════════════════════════════
     FIRST TOUCH — Premium GHL Widget Theme
     Injected into shadow DOM at runtime
     ═══════════════════════════════════════ */

  /* Liquid Gold Pour animation */
  @keyframes liquidGoldFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes livePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.4); }
    50% { box-shadow: 0 0 0 6px rgba(201, 169, 110, 0); }
  }

  /* ── Widget Container ── */
  .lc_text-widget--box {
    background: linear-gradient(180deg, #0d0b08 0%, #0a0908 100%) !important;
    border: 1px solid rgba(201, 169, 110, 0.2) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(16px) saturate(150%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(150%) !important;
    box-shadow:
      0 25px 60px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(201, 169, 110, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
    overflow: hidden !important;
  }

  /* ── Header ── */
  .lc_text-widget--header-wrapper {
    background: linear-gradient(180deg, #151210 0%, #0d0b08 100%) !important;
    border-bottom: 1px solid rgba(201, 169, 110, 0.15) !important;
  }

  .lc_text-widget_heading--content {
    color: #fff !important;
  }

  /* ── Voice Screen Body ── */
  .lc_text-widget--voice-initial-screen {
    background: linear-gradient(180deg, #080706 0%, #0c0a08 50%, #0a0908 100%) !important;
  }

  .lc_text-widget--voice-chat-container {
    background: transparent !important;
  }

  /* ── Agent Profile ── */
  .lc_text-widget--voice-agent-name {
    color: #fff !important;
    font-weight: 600 !important;
  }

  .lc_text-widget--voice-agent-title {
    color: rgba(201, 169, 110, 0.7) !important;
  }

  /* Hide AI badge — Alex is a team member, not a bot */
  .lc_text-widget--voice-ai-badge {
    display: none !important;
  }

  /* Avatar — gold ring glow */
  .lc_text-widget--voice-agent-avatar {
    border: 2px solid rgba(201, 169, 110, 0.3) !important;
    border-radius: 50% !important;
    box-shadow: 0 0 20px rgba(201, 169, 110, 0.15) !important;
  }

  /* ── Call Button — Liquid Gold Pour ── */
  .lc_text-widget--voice-start-call {
    background: linear-gradient(
      135deg,
      #8B6D3F 0%,
      #C9A96E 25%,
      #E8D5A8 50%,
      #C9A96E 75%,
      #8B6D3F 100%
    ) !important;
    background-size: 300% 300% !important;
    animation: liquidGoldFlow 6s ease-in-out infinite !important;
    color: #2C1810 !important;
    -webkit-text-fill-color: #2C1810 !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 9999px !important;
    padding: 14px 32px !important;
    font-size: 14px !important;
    letter-spacing: 0.02em !important;
    box-shadow:
      0 4px 20px rgba(201, 169, 110, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
    cursor: pointer !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  /* Kill inner rectangular border/outline on button children */
  .lc_text-widget--voice-start-call *,
  .lc_text-widget--voice-start-call span,
  .lc_text-widget--voice-start-call div {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    text-decoration: none !important;
    color: #2C1810 !important;
    -webkit-text-fill-color: #2C1810 !important;
  }

  /* Ion-button inside voice start — kill outline variant border */
  ion-button.lc_text-widget--voice-talk-button,
  .lc_text-widget--voice-talk-button {
    --border-width: 0 !important;
    --border-style: none !important;
    --border-color: transparent !important;
    --background: transparent !important;
    --box-shadow: none !important;
    --color: #2C1810 !important;
    border: none !important;
    outline: none !important;
  }

  /* Penetrate ion-button shadow DOM via ::part */
  ion-button.lc_text-widget--voice-talk-button::part(native) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
    color: #2C1810 !important;
  }

  /* Also target ion-button call-ended variants */
  ion-button[class*="voice-talk"]::part(native),
  ion-button[class*="call"]::part(native) {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .lc_text-widget--voice-start-call:hover {
    box-shadow:
      0 8px 32px rgba(201, 169, 110, 0.45),
      0 2px 6px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px) !important;
  }

  /* ── Agency Branding Footer ── */
  .lc_text-widget--agency-branding {
    background: #0a0908 !important;
    border-top: 1px solid rgba(201, 169, 110, 0.1) !important;
  }

  .lc_text-widget--agency-branding,
  .lc_text-widget--agency-branding * {
    color: rgba(255, 255, 255, 0.25) !important;
  }

  .lc_text-widget--agency-branding a {
    color: rgba(201, 169, 110, 0.4) !important;
  }

  /* ── Trigger Button (floating circle) ── */
  .lc_text-widget--bubble {
    background: radial-gradient(circle at 35% 35%, rgba(201, 169, 110, 0.25), rgba(10, 10, 10, 0.95)) !important;
    border: 1px solid rgba(201, 169, 110, 0.2) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(201, 169, 110, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  .lc_text-widget--bubble:hover {
    transform: scale(1.08) !important;
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.6),
      0 0 60px rgba(201, 169, 110, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(201, 169, 110, 0.35) !important;
  }

  /* ── In-call / Active State ── */
  .lc_text-widget--voice-active-screen {
    background: linear-gradient(180deg, #080706 0%, #0c0a08 50%, #0a0908 100%) !important;
  }

  .lc_text-widget--voice-active-screen * {
    color: #fff !important;
  }

  /* ── Call-Ended State — MUST stay dark ── */
  .lc_text-widget--voice-call-ended-screen,
  .lc_text-widget--voice-end-screen,
  *[class*="call-ended"],
  *[class*="call-end"] {
    background: linear-gradient(180deg, #080706 0%, #0c0a08 50%, #0a0908 100%) !important;
    color: #fff !important;
  }

  /* Catch-all: force dark on every possible screen/container */
  .lc_text-widget--box *[class*="screen"],
  .lc_text-widget--box *[class*="wrapper"],
  .lc_text-widget--box *[class*="ended"],
  .lc_text-widget--box *[class*="call-end"] {
    background: #0a0908 !important;
    color: #fff !important;
  }

  /* ── Call-Ended Button — same liquid gold as initial ── */
  *[class*="call-ended"] button,
  *[class*="call-end"] button,
  *[class*="end"] button[class*="again"],
  *[class*="end"] button[class*="call"] {
    background: linear-gradient(
      135deg,
      #8B6D3F 0%,
      #C9A96E 25%,
      #E8D5A8 50%,
      #C9A96E 75%,
      #8B6D3F 100%
    ) !important;
    background-size: 300% 300% !important;
    animation: liquidGoldFlow 6s ease-in-out infinite !important;
    color: #2C1810 !important;
    -webkit-text-fill-color: #2C1810 !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 9999px !important;
    padding: 14px 32px !important;
    font-size: 14px !important;
    letter-spacing: 0.02em !important;
    box-shadow:
      0 4px 20px rgba(201, 169, 110, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
    cursor: pointer !important;
  }

  /* ── Smooth State Transitions ── */
  .lc_text-widget--voice-initial-screen,
  .lc_text-widget--voice-active-screen,
  *[class*="call-ended"],
  *[class*="screen"] {
    transition: opacity 0.3s ease, background 0.3s ease !important;
  }

  /* ── Voice Controls Container ── */
  .lc_text-widget--voice-controls {
    display: flex !important;
    gap: 16px !important;
    justify-content: center !important;
    align-items: center !important;
    padding: 16px 0 !important;
  }

  /* ── Mute Button — Frosted Glass Pill ── */
  ion-button.lc_text-widget--voice-mute-btn,
  ion-button[aria-label*="mute"],
  ion-button[aria-label*="Mute"] {
    --background: rgba(255, 255, 255, 0.08) !important;
    --background-hover: rgba(255, 255, 255, 0.12) !important;
    --border-radius: 9999px !important;
    --border-width: 1px !important;
    --border-style: solid !important;
    --border-color: rgba(201, 169, 110, 0.35) !important;
    --box-shadow: 0 0 16px rgba(201, 169, 110, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
    --color: #fff !important;
    --padding-start: 20px !important;
    --padding-end: 20px !important;
    --padding-top: 12px !important;
    --padding-bottom: 12px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    transition: all 0.3s ease !important;
  }

  ion-button.lc_text-widget--voice-mute-btn:hover {
    --border-color: rgba(201, 169, 110, 0.5) !important;
    --box-shadow: 0 0 24px rgba(201, 169, 110, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
  }

  /* ── End Call Button — Red/Coral Pill ── */
  ion-button.lc_text-widget--voice-end-call-btn,
  ion-button[aria-label*="end"],
  ion-button[aria-label*="End"],
  ion-button.ion-color-danger {
    --background: rgba(248, 113, 113, 0.18) !important;
    --background-hover: rgba(248, 113, 113, 0.3) !important;
    --border-radius: 9999px !important;
    --border-width: 1px !important;
    --border-style: solid !important;
    --border-color: rgba(248, 113, 113, 0.4) !important;
    --box-shadow: 0 0 20px rgba(248, 113, 113, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
    --color: #fff !important;
    --padding-start: 20px !important;
    --padding-end: 20px !important;
    --padding-top: 12px !important;
    --padding-bottom: 12px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    transition: all 0.3s ease !important;
  }

  ion-button.lc_text-widget--voice-end-call-btn:hover,
  ion-button.ion-color-danger:hover {
    --background: rgba(248, 113, 113, 0.3) !important;
    --border-color: rgba(248, 113, 113, 0.55) !important;
    --box-shadow: 0 0 30px rgba(248, 113, 113, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
    transform: scale(1.05) !important;
  }

  /* ── Mute/End label text ── */
  .lc_text-widget--voice-controls span,
  .lc_text-widget--voice-controls div[class*="label"] {
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 11px !important;
    letter-spacing: 0.05em !important;
  }

  /* ── Reduced Motion ── */
  @media (prefers-reduced-motion: reduce) {
    .lc_text-widget--voice-start-call {
      animation: none !important;
      background: linear-gradient(135deg, #B8965A, #C9A96E) !important;
      background-size: 100% 100% !important;
    }
  }
`

const STYLE_ID = 'ft-premium-theme'

function injectStyles(shadow) {
  if (shadow.querySelector(`#${STYLE_ID}`)) return // Already injected
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = PREMIUM_STYLES
  shadow.appendChild(style)

  // Penetrate ion-button's nested shadow DOM to kill the outline border
  fixIonButtonBorders(shadow)
}

function fixIonButtonBorders(shadow) {
  const ionButtons = shadow.querySelectorAll('ion-button')
  ionButtons.forEach(btn => {
    const ionSR = btn.shadowRoot
    if (!ionSR) return
    if (ionSR.querySelector('#ft-ion-fix')) return // Already fixed

    const isMute = btn.classList.contains('lc_text-widget--voice-mute-btn')
    const isEnd = btn.classList.contains('lc_text-widget--voice-end-call-btn') || btn.classList.contains('ion-color-danger')

    const fix = document.createElement('style')
    fix.id = 'ft-ion-fix'

    if (isMute) {
      fix.textContent = `
        .button-native {
          border: 1px solid rgba(201, 169, 110, 0.35) !important;
          border-radius: 9999px !important;
          background: rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(12px) !important;
          box-shadow: 0 0 16px rgba(201, 169, 110, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
          color: #fff !important;
          transition: all 0.3s ease !important;
        }
        .button-native:hover {
          border-color: rgba(201, 169, 110, 0.5) !important;
          box-shadow: 0 0 24px rgba(201, 169, 110, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        }
        .button-native::after { display: none !important; }
      `
    } else if (isEnd) {
      fix.textContent = `
        .button-native {
          border: 1px solid rgba(248, 113, 113, 0.4) !important;
          border-radius: 9999px !important;
          background: rgba(248, 113, 113, 0.18) !important;
          backdrop-filter: blur(12px) !important;
          box-shadow: 0 0 20px rgba(248, 113, 113, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
          color: #fff !important;
          transition: all 0.3s ease !important;
        }
        .button-native:hover {
          background: rgba(248, 113, 113, 0.3) !important;
          border-color: rgba(248, 113, 113, 0.55) !important;
          box-shadow: 0 0 30px rgba(248, 113, 113, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transform: scale(1.05) !important;
        }
        .button-native::after { display: none !important; }
      `
    } else {
      // Start-call button and others — transparent, no border
      fix.textContent = `
        .button-native {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
          color: #2C1810 !important;
        }
        .button-native::after { display: none !important; }
      `
    }

    ionSR.appendChild(fix)
  })
}

export function GHLWidgetStyles() {
  useEffect(() => {
    // Try to inject immediately if widget already loaded
    const widget = document.querySelector('chat-widget')
    if (widget?.shadowRoot) {
      injectStyles(widget.shadowRoot)
    }

    // Watch for the widget to appear (it may load async)
    const observer = new MutationObserver(() => {
      const w = document.querySelector('chat-widget')
      if (w?.shadowRoot) {
        injectStyles(w.shadowRoot)
        // Also watch for shadow DOM mutations (widget rebuilds internal DOM)
        const shadowObserver = new MutationObserver(() => {
          injectStyles(w.shadowRoot)
          fixIonButtonBorders(w.shadowRoot)
        })
        shadowObserver.observe(w.shadowRoot, { childList: true, subtree: true })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Re-check periodically for first 10s (widget may take time to init shadow DOM)
    const checks = [500, 1000, 2000, 3000, 5000, 8000, 10000]
    const timers = checks.map(ms =>
      setTimeout(() => {
        const w = document.querySelector('chat-widget')
        if (w?.shadowRoot) {
          injectStyles(w.shadowRoot)
          fixIonButtonBorders(w.shadowRoot)
        }
      }, ms)
    )

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  return null // This component renders nothing — it only injects styles
}
