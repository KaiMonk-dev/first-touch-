import { AnimatedSection } from './AnimatedSection'
import { useCalendly } from './CalendlyModal'

const rows = [
  { feature: 'Answers in < 1 second', ai: true, human: false },
  { feature: 'Available 24/7', ai: true, human: false },
  { feature: 'Handles 100% of calls', ai: true, human: false },
  { feature: 'Books appointments live', ai: true, human: false },
  { feature: 'Qualifies leads on call', ai: true, human: false },
  { feature: 'Sends SMS follow-ups', ai: true, human: false },
  { feature: 'Never calls in sick', ai: true, human: false },
  { feature: 'No training required', ai: true, human: false },
  { feature: 'Monthly salary / overhead', ai: false, human: true },
  { feature: 'Turnover risk', ai: false, human: true },
]

export function ComparisonTable() {
  const calendly = useCalendly()

  return (
    <section className="relative py-40 md:py-52 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="label mb-6">Why switch</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="text-white/90">First Touch vs.</span>
              <br />
              <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">A Human Receptionist.</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="rounded-2xl glass overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_140px_140px] border-b border-white/[0.04]">
              <div className="p-5" />
              <div className="p-5 text-center">
                <p className="text-[12px] font-semibold text-white/70">First Touch</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-[12px] font-medium text-white/25">Human</p>
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_140px_140px] ${
                  i < rows.length - 1 ? 'border-b border-white/[0.03]' : ''
                } hover:bg-white/[0.02] transition-colors`}
              >
                <div className="p-4 md:p-5 flex items-center">
                  <span className="text-[13px] text-white/40 font-light">{row.feature}</span>
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center">
                  {row.ai ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <span className="w-4 h-[1px] bg-white/10" />
                  )}
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center">
                  {row.human ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <span className="w-4 h-[1px] bg-white/10" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <div className="text-center mt-12">
            <button
              onClick={() => calendly.open()}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all btn-press hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Get First Touch Live in 72 Hours
            </button>
            <p className="text-[11px] text-white/15 mt-4 font-light">No contracts. Cancel anytime.</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
