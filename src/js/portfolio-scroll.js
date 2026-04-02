// Full-viewport stacking + number count-up animation

function countUp(el) {
  const target = parseInt(el.dataset.count)
  const suffix = el.dataset.suffix || ''
  if (isNaN(target)) return

  const duration = 1400
  const start = performance.now()

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 4)
    const current = Math.round(target * eased)
    el.textContent = current.toLocaleString() + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

export function init() {
  const projects = document.querySelectorAll('.pf-project')
  if (!projects.length) return

  // Stacking depth effect
  function onScroll() {
    projects.forEach((project, i) => {
      if (i === projects.length - 1) return

      const rect = project.getBoundingClientRect()
      const nextProject = projects[i + 1]
      if (!nextProject) return

      const nextRect = nextProject.getBoundingClientRect()
      const overlap = rect.bottom - nextRect.top
      const maxOverlap = rect.height

      if (overlap > 0 && maxOverlap > 0) {
        const progress = Math.min(1, overlap / maxOverlap)
        project.style.transform = `scale(${1 - progress * 0.05})`
        project.style.opacity = 1 - progress * 0.4
      } else {
        project.style.transform = ''
        project.style.opacity = ''
      }
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Number count-up: use IntersectionObserver on each stat element
  const statEls = document.querySelectorAll('.pf-project-stat-value[data-count]')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        observer.unobserve(el)
        // Small delay so user sees it animate
        setTimeout(() => countUp(el), 200)
      }
    })
  }, {
    threshold: 0.5
  })

  statEls.forEach(el => {
    // Set initial text to 0
    el.textContent = '0' + (el.dataset.suffix || '')
    observer.observe(el)
  })
}
