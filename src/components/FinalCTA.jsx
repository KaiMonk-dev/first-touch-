import { AnimatedSection } from './AnimatedSection'
import { useBooking } from './BookingModal'
import { useMagnetic } from '../hooks/useMagnetic'
import { triggerStarBirth } from './ViewportEffects'
import { playCtaChime } from '../hooks/useCtaSound'

export function FinalCTA() {
  const booking = useBooking()
  const btn = useMagnetic(0.35, 100)
  return (
    <section className="relative py-28 md:py-36 px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <div className="divider-line mb-16" />
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-8">
            <span className="text-white">Your Next Customer</span>
            <br />
            <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">
              Is Already Calling.
            </span>
          </h2>
          <p className="text-base text-white/50 mb-14 max-w-md mx-auto font-light leading-relaxed">
            Let's make sure someone's there to answer. We'll walk you through
            exactly what First Touch looks like for your business.
          </p>

          <div onMouseMove={btn.onMouseMove} onMouseLeave={btn.onMouseLeave}>
            <button
              ref={btn.ref}
              onClick={() => { playCtaChime(); triggerStarBirth(); booking.open() }}
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-white/90 transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] btn-press cta-breathe"
              style={btn.style}
            >
              Book Your Free Call
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p className="text-[13px] text-white/25 mt-10 mb-8 max-w-sm mx-auto font-light leading-relaxed italic">
            No pressure. No obligation. Just a conversation about what's possible.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[12px] text-white/35 font-light">
            <a href="tel:+18584347041" className="hover:text-white/60 transition-colors duration-300">
              +1 (858) 434-7041
            </a>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-white/15" />
            <a href="mailto:hello@ascensionfirst.com" className="hover:text-white/60 transition-colors duration-300">
              hello@ascensionfirst.com
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
