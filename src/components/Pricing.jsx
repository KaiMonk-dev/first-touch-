import { useState, useEffect, useRef } from 'react'
import { AnimatedSection } from './AnimatedSection'
import { useBooking } from './BookingModal'
import { useTilt } from '../hooks/useTilt'

const plans = [
  {
    name: 'Core',
    tagline: 'Never Miss a Call Again',
    price: 597,
    period: '/mo',
    features: [
      { text: 'Alex — answers every call, 24/7', tip: 'Picks up in under 1 second, handles unlimited concurrent calls' },
      { text: 'Missed call text-back — instant SMS recovery', tip: 'Automatically texts callers you miss within 30 seconds' },
      { text: 'Real-time calendar booking via voice + SMS', tip: 'Syncs with Google Calendar and your scheduling software' },
      { text: 'SMS follow-ups to every lead — on autopilot', tip: 'Customizable sequences — timing and messaging tailored to you' },
      { text: 'Appointment reminders via SMS', tip: 'Reduces no-shows by up to 60%' },
      { text: 'Google review requests — sent for you', tip: 'Sent after completed jobs to build your reputation' },
      { text: 'Lead Connector app — manage leads in real-time', tip: 'See every call, text, and booking from your phone' },
      { text: 'Live in 72 hours', tip: 'Strategy call to go-live in 3 days' },
    ],
    cta: 'Get Started',
    tier: 'standard',
  },
  {
    name: 'Pro',
    tagline: 'Fill Your Calendar on Autopilot',
    price: 997,
    period: '/mo',
    features: [
      { text: 'Everything in Core, plus:' },
      { text: 'First Touch Live — talk to Alex on your website', tip: 'Your website\'s personal welcome desk — visitors speak directly with Alex the moment they arrive' },
      { text: 'Custom-designed premium website — built and maintained', tip: 'Fully managed, conversion-optimized, mobile-first design' },
      { text: '60-second speed-to-lead callbacks', tip: 'Form fills trigger an immediate call from Alex' },
      { text: 'No-show prevention — reminders + follow-up call', tip: 'Calls and texts sent before every appointment — handled for you' },
      { text: 'Dead lead reactivation campaigns', tip: 'Monthly outreach to cold leads — avg. 5-10 recovered' },
      { text: 'Intelligent review generation — sentiment-filtered', tip: 'Only asks happy customers, routes unhappy ones to you privately' },
      { text: 'Priority support — 2hr response', tip: 'Direct line to your account team' },
    ],
    cta: 'Go Pro',
    tier: 'featured',
  },
  {
    name: 'Enterprise',
    tagline: 'Your Entire Front Office, Handled',
    price: null,
    period: '',
    features: [
      { text: 'Everything in Pro, plus:' },
      { text: 'Multi-location deployment — one Alex per location', tip: 'Each location gets a uniquely trained team member' },
      { text: 'Custom persona — your voice, your tone, your brand', tip: 'Tailored scripts, personality, and conversation style' },
      { text: 'Full reputation engine — Google, Yelp, and Facebook', tip: 'Review requests sent across all major platforms — on your behalf' },
      { text: 'Negative review intercept — bad feedback stays private', tip: 'Unhappy customers routed to you before they post publicly' },
      { text: 'Referral engine', tip: 'Happy customers are asked for referrals post-service — seamlessly' },
      { text: 'Outbound reactivation campaigns', tip: 'Alex calls your dormant leads with personalized outreach' },
      { text: 'Full CRM pipeline management', tip: 'Lead stages, follow-up sequences, and deal tracking — all handled' },
      { text: 'Advanced analytics + intelligent call scoring', tip: 'Every call graded for quality, sentiment, and conversion potential' },
      { text: 'CRM integration — HubSpot, Salesforce, Jobber & more', tip: 'Bi-directional sync with your existing systems' },
      { text: 'Dedicated account manager', tip: 'Your single point of contact for strategy and support' },
      { text: 'Quarterly strategy reviews + SLA-backed uptime', tip: 'Guaranteed performance benchmarks and optimization sessions' },
    ],
    cta: 'Book a Strategy Call',
    tier: 'enterprise',
  },
]

