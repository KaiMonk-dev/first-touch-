import { InfiniteSlider } from './InfiniteSlider'
import { useCalendly } from './CalendlyModal'

export function Hero() {
  const calendly = useCalendly()

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-40 pb-20 text-center">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.9] mb-8 max-w-5xl animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <span className="text-white">Every Call Answered.</span>
          <br />
          <span className="bg-gradient-to-b from-white/90 to-white/60 bg-clip-text text-transparent">
            Every Lead Booked.
          </span>
        </h1>

        <p
          className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed font-light mb-14 animate-fade-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          Alex picks up in under 1 second, books 3-5 extra jobs per week,
          and follows up before your competitor even knows the lead exists.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 mb-10 animate-fade-up"
          style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
        >
          <button
            onClick={() => calendly.open()}
            className="group px-8 py-4 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] btn-press flex items-center gap-3"
          >
            Book a Free Strategy Call
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="tel:+18584347041"
            className="px-8 py-4 rounded-2xl liquid-glass text-white/80 font-medium text-[15px] hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-2.5 liquid-shimmer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Alex Now
          </a>
        </div>

        {/* Trust */}
        <p
          className="text-[12px] text-white/35 tracking-wider animate-fade-up"
          style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
        >
          No contracts &middot; 30-day guarantee &middot; Live in 72 hours
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
