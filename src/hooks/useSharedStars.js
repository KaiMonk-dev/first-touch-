// Shared visible star positions between galaxy and cursor canvases
// Galaxy writes, cursor reads — no React re-renders needed
const sharedStars = { positions: [] }

export function setVisibleStars(positions) {
  sharedStars.positions = positions
}

export function getVisibleStars() {
  return sharedStars.positions
}

// Gravity well — cursor writes when hovering interactive elements, galaxy reads
const sharedGravityWell = { x: 0, y: 0, active: false }

export function setGravityWell(well) {
  sharedGravityWell.x = well.x || 0
  sharedGravityWell.y = well.y || 0
  sharedGravityWell.active = !!well.active
}

export function getGravityWell() {
  return sharedGravityWell
}

// Star displacement — cursor writes on click supernova, galaxy reads for spring-back
// Keys are star indices, values are { dx, dy }
const sharedDisplacements = {}

export function pushStarDisplacement(starIdx, dx, dy) {
  sharedDisplacements[starIdx] = { dx, dy }
}

export function getStarDisplacements() {
  return sharedDisplacements
}

export function decayDisplacements() {
  for (const key in sharedDisplacements) {
    const d = sharedDisplacements[key]
    d.dx *= 0.92
    d.dy *= 0.92
    if (Math.abs(d.dx) < 0.1 && Math.abs(d.dy) < 0.1) {
      delete sharedDisplacements[key]
    }
  }
}
