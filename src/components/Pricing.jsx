import { AnimatedSection } from './AnimatedSection'
import { useCalendly } from './CalendlyModal'

const plans = [
  {
    name: 'Core',
    price: '$597',
    period: '/mo',
    features: [
      'Dedicated AI agent (Alex), custom-trained',
      'Answers every inbound call, 24/7',
      'Real-time calendar booking',
      'SMS follow-ups to every caller',
      'Monthly performance dashboard',
      'Live in 72 hours',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$897',
    period: '/mo',
    features: [
      'Everything in Core, plus:',
      '60-second speed-to-lead callbacks',
      'Dead lead reactivation campaigns',
      'No-show reduction calls',
      'Google review generation',
      'Advanced analytics & reporting',
      'Priority support',
    ],
    cta: 'Go Pro',
    featured: true,
  },
]

export function Pricing() {
  const calendly = useCalendly()
  return (
    <section id="pricing" className="relative py-40 md:py-52 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-24">
            <p className="label mb-6">Pricing</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="text-white/90">Simple Pricing.</span>
              <br />
              <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">Real Results.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 200}>
              <div className={`h-full p-10 rounded-2xl transition-all duration-500 ${
                plan.featured ? 'glass-strong' : 'glass'
              }`}>
                {plan.featured && (
                  <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#B8965A]/20 to-[#C9A96E]/20 border border-[#C9A96E]/20 text-[10px] font-medium tracking-wider uppercase text-[#B8965A] mb-6">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2 text-white/80">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-bold tracking-tight text-white/90">{plan.price}</span>
                  <span className="text-white/20 text-sm font-light">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-[#B8965A]/40 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="text-[13px] text-white/40 leading-relaxed font-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => calendly.open()}
                  className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-[14px] transition-all duration-300 ${
                    plan.featured
                      ? 'bg-white text-black hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]'
                      : 'glass hover:bg-white/[0.06] text-white/70'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={500}>
          <p className="text-center text-[12px] text-white/15 mt-10 font-light tracking-wide">
            No contracts. 30-day money-back guarantee. Cancel anytime.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
