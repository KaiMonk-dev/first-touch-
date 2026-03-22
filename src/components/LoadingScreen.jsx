import { useState, useEffect } from 'react'
import { playChime } from '../hooks/useChime'

export function LoadingScreen() {
  const [phase, setPhase] = useState('black')
  const [removed, setRemoved] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Listen for first user interaction to enable audio
  useEffect(() => {
    const mark = () => setHasInteracted(true)
    window.addEventListener('click', mark, { once: true })
    window.addEventListener('touchstart', mark, { once: true })
    window.addEventListener('keydown', mark, { once: true })
    return () => {
      window.removeEventListener('click', mark)
      window.removeEventListener('touchstart', mark)
      window.removeEventListener('keydown', mark)
    }
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('brand'), 400),
      setTimeout(() => {
        setPhase('line')
        // Play chime when the gold line appears (if user has interacted)
        if (hasInteracted) playChime()
      }, 900),
      setTimeout(() => setPhase('powered'), 1400),
      setTimeout(() => setPhase('exit'), 2400),
      setTimeout(() => setRemoved(true), 3600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [hasInteracted])

  if (removed) return null

  const isExiting = phase === 'exit'
  const showBrand = phase !== 'black'
  const showLine = phase === 'line' || phase === 'powered' || phase === 'exit'
  const showPowered = phase === 'powered' || phase === 'exit'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.03)' : 'scale(1)',
        filter: isExiting ? 'blur(8px)' : 'blur(0px)',
        transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0, 1), transform 1.2s cubic-bezier(0.4, 0, 0, 1), filter 1.2s cubic-bezier(0.4, 0, 0, 1)',
        willChange: 'opacity, transform, filter',
      }}
    >
      {/* Warm ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 350,
          background: 'radial-gradient(ellipse, rgba(201,169,110,0.07), transparent 70%)',
          opacity: showBrand ? 1 : 0,
          transition: 'opacity 2s ease',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center' }}>
        {/* Brand name */}
        <p
          style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            opacity: showBrand ? 1 : 0,
            transform: showBrand ? 'translateY(0)' : 'translateY(16px)',
            filter: showBrand ? 'blur(0px)' : 'blur(6px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            margin: 0,
          }}
        >
          <span style={{ color: 'white' }}>First</span>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Touch</span>
        </p>

        {/* Gold sweep line */}
        <div
          style={{
            height: 1,
            marginTop: 22,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: showLine ? 140 : 0,
            opacity: showLine ? 0.5 : 0,
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)',
            transition: 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease',
          }}
        />

        {/* Powered by */}
        <p
          style={{
            fontSize: '0.6rem',
            fontWeight: 400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: 16,
            color: 'rgba(255,255,255,0.3)',
            opacity: showPowered ? 1 : 0,
            transform: showPowered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Powered by Ascension First AI
        </p>
      </div>
    </div>
  )
}
