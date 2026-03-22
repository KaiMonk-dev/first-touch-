import { useEffect, useRef } from 'react'

export function AmbientCursor() {
  const glowRef = useRef(null)
  const innerRef = useRef(null)
  const coreRef = useRef(null)
  const target = useRef({ x: -300, y: -300 })
  const pos = useRef({ x: -300, y: -300 })

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let animId
    const animate = () => {
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y
      pos.current.x += dx * 0.15
      pos.current.y += dy * 0.15

      // Outer warm glow — follows with slight lag
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 200}px, ${pos.current.y - 200}px)`
      }
      // Inner bright halo — faster follow
      if (innerRef.current) {
        const ix = pos.current.x + dx * 0.08
        const iy = pos.current.y + dy * 0.08
        innerRef.current.style.transform = `translate(${ix - 120}px, ${iy - 120}px)`
      }
      // Core highlight — directly on cursor
      if (coreRef.current) {
        coreRef.current.style.transform = `translate(${target.current.x - 60}px, ${target.current.y - 60}px)`
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      {/* Outer ambient glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.04) 35%, transparent 65%)',
          willChange: 'transform',
        }}
      />
      {/* Inner bright halo */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-[240px] h-[240px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(255,248,230,0.10) 0%, rgba(201,169,110,0.05) 35%, transparent 65%)',
          willChange: 'transform',
        }}
      />
      {/* Core highlight — right on cursor */}
      <div
        ref={coreRef}
        className="fixed top-0 left-0 w-[120px] h-[120px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(255,252,245,0.08) 0%, rgba(255,245,225,0.03) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
