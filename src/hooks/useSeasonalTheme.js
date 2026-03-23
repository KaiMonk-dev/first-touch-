// Seasonal galaxy theme system
// Activate via URL param: ?theme=holiday | valentine | aurora | ocean | default
// Colors modify the galaxy star palette and nebula tones

const themes = {
  default: {
    name: 'default',
    starAccent: null, // use default colors
    nebulaOverride: null,
    cursorColor: [201, 169, 110],
  },
  holiday: {
    name: 'holiday',
    // Some stars shift red/green, gold stays
    starAccent: [
      { r: 255, g: 80, b: 80 },   // red
      { r: 80, g: 200, b: 80 },   // green
      { r: 255, g: 215, b: 0 },   // gold
      { r: 255, g: 248, b: 225 }, // warm white
    ],
    nebulaOverride: [
      [180, 50, 50],  // deep red
      [50, 130, 50],  // deep green
      [200, 160, 50], // gold
    ],
    cursorColor: [255, 200, 100],
  },
  valentine: {
    name: 'valentine',
    starAccent: [
      { r: 255, g: 150, b: 180 }, // pink
      { r: 255, g: 100, b: 130 }, // rose
      { r: 255, g: 200, b: 210 }, // soft pink
      { r: 255, g: 248, b: 240 }, // warm white
    ],
    nebulaOverride: [
      [200, 80, 120],  // rose
      [180, 100, 150], // mauve
      [220, 140, 160], // blush
    ],
    cursorColor: [255, 150, 180],
  },
  aurora: {
    name: 'aurora',
    starAccent: [
      { r: 100, g: 255, b: 200 }, // aurora green
      { r: 150, g: 200, b: 255 }, // ice blue
      { r: 200, g: 100, b: 255 }, // violet
      { r: 255, g: 248, b: 225 }, // warm white
    ],
    nebulaOverride: [
      [50, 200, 150],  // aurora green
      [80, 120, 200],  // deep blue
      [150, 80, 200],  // violet
    ],
    cursorColor: [100, 220, 180],
  },
  ocean: {
    name: 'ocean',
    starAccent: [
      { r: 100, g: 200, b: 255 }, // cyan
      { r: 80, g: 160, b: 220 },  // ocean blue
      { r: 150, g: 220, b: 255 }, // sky blue
      { r: 240, g: 250, b: 255 }, // ice white
    ],
    nebulaOverride: [
      [40, 100, 180],  // deep ocean
      [60, 140, 200],  // medium blue
      [80, 180, 200],  // teal
    ],
    cursorColor: [100, 200, 255],
  },
}

export function getSeasonalTheme() {
  if (typeof window === 'undefined') return themes.default
  const params = new URLSearchParams(window.location.search)
  const themeName = params.get('theme')
  return themes[themeName] || themes.default
}

export function isSeasonalTheme() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('theme')
}
