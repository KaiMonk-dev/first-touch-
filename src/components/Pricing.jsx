import { AnimatedSection } from './AnimatedSection'
import { useCalendly } from './CalendlyModal'

const plans = [
  {
    name: 'Core',
    tagline: 'Never Miss a Call Again',
    price: '$597',
    period: '/mo',
    features: [
      'AI agent Alex — answers every call, 24/7',
      'Missed call text-back — instant SMS recovery',
      'Real-time calendar booking via voice + SMS',
      'Automated SMS follow-ups to every lead',
      'Appointment reminders via SMS',
      'Automated Google review requests',
      'Lead Connector app — see leads in real-time',
      'Live in 72 hours',
    ],
    cta: 'Get Started',
    tier: 'standard',
  },
  {
    name: 'Pro',
    tagline: 'Fill Your Calendar on Autopilot',
    price: '$997',
    period: '/mo',
    features: [
      'Everything in Core, plus:',
      '60-second speed-to-lead callbacks',
      'No-show prevention system — reminders + call',
      'Dead lead reactivation campaigns (monthly)',
      'Smart review generation — sentiment-filtered',
      'Custom website built + maintained',
      'Website chat widget with lead capture',
      'Priority support — 2hr response',
    ],
    cta: 'Go Pro',
    tier: 'featured',
  },
  {
    name: 'Enterprise',
    tagline: 'Your Entire Front Office, Automated',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Pro, plus:',
      'Multi-location support — one Alex per location',
      'Custom AI training — your scripts, your tone, your brand',
      'CRM integration (HubSpot, Salesforce, Jobber, etc.)',
      'Dedicated account manager',
      'Custom reporting & analytics dashboard',
      'API access for workflow automation',
      'White-glove onboarding & quarterly strategy reviews',
      'SLA-backed uptime guarantee',
    ],
    cta: 'Contact Sales',
    tier: 'enterprise',
  },
]

export function Pricing() {
  const calendly = useCalendly()
  return (
    <section id="pricing" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-24">
            <p className="label mb-6">Pricing</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="text-white">Simple Pricing.</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">Real Results.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className={`h-full p-9 rounded-2xl transition-all duration-500 flex flex-col ${
                plan.tier === 'featured'
                  ? 'liquid-glass-strong liquid-shimmer'
                  : plan.tier === 'enterprise'
                  ? 'liquid-glass-strong relative overflow-hidden'
                  : 'liquid-glass'
              }`}>
                {/* Enterprise gold border accent */}
                {plan.tier === 'enterprise' && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />
                )}

                {/* Badge */}
                {plan.tier === 'featured' && (
                  <span className="inline-block self-start px-3 py-1 rounded-full bg-gradient-to-r from-[#B8965A]/20 to-[#C9A96E]/20 border border-[#C9A96E]/25 text-[10px] font-medium tracking-wider uppercase text-[#C9A96E] mb-5">
                    Most Popular
                  </span>
                )}
                {plan.tier === 'enterprise' && (
                  <span className="inline-block self-start px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium tracking-wider uppercase text-white/60 mb-5">
                    Enterprise
                  </span>
                )}

                <h3 className="text-lg font-semibold mb-1 text-white/90">{plan.name}</h3>
                {plan.tagline && (
                  <p className="text-[11px] text-[#C9A96E]/70 font-light tracking-wide mb-3">{plan.tagline}</p>
                )}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`font-bold tracking-tight text-white ${
                    plan.price === 'Custom' ? 'text-4xl' : 'text-5xl'
                  }`}>{plan.price}</span>
                  {plan.period && (
                    <span className="text-white/35 text-sm font-light">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.tier === 'enterprise' ? 'text-white/40' : 'text-[#C9A96E]/60'
                      }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span className="text-[13px] text-white/60 leading-relaxed font-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => calendly.open()}
                  className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-[14px] transition-all duration-300 mt-auto ${
                    plan.tier === 'featured'
                      ? 'bg-white text-black hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]'
                      : plan.tier === 'enterprise'
                      ? 'bg-gradient-to-r from-[#B8965A] to-[#C9A96E] text-black hover:shadow-[0_0_40px_rgba(201,169,110,0.3)]'
                      : 'liquid-glass hover:bg-white/[0.08] text-white/80'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={500}>
          <p className="text-center text-[12px] text-white/30 mt-10 font-light tracking-wide">
            No contracts. 30-day money-back guarantee. Cancel anytime.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
