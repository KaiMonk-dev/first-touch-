import { AnimatedSection } from './AnimatedSection'

const stats = [
  { value: '62%', label: 'of callers won\'t call back after a missed call' },
  { value: '85%', label: 'call your competitor instead' },
  { value: '$52K+', label: 'lost per year from just 2 missed calls a week' },
]

export function Problem() {
  return (
    <section className="relative py-28 md:py-36 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <AnimatedSection>
          <p className="label mb-6">The reality</p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.9] mb-24">
            <span className="text-white/90">The Cost of</span>
            <br />
            <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">Missed Calls.</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={400 + i * 200}>
              <div className="space-y-5">
                <p className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.04em] bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-[13px] text-white/30 max-w-[220px] mx-auto leading-relaxed font-light">
                  {stat.label}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={1000}>
          <p className="text-lg md:text-xl text-white/30 max-w-md mx-auto font-light leading-relaxed">
            Every unanswered call is a customer choosing someone else.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
