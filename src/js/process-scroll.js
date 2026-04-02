// Horizontal scroll driven by vertical scroll + arrow navigation

let currentCard = 0
let totalCards = 0
let scrollArea, track, cards, prevBtn, nextBtn

function getScrollAreaTop() {
  // Get absolute page offset (not relative to parent)
  return window.scrollY + scrollArea.getBoundingClientRect().top
}

function updateArrows() {
  if (!prevBtn || !nextBtn) return
  prevBtn.classList.toggle('disabled', currentCard <= 0)
  nextBtn.classList.toggle('disabled', currentCard >= totalCards - 1)
}

function scrollToCard(index) {
  if (!scrollArea) return
  index = Math.max(0, Math.min(totalCards - 1, index))
  currentCard = index

  const scrollRange = scrollArea.offsetHeight - window.innerHeight
  const progress = index / (totalCards - 1)
  const targetScroll = getScrollAreaTop() + progress * scrollRange

  window.scrollTo({
    top: targetScroll,
    behavior: 'smooth'
  })

  updateArrows()
}

export function init() {
  scrollArea = document.querySelector('.process-scroll-area')
  track = document.querySelector('.process-track')
  cards = document.querySelectorAll('.process-card')
  prevBtn = document.getElementById('processPrev')
  nextBtn = document.getElementById('processNext')

  if (!scrollArea || !track || !cards.length) return

  totalCards = cards.length

  if (prevBtn) {
    prevBtn.addEventListener('click', () => scrollToCard(currentCard - 1))
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => scrollToCard(currentCard + 1))
  }

  // On mobile, let native horizontal scroll handle it
  if (window.innerWidth <= 768) return

  function onScroll() {
    const areaTop = getScrollAreaTop()
    const scrollStart = window.scrollY - areaTop
    const scrollRange = scrollArea.offsetHeight - window.innerHeight

    if (scrollRange <= 0) return

    const progress = Math.max(0, Math.min(1, scrollStart / scrollRange))

    // Total slide distance = track content minus visible area
    const trackWidth = track.scrollWidth
    const viewWidth = track.parentElement?.offsetWidth || window.innerWidth
    const maxTranslate = Math.max(0, trackWidth - viewWidth)

    track.style.transform = `translateX(${-progress * maxTranslate}px)`

    currentCard = Math.round(progress * (totalCards - 1))
    updateArrows()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
