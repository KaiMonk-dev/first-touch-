import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState(0) // 0=visible, 1=swoosh-out, 2=gone

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 2) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${
        phase === 1 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Wordmark */}
      <div className="relative">
        <p
          className="text-2xl font-semibold tracking-[-0.02em]"
          style={{
            animation: 'revealText 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <span className="text-white">First</span>
          <span className="text-white/30">Touch</span>
        </p>

        {/* Gold swoosh line underneath */}
        <div
          className="absolute -bottom-3 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent"
          style={{
            animation: 'swoosh 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
            width: '0%',
          }}
        />
      </div>

      <style>{`
        @keyframes revealText {
          from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes swoosh {
          from { width: 0%; left: 50%; }
          to { width: 120%; left: -10%; }
        }
      `}</style>
    </div>
  )
}
