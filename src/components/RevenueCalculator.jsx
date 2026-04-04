import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { AnimatedSection } from './AnimatedSection'
import { useBooking } from './BookingModal'
import { useTilt } from '../hooks/useTilt'

const BOOKING_RATE = 0.4
const WEEKS_PER_MONTH = 4.3
const FIRST_TOUCH_PRICE = 597

/**
 * Animated value hook — re-triggers on every target change.
 * Adapts the useCounter pattern from Pricing.jsx for reactive use.
 */
function useAnimatedValue(target, duration = 800) {
  const [value, setValue] = useState(target)
  const frameRef = useRef(null)
  const startRef = useRef(null)
  const fromRef = useRef(target)

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    const from = fromRef.current
    if (from === target) return

    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    startRef.current = performance.now()

    const step = (now) => {
      const progress = Math.min((now - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = Math.round(from + (target - from) * eased)
      setValue(current)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = target
      }
    }

    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  // Keep fromRef updated when animation completes
  useEffect(() => { fromRef.current = value }, [value])

  return value
}

function formatCurrency(num) {
  return num.toLocaleString('en-US')
}

export function RevenueCalculator() {
  const [missedCalls, setMissedCalls] = useState(5)
  const [avgJobValue, setAvgJobValue] = useState(300)
  const [email, setEmail] = useState('')
  const [emailState, setEmailState] = useState('idle') // idle | sending | sent | error
  const booking = useBooking()
  const tilt = useTilt(4)

  const { monthlyLost, annualLost, roi } = useMemo(() => {
    const monthly = Math.round(missedCalls * WEEKS_PER_MONTH * BOOKING_RATE * avgJobValue)
    return {
      monthlyLost: monthly,
      annualLost: monthly * 12,
      roi: Math.round((monthly / FIRST_TOUCH_PRICE) * 10) / 10,
    }
  }, [missedCalls, avgJobValue])

  const animatedMonthly = useAnimatedValue(monthlyLost)
  const animatedAnnual = useAnimatedValue(annualLost)
  const animatedRoi = useAnimatedValue(Math.round(roi * 10)) // animate 10x, display /10

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email || emailState === 'sending') return
    setEmailState('sending')
    try {
      const res = await fetch('/api/calculator-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          missedCalls,
          avgJobValue,
          monthlyLost,
          annualLost,
          roi,
        }),
      })
      if (res.ok) setEmailState('sent')
      else setEmailState('error')
    } catch {
      setEmailState('error')
    }
  }

  // Delayed color shift — annual number fades to red after calculation
  const [annualAlarm, setAnnualAlarm] = useState(false)
  const alarmTimer = useRef(null)

  useEffect(() => {
    setAnnualAlarm(false)
    if (alarmTimer.current) clearTimeout(alarmTimer.current)
    alarmTimer.current = setTimeout(() => setAnnualAlarm(true), 900)
    return () => clearTimeout(alarmTimer.current)
  }, [annualLost])

  const missedFill = ((missedCalls - 1) / (30 - 1)) * 100
  const jobFill = ((avgJobValue - 50) / (2000 - 50)) * 100

  return (
    <section id="revenue-calculator" className="relative py-28 md:py-36 px-6">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201, 169, 110, 0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="label mb-4">Your Hidden Losses</p>
            <div className="divider-line mb-8" />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
              <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                The Revenue You're
              </span>
              <br />
              <span className="bg-gradient-to-b from-white/90 to-white/30 bg-clip-text text-transparent">
                Leaving on the Table
              </span>
            </h2>
            <p className="mt-5 text-white/40 text-base max-w-lg mx-auto">
              Every missed call is a missed customer. Move the sliders to see what it's costing you.
            </p>
          </div>
        </AnimatedSection>

        {/* Calculator card */}
        <AnimatedSection delay={200}>
          <div
            className="liquid-glass-strong liquid-shimmer rounded-2xl p-8 md:p-10"
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            style={tilt.style}
          >
            {/* Slider: Missed Calls */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-white/60 text-sm font-medium">
                  Missed Calls Per Week
                </label>
                <span className="text-2xl font-bold tabular-nums text-white">
                  {missedCalls}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={missedCalls}
                onChange={(e) => setMissedCalls(Number(e.target.value))}
                className="revenue-slider w-full"
                style={{ '--fill': `${missedFill}%` }}
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[11px] text-white/20">1</span>
                <span className="text-[11px] text-white/20">30</span>
              </div>
            </div>

            {/* Slider: Avg Job Value */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-white/60 text-sm font-medium">
                  Average Job Value
                </label>
                <span className="text-2xl font-bold tabular-nums text-white">
                  ${formatCurrency(avgJobValue)}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={avgJobValue}
                onChange={(e) => setAvgJobValue(Number(e.target.value))}
                className="revenue-slider w-full"
                style={{ '--fill': `${jobFill}%` }}
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[11px] text-white/20">$50</span>
                <span className="text-[11px] text-white/20">$2,000</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="text-center sm:text-left">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Monthly Revenue Lost</p>
                <p className="text-3xl md:text-4xl font-bold tabular-nums text-[#C9A96E]">
                  ${formatCurrency(animatedMonthly)}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Annual Revenue Lost</p>
                <p
                  className="text-3xl md:text-4xl font-bold tabular-nums transition-colors duration-1000 ease-out"
                  style={{ color: annualAlarm ? '#D4645C' : 'rgba(255,255,255,0.9)' }}
                >
                  ${formatCurrency(animatedAnnual)}
                </p>
              </div>
            </div>

            {/* ROI comparison */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 mb-8">
              <p className="text-white/60 text-sm leading-relaxed text-center">
                First Touch costs{' '}
                <span className="text-white font-semibold">$597/mo</span>
                {' '}&mdash; you're losing{' '}
                <span className="text-[#C9A96E] font-semibold">${formatCurrency(animatedMonthly)}</span>
                {' '}without it.
                {roi >= 1 && (
                  <>
                    {' '}That's a{' '}
                    <span className="text-[#C9A96E] font-bold text-lg">{(animatedRoi / 10).toFixed(1)}x</span>
                    {' '}return.
                  </>
                )}
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => booking.open()}
              className="w-full py-4 rounded-full font-semibold text-sm tracking-wide cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A96E]/20 hover:-translate-y-0.5 active:translate-y-0 btn-press"
              style={{
                background: 'linear-gradient(135deg, #B8965A, #C9A96E)',
                color: '#0a0a0a',
              }}
            >
              Stop Losing Revenue &mdash; Book a Call
            </button>

            {/* Email capture — soft alternative */}
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              {emailState === 'sent' ? (
                <div className="text-center py-2">
                  <p className="text-[#C9A96E] text-sm font-medium">
                    Sent — check your inbox.
                  </p>
                  <p className="text-white/30 text-xs mt-1">
                    Your personalized analysis is on its way.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-white/35 text-xs text-center mb-3">
                    Not ready to talk? Get this analysis emailed to you.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-full text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/25 outline-none focus:border-[#C9A96E]/40 focus:bg-white/[0.06] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={emailState === 'sending'}
                      className="px-6 py-3 rounded-full text-sm font-medium border border-white/[0.1] text-white/70 hover:text-white hover:border-[#C9A96E]/30 hover:bg-white/[0.04] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {emailState === 'sending' ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                  {emailState === 'error' && (
                    <p className="text-red-400/60 text-xs text-center mt-2">
                      Something went wrong. Try again.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Fine print */}
        <AnimatedSection delay={400}>
          <p className="text-center text-white/20 text-xs mt-6">
            Based on a 40% booking rate for answered calls. Results vary by industry.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
