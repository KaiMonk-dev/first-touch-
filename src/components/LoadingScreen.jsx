import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState(0) // 0=visible, 1=exit, 2=gone

  useEffect(() => {
    // Slightly longer presence, then smooth exit
    const t1 = setTimeout(() => setPhase(1), 1400)
    const t2 = setTimeout(() => setPhase(2), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 2) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      style={{
        opacity: phase === 1 ? 0 : 1,
        transform: phase === 1 ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 1s cubic-bezier(0.4, 0, 0, 1), transform 1s cubic-bezier(0.4, 0, 0, 1)',
      }}
    >
      {/* Wordmark */}
      <div className="relative flex flex-col items-center">
        <p
          className="text-2xl font-semibold tracking-[-0.02em] opacity-0"
          style={{
            animation: 'lsReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
          }}
        >
          <span className="text-white">First</span>
          <span className="text-white/30">Touch</span>
        </p>

        {/* Gold swoosh line */}
        <div
          className="mt-4 h-[1px] opacity-0"
          style={{
            animation: 'lsSwoosh 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes lsReveal {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsSwoosh {
          0% { opacity: 0; width: 0px; background: transparent; }
          30% { opacity: 1; }
          100% { opacity: 1; width: 120px; background: linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent); }
        }
      `}</style>
    </div>
  )
}
