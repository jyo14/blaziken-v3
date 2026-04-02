export function init() {
  // Minimal scroll — fade hero content as user scrolls down
  const hero = document.querySelector('.hero')
  const content = document.querySelector('.hero-content')

  if (!hero || !content) return

  function onScroll() {
    const scrollY = window.scrollY
    const heroHeight = hero.offsetHeight
    const progress = Math.min(1, scrollY / (heroHeight * 0.6))

    content.style.opacity = 1 - progress
    content.style.transform = `translateY(${progress * -30}px)`
  }

  window.addEventListener('scroll', onScroll, { passive: true })
}
