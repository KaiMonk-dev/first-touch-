import { useState, useEffect, useRef } from 'react'
import { InfiniteSlider } from './InfiniteSlider'
import { useBooking } from './BookingModal'
import { useMagnetic } from '../hooks/useMagnetic'
import { useVariant } from '../hooks/useVariant'
import { triggerStarBirth } from './ViewportEffects'
import { playCtaChime } from '../hooks/useCtaSound'
import { triggerGHLWidget } from '../utils/ghl'

export function Hero() {
  const booking = useBooking()
  const primaryBtn = useMagnetic(0.35, 100)
  const secondaryBtn = useMagnetic(0.25, 80)
  const [scrollY, setScrollY] = useState(0)
  const variant = useVariant()
  const hasWowed = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-40 pb-20 text-center">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.9] mb-8 max-w-5xl animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <span
            className="text-white block"
            style={{ transform: `translateY(${scrollY * -0.08}px)`, transition: 'transform 0.1s linear' }}
          >
            {variant.heroHeadline[0]}
          </span>
          <span
            className="bg-gradient-to-b from-white/90 to-white/60 bg-clip-text text-transparent block"
            style={{ transform: `translateY(${scrollY * -0.04}px)`, transition: 'transform 0.1s linear' }}
          >
            {variant.heroHeadline[1]}
          </span>
        </h1>

        <p
          className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed font-light mb-14 animate-fade-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          {variant.heroSubtext}
        </p>

        {/* CTAs with magnetic pull */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 mb-10 animate-fade-up"
          style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
        >
          <div
            onMouseMove={primaryBtn.onMouseMove}
            onMouseLeave={primaryBtn.onMouseLeave}
            onMouseEnter={() => {
              if (!hasWowed.current) {
                hasWowed.current = true
                // One-time supernova burst from button
                const el = document.createElement('div')
                el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:0;height:0;border-radius:50%;z-index:200;background:radial-gradient(circle,rgba(255,255,255,0.25),rgba(201,169,110,0.15) 40%,transparent 70%);pointer-events:none;transition:all 0.8s cubic-bezier(0.16,1,0.3,1);'
                document.body.appendChild(el)
                requestAnimationFrame(() => { el.style.width='600px'; el.style.height='600px'; el.style.opacity='0' })
                setTimeout(() => el.remove(), 1000)
              }
            }}
          >
            <button
              ref={primaryBtn.ref}
              onClick={() => { playCtaChime(); triggerStarBirth(); booking.open() }}
              className="group px-8 py-4 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-white/90 transition-colors btn-press btn-glow cta-breathe flex items-center gap-3"
              style={primaryBtn.style}
            >
              {variant.heroCTA}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div onMouseMove={secondaryBtn.onMouseMove} onMouseLeave={secondaryBtn.onMouseLeave}>
            <button
              ref={secondaryBtn.ref}
              onClick={triggerGHLWidget}
              className="px-8 py-4 rounded-2xl liquid-glass text-white/80 font-medium text-[15px] hover:text-white hover:bg-white/[0.08] transition-colors flex items-center gap-2.5 liquid-shimmer cta-breathe-gold"
              style={secondaryBtn.style}
            >
              <span className="live-dot" />
              {variant.heroSecondaryCTA}
            </button>
          </div>
        </div>

        {/* Curiosity micro-copy */}
        <p
          className="text-[11px] text-white/30 font-light tracking-wide animate-fade-up"
          style={{ animationDelay: '0.85s', animationFillMode: 'both' }}
        >
          She's live right now — ask her anything about your business.
        </p>

        {/* Trust */}
        <p
          className="text-[12px] text-white/35 tracking-wider animate-fade-up"
          style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
        >
          No contracts &middot; 14-day guarantee &middot; Live in 72 hours
        </p>

      </div>

      {/* Integrations bar */}
      <div className="relative z-10 mt-auto">
        <div className="border-t border-white/[0.06] py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <p className="label flex-shrink-0 whitespace-nowrap">
              Integrates with
            </p>
            <div className="hidden md:block w-px h-6 bg-white/[0.08] flex-shrink-0" />
            <InfiniteSlider />
          </div>
        </div>
      </div>
    </section>
  )
}

