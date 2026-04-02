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
    color: #0a0a0a !important;
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

  .lc_text-widget--voice-start-call:hover {
    box-shadow:
      0 8px 32px rgba(201, 169, 110, 0.45),
      0 2px 6px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px) !important;
  }

  /* Force dark text on ALL call button children (fixes gold-on-gold) */
  .lc_text-widget--voice-start-call,
  .lc_text-widget--voice-start-call * {
    color: #0a0a0a !important;
  }
  .lc_text-widget--voice-start-call svg,
  .lc_text-widget--voice-start-call svg * {
    stroke: #0a0a0a !important;
    fill: #0a0a0a !important;
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

  /* ── Starfield background for voice screens ── */
  @keyframes starfieldTwinkle {
    0% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  .lc_text-widget--voice-initial-screen,
  .lc_text-widget--voice-active-screen {
    position: relative !important;
  }

  .lc_text-widget--voice-initial-screen::before,
  .lc_text-widget--voice-active-screen::before {
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
  }

  .lc_text-widget--voice-active-screen * {
    color: #fff !important;
  }

  /* ── Reduced Motion ── */
  @media (prefers-reduced-motion: reduce) {
    .lc_text-widget--voice-start-call {
      animation: none !important;
      background: linear-gradient(135deg, #B8965A, #C9A96E) !important;
      background-size: 100% 100% !important;
    }
    .lc_text-widget--bubble {
      animation: none !important;
    }
    .lc_text-widget--voice-initial-screen::before,
    .lc_text-widget--voice-active-screen::before {
      animation: none !important;
      opacity: 0.8 !important;
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
        const shadowObserver = new MutationObserver(() => injectStyles(w.shadowRoot))
        shadowObserver.observe(w.shadowRoot, { childList: true, subtree: true })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Re-check periodically for first 10s (widget may take time to init shadow DOM)
    const checks = [500, 1000, 2000, 3000, 5000, 8000, 10000]
    const timers = checks.map(ms =>
      setTimeout(() => {
        const w = document.querySelector('chat-widget')
        if (w?.shadowRoot) injectStyles(w.shadowRoot)
      }, ms)
    )

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])

  return null // This component renders nothing — it only injects styles
}
