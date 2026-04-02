import { useState, useEffect } from 'react'
import { triggerGHLWidget } from '../utils/ghl'

/**
 * Floating contextual label near the GHL widget trigger (bottom-right).
 * Appears after 8s or scrolling past hero. Dismissible, remembers via localStorage.
 */
export function GHLWidgetLabel() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed
    try {
      if (localStorage.getItem('ft_ghl_label_dismissed')) {
        setDismissed(true)
        return
      }
    } catch {}

    let shown = false
    const show = () => {
      if (shown) return
      shown = true
      setVisible(true)
    }

    // Show after 8s
    const timer = setTimeout(show, 8000)

    // Or after scrolling past hero (~window height)
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) show()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    try { localStorage.setItem('ft_ghl_label_dismissed', '1') } catch {}
  }

  const handleClick = () => {
    triggerGHLWidget()
    dismiss()
  }

  if (dismissed || !visible) return null

  return (
    <div
      className="fixed z-[44] bottom-[90px] right-5 animate-fade-up"
      style={{ animationDuration: '0.5s' }}
    >
      <div className="flex items-center gap-2 pl-4 pr-2 py-2.5 rounded-xl liquid-glass border-l-2 border-[#C9A96E]/30 shadow-lg">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 text-[12px] text-white/60 font-light hover:text-white/90 transition-colors"
        >
          <span className="live-dot" />
          Talk to Alex
        </button>
        <button
          onClick={dismiss}
          className="w-5 h-5 flex items-center justify-center rounded-full text-white/20 hover:text-white/50 transition-colors ml-1"
          aria-label="Dismiss"
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
