export const BASE_HEX_COLORS = [
  '#005CB9', '#091F40', '#DB0032', '#0054A4',
  '#EE3124', '#9BE1FB', '#C5EFFD', '#6D6E71',
]

export function hexColorForIndex(index) {
  return BASE_HEX_COLORS[index % BASE_HEX_COLORS.length]
}

export function hexToRgba(hex, alpha = 0.75) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
