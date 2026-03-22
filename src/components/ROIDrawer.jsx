import { useState, useEffect } from 'react'

const RECOVERY_RATE = 0.85

export function ROIDrawer() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [calls, setCalls] = useState(150)
  const [missedPct, setMissedPct] = useState(30)
  const [jobValue, setJobValue] = useState(500)
  const [convRate, setConvRate] = useState(25)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const missedCalls = Math.round(calls * (missedPct / 100))
  const recovered = Math.round(missedCalls * (convRate / 100) * jobValue * RECOVERY_RATE)
  const annual = recovered * 12
  const fmt = (n) => n.toLocaleString('en-US')

  if (!visible) return null

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 md:bottom-8 left-6 z-40 w-11 h-11 rounded-full liquid-glass-strong flex items-center justify-center text-[#C9A96E]/70 hover:text-[#C9A96E] transition-all duration-500 btn-press ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        } ${open ? 'rotate-45' : ''}`}
        aria-label="ROI Calculator"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </button>

      {/* Drawer panel */}
      <div
        className={`fixed bottom-20 md:bottom-20 left-6 z-40 w-80 rounded-2xl liquid-glass-strong p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-[12px] text-white/50 font-medium tracking-wide uppercase">Quick ROI</p>
          <button onClick={() => setOpen(false)} className="text-white/25 hover:text-white/60 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <MiniSlider label="Monthly calls" value={calls} onChange={setCalls} min={50} max={500} step={10} />
          <MiniSlider label="% missed" value={missedPct} onChange={setMissedPct} min={10} max={60} step={5} suffix="%" />
          <MiniSlider label="Avg job value" value={jobValue} onChange={setJobValue} min={100} max={5000} step={50} prefix="$" />
          <MiniSlider label="Close rate" value={convRate} onChange={setConvRate} min={10} max={50} step={5} suffix="%" />
        </div>

        <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
          <p className="text-[10px] text-white/30 font-light mb-1">Annual recovery</p>
          <p className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#D4BA82] to-[#C9A96E] bg-clip-text text-transparent tabular-nums">
            ${fmt(annual)}
          </p>
        </div>
      </div>
    </>
  )
}

function MiniSlider({ label, value, onChange, min, max, step, prefix = '', suffix = '' }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-white/35 font-light">{label}</span>
        <span className="text-[11px] font-semibold text-white/70 tabular-nums">
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
