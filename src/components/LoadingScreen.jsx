import { useState, useEffect } from 'react'

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 1600)
    const removeTimer = setTimeout(() => {
      setVisible(false)
      setRemoved(true)
    }, 2600)
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer) }
  }, [])

  if (removed) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 1s ease',
        willChange: 'opacity',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            opacity: 0,
            transform: 'translateY(8px)',
            animation: 'lsFade 0.8s ease 0.3s forwards',
          }}
        >
          <span style={{ color: 'white' }}>First</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>Touch</span>
        </p>
        <div
          style={{
            height: 1,
            marginTop: 16,
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: 0,
            width: 0,
            background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent)',
            animation: 'lsLine 1s ease 0.7s forwards',
          }}
        />
      </div>
      <style>{`
        @keyframes lsFade {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsLine {
          to { opacity: 1; width: 100px; }
        }
      `}</style>
    </div>
  )
}
