import { useState, useEffect, useRef } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState('intro') // intro → ready → entering → traveling → arrived → gone
  const [removed, setRemoved] = useState(false)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const phaseRef = useRef('intro')

  // Sync phase to ref for canvas access
  useEffect(() => { phaseRef.current = phase }, [phase])

  // Show brand text after brief delay
  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 800)
    return () => clearTimeout(t)
  }, [])

  // Wormhole canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    let time = 0
    let enterTime = 0

    const draw = () => {
      time++
      ctx.clearRect(0, 0, W, H)
      const p = phaseRef.current

      if (p === 'gone') return

      const isEntering = p === 'entering' || p === 'traveling'
      if (isEntering && enterTime === 0) enterTime = time
      const enterProgress = isEntering ? Math.min(1, (time - enterTime) / 60) : 0 // 1 second transition

      // Number of rings
      const ringCount = 8
      for (let i = 0; i < ringCount; i++) {
        const baseR = 30 + i * 25
        const pulse = Math.sin(time * 0.03 + i * 0.5) * 8
        let r = baseR + pulse

        // When entering: rings expand rapidly outward
        if (isEntering) {
          r += enterProgress * enterProgress * (400 + i * 100)
        }

        const opacity = isEntering
          ? Math.max(0, (1 - enterProgress) * (0.15 - i * 0.012))
          : 0.12 - i * 0.01

        if (opacity <= 0) continue

        // Ring color shifts from gold center to blue/purple edges
        const hueShift = i / ringCount
        const red = Math.round(201 * (1 - hueShift * 0.5) + 100 * hueShift)
        const green = Math.round(169 * (1 - hueShift * 0.6) + 100 * hueShift)
        const blue = Math.round(110 + hueShift * 145)

        // Draw ring
        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(1, r), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`
        ctx.lineWidth = isEntering ? 1 + enterProgress * 3 : 1.5
        ctx.stroke()

        // Inner glow
        if (i < 3) {
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, r))
          grad.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${opacity * 0.4})`)
          grad.addColorStop(0.5, `rgba(${red}, ${green}, ${blue}, ${opacity * 0.1})`)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
        }
      }

      // Central bright core
      if (!isEntering || enterProgress < 0.5) {
        const coreO = isEntering ? (1 - enterProgress * 2) * 0.3 : 0.2 + Math.sin(time * 0.02) * 0.1
        const coreR = isEntering ? 15 + enterProgress * 200 : 12 + Math.sin(time * 0.03) * 3
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, coreR))
        coreGrad.addColorStop(0, `rgba(255, 248, 230, ${coreO})`)
        coreGrad.addColorStop(0.3, `rgba(201, 169, 110, ${coreO * 0.5})`)
        coreGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = coreGrad
        ctx.fillRect(cx - coreR, cy - coreR, coreR * 2, coreR * 2)
      }

      // Traveling phase: streaking star lines rushing outward
      if (p === 'traveling') {
        const travelProgress = Math.min(1, (time - enterTime - 30) / 40)
        if (travelProgress > 0) {
          for (let s = 0; s < 30; s++) {
            const angle = (s / 30) * Math.PI * 2 + time * 0.01
            const innerR = 20 + travelProgress * 100
            const outerR = innerR + 100 + travelProgress * 400
            const sx = cx + Math.cos(angle) * innerR
            const sy = cy + Math.sin(angle) * innerR
            const ex = cx + Math.cos(angle) * outerR
            const ey = cy + Math.sin(angle) * outerR

            const grad = ctx.createLinearGradient(sx, sy, ex, ey)
            grad.addColorStop(0, `rgba(255, 248, 230, ${(1 - travelProgress) * 0.3})`)
            grad.addColorStop(0.5, `rgba(201, 169, 110, ${(1 - travelProgress) * 0.15})`)
            grad.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.moveTo(sx, sy)
            ctx.lineTo(ex, ey)
            ctx.strokeStyle = grad
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  // Handle the portal click
  const enterPortal = () => {
    if (phase !== 'ready') return
    setPhase('entering')
    setTimeout(() => setPhase('traveling'), 500)
    setTimeout(() => setPhase('arrived'), 1500)
    setTimeout(() => setRemoved(true), 2300)
  }

  if (removed) return null

  const isLeaving = phase === 'arrived'
  const showContent = phase === 'ready'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: showContent ? 'pointer' : 'default',
        opacity: isLeaving ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}
      onClick={enterPortal}
    >
      {/* Wormhole canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Brand text */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <p
          style={{
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(12px)',
            filter: showContent ? 'blur(0)' : 'blur(6px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            margin: 0,
          }}
        >
          <span style={{ color: 'white' }}>First</span>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Touch</span>
        </p>

        <p
          style={{
            fontSize: '0.6rem',
            fontWeight: 400,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginTop: 12,
            color: 'rgba(255,255,255,0.25)',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          Powered by Ascension First AI
        </p>

        {/* Enter prompt */}
        <div
          style={{
            marginTop: 40,
            opacity: showContent ? 1 : 0,
            transition: 'opacity 1s ease 0.6s',
          }}
        >
          <p style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(201, 169, 110, 0.5)',
            animation: showContent ? 'pulse 2s ease-in-out infinite' : 'none',
          }}>
            Click to Enter
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
