import { useState, useEffect, useRef, createContext, useContext } from 'react'

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
   ───────────────────────────────────────────────── */

function BookingModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [goals, setGoals] = useState('')
  const [errors, setErrors] = useState({})
  const iframeRef = useRef(null)
  const pollingRef = useRef(null)
  const hasUpdatedRef = useRef(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      // When modal unmounts (closes), fire the update if we were on step 2
      // This catches the case where user booked and then closed the modal
      if (step === 2 && !hasUpdatedRef.current && businessName.trim()) {
        hasUpdatedRef.current = true
        updateContactWithBusinessInfo()
      }
    }
  }, [step, businessName])

  // When step 2 loads, listen for booking completion
  // GHL widget doesn't reliably send postMessage, so we use multiple strategies:
  // 1. Listen for any postMessage from the widget
  // 2. Fire update when modal closes (user likely just booked)
  // 3. Fire update on beforeunload as a safety net

  useEffect(() => {
    if (step !== 2) return

    const handleMessage = (e) => {
      // Catch any GHL widget messages that might indicate completion
      if (e.data && typeof e.data === 'object') {
        console.log('GHL widget message:', e.data)
      }
      if (
        e.data === 'booking_confirmed' ||
        e.data?.type === 'booking_confirmed' ||
        e.data?.action === 'booking_confirmed' ||
        (typeof e.data === 'string' && e.data.includes('confirm'))
      ) {
        if (!hasUpdatedRef.current) {
          hasUpdatedRef.current = true
          updateContactWithBusinessInfo()
        }
      }
    }
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [step])

  async function updateContactWithBusinessInfo() {
    if (!businessName.trim()) return
    try {
      await fetch('/api/update-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          goals: goals.trim(),
        }),
      })
    } catch (err) {
      console.error('Failed to update contact with business info:', err)
    }
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
    // Store in sessionStorage so we can retrieve after GHL widget completes
    sessionStorage.setItem('af_booking_business', businessName.trim())
    sessionStorage.setItem('af_booking_goals', goals.trim())
    setStep(2)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden glass-strong animate-fade-up shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
        style={{ height: step === 1 ? 'auto' : '700px', maxHeight: '90vh' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full glass flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="w-full h-full flex flex-col">
            {/* Back button */}
            <div className="px-6 pt-5 pb-2 flex items-center gap-2">
              <button
                onClick={() => setStep(1)}
                className="text-[#c9a84c]/60 hover:text-[#c9a84c] text-xs flex items-center gap-1 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-white/30 text-xs">Select a date & time</span>
            </div>
            {/* GHL native calendar widget — handles booking + notifications + Google Calendar sync */}
            <iframe
              ref={iframeRef}
              src="https://api.leadconnectorhq.com/widget/bookings/strategy-and-demo"
              width="100%"
              style={{ flex: 1, border: 'none', background: '#0a0a0a' }}
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
    <div className="p-8 sm:p-10" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Gold accent line */}
      <div className="w-12 h-0.5 bg-[#c9a84c] mb-6" />

      <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#f5f0e8] mb-2">
        Strategy & Demo Call
      </h2>
      <p className="text-sm font-light text-white/40 mb-8 leading-relaxed">
        Tell us about your business so we can prepare a personalized strategy for your call.
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
            style={{ fontFamily: "'Inter', sans-serif" }}
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
            style={{ fontFamily: "'Inter', sans-serif" }}
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
              'Personalized revenue recovery analysis',
              'Live demo tailored to your business',
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
