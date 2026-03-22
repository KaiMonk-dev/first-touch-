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

      // Much faster follow — 0.18 lerp for near-instant tracking
      pos.current.x += dx * 0.18
      pos.current.y += dy * 0.18

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 175}px, ${pos.current.y - 175}px)`
      }
      if (innerRef.current) {
        // Inner core follows even faster — nearly 1:1 with cursor
        const ix = target.current.x
        const iy = target.current.y
        innerRef.current.style.transform = `translate(${ix - 100}px, ${iy - 100}px)`
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
      {/* Outer glow — warm ambient */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.09) 0%, rgba(201,169,110,0.03) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />
      {/* Inner core — bright center, directly on cursor */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-[200px] h-[200px] rounded-full pointer-events-none z-[2] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(255,248,230,0.08) 0%, rgba(201,169,110,0.04) 35%, transparent 65%)',
          willChange: 'transform',
        }}
      />
    </>
  )
}
