import { useEffect, useRef, useState } from 'react'

export function DebugOverlay() {
  const [enabled, setEnabled] = useState(false)
  const [fps, setFps] = useState(0)
  const frames = useRef([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('debug') === 'true') setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let animId
    const tick = () => {
      const now = performance.now()
      frames.current.push(now)
      // Keep last 60 frame timestamps
      while (frames.current.length > 60) frames.current.shift()
      if (frames.current.length > 1) {
        const elapsed = now - frames.current[0]
        setFps(Math.round((frames.current.length / elapsed) * 1000))
      }
      animId = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(animId)
  }, [enabled])

  if (!enabled) return null

  const canvases = document.querySelectorAll('canvas')

  return (
    <div style={{
      position: 'fixed', top: 70, right: 10, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', color: '#0f0', fontFamily: 'monospace',
      fontSize: 10, padding: '6px 10px', borderRadius: 6, pointerEvents: 'none',
      lineHeight: 1.6,
    }}>
      <div>FPS: {fps}</div>
      <div>Canvases: {canvases.length}</div>
      <div>Scroll: {Math.round(window.scrollY)}px</div>
      <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
    </div>
  )
}
