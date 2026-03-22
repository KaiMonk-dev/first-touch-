import { useState, useCallback } from 'react'

export function useTilt(maxDeg = 6) {
  const [style, setStyle] = useState({})

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * maxDeg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -maxDeg
    setStyle({
      transform: `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`,
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    })
  }, [maxDeg])

  const onMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(800px) rotateY(0deg) rotateX(0deg)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    })
  }, [])

  return { style, onMouseMove, onMouseLeave }
}
