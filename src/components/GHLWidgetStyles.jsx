import { useEffect, useRef } from 'react'

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

  @keyframes avatarPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201, 169, 110, 0.3), 0 0 20px rgba(201, 169, 110, 0.15); }
    50%       { box-shadow: 0 0 0 6px rgba(201, 169, 110, 0), 0 0 28px rgba(201, 169, 110, 0.25); }
  }

  /* Playful wiggle — attracts attention on load, stops on click */
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    10% { transform: rotate(-3deg) scale(1.02); }
    20% { transform: rotate(3deg) scale(1.02); }
    30% { transform: rotate(-2deg); }
    40% { transform: rotate(2deg); }
    50% { transform: rotate(0deg); }
  }

  /* Wiggle applies to the floating trigger bubble only */
  .lc_text-widget--bubble.ft-wiggle {
    animation: wiggle 1.8s ease-in-out 0.5s 3, galaxyGlow 6s ease-in-out infinite !important;
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
  .lc_text-widget--voice-initial-screen,
  .lc_text-widget--voice-active-screen,
  .lc_text-widget--voice-call-ended-screen {
    background: linear-gradient(180deg, #080706 0%, #0c0a08 50%, #0a0908 100%) !important;
    color: #fff !important;
  }

  /* Ensure all inner text in every screen is white (except gold buttons) */
  .lc_text-widget--voice-call-ended-screen *:not(ion-button):not(ion-button *),
  .lc_text-widget--voice-call-ended-status {
    color: #fff !important;
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
    color: rgba(201, 169, 110, 0.65) !important;
    font-size: 12px !important;
    font-weight: 300 !important;
    letter-spacing: 0.04em !important;
  }

  /* Hide AI badge — Alex is a team member, not a bot */
  .lc_text-widget--voice-ai-badge {
    display: none !important;
  }

  /* Avatar — subtle gold pulse ring */
  .lc_text-widget--voice-agent-avatar {
    border: 2px solid rgba(201, 169, 110, 0.35) !important;
    border-radius: 50% !important;
    animation: avatarPulse 3s ease-in-out infinite !important;
  }

  /* ── Call Button — Liquid Gold Pour (initial + call-ended screens) ── */
  .lc_text-widget--voice-start-call,
  .lc_text-widget--voice-talk-button {
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
    color: #0a0a0a !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 9999px !important;
    padding: 14px 32px !important;
    font-size: 14px !important;
    letter-spacing: 0.02em !important;
    outline: none !important;
    box-shadow:
      0 4px 20px rgba(201, 169, 110, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
    cursor: pointer !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  .lc_text-widget--voice-start-call:hover,
  .lc_text-widget--voice-talk-button:hover {
    box-shadow:
      0 8px 32px rgba(201, 169, 110, 0.45),
      0 2px 6px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px) !important;
  }

  .lc_text-widget--voice-start-call:focus,
  .lc_text-widget--voice-start-call:focus-visible,
  .lc_text-widget--voice-talk-button:focus,
  .lc_text-widget--voice-talk-button:focus-visible {
    outline: none !important;
  }

  /* Force dark text on ALL call button children */
  .lc_text-widget--voice-start-call,
  .lc_text-widget--voice-start-call *,
  .lc_text-widget--voice-talk-button,
  .lc_text-widget--voice-talk-button * {
    color: #0a0a0a !important;
  }

  /* Kill any rectangular outlines on button child elements */
  .lc_text-widget--voice-start-call span,
  .lc_text-widget--voice-start-call div,
  .lc_text-widget--voice-start-call p,
  .lc_text-widget--voice-talk-button span,
  .lc_text-widget--voice-talk-button div,
  .lc_text-widget--voice-talk-button p {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  /* Phone icon */
  .lc_text-widget--voice-start-call svg,
  .lc_text-widget--voice-start-call svg *,
  .lc_text-widget--voice-talk-button svg,
  .lc_text-widget--voice-talk-button svg * {
    stroke: #0a0a0a !important;
    fill: #0a0a0a !important;
    stroke-width: 2.5px !important;
  }

  /* ── Catch-all: force dark on screen containers — NOT ion-button elements ── */
  [class*="lc_text-widget--voice"]:not(ion-button) {
    background-color: #0a0908 !important;
    color: #fff !important;
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

  /* Galaxy glow cycle for trigger button */
  @keyframes galaxyGlow {
    0%, 100% {
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(201, 169, 110, 0.2),
        0 0 40px rgba(139, 110, 199, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    33% {
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(91, 141, 239, 0.2),
        0 0 40px rgba(201, 169, 110, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    66% {
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(168, 85, 247, 0.2),
        0 0 40px rgba(91, 141, 239, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }

  /* ── Trigger Button (floating circle) — Galaxy Glass ── */
  .lc_text-widget--bubble {
    background: radial-gradient(circle at 30% 30%, rgba(201, 169, 110, 0.3), rgba(139, 110, 199, 0.08) 50%, rgba(10, 10, 10, 0.95)) !important;
    border: 1.5px solid rgba(201, 169, 110, 0.3) !important;
    backdrop-filter: blur(24px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(160%) !important;
    animation: galaxyGlow 6s ease-in-out infinite !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  .lc_text-widget--bubble:hover {
    transform: scale(1.08) !important;
    border-color: rgba(201, 169, 110, 0.5) !important;
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.6),
      0 0 30px rgba(201, 169, 110, 0.3),
      0 0 60px rgba(139, 110, 199, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
  }

  /* ── Starfield background — initial screen only ── */
  @keyframes starfieldTwinkle {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  .lc_text-widget--voice-initial-screen {
    position: relative !important;
  }

  .lc_text-widget--voice-initial-screen::before {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    background-image:
      radial-gradient(1px 1px at 15% 25%, rgba(201, 169, 110, 0.18) 50%, transparent 100%),
      radial-gradient(1px 1px at 55% 8%, rgba(139, 110, 199, 0.14) 50%, transparent 100%),
      radial-gradient(1px 1px at 82% 65%, rgba(91, 141, 239, 0.12) 50%, transparent 100%),
      radial-gradient(1px 1px at 38% 78%, rgba(201, 169, 110, 0.1) 50%, transparent 100%),
      radial-gradient(1px 1px at 8% 55%, rgba(168, 85, 247, 0.1) 50%, transparent 100%),
      radial-gradient(1px 1px at 70% 40%, rgba(232, 213, 168, 0.08) 50%, transparent 100%),
      radial-gradient(1px 1px at 25% 90%, rgba(91, 141, 239, 0.06) 50%, transparent 100%) !important;
    pointer-events: none !important;
    animation: starfieldTwinkle 8s ease-in-out infinite alternate !important;
    z-index: 0 !important;
  }

  /* ── In-call / Active State ── */
  .lc_text-widget--voice-active-screen {
    background: linear-gradient(180deg, #080706 0%, #0c0a08 50%, #0a0908 100%) !important;
    position: absolute !important;
    inset: 0 !important;
    z-index: 10 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: visible !important;
  }

  /* When GHL hides the active screen, respect its display:none */
  .lc_text-widget--voice-active-screen[style*="display: none"],
  .lc_text-widget--voice-active-screen[style*="display:none"] {
    display: none !important;
  }

  .lc_text-widget--voice-active-screen *:not(ion-button):not(ion-button *) {
    color: #fff !important;
  }

  /* ── Call status / timer — gold tint ── */
  .lc_text-widget--voice-call-timer,
  [class*="lc_text-widget--voice-call-status"],
  [class*="lc_text-widget--voice-call-timer"] {
    color: rgba(201, 169, 110, 0.7) !important;
    font-size: 12px !important;
    font-weight: 300 !important;
    letter-spacing: 0.1em !important;
  }

  /* ── Voice Controls — premium, sleek ── */
  .lc_text-widget--voice-controls {
    position: relative !important;
    z-index: 20 !important;
    display: flex !important;
    gap: 20px !important;
    align-items: center !important;
    justify-content: center !important;
    margin-top: auto !important;
    padding: 28px 0 !important;
  }

  /* Mute — frosted glass circle */
  .lc_text-widget--voice-mute-btn {
    width: 52px !important;
    min-width: 52px !important;
    height: 52px !important;
    min-height: 52px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.07) !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35) !important;
    cursor: pointer !important;
    z-index: 25 !important;
    transition: all 0.3s ease !important;
  }

  .lc_text-widget--voice-mute-btn:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.22) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
  }

  /* End Call — deep crimson, refined */
  .lc_text-widget--voice-end-call-btn {
    width: 52px !important;
    min-width: 52px !important;
    height: 52px !important;
    min-height: 52px !important;
    border-radius: 50% !important;
    background: #9f1239 !important;
    border: none !important;
    box-shadow:
      0 4px 20px rgba(159, 18, 57, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
    cursor: pointer !important;
    z-index: 25 !important;
    transition: all 0.3s ease !important;
  }

  .lc_text-widget--voice-end-call-btn:hover {
    background: #881337 !important;
    box-shadow:
      0 6px 28px rgba(159, 18, 57, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
  }

  /* Control button labels — subtle, refined */
  .lc_text-widget--voice-mute-btn + span,
  .lc_text-widget--voice-end-call-btn + span,
  [class*="lc_text-widget--voice-control"] span {
    font-size: 10px !important;
    font-weight: 300 !important;
    letter-spacing: 0.07em !important;
    color: rgba(255, 255, 255, 0.4) !important;
  }

  /* ── Reduced Motion ── */
  @media (prefers-reduced-motion: reduce) {
    .lc_text-widget--voice-start-call,
    .lc_text-widget--voice-talk-button {
      animation: none !important;
      background: linear-gradient(135deg, #B8965A, #C9A96E) !important;
      background-size: 100% 100% !important;
    }
    .lc_text-widget--bubble,
    .lc_text-widget--bubble.ft-wiggle {
      animation: none !important;
    }
    .lc_text-widget--voice-initial-screen::before {
      animation: none !important;
      opacity: 0.8 !important;
    }
    .lc_text-widget--voice-agent-avatar {
      animation: none !important;
    }
  }
`

const STYLE_ID = 'ft-premium-theme'

function injectStyles(shadow) {
  if (shadow.querySelector(`#${STYLE_ID}`)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = PREMIUM_STYLES
  shadow.appendChild(style)
}

/** Strip yellow rectangular borders from all ion-buttons' inner shadow DOMs.
 *  State-aware: removes and re-injects if the screen state has changed
 *  (same ion-button DOM element is reused across initial/call-ended screens). */
function stripIonButtonBorders(shadow) {
  // All talk buttons get transparent .button-native so the gold HOST shows through.
  // The host element is now explicitly gold for both .voice-start-call and .voice-talk-button.
  const TALK_CSS = `
    .button-native {
      border: none !important;
      outline: none !important;
      background: transparent !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      color: #0a0a0a !important;
    }
    .button-native * {
      color: #0a0a0a !important;
    }
  `
  const CONTROL_CSS = `
    .button-native {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
  `

  function getStateFor(btn) {
    const isTalk = btn.classList.contains('lc_text-widget--voice-talk-button')
    if (!isTalk) return { id: 'ft-ion-ctrl', css: CONTROL_CSS }
    const onEnded = !!btn.closest('.lc_text-widget--voice-call-ended-screen')
    return { id: onEnded ? 'ft-ion-talk-ended' : 'ft-ion-talk-init', css: TALK_CSS }
  }

  function tryInject() {
    const allBtns = shadow.querySelectorAll('ion-button')
    allBtns.forEach(btn => {
      if (!btn.shadowRoot) return
      const { id, css } = getStateFor(btn)
      const existing = btn.shadowRoot.querySelector('[id^="ft-ion-"]')
      if (existing) {
        if (existing.id === id) return // Already correct state
        existing.remove()              // State changed — remove stale style
      }
      const style = document.createElement('style')
      style.id = id
      style.textContent = css
      btn.shadowRoot.appendChild(style)
    })
    return allBtns.length > 0
  }

  if (tryInject()) return
  const attempts = [100, 300, 600, 1000, 1500, 2000, 3000, 5000, 8000]
  attempts.forEach(ms => setTimeout(() => tryInject(), ms))
}

/** Add wiggle class to floating trigger bubble; remove on first click */
function attachWiggle(shadow, clickedRef) {
  if (clickedRef.current) return
  const bubble = shadow.querySelector('.lc_text-widget--bubble')
  if (!bubble || bubble.classList.contains('ft-wiggle')) return
  bubble.classList.add('ft-wiggle')
  bubble.addEventListener('click', () => {
    clickedRef.current = true
    bubble.classList.remove('ft-wiggle')
  }, { once: true })
}

export function GHLWidgetStyles() {
  const wiggleClicked = useRef(false)

  useEffect(() => {
    const widget = document.querySelector('chat-widget')
    if (widget?.shadowRoot) {
      injectStyles(widget.shadowRoot)
      stripIonButtonBorders(widget.shadowRoot)
      attachWiggle(widget.shadowRoot, wiggleClicked)
    }

    const observer = new MutationObserver(() => {
      const w = document.querySelector('chat-widget')
      if (w?.shadowRoot) {
        injectStyles(w.shadowRoot)
        stripIonButtonBorders(w.shadowRoot)
        attachWiggle(w.shadowRoot, wiggleClicked)
        const shadowObserver = new MutationObserver(() => {
          injectStyles(w.shadowRoot)
          stripIonButtonBorders(w.shadowRoot)
          attachWiggle(w.shadowRoot, wiggleClicked)
        })
        shadowObserver.observe(w.shadowRoot, { childList: true, subtree: true })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    const checks = [500, 1000, 2000, 3000, 5000, 8000, 10000]
    const timers = checks.map(ms =>
      setTimeout(() => {
        const w = document.querySelector('chat-widget')
        if (w?.shadowRoot) {
          injectStyles(w.shadowRoot)
          stripIonButtonBorders(w.shadowRoot)
          attachWiggle(w.shadowRoot, wiggleClicked)
        }
      }, ms)
    )

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  return null
}
