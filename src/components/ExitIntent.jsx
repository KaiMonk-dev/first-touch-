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
    setTimeout(() => {
      setShow(false)
      setDismissed(true)
    }, 400)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500"
        style={{ opacity: entering ? 1 : 0 }}
        onClick={close}
      />

      {/* Modal */}
      <div
        className="relative max-w-lg w-full rounded-3xl liquid-glass-strong p-12 md:p-14 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          filter: entering ? 'blur(0px)' : 'blur(4px)',
        }}
      >
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass flex items-center justify-center text-white/30 hover:text-white/70 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Stat that makes them pause */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
            <span className="text-[11px] text-white/50 font-medium tracking-wide">
              Alex is handling calls right now
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] leading-[1.1] mb-4">
            <span className="text-white">Your competitors</span>
            <br />
            <span className="text-white/50">aren't missing calls.</span>
          </h3>

          <p className="text-sm text-white/45 font-light leading-relaxed mb-10 max-w-sm mx-auto">
            Every missed call costs you $400+ on average. A 15-minute strategy call
            could change that permanently.
          </p>

          {/* Two actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { close(); calendly.open() }}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] btn-press"
            >
              Book a Free Strategy Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <a
              href="tel:+18584347041"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full liquid-glass text-white/70 text-[14px] font-medium hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Or call Alex — takes 30 seconds
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
