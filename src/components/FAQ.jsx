import { useState } from 'react'
import { AnimatedSection } from './AnimatedSection'

const faqs = [
  {
    q: 'What is First Touch?',
    a: 'First Touch is a customer experience platform powered by AI voice technology. We build a custom AI agent — named Alex — specifically trained for your business. Alex answers calls, qualifies leads, books appointments, and follows up with customers, 24/7.',
  },
  {
    q: 'Will my customers know they\'re talking to AI?',
    a: 'Alex is designed to sound natural and conversational — not robotic. Most callers don\'t realize they\'re talking to AI. If a caller asks directly, Alex will let them know and can transfer to a human at any time.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most businesses are live within 72 hours of the strategy call. We handle everything — training, configuration, calendar integration, and testing.',
  },
  {
    q: 'What if Alex can\'t handle a call?',
    a: 'Alex knows its limits. Complex or sensitive calls get flagged and transferred to you or your team immediately, with full context of the conversation.',
  },
  {
    q: 'Do I need any technical skills?',
    a: 'Zero. We set everything up for you. You keep doing what you do — we handle the tech.',
  },
  {
    q: 'What\'s the ROI?',
    a: 'Clients typically see the service pay for itself within the first week. If Alex books just one extra job per month at $500+, that\'s a 10x return on your $597 investment.',
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
              <div className="rounded-xl liquid-glass overflow-hidden hover:bg-white/[0.05] transition-all duration-500">
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
