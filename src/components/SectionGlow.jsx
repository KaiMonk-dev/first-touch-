import { useEffect, useRef, useState } from 'react'

// Ambient background glow that intensifies as section enters viewport
export function SectionGlow({ color = 'gold', intensity = 0.06, position = 'center' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const colors = {
    gold: `rgba(201, 169, 110, ${intensity})`,
    warm: `rgba(180, 140, 80, ${intensity})`,
    cool: `rgba(150, 170, 200, ${intensity * 0.5})`,
  }

  const positions = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    top: 'top-0 left-1/2 -translate-x-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2',
  }

  return (
    <div
      ref={ref}
      className={`absolute ${positions[position]} w-[800px] h-[500px] pointer-events-none transition-opacity duration-[2000ms] ease-out`}
      style={{
        background: `radial-gradient(ellipse, ${colors[color]}, transparent 70%)`,
        opacity: visible ? 1 : 0,
      }}
    />
  )
}
