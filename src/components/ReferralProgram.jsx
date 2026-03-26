import { useState } from 'react'
import { AnimatedSection } from './AnimatedSection'

const steps = [
  {
    num: '01',
    title: 'Share Your Link',
    desc: 'Every client gets a unique referral link. Share it with business owners you know who are missing calls and losing leads.',
  },
  {
    num: '02',
    title: 'They Get Onboarded',
    desc: 'When they sign up through your link and go live with First Touch, their 72-hour setup begins — just like yours.',
  },
  {
    num: '03',
    title: 'You Get Rewarded',
    desc: 'Once they\'re live and active, your next month is on us. Every referral = one free month. No cap.',
  },
]

const rewards = [
  { referrals: '1', reward: '1 month free', icon: '✦' },
  { referrals: '3', reward: '3 months free', icon: '✦✦' },
  { referrals: '5+', reward: 'Permanent discount', icon: '✦✦✦' },
]

export function ReferralProgram() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // In production, this would be a unique referral link per client
    navigator.clipboard.writeText('https://ascensionfirst.com/?ref=invite').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {})
  }

  return (
    <section id="referral" className="relative py-28 md:py-36 px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="label mb-6">Referral Program</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.9] mb-8">
              <span className="text-white">Know a Business Owner</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">
                Who's Missing Calls?
              </span>
            </h2>
            <p className="text-base md:text-lg text-white/45 max-w-xl mx-auto leading-relaxed font-light">
              Refer them to First Touch. When they go live, your next month is free.
              No limit on referrals. The more you share, the more you save.
            </p>
          </div>
        </AnimatedSection>

        {/* How it works steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={150 + i * 100}>
              <div className="p-7 rounded-2xl liquid-glass card-hover h-full relative overflow-hidden">
                <span className="text-[40px] font-bold text-white/[0.03] absolute top-4 right-5 tracking-tight select-none">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <span className="inline-block text-[11px] font-semibold text-[#C9A96E]/60 tracking-wider uppercase mb-4">
                    Step {step.num}
                  </span>
                  <h3 className="text-[15px] font-semibold text-white/85 mb-3">{step.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Reward tiers */}
        <AnimatedSection delay={500}>
          <div className="rounded-2xl liquid-glass-strong p-8 md:p-10 mb-12">
            <h3 className="text-center text-[13px] font-semibold text-white/60 tracking-wider uppercase mb-8">
              Reward Tiers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rewards.map((tier, i) => (
                <div
                  key={i}
                  className={`text-center p-6 rounded-xl transition-all ${
                    i === 2
                      ? 'bg-gradient-to-b from-[#C9A96E]/10 to-transparent border border-[#C9A96E]/15'
                      : 'bg-white/[0.02] border border-white/[0.05]'
                  }`}
                >
                  <p className="text-[#C9A96E]/50 text-sm mb-2 tracking-wide">{tier.icon}</p>
                  <p className="text-2xl font-bold text-white/80 mb-1">{tier.referrals}</p>
                  <p className="text-[11px] text-white/35 uppercase tracking-wider mb-3">
                    {tier.referrals === '1' ? 'Referral' : 'Referrals'}
                  </p>
                  <p className={`text-[13px] font-medium ${
                    i === 2 ? 'text-[#C9A96E]' : 'text-white/60'
                  }`}>
                    {tier.reward}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={650}>
          <div className="text-center">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full liquid-glass-strong hover:bg-white/[0.08] transition-all text-white/80 font-medium text-[14px] btn-press"
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Link Copied
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Your Referral Link
                </>
              )}
            </button>
            <p className="text-[11px] text-white/25 mt-4 font-light">
              Active First Touch clients receive a personalized referral link after onboarding.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
