// Generates a subtle warm chime using Web Audio API
// Plays once when called — no external audio file needed
export function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    // Two layered tones for warmth
    const playTone = (freq, start, duration, gain) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      g.gain.setValueAtTime(0, ctx.currentTime + start)
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.05)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }

    // C5 + E5 — a warm major third
    playTone(523.25, 0, 1.2, 0.06)   // C5
    playTone(659.25, 0.08, 1.0, 0.04) // E5 slightly delayed

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 2000)
  } catch {
    // Audio not supported — silently ignore
  }
}
