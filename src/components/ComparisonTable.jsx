import { AnimatedSection } from './AnimatedSection'
import { useCalendly } from './CalendlyModal'

const rows = [
  { feature: 'Answers in < 1 second', ft: true, human: false },
  { feature: 'Available 24/7, 365 days', ft: true, human: false },
  { feature: 'Handles 100% of calls', ft: true, human: false },
  { feature: 'Books appointments live', ft: true, human: false },
  { feature: 'Qualifies leads on call', ft: true, human: false },
  { feature: 'Sends SMS follow-ups', ft: true, human: false },
  { feature: 'Never calls in sick', ft: true, human: false },
  { feature: 'Ready from day one', ft: true, human: false },
  { feature: 'Monthly salary / overhead', ft: false, human: true },
  { feature: 'Turnover risk', ft: false, human: true },
]

export function ComparisonTable() {
  const calendly = useCalendly()

  return (
    <section className="relative py-28 md:py-36 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="text-white">First Touch vs.</span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/50 bg-clip-text text-transparent">The Traditional Way.</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="rounded-2xl liquid-glass-strong overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_140px_140px] border-b border-white/[0.06]">
              <div className="p-5" />
              <div className="p-5 text-center">
                <p className="text-[12px] font-semibold text-white/80">First Touch</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-[12px] font-medium text-white/35">Human</p>
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_140px_140px] ${
                  i < rows.length - 1 ? 'border-b border-white/[0.04]' : ''
                } hover:bg-white/[0.03] transition-all group/row hover:border-l-2 hover:border-l-[#C9A96E]/30 hover:pl-1`}
              >
                <div className="p-4 md:p-5 flex items-center">
                  <span className="text-[13px] text-white/60 font-light">{row.feature}</span>
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center">
                  {row.ft ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 group-hover/row:scale-110 transition-transform">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <span className="w-4 h-[1px] bg-white/10" />
                  )}
                </div>
                <div className="p-4 md:p-5 flex items-center justify-center">
                  {row.human ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
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
            <p className="text-[12px] text-white/25 mt-4 font-light">No contracts. Cancel anytime.</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
