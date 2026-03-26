import { AnimatedSection } from './AnimatedSection'

const framework = [
  {
    phase: 'Capture',
    desc: 'Every call answered. Every lead caught. No voicemail, no missed opportunities — your business is always open.',
    icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  },
  {
    phase: 'Care',
    desc: 'Warm, personal, human-feeling conversations. Your customers feel heard, valued, and cared for from the very first moment.',
    icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  },
  {
    phase: 'Convert',
    desc: 'Qualified, booked, and followed up — automatically. Leads don\'t slip through. They become appointments, then customers.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    phase: 'Keep',
    desc: 'Reviews, referrals, and repeat business. Happy customers become your most powerful growth engine — and they come back.',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
]

const pillars = [
  'Every decision starts with the customer\'s experience.',
  'We\'re the premium option — not the budget one.',
  'Growth through genuine care, not manipulation.',
  'Effortless for you. Exceptional for your customers.',
]

export function WhoWeAre() {
  return (
    <section id="who-we-are" className="relative py-28 md:py-36 px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* The First Touch Approach */}
        <AnimatedSection>
          <div className="text-center mb-8">
            <p className="label mb-6">The First Touch Approach</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.9] mb-8">
              <span className="text-white">Your First Impression</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">
                Is Your Competitive Advantage.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">
              Every customer relationship begins with a single moment — the instant someone
              reaches out and decides whether your business cares about them. We call it the
              First Touch. Most businesses lose this moment. We make sure you own it.
            </p>
          </div>
        </AnimatedSection>

        {/* The Ascension Framework */}
        <AnimatedSection delay={250}>
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-[#C9A96E]/50 tracking-[0.2em] uppercase">
              The Ascension Framework
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-20">
          {framework.map((step, i) => (
            <AnimatedSection key={i} delay={300 + i * 100}>
              <div className="p-6 rounded-2xl liquid-glass card-hover h-full text-center relative overflow-hidden">
                {/* Connector line (not on last) */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-[#C9A96E]/20 to-transparent z-20" />
                )}
                <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A96E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-50"
                  >
                    <path d={step.icon} />
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-white/85 mb-2">{step.phase}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed font-light">{step.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Who We Are — concise */}
        <AnimatedSection delay={700}>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl liquid-glass-strong p-8 md:p-10">
              <h3 className="text-center text-[13px] font-semibold text-white/60 tracking-wider uppercase mb-8">
                What We Stand For
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pillars.map((pillar, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <p className="text-[13px] text-white/45 leading-relaxed font-light">{pillar}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom line */}
        <AnimatedSection delay={850}>
          <div className="text-center mt-14">
            <p className="text-[13px] text-[#C9A96E]/40 font-light italic tracking-wide">
              Ascension First — premium customer experience for business owners who refuse to compromise.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
