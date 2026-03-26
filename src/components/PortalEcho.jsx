import { useState, useEffect } from 'react'

// A tiny echo of the portal in the corner — a reminder of where you came from
export function PortalEcho() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show after portal exits
    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed top-20 left-4 z-30 hidden lg:block opacity-0 transition-opacity duration-[3000ms]"
      style={{ opacity: visible ? 0.35 : 0 }}
      title="You came from here"
    >
      <div className="relative w-8 h-8">
        {/* Tiny concentric rings */}
        <div className="absolute inset-0 rounded-full border border-[#C9A96E]/35" style={{ animation: 'portalEchoSpin 20s linear infinite' }} />
        <div className="absolute inset-1 rounded-full border border-[#C9A96E]/25" style={{ animation: 'portalEchoSpin 15s linear infinite reverse' }} />
        <div className="absolute inset-2 rounded-full border border-[#C9A96E]/18" />
        {/* Core dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#C9A96E]/50" />
      </div>

      <style>{`
        @keyframes portalEchoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
