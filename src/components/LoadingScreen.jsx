import { useState, useEffect, useRef } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState('black')
  const [removed, setRemoved] = useState(false)
  const brandRef = useRef(null)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('brand'), 400),
      setTimeout(() => setPhase('line'), 900),
      setTimeout(() => setPhase('powered'), 1400),
      setTimeout(() => setPhase('morph'), 2400),  // start morphing to nav position
      setTimeout(() => setPhase('exit'), 3200),
      setTimeout(() => setRemoved(true), 4000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  if (removed) return null

  const isMorphing = phase === 'morph' || phase === 'exit'
  const isExiting = phase === 'exit'
  const showBrand = phase !== 'black'
  const showLine = phase === 'line' || phase === 'powered' || phase === 'morph' || phase === 'exit'
  const showPowered = phase === 'powered'

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
        transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0, 1)',
        willChange: 'opacity',
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
          opacity: showBrand && !isMorphing ? 1 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={brandRef}
        style={{
          position: isMorphing ? 'fixed' : 'relative',
          top: isMorphing ? '28px' : undefined,
          left: isMorphing ? '28px' : undefined,
          textAlign: isMorphing ? 'left' : 'center',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand name — morphs from center to nav position */}
        <p
          style={{
            fontSize: isMorphing ? '0.94rem' : '1.8rem',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            opacity: showBrand ? 1 : 0,
            transform: showBrand ? 'translateY(0)' : 'translateY(16px)',
            filter: showBrand ? 'blur(0px)' : 'blur(6px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            margin: 0,
          }}
        >
          <span style={{ color: 'white' }}>First</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Touch</span>
        </p>

        {/* Gold sweep line — fades out during morph */}
        <div
          style={{
            height: 1,
            marginTop: isMorphing ? 0 : 22,
            marginLeft: isMorphing ? 0 : 'auto',
            marginRight: 'auto',
            width: showLine && !isMorphing ? 140 : 0,
            opacity: showLine && !isMorphing ? 0.5 : 0,
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.6), transparent)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Powered by — fades out before morph */}
        <p
          style={{
            fontSize: '0.6rem',
            fontWeight: 400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: isMorphing ? 0 : 16,
            maxHeight: isMorphing ? 0 : 20,
            color: 'rgba(255,255,255,0.3)',
            opacity: showPowered ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Powered by Ascension First AI
        </p>
      </div>
    </div>
  )
}
