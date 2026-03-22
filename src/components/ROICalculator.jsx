import { useState } from 'react'
import { AnimatedSection } from './AnimatedSection'
import { useCalendly } from './CalendlyModal'

const RECOVERY_RATE = 0.85

export function ROICalculator() {
  const [calls, setCalls] = useState(150)
  const [missedPct, setMissedPct] = useState(30)
  const [jobValue, setJobValue] = useState(500)
  const [convRate, setConvRate] = useState(25)

  const missedCalls = Math.round(calls * (missedPct / 100))
  const lostRevenue = Math.round(missedCalls * (convRate / 100) * jobValue)
  const recovered = Math.round(lostRevenue * RECOVERY_RATE)
  const annual = recovered * 12

  const calendly = useCalendly()
  const fmt = (n) => n.toLocaleString('en-US')

  return (
    <section id="roi" className="relative py-40 md:py-52 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="label mb-6">Your numbers</p>
            <div className="divider-line mb-16" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[0.9]">
              <span className="text-white/90">Revenue You're</span>
              <br />
              <span className="bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent">Leaving Behind.</span>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sliders */}
            <div className="space-y-10 p-10 rounded-2xl glass">
              <SliderInput label="Monthly inbound calls" value={calls} onChange={setCalls} min={50} max={500} step={10} />
              <SliderInput label="Percentage missed" value={missedPct} onChange={setMissedPct} min={10} max={60} step={5} suffix="%" />
              <SliderInput label="Average job value" value={jobValue} onChange={setJobValue} min={100} max={5000} step={50} prefix="$" />
              <SliderInput label="Conversion rate" value={convRate} onChange={setConvRate} min={10} max={50} step={5} suffix="%" />
            </div>

            {/* Results */}
            <div className="p-10 rounded-2xl glass-strong">
              <div className="space-y-6">
                <ResultRow label="Missed calls / month" value={fmt(missedCalls)} />
                <ResultRow label="Revenue lost / month" value={`$${fmt(lostRevenue)}`} />
                <div className="divider-line !w-full !bg-white/[0.06] my-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <ResultRow label="Recovered with First Touch" value={`$${fmt(recovered)}`} highlight />

                <div className="p-8 rounded-xl bg-white/[0.03] border border-white/[0.04] text-center mt-4">
                  <p className="label mb-3">Annual recovery</p>
                  <p className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#FA93FA] to-[#983AD6] bg-clip-text text-transparent">
                    ${fmt(annual)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => calendly.open()}
                className="mt-10 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] btn-press"
              >
                Recover This Revenue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <p className="text-[11px] text-white/15 mt-4 text-center font-light">
                Based on industry averages. Actual results vary.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

function SliderInput({ label, value, onChange, min, max, step, prefix = '', suffix = '' }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="text-[13px] text-white/30 font-light">{label}</label>
        <span className="text-[14px] font-semibold text-white/80 tabular-nums">
          {prefix}{value.toLocaleString('en-US')}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function ResultRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] text-white/30 font-light">{label}</span>
      <span className={`text-lg font-semibold tabular-nums ${highlight ? 'text-[#C967E8]' : 'text-white/80'}`}>
        {value}
      </span>
    </div>
  )
}
