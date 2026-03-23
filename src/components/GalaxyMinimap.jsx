import { useState, useEffect } from 'react'

export function GalaxyMinimap() {
  const [scrollPct, setScrollPct] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setScrollPct(Math.min(1, Math.max(0, pct)))
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  // Minimap dimensions
  const mapH = 80
  const dotY = scrollPct * (mapH - 8) + 4

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-1 transition-opacity duration-500"
      style={{ opacity: visible ? 0.4 : 0 }}
    >
      {/* Track */}
      <div className="relative w-[3px] rounded-full overflow-hidden" style={{ height: mapH }}>
        {/* Background */}
        <div className="absolute inset-0 bg-white/[0.04] rounded-full" />
        {/* Fill */}
        <div
          className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-[#C9A96E]/30 to-[#C9A96E]/10 transition-[height] duration-150"
          style={{ height: `${scrollPct * 100}%` }}
        />
      </div>
      {/* Position dot */}
      <div
        className="absolute w-2 h-2 rounded-full bg-[#C9A96E]/60 shadow-[0_0_6px_rgba(201,169,110,0.3)] transition-[top] duration-150"
        style={{ top: dotY, left: '50%', transform: 'translateX(-50%)' }}
      />
      {/* Label */}
      <p className="text-[7px] text-white/20 font-light mt-2 tracking-wider">
        {Math.round(scrollPct * 100)}%
      </p>
    </div>
  )
}
