import { AnimatedSection } from './AnimatedSection'

export function LiveDemo() {
  return (
    <section className="relative py-40 md:py-52 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <p className="label mb-6">Try it yourself</p>
          <div className="divider-line mb-16" />
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-6">
            <span className="text-white/90">Hear It</span>
            <br />
            <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">For Yourself.</span>
          </h2>
          <p className="text-base text-white/30 mb-16 font-light">
            Real AI. Real conversation. No scripts.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <a
            href="tel:+18584347041"
            className="inline-block group"
          >
            <div className="relative rounded-3xl glass-strong p-14 md:p-20 hover:bg-white/[0.06] transition-all duration-500">
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(152,58,214,0.06),transparent_70%)] pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C967E8] to-[#983AD6] flex items-center justify-center shadow-[0_0_60px_rgba(152,58,214,0.25)] group-hover:shadow-[0_0_80px_rgba(152,58,214,0.4)] transition-shadow duration-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white/90">
                  +1 (858) 434-7041
                </p>
                <p className="text-[13px] text-white/25 font-light">
                  Alex answers instantly
                </p>
              </div>
            </div>
          </a>
        </AnimatedSection>
      </div>
    </section>
  )
}
