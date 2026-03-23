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
      {/* Backdrop with stars */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85), rgba(0,0,0,0.95))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          opacity: entering ? 1 : 0,
        }}
        onClick={close}
      />

      {/* Modal */}
      <div
        className="relative max-w-lg w-full rounded-3xl liquid-glass-strong p-12 md:p-14 liquid-shimmer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          filter: entering ? 'blur(0px)' : 'blur(6px)',
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

        {/* Ambient glow behind modal */}
        <div className="absolute -inset-12 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.05),transparent_70%)] pointer-events-none rounded-full" />

        <div className="text-center relative">
          {/* Constellation-style decorative dots */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-1 h-1 rounded-full bg-[#C9A96E]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]/50" />
            <div className="w-2 h-2 rounded-full bg-[#C9A96E]/40 shadow-[0_0_8px_rgba(201,169,110,0.3)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]/50" />
            <div className="w-1 h-1 rounded-full bg-[#C9A96E]/30" />
          </div>

          <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] leading-[1.1] mb-4">
            <span className="text-white">Your competitors</span>
            <br />
            <span className="bg-gradient-to-b from-white/70 to-white/40 bg-clip-text text-transparent">aren't missing calls.</span>
          </h3>

          <p className="text-sm text-white/45 font-light leading-relaxed mb-10 max-w-sm mx-auto">
            Every missed call costs you $400+ on average. A 15-minute strategy call
            could change that permanently.
          </p>

          {/* Two actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { close(); setTimeout(() => calendly.open(), 600) }}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] btn-press"
            >
              Book a Free Strategy Call
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <a
              href="tel:+18584347041"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full liquid-glass text-white/60 text-[14px] font-medium hover:text-white/90 hover:bg-white/[0.06] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Or call Alex — takes 30 seconds
            </a>
          </div>

          <p className="text-[10px] text-white/20 font-light mt-6">
            +1 (858) 434-7041
          </p>
        </div>
      </div>
    </div>
  )
}
