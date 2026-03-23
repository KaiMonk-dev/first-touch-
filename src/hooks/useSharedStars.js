// Shared visible star positions between galaxy and cursor canvases
// Galaxy writes, cursor reads — no React re-renders needed
const sharedStars = { positions: [] }

export function setVisibleStars(positions) {
  sharedStars.positions = positions
}

export function getVisibleStars() {
  return sharedStars.positions
}
