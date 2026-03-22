import { useEffect, useRef } from 'react'

export function AmbientCursor() {
  const glowRef = useRef(null)
  const innerRef = useRef(null)
  const pos = useRef({ x: -300, y: -300 })
  const target = useRef({ x: -300, y: -300 })

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let animId
    const animate = () => {
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y

      pos.current.x += dx * 0.06
      pos.current.y += dy * 0.06

      const speed = Math.sqrt(dx * dx + dy * dy)
      const scale = 1 + Math.min(speed * 0.002, 0.25)

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 175}px, ${pos.current.y - 175}px) scale(${scale})`
      }
      if (innerRef.current) {
        const ix = pos.current.x + dx * 0.03
        const iy = pos.current.y + dy * 0.03
        innerRef.current.style.transform = `translate(${ix - 110}px, ${iy - 110}px)`
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
      {/* Outer glow — warm, softer, smaller */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, rgba(201,169,110,0.02) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Inner core — brighter, bigger */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-[220px] h-[220px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(255,245,225,0.06) 0%, rgba(201,169,110,0.04) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
