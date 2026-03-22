import { AnimatedSection } from './AnimatedSection'

const steps = [
  {
    num: '01',
    title: 'Strategy Call',
    desc: 'We learn your business, your customers, and exactly how you want calls handled.',
  },
  {
    num: '02',
    title: 'We Build Alex',
    desc: 'We train your AI agent on your scripts, services, calendar, and brand voice.',
  },
  {
    num: '03',
    title: 'Go Live',
    desc: 'Alex starts answering calls. You start booking more jobs. It\'s that simple.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="bg-gradient-to-b from-white/90 to-white/30 bg-clip-text text-transparent">
                Live in 72 Hours.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 200}>
              <div className="relative p-10 rounded-2xl glass card-hover group hover:bg-white/[0.04] h-full">
                <span className="text-6xl font-bold tracking-[-0.04em] bg-gradient-to-b from-white/15 to-white/[0.03] bg-clip-text text-transparent">
                  {step.num}
                </span>
                <h3 className="text-xl font-semibold mt-6 mb-4 text-white/90">{step.title}</h3>
                <p className="text-[13px] text-white/30 leading-relaxed font-light">{step.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
