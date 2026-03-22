import { AnimatedSection } from './AnimatedSection'

const outcomes = [
  {
    title: 'Every call answered',
    desc: 'No more voicemails. Alex picks up in under 1 second, 24/7.',
  },
  {
    title: 'Leads followed up in 60s',
    desc: 'Form fill to callback before they close the browser tab.',
  },
  {
    title: 'Calendar fills itself',
    desc: 'Appointments booked in real-time, synced to your calendar.',
  },
  {
    title: 'Dead leads revived',
    desc: 'Alex reactivates cold leads. 5-10 recovered per month.',
  },
  {
    title: 'No-shows drop 60%',
    desc: 'Confirmation calls before every appointment.',
  },
  {
    title: '5-star reviews on autopilot',
    desc: 'Happy customers funneled to your Google page automatically.',
  },
]

export function WhatChanges() {
  return (
    <section id="results" className="relative py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-24">
            <p className="label mb-6">The results</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="text-white">What Changes</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">When First Touch Runs.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outcomes.map((item, i) => (
            <AnimatedSection key={i} delay={i * 120}>
              <div className="p-8 rounded-2xl liquid-glass card-hover group hover:bg-white/[0.05] h-full">
                <h3 className="text-base font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
