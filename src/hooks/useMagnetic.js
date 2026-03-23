import { useState, useCallback, useRef } from 'react'

export function useMagnetic(strength = 0.3, radius = 120) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < radius) {
      const pull = (1 - dist / radius) * strength
      setOffset({ x: dx * pull, y: dy * pull })
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }, [strength, radius])

  const onMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
  }, [])

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 && offset.y === 0
      ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      : 'transform 0.15s ease-out',
  }

  return { ref, style, onMouseMove, onMouseLeave }
}
