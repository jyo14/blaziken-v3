// Stacking scroll: row 1 is sticky, row 2 scrolls over it.
// As row 2 overlaps, row 1 scales down and dims for depth.

export function init() {
  const row1 = document.querySelector('.services-row-1')
  const row2 = document.querySelector('.services-row-2')

  if (!row1 || !row2) return

  function onScroll() {
    const row1Rect = row1.getBoundingClientRect()
    const row2Rect = row2.getBoundingClientRect()

    // How much row2's top has crossed into row1's bottom
    const overlap = row1Rect.bottom - row2Rect.top
    const maxOverlap = row1Rect.height

    if (overlap > 0 && maxOverlap > 0) {
      const progress = Math.min(1, overlap / maxOverlap)

      // Scale down and dim row 1 as row 2 covers it
      const scale = 1 - progress * 0.06
      const opacity = 1 - progress * 0.5
      row1.style.transform = `scale(${scale})`
      row1.style.opacity = opacity
    } else {
      row1.style.transform = ''
      row1.style.opacity = ''
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
