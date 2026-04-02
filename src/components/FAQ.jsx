import { useState } from 'react'
import { AnimatedSection } from './AnimatedSection'

const faqs = [
  {
    q: 'What is First Touch?',
    a: 'First Touch is a premium customer experience solution by Ascension First. We build Alex — a dedicated team member trained specifically for your business. Alex answers calls, qualifies leads, books appointments, and follows up with customers, 24/7. Your customers feel cared for from their very first interaction.',
  },
  {
    q: 'What does Alex sound like?',
    a: 'Alex is warm, natural, and conversational — trained to match the tone and personality of your brand. Customers feel like they\'re speaking with someone who genuinely knows your business. And if a conversation ever needs a personal touch, Alex hands off to your team seamlessly, with full context.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most businesses are live within 72 hours of the strategy call. We handle everything — training, configuration, calendar integration, and testing.',
  },
  {
    q: 'What if Alex can\'t handle a call?',
    a: 'Alex knows when to hand off. Complex or sensitive calls get flagged and transferred to you or your team immediately, with full context of the conversation.',
  },
  {
    q: 'Do I need any technical skills?',
    a: 'Zero. We set everything up for you. You keep doing what you do — we handle the tech.',
  },
  {
    q: 'What\'s the ROI?',
    a: 'Clients typically see the service pay for itself within the first week. If Alex books just one extra job per month at $500+, that\'s a 10x return on your $597 investment.',
  },
  {
    q: 'How much does it cost?',
    a: 'Core starts at $597/mo, Pro at $997/mo, and Enterprise is custom-priced based on your operation. No contracts, no setup fees, and a 14-day money-back guarantee. You can see the full breakdown in our pricing section above.',
  },
  {
    q: 'Can Alex handle multiple languages?',
    a: 'Yes. Alex can be trained to handle calls in English and Spanish out of the box. Additional languages are available on Enterprise plans — we\'ll configure the right setup during your strategy call.',
  },
  {
    q: 'What industries does First Touch work for?',
    a: 'First Touch works for any service-based business that relies on phone calls to book jobs. Plumbing, HVAC, roofing, electrical, landscaping, dental offices, law firms, med spas, auto repair — if your customers call to book, Alex can handle it. Each Alex is custom-trained for your specific industry, services, and brand voice.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="relative py-28 md:py-36 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="label mb-6">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                Common Questions.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className={`rounded-xl overflow-hidden transition-all duration-500 ${
                open === i ? 'liquid-glass-strong' : 'liquid-glass hover:bg-white/[0.05]'
              }`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-[14px] font-medium text-white/80 pr-4">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      open === i ? 'rotate-45' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-6 text-sm text-white/50 leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
