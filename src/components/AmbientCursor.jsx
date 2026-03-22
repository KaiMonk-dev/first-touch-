import { useEffect, useRef } from 'react'

export function AmbientCursor() {
  const glowRef = useRef(null)
  const innerRef = useRef(null)
  const pos = useRef({ x: -300, y: -300 })
  const target = useRef({ x: -300, y: -300 })
  const velocity = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let animId
    const animate = () => {
      // Track velocity for dynamic sizing
      const dx = target.current.x - pos.current.x
      const dy = target.current.y - pos.current.y
      velocity.current = { x: dx, y: dy }

      // Smooth lerp follow
      pos.current.x += dx * 0.06
      pos.current.y += dy * 0.06

      // Speed-based scale — glow stretches slightly when moving fast
      const speed = Math.sqrt(dx * dx + dy * dy)
      const scale = 1 + Math.min(speed * 0.002, 0.3)

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 250}px, ${pos.current.y - 250}px) scale(${scale})`
      }
      if (innerRef.current) {
        // Inner core follows slightly faster for depth
        const ix = pos.current.x + dx * 0.03
        const iy = pos.current.y + dy * 0.03
        innerRef.current.style.transform = `translate(${ix - 80}px, ${iy - 80}px)`
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
      {/* Outer glow — large, soft, warm */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-[1] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, rgba(201,169,110,0.02) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Inner core — smaller, brighter, follows slightly ahead */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-[160px] h-[160px] rounded-full pointer-events-none z-[1] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
