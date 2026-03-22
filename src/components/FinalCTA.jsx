import { AnimatedSection } from './AnimatedSection'
import { useCalendly } from './CalendlyModal'

export function FinalCTA() {
  const calendly = useCalendly()
  return (
    <section className="relative py-40 md:py-52 px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <div className="divider-line mb-16" />
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-8">
            <span className="text-white/90">Ready to Never Miss</span>
            <br />
            <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">
              Another Customer?
            </span>
          </h2>
          <p className="text-base text-white/30 mb-14 max-w-md mx-auto font-light leading-relaxed">
            Book a free 30-minute strategy call. We'll show you exactly how
            First Touch works for your business.
          </p>

          <button
            onClick={() => calendly.open()}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-white/90 transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] btn-press"
          >
            Book Your Free Call
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-[12px] text-white/20 font-light">
            <a href="tel:+18584347041" className="hover:text-white/40 transition-colors duration-300">
              +1 (858) 434-7041
            </a>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />
            <a href="mailto:ascensionfirstai@gmail.com" className="hover:text-white/40 transition-colors duration-300">
              ascensionfirstai@gmail.com
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