// Animated counter hook
function useCounter(target, duration = 1500) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const start = performance.now()
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return [ref, value]
}

function Tooltip({ text }) {
  if (!text) return null
  return (
    <span className="group/tip relative cursor-help ml-1">
      <svg className="w-3 h-3 text-white/15 inline-block group-hover/tip:text-[#C9A96E]/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <span className="pricing-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-black/95 border border-white/10 text-[10px] text-white/70 font-light leading-relaxed whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-300 pointer-events-none z-50 max-w-[220px] whitespace-normal text-center">
        {text}
      </span>
    </span>
  )
}

export function Pricing() {
  const booking = useBooking()

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 group/cards">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} delay={i * 150} onBook={() => booking.open()} />
          ))}
        </div>

        <AnimatedSection delay={500}>
          <div className="flex items-center justify-center gap-3 mt-12 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-[13px] text-white/40 font-light">
              14-day money-back guarantee. No contracts. Cancel anytime.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

function PricingCard({ plan, delay, onBook }) {
  const [priceRef, animatedPrice] = useCounter(plan.price || 0, 1200)
  const tilt = useTilt(plan.tier === 'featured' ? 8 : 5)
  const [hovered, setHovered] = useState(false)

  const badges = {
    standard: { label: 'Starter', className: 'bg-white/5 border border-white/10 text-white/50' },
    featured: { label: 'Most Popular', className: 'bg-gradient-to-r from-[#B8965A]/20 to-[#C9A96E]/20 border border-[#C9A96E]/25 text-[#C9A96E]' },
    enterprise: { label: 'Enterprise', className: 'bg-white/5 border border-white/10 text-white/60' },
  }

  const badge = badges[plan.tier]

  return (
    <AnimatedSection delay={delay}>
      <div
        ref={priceRef}
        onMouseMove={tilt.onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={(e) => { tilt.onMouseLeave(e); setHovered(false) }}
        className={`h-full p-9 rounded-2xl flex flex-col card-hover transition-all duration-500 ${
          plan.tier === 'featured'
            ? 'liquid-glass-strong liquid-shimmer'
            : plan.tier === 'enterprise'
            ? 'liquid-glass-strong relative overflow-hidden'
            : 'liquid-glass'
        } ${hovered ? 'scale-[1.02] z-10' : 'group-hover/cards:opacity-60 group-hover/cards:scale-[0.98]'}
        hover:!opacity-100 hover:!scale-100`}
        style={tilt.style}
      >
        {plan.tier === 'enterprise' && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />
        )}

        {/* Spotlight glow on hover */}
        {plan.tier === 'featured' && (
          <div
            className="absolute -inset-8 rounded-3xl pointer-events-none transition-opacity duration-700"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.06), transparent 70%)',
              opacity: hovered ? 1 : 0,
              zIndex: -1,
            }}
          />
        )}

        <span className={`inline-block self-start px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase mb-5 ${badge.className}`}>
          {badge.label}
        </span>

        <h3 className="text-lg font-semibold mb-1 text-white/90">{plan.name}</h3>
        {plan.tagline && (
          <p className="text-[11px] text-[#C9A96E]/70 font-light tracking-wide mb-3">{plan.tagline}</p>
        )}

        <div className="flex items-baseline gap-1 mb-8">
          {plan.price ? (
            <>
              <span className="text-5xl font-bold tracking-tight text-white tabular-nums">
                ${animatedPrice.toLocaleString()}
              </span>
              <span className="text-white/35 text-sm font-light">{plan.period}</span>
            </>
          ) : (
            <span className="text-4xl font-bold tracking-tight text-white">Custom</span>
          )}
        </div>

        <ul className="space-y-3.5 mb-8 flex-1">
          {plan.features.map((feature, j) => (
            <li key={j} className="flex items-start gap-3 group/feature">
              <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover/feature:scale-125 group-hover/feature:text-[#C9A96E] ${
                plan.tier === 'enterprise' ? 'text-[#C9A96E]/50' : 'text-[#C9A96E]/60'
              }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-[13px] text-white/60 leading-relaxed font-light group-hover/feature:text-white/75 transition-colors duration-300">
                {feature.text}
                <Tooltip text={feature.tip} />
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={onBook}
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
  )
}
