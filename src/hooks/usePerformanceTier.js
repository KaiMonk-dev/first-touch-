// Adaptive Performance Tier System
// Module-level singleton — canvas loops read synchronously, no React re-renders.

const TIERS = ['ultra', 'high', 'medium', 'low']

const TIER_CONFIG = {
  ultra: {
    starCountMultiplier: 1.0,
    particleMultiplier: 1.0,
    constellationWeaverMax: 3,
    cometTrail: 'full',       // full | short | off
    gravityWell: 'orbit',     // orbit | pull | off
    clickSupernova: 'full',   // full | ring | flash
    orbitRing: 'full',        // full | ring | off
    comets: true,
    supernovae: true,
    stellarBirths: true,
    galaxyWeather: true,
    sparks: true,
    starDisplacement: true,
  },
  high: {
    starCountMultiplier: 1.0,
    particleMultiplier: 0.75,
    constellationWeaverMax: 3,
    cometTrail: 'full',
    gravityWell: 'orbit',
    clickSupernova: 'ring',
    orbitRing: 'full',
    comets: true,
    supernovae: true,
    stellarBirths: true,
    galaxyWeather: true,
    sparks: true,
    starDisplacement: false,
  },
  medium: {
    starCountMultiplier: 0.6,
    particleMultiplier: 0.4,
    constellationWeaverMax: 2,
    cometTrail: 'short',
    gravityWell: 'pull',
    clickSupernova: 'ring',
    orbitRing: 'ring',
    comets: false,
    supernovae: false,
    stellarBirths: true,
    galaxyWeather: false,
    sparks: true,
    starDisplacement: false,
  },
  low: {
    starCountMultiplier: 0.3,
    particleMultiplier: 0.0,
    constellationWeaverMax: 0,
    cometTrail: 'off',
    gravityWell: 'off',
    clickSupernova: 'flash',
    orbitRing: 'off',
    comets: false,
    supernovae: false,
    stellarBirths: false,
    galaxyWeather: false,
    sparks: false,
    starDisplacement: false,
  },
}

// --- State ---
let currentTier = 'high' // safe default until detection runs
let initialTier = 'high'
let hasUpgraded = false

// --- FPS Monitor ---
const FPS_WINDOW = 60
const frameTimes = []
let lowFpsFrames = 0
let criticalFpsFrames = 0
let highFpsFrames = 0

// --- Detection (runs once) ---
function runBenchmark() {
  try {
    const c = document.createElement('canvas')
    c.width = 200; c.height = 200
    const ctx = c.getContext('2d')
    if (!ctx) return 20 // fallback

    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      const x = (i * 7) % 200, y = (i * 13) % 200
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 8)
      grad.addColorStop(0, 'rgba(255,200,100,0.5)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
    }
    return performance.now() - start
  } catch { return 30 }
}

function detectTier() {
  // Respect user preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low'

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  const dpr = window.devicePixelRatio || 1
  const width = window.innerWidth
  const benchMs = runBenchmark()

  // Ultra: fast GPU, beefy hardware, big screen, not touch
  if (benchMs < 8 && cores >= 8 && memory >= 8 && width > 1400 && !isTouch) return 'ultra'
  // High: decent GPU, decent hardware, desktop
  if (benchMs < 16 && cores >= 4 && width > 1024 && !isTouch) return 'high'
  // Medium: passable GPU or decent specs
  if (benchMs < 30 || (cores >= 4 && width > 768)) return 'medium'
  // Low: everything else
  return 'low'
}

// Initialize
try {
  currentTier = detectTier()
  initialTier = currentTier
} catch {
  currentTier = 'medium'
  initialTier = 'medium'
}

// --- Runtime FPS Monitoring ---
export function reportFrameTime(delta) {
  frameTimes.push(delta)
  if (frameTimes.length > FPS_WINDOW) frameTimes.shift()
  if (frameTimes.length < 30) return // need enough samples

  const avgDelta = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
  const avgFps = 1000 / avgDelta

  // Drop tier if sustained low FPS
  if (avgFps < 40) {
    lowFpsFrames++
    highFpsFrames = 0
    if (lowFpsFrames > 120) { // ~2 seconds
      dropTier()
      lowFpsFrames = 0
    }
  } else if (avgFps < 25) {
    criticalFpsFrames++
    highFpsFrames = 0
    if (criticalFpsFrames > 60) { // ~1 second
      currentTier = 'low'
      criticalFpsFrames = 0
    }
  } else {
    lowFpsFrames = Math.max(0, lowFpsFrames - 1)
    criticalFpsFrames = 0

    // Allow one upgrade if sustained high FPS
    if (avgFps > 55) {
      highFpsFrames++
      if (highFpsFrames > 300 && !hasUpgraded) { // ~5 seconds
        upgradeTier()
        highFpsFrames = 0
        hasUpgraded = true
      }
    } else {
      highFpsFrames = Math.max(0, highFpsFrames - 1)
    }
  }
}

function dropTier() {
  const idx = TIERS.indexOf(currentTier)
  if (idx < TIERS.length - 1) currentTier = TIERS[idx + 1]
}

function upgradeTier() {
  const idx = TIERS.indexOf(currentTier)
  const initIdx = TIERS.indexOf(initialTier)
  if (idx > 0 && idx > initIdx) currentTier = TIERS[idx - 1]
}

// --- Public API ---
export function getPerformanceTier() { return currentTier }

export function getTierConfig() { return TIER_CONFIG[currentTier] }

export function getParticleMultiplier() { return TIER_CONFIG[currentTier].particleMultiplier }

export function shouldEnable(feature) {
  const config = TIER_CONFIG[currentTier]
  if (feature in config) {
    const val = config[feature]
    return val === true || (typeof val === 'string' && val !== 'off')
  }
  return true
}
