import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

const BookingContext = createContext()

export function useBooking() {
  return useContext(BookingContext)
}

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <BookingContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
      {isOpen && <BookingModal onClose={() => setIsOpen(false)} />}
    </BookingContext.Provider>
  )
}

/* ─────────────────────────────────────────────────
   Stage 1: Branded pre-screen (Business + Goals)
   Stage 2: GHL native widget (date/time/contact)

   The GHL widget handles Google Calendar sync natively.
   After the modal closes from Step 2, we call /api/update-contact
   which adds business info AND triggers notification workflows
   (because the GHL calendar has notifications: [] — empty).
   ───────────────────────────────────────────────── */

function BookingModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [goals, setGoals] = useState('')
  const [errors, setErrors] = useState({})
  const hasUpdatedRef = useRef(false)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Fire contact update + workflow triggers when closing from step 2
  const fireUpdate = useCallback(() => {
    if (hasUpdatedRef.current || !businessName.trim()) return
    hasUpdatedRef.current = true

    // Small delay to let GHL widget finish creating the contact
    setTimeout(() => {
      fetch('/api/update-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          goals: goals.trim(),
        }),
      }).catch(err => console.error('Contact update failed:', err))
    }, 3000) // 3s delay — GHL widget needs time to create the contact
  }, [businessName, goals])

  // Listen for GHL widget messages (booking completion)
  useEffect(() => {
    if (step !== 2) return

    const handleMessage = (e) => {
      // Log all messages from iframe for debugging
      if (e.origin?.includes('leadconnectorhq')) {
        console.log('GHL widget message:', e.data)
        fireUpdate()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [step, fireUpdate])

  // Handle close — fire update if we were on step 2
  function handleClose() {
    if (step === 2) fireUpdate()
    onClose()
  }

  function handleContinue(e) {
    e.preventDefault()
    const newErrors = {}
    if (!businessName.trim()) newErrors.businessName = 'Required'
    if (!goals.trim()) newErrors.goals = 'Required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setStep(2)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 booking-overlay"
      style={{ cursor: 'auto' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
        style={{ cursor: 'auto' }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden glass-strong animate-fade-up shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
        style={{
          height: step === 1 ? 'auto' : '700px',
          maxHeight: '90vh',
          cursor: 'auto',
        }}
      >
        {/* Close button — always visible, prominent */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
          aria-label="Close booking modal"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {step === 1 ? (
          <PreScreen
            businessName={businessName}
            setBusinessName={setBusinessName}
            goals={goals}
            setGoals={setGoals}
            errors={errors}
            onContinue={handleContinue}
          />
        ) : (
          <div className="w-full h-full flex flex-col" style={{ cursor: 'auto' }}>
            {/* Back button */}
            <div className="px-6 pt-5 pb-2 flex items-center gap-2">
              <button
                onClick={() => setStep(1)}
                className="text-[#c9a84c]/60 hover:text-[#c9a84c] text-xs flex items-center gap-1 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-white/30 text-xs">Select a date & time</span>
            </div>
            {/* GHL native calendar widget — handles booking + Google Calendar sync */}
            <iframe
              src="https://api.leadconnectorhq.com/widget/bookings/strategy-and-demo"
              width="100%"
              style={{ flex: 1, border: 'none', background: '#0a0a0a', cursor: 'auto' }}
              title="Book a Strategy & Demo Call"
              className="rounded-b-3xl"
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Pre-Screen Form (Step 1) ─── */
function PreScreen({ businessName, setBusinessName, goals, setGoals, errors, onContinue }) {
  return (
    <div className="p-8 sm:p-10" style={{ fontFamily: "'Inter', sans-serif", cursor: 'auto' }}>
      {/* Gold accent line */}
      <div className="w-12 h-0.5 bg-[#c9a84c] mb-6" />

      <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#f5f0e8] mb-2">
        Meet Alex for Your Business
      </h2>
      <p className="text-sm font-light text-white/40 mb-8 leading-relaxed">
        Tell us about your business so Alex can be custom-trained and ready for your call with Kai.
      </p>

      <form onSubmit={onContinue} className="space-y-5">
        {/* Business Name */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-[#c9a84c]/60 mb-2">
            Business Name <span className="text-[#c9a84c]">*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your company or business name"
            className={`w-full px-4 py-3 rounded-xl text-sm text-[#e8e4df] placeholder-white/20 transition-all outline-none ${
              errors.businessName
                ? 'bg-red-500/5 border border-red-500/30 focus:border-red-400/50'
                : 'bg-white/[0.03] border border-[#c9a84c]/15 focus:border-[#c9a84c]/40 focus:bg-white/[0.05]'
            }`}
            style={{ fontFamily: "'Inter', sans-serif", cursor: 'text' }}
          />
          {errors.businessName && (
            <p className="mt-1 text-xs text-red-400/80">Please enter your business name</p>
          )}
        </div>

        {/* Goals */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-[#c9a84c]/60 mb-2">
            What are you hoping to achieve? <span className="text-[#c9a84c]">*</span>
          </label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Tell us about your goals — what challenges are you facing, and what would success look like?"
            rows={4}
            className={`w-full px-4 py-3 rounded-xl text-sm text-[#e8e4df] placeholder-white/20 transition-all outline-none resize-none ${
              errors.goals
                ? 'bg-red-500/5 border border-red-500/30 focus:border-red-400/50'
                : 'bg-white/[0.03] border border-[#c9a84c]/15 focus:border-[#c9a84c]/40 focus:bg-white/[0.05]'
            }`}
            style={{ fontFamily: "'Inter', sans-serif", cursor: 'text' }}
          />
          {errors.goals && (
            <p className="mt-1 text-xs text-red-400/80">Please share what you're looking to achieve</p>
          )}
        </div>

        {/* What to expect */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
          <p className="text-[11px] uppercase tracking-[0.1em] text-white/30 mb-2.5">What to expect</p>
          <ul className="space-y-2">
            {[
              'Hear exactly what Alex sounds like for your business',
              'Personalized revenue recovery analysis',
              'Clear action plan — zero obligation',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                <svg className="w-4 h-4 mt-0.5 text-[#c9a84c]/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: 'linear-gradient(135deg, #c9a84c 0%, #a8893d 100%)',
            color: '#0a0a0a',
            letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Continue to Select a Time
        </button>

        <p className="text-center text-[11px] text-white/20 mt-3">
          30-minute call  ·  No commitment required
        </p>
      </form>
    </div>
  )
}
