import { AnimatedSection } from './AnimatedSection'

const timeline = [
  {
    day: 'Day 1',
    title: 'Strategy Call',
    desc: 'We learn your business, your customers, and exactly how you want calls handled.',
  },
  {
    day: 'Day 2',
    title: 'We Build Alex',
    desc: 'Custom scripts, calendar integration, brand voice training, and conversation flows — all configured.',
  },
  {
    day: 'Day 3',
    title: 'Testing & Refinement',
    desc: 'Live test calls, edge case handling, and fine-tuning until Alex sounds like your best employee.',
  },
  {
    day: 'Day 4',
    title: 'Go Live',
    desc: 'Alex starts answering calls. You start booking more jobs. Every call recorded and logged.',
  },
  {
    day: 'Week 2',
    title: 'First Performance Report',
    desc: 'Calls answered, leads booked, response times — real data showing real results.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                Live in 72 Hours.
              </span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[27px] md:left-[31px] top-0 bottom-0 w-px bg-gradient-to-b from-[#C9A96E]/30 via-[#C9A96E]/10 to-transparent" />

          <div className="space-y-2">
            {timeline.map((step, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="flex gap-6 group">
                  {/* Dot */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-[54px] md:w-[62px] flex flex-col items-center pt-7">
                      <div className="w-3 h-3 rounded-full bg-[#C9A96E]/30 border-2 border-[#C9A96E]/50 group-hover:bg-[#C9A96E]/60 group-hover:border-[#C9A96E] transition-all duration-500 relative z-10" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-7 rounded-2xl liquid-glass card-hover group-hover:bg-white/[0.05]">
                    <span className="text-[10px] font-semibold text-[#C9A96E]/60 tracking-wider uppercase">{step.day}</span>
                    <h3 className="text-lg font-semibold mt-2 mb-2 text-white">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-light">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
