import { useState, useEffect } from 'react'
import { useCalendly } from './CalendlyModal'

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)
  const calendly = useCalendly()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-black/80 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3 flex items-center gap-3">
        <a
          href="tel:+18584347041"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full glass text-white/70 text-[13px] font-medium"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call Alex
        </a>
        <button
          onClick={() => calendly.open()}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-white text-black text-[13px] font-semibold"
        >
          Book a Call
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
