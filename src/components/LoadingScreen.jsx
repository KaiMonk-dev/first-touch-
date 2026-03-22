import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 2) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${
        phase === 1 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Wordmark */}
      <p
        className="text-xl font-semibold tracking-[-0.01em] mb-10 animate-fade-up"
        style={{ animationDuration: '0.8s' }}
      >
        <span className="text-white">First</span>
        <span className="text-white/40">Touch</span>
      </p>

      {/* Loading bar */}
      <div className="w-24 h-[1px] rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-white/40 to-white/80 rounded-full"
          style={{
            animation: 'loadBar 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
