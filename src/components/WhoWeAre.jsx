import { AnimatedSection } from './AnimatedSection'
import { useTilt } from '../hooks/useTilt'

const framework = [
  {
    phase: 'Capture',
    desc: 'Every call answered. Every lead secured. Your business never closes.',
    icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  },
  {
    phase: 'Care',
    desc: 'Warm, personal conversations that make every caller feel like your most important customer.',
    icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  },
  {
    phase: 'Convert',
    desc: 'Qualified, booked, and followed up. Leads become appointments. Appointments become customers.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    phase: 'Keep',
    desc: 'Five-star reviews, referrals, and repeat business. Your reputation grows while you sleep.',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
]

const pillars = [
  'Every decision begins with the customer experience.',
  'Excellence is the standard, not the exception.',
  'Real relationships. Real conversations. Real growth.',
  'Effortless for you. Exceptional for your customers.',
]

function FrameworkCard({ step, index }) {
  const tilt = useTilt(6)
  return (
    <div
      className="p-6 rounded-2xl liquid-glass card-hover h-full text-center relative overflow-hidden liquid-shimmer"
      style={{ ...tilt.style, animationDelay: `${index * 3}s` }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />

      <div className="relative z-10">
        <span className="inline-block text-[9px] font-semibold text-[#C9A96E]/40 tracking-[0.25em] uppercase mb-4">
          0{index + 1}
        </span>
        <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/[0.08] flex items-center justify-center mx-auto mb-4">
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
        <h3 className="text-[15px] font-semibold text-white/85 mb-2.5">{step.phase}</h3>
        <p className="text-[12px] text-white/35 leading-relaxed font-light">{step.desc}</p>
      </div>
    </div>
  )
}

export function WhoWeAre() {
  const pillarTilt = useTilt(4)

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
                Is Everything.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <div className="max-w-xl mx-auto text-center mb-24">
            <p className="text-base md:text-lg text-white/45 leading-relaxed font-light">
              The moment someone reaches out to your business, they've already made a decision
              to trust you with their time. That moment — the First Touch — defines the entire
              relationship. We exist to make sure it's flawless.
            </p>
          </div>
        </AnimatedSection>

        {/* The Ascension Framework */}
        <AnimatedSection delay={200}>
          <div className="text-center mb-10">
            <p className="text-[10px] font-semibold text-[#C9A96E]/40 tracking-[0.25em] uppercase">
              The Ascension Framework
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-24">
          {framework.map((step, i) => (
            <AnimatedSection key={i} delay={250 + i * 100}>
              <FrameworkCard step={step} index={i} />
            </AnimatedSection>
          ))}
        </div>

        {/* What We Stand For */}
        <AnimatedSection delay={650}>
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl liquid-glass-strong p-8 md:p-10 liquid-shimmer relative overflow-hidden"
              style={pillarTilt.style}
              onMouseMove={pillarTilt.onMouseMove}
              onMouseLeave={pillarTilt.onMouseLeave}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/25 to-transparent" />
              <h3 className="text-center text-[10px] font-semibold text-white/40 tracking-[0.25em] uppercase mb-8">
                What We Stand For
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pillars.map((pillar, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-1 h-1 rounded-full bg-[#C9A96E]/30 flex-shrink-0 mt-2 group-hover:bg-[#C9A96E]/60 transition-colors duration-500" />
                    <p className="text-[13px] text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-500">{pillar}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom line */}
        <AnimatedSection delay={800}>
          <div className="text-center mt-16">
            <p className="text-[12px] text-white/15 font-light tracking-[0.15em] uppercase">
              Ascension First
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
