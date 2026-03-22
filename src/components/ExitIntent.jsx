import { useState, useEffect, useCallback } from 'react'

export function ExitIntent() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleMouseLeave = useCallback((e) => {
    if (e.clientY <= 5 && !dismissed && window.scrollY > 400) {
      setShow(true)
    }
  }, [dismissed])

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [handleMouseLeave])

  const close = () => {
    setShow(false)
    setDismissed(true)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative max-w-md w-full rounded-3xl glass-strong p-10 text-center animate-fade-up">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Phone icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B8965A] to-[#C9A96E] flex items-center justify-center shadow-[0_0_50px_rgba(201,169,110,0.3)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3 text-white/90">
          Before you go —
        </h3>
        <p className="text-[14px] text-white/40 font-light leading-relaxed mb-8">
          Hear Alex handle a real call. One conversation and you'll see why businesses never go back to voicemail.
        </p>

        <a
          href="tel:+18584347041"
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] mb-3"
        >
          Call Alex Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <p className="text-[11px] text-white/20 font-light">
          +1 (858) 434-7041 &middot; Takes 30 seconds
        </p>
      </div>
    </div>
  )
}
