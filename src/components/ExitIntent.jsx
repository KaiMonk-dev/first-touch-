import { useState, useEffect, useCallback } from 'react'
import { useCalendly } from './CalendlyModal'

export function ExitIntent() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [entering, setEntering] = useState(false)
  const calendly = useCalendly()

  const handleMouseLeave = useCallback((e) => {
    if (e.clientY <= 5 && !dismissed && window.scrollY > 400) {
      setShow(true)
      requestAnimationFrame(() => setEntering(true))
    }
  }, [dismissed])

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [handleMouseLeave])

  const close = () => {
    setEntering(false)
    setTimeout(() => { setShow(false); setDismissed(true) }, 500)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      {/* Backdrop — deep space darkness */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          opacity: entering ? 1 : 0,
        }}
        onClick={close}
      />

      {/* Modal — clean, no canvas stars, pure liquid glass */}
      <div
        className="relative max-w-md w-full rounded-3xl liquid-glass-strong p-10 md:p-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          filter: entering ? 'blur(0)' : 'blur(4px)',
        }}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white/25 hover:text-white/60 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          {/* Minimal gold accent line */}
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent mx-auto mb-8" />

          <h3 className="text-xl md:text-2xl font-bold tracking-[-0.02em] leading-[1.15] mb-4">
            <span className="text-white">The universe is calling</span>
            <br />
            <span className="text-white/40">you back.</span>
          </h3>

          <p className="text-[13px] text-white/40 font-light leading-relaxed mb-8 max-w-xs mx-auto">
            Every hour without First Touch is another customer choosing someone else.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => { close(); setTimeout(() => calendly.open(), 600) }}
              className="w-full px-7 py-3.5 rounded-full bg-white text-black font-semibold text-[13px] hover:bg-white/90 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] btn-press"
            >
              Book a Strategy Call
            </button>

            <a
              href="tel:+18584347041"
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full liquid-glass text-white/50 text-[13px] font-light hover:text-white/80 transition-all"
            >
              Call Alex — 30 seconds
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
