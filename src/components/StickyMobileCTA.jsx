import { useState, useEffect } from 'react'
import { useBooking } from './BookingModal'
import { playCtaChime } from '../hooks/useCtaSound'
import { triggerGHLWidget } from '../utils/ghl'

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)
  const booking = useBooking()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[45] md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
      }`}
    >
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />

      <div className="sticky-mobile-cta bg-black/90 backdrop-blur-2xl px-4 py-3.5 flex items-center gap-3">
        <button
          onClick={triggerGHLWidget}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full liquid-glass text-white/60 text-[13px] font-medium hover:text-white/80 transition-colors"
        >
          <span className="live-dot" style={{ width: 5, height: 5 }} />
          Talk to Alex
        </button>
        <button
          onClick={() => { playCtaChime(); booking.open() }}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-white text-black text-[13px] font-semibold hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
        >
          Book a Call
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
