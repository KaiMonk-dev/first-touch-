import { useState } from 'react'
import { AnimatedSection } from './AnimatedSection'

export function SMSCapture() {
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phone.length >= 10) {
      setSubmitted(true)
    }
  }

  return (
    <section className="relative py-20 md:py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection>
          <div className="rounded-2xl glass-strong p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.04),transparent_60%)] pointer-events-none" />

            <div className="relative z-10">
              {!submitted ? (
                <>
                  <p className="label mb-4">Not ready to call yet?</p>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-white/90">
                    Get a demo link via text
                  </h3>
                  <p className="text-[13px] text-white/30 font-light mb-8 max-w-sm mx-auto">
                    We'll text you a link to try Alex yourself — no commitment, no spam. Just one text.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="flex-1 relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="w-full px-5 py-4 rounded-full bg-white/[0.04] border border-white/[0.06] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E]/30 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-7 py-4 rounded-full bg-white text-black font-semibold text-[14px] hover:bg-white/90 transition-all btn-press hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] whitespace-nowrap"
                    >
                      Text me
                    </button>
                  </form>

                  <p className="text-[10px] text-white/15 mt-4 font-light">
                    No spam. Unsubscribe anytime. Standard messaging rates apply.
                  </p>
                </>
              ) : (
                <div className="py-6">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white/90">Check your texts</h3>
                  <p className="text-[13px] text-white/30 font-light">
                    Alex will reach out shortly with your demo link.
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
