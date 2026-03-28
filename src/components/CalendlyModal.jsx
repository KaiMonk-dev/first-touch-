import { useState, useEffect, createContext, useContext } from 'react'

const CalendlyContext = createContext()

export function useCalendly() {
  return useContext(CalendlyContext)
}

export function CalendlyProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CalendlyContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
      {isOpen && <CalendlyModal onClose={() => setIsOpen(false)} />}
    </CalendlyContext.Provider>
  )
}

function CalendlyModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg h-[700px] rounded-3xl overflow-hidden glass-strong animate-fade-up shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full glass flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* GHL Calendar embed */}
        <iframe
          src="https://link.msgsndr.com/widget/booking/strategy-and-demo"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Book a Strategy & Demo Call"
          className="rounded-3xl"
          style={{ background: '#0a0a0a' }}
        />
      </div>
    </div>
  )
}
