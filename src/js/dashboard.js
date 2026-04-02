const STATUSES = ['todo', 'progress', 'done']
const STATUS_LABELS = { todo: 'Todo', progress: 'In Progress', done: 'Done' }

const CHECK_SVG = {
  todo: '<circle cx="8" cy="8" r="7" />',
  progress: '<circle cx="8" cy="8" r="7" /><path d="M8 4v4l2.5 2.5" />',
  done: '<circle cx="8" cy="8" r="7" /><path d="M5 8l2 2 4-4" />',
}

let autoPlayTimer = null
let autoPlayPaused = false

function cycleStatus(row) {
  const statusEl = row.querySelector('.dash-status')
  const checkEl = row.querySelector('.dash-task-check')
  if (!statusEl || !checkEl) return

  const current = statusEl.dataset.status || statusEl.className.split(' ').pop()
  const idx = STATUSES.indexOf(current)
  const next = STATUSES[(idx + 1) % STATUSES.length]

  // Animate row flash
  row.style.transition = 'background 0.3s ease'
  row.classList.add('row-flash')
  setTimeout(() => row.classList.remove('row-flash'), 400)

  // Update status
  statusEl.className = `dash-status ${next}`
  statusEl.dataset.status = next
  statusEl.textContent = STATUS_LABELS[next]

  // Update check icon
  checkEl.className = `dash-task-check ${next}`
  checkEl.innerHTML = CHECK_SVG[next]

  // Update active row highlight
  row.classList.toggle('active', next === 'progress')

  // Update stats
  updateStats()
}

function updateStats() {
  const rows = document.querySelectorAll('.dash-task-row')
  let done = 0, total = rows.length

  rows.forEach(row => {
    const status = row.querySelector('.dash-status')
    if (status && (status.dataset.status === 'done' || status.classList.contains('done'))) {
      done++
    }
  })

  const tasksEl = document.querySelector('[data-stat="tasks"]')
  const accuracyEl = document.querySelector('[data-stat="accuracy"]')
  const processedEl = document.querySelector('[data-stat="processed"]')

  if (tasksEl) animateValue(tasksEl, parseInt(tasksEl.textContent) || 0, total, 300)
  if (accuracyEl) {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    animateValue(accuracyEl, parseInt(accuracyEl.textContent) || 0, pct, 400, '%')
  }
  if (processedEl) {
    const val = done * 640
    animateValueK(processedEl, val, 350)
  }
}

function animateValue(el, from, to, duration, suffix = '') {
  const start = performance.now()
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(from + (to - from) * eased)
    el.textContent = current + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function animateValueK(el, to, duration) {
  const fromText = el.textContent
  const from = parseFloat(fromText) * (fromText.includes('k') ? 1000 : 1) || 0
  const start = performance.now()
  function tick(now) {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = from + (to - from) * eased
    if (current >= 1000) {
      el.textContent = (current / 1000).toFixed(1) + 'k'
    } else {
      el.textContent = Math.round(current)
    }
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function startAutoPlay() {
  const rows = Array.from(document.querySelectorAll('.dash-task-row'))
  if (!rows.length) return

  let currentIdx = 0

  // Sequence: cycle through rows one at a time
  autoPlayTimer = setInterval(() => {
    if (autoPlayPaused) return

    const row = rows[currentIdx]
    cycleStatus(row)
    currentIdx = (currentIdx + 1) % rows.length
  }, 2800)
}

function setupSearchAnimation() {
  const searchText = document.querySelector('.dash-search-text')
  if (!searchText) return

  const phrases = ['Search tasks...', 'RAG pipeline...', 'Dashboard...', 'NLP extraction...']
  let phraseIdx = 0
  let charIdx = 0
  let deleting = false

  function type() {
    const phrase = phrases[phraseIdx]

    if (!deleting) {
      charIdx++
      searchText.textContent = phrase.substring(0, charIdx)
      if (charIdx === phrase.length) {
        setTimeout(() => { deleting = true; type() }, 1800)
        return
      }
      setTimeout(type, 60 + Math.random() * 40)
    } else {
      charIdx--
      searchText.textContent = phrase.substring(0, charIdx) || '\u200B'
      if (charIdx === 0) {
        deleting = false
        phraseIdx = (phraseIdx + 1) % phrases.length
        setTimeout(type, 300)
        return
      }
      setTimeout(type, 30)
    }
  }

  setTimeout(type, 2000)
}

function initialCountUp() {
  const stats = document.querySelectorAll('.dash-stat-value[data-stat]')
  stats.forEach(el => {
    const target = el.dataset.target
    if (!target) return

    el.textContent = '0'
    const hasK = target.includes('k')
    const hasPct = target.includes('%')
    const hasMs = target.includes('ms')

    let numVal
    if (hasK) numVal = parseFloat(target) * 1000
    else numVal = parseFloat(target)

    const start = performance.now()
    const duration = 1200

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = numVal * eased

      if (hasK) el.textContent = (current / 1000).toFixed(1) + 'k'
      else if (hasPct) el.textContent = Math.round(current) + '%'
      else if (hasMs) el.textContent = Math.round(current) + 'ms'
      else el.textContent = Math.round(current)

      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

export function init() {
  const dashboard = document.querySelector('.hero-dashboard')
  if (!dashboard) return

  // Click to cycle status
  const rows = dashboard.querySelectorAll('.dash-task-row')
  rows.forEach(row => {
    row.style.cursor = 'pointer'
    row.addEventListener('click', () => {
      cycleStatus(row)
    })
  })

  // Initialize status data attributes
  dashboard.querySelectorAll('.dash-status').forEach(el => {
    const cls = [...el.classList].find(c => STATUSES.includes(c))
    if (cls) el.dataset.status = cls
  })

  // Pause auto-play on hover
  dashboard.addEventListener('mouseenter', () => { autoPlayPaused = true })
  dashboard.addEventListener('mouseleave', () => { autoPlayPaused = false })

  // Count up stats on load
  setTimeout(initialCountUp, 800)

  // Search typing animation
  setupSearchAnimation()

  // Start auto-play demo
  setTimeout(startAutoPlay, 3000)
}
