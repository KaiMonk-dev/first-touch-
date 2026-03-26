// Warm chime sound on CTA click — synthesized, no audio file needed.
// Plays a soft, satisfying two-tone chime that feels premium and intentional.

let audioCtx = null

export function playCtaChime() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()

    const now = audioCtx.currentTime

    // Primary tone — warm, bell-like
    const osc1 = audioCtx.createOscillator()
    const gain1 = audioCtx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now) // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08) // E6
    gain1.gain.setValueAtTime(0.08, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    osc1.connect(gain1).connect(audioCtx.destination)
    osc1.start(now)
    osc1.stop(now + 0.5)

    // Harmonic shimmer — higher, quieter
    const osc2 = audioCtx.createOscillator()
    const gain2 = audioCtx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1760, now + 0.05) // A6
    gain2.gain.setValueAtTime(0.03, now + 0.05)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc2.connect(gain2).connect(audioCtx.destination)
    osc2.start(now + 0.05)
    osc2.stop(now + 0.6)

    // Sub-tone for warmth
    const osc3 = audioCtx.createOscillator()
    const gain3 = audioCtx.createGain()
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(440, now) // A4
    gain3.gain.setValueAtTime(0.04, now)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc3.connect(gain3).connect(audioCtx.destination)
    osc3.start(now)
    osc3.stop(now + 0.3)
  } catch {
    // Audio not available — fail silently
  }
}
