import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState('enter') // enter → hold → exit → gone
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    // Phase timings for a luxury feel
    const holdTimer = setTimeout(() => setPhase('hold'), 600)
    const exitTimer = setTimeout(() => setPhase('exit'), 2200)
    const removeTimer = setTimeout(() => setRemoved(true), 3200)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (removed) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(201,169,110,0.06),transparent_70%)] pointer-events-none"
        style={{
          opacity: phase === 'enter' ? 0 : 1,
          transition: 'opacity 1.5s ease',
        }}
      />

      <div className="relative text-center">
        {/* Brand name */}
        <p
          style={{
            fontSize: '1.6rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            opacity: phase === 'enter' ? 0 : 1,
            transform: phase === 'enter' ? 'translateY(12px)' : 'translateY(0)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span style={{ color: 'white' }}>First</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Touch</span>
        </p>

        {/* Gold sweep line */}
        <div
          style={{
            height: 1,
            marginTop: 20,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: phase === 'enter' ? 0 : 120,
            opacity: phase === 'enter' ? 0 : 0.6,
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        />

        {/* Powered by */}
        <p
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: 14,
            color: 'rgba(255,255,255,0.25)',
            opacity: phase === 'enter' ? 0 : 1,
            transition: 'opacity 0.8s ease 0.6s',
          }}
        >
          Powered by Ascension First AI
        </p>
      </div>
    </div>
  )
}
