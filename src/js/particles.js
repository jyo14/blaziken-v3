// Linear-style animated grid dots
const DOT_SPACING = 32
const DOT_SIZE = 1.2
const RIPPLE_SPEED = 0.002
const RIPPLE_RADIUS = 180

let canvas, ctx
let dots = []
let animationId = null
let dotColor = 'rgba(255, 255, 255, 0.07)'
let highlightColor = { r: 139, g: 139, b: 245 }
let mouseX = -9999, mouseY = -9999

function readThemeColors() {
  const style = getComputedStyle(document.documentElement)
  dotColor = style.getPropertyValue('--grid-dot-color').trim() || dotColor

  const highlightStr = style.getPropertyValue('--grid-dot-highlight').trim()
  if (highlightStr) {
    // Parse rgba
    const match = highlightStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      highlightColor = { r: +match[1], g: +match[2], b: +match[3] }
    }
  }
}

function createDots() {
  dots = []
  const cols = Math.ceil(canvas.width / DOT_SPACING) + 2
  const rows = Math.ceil(canvas.height / DOT_SPACING) + 2
  const offsetX = (canvas.width - (cols - 1) * DOT_SPACING) / 2
  const offsetY = (canvas.height - (rows - 1) * DOT_SPACING) / 2

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push({
        x: offsetX + col * DOT_SPACING,
        y: offsetY + row * DOT_SPACING,
        baseAlpha: 0.07 + Math.random() * 0.03,
      })
    }
  }
}

function resize() {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.parentElement.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  ctx.scale(dpr, dpr)
  createDots()
}

function animate(time) {
  const dpr = window.devicePixelRatio || 1
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

  const t = time * RIPPLE_SPEED
  const { r, g, b } = highlightColor

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i]

    // Ambient ripple wave
    const waveX = Math.sin(dot.x * 0.008 + t) * 0.5 + 0.5
    const waveY = Math.cos(dot.y * 0.006 + t * 0.7) * 0.5 + 0.5
    const wave = waveX * waveY

    // Mouse proximity glow
    const dx = dot.x - mouseX
    const dy = dot.y - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const mouseInfluence = dist < RIPPLE_RADIUS
      ? (1 - dist / RIPPLE_RADIUS) * 0.6
      : 0

    const totalHighlight = Math.min(1, wave * 0.25 + mouseInfluence)

    if (totalHighlight > 0.08) {
      // Highlighted dot — accent color
      const alpha = 0.1 + totalHighlight * 0.5
      const size = DOT_SIZE + totalHighlight * 1.2
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fill()
    } else {
      // Base dot
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, DOT_SIZE, 0, Math.PI * 2)
      ctx.fillStyle = dotColor
      ctx.fill()
    }
  }

  animationId = requestAnimationFrame(animate)
}

export function init() {
  const container = document.querySelector('.hero-grid')
  if (!container) return

  canvas = document.createElement('canvas')
  container.appendChild(canvas)
  ctx = canvas.getContext('2d')

  readThemeColors()
  resize()

  window.addEventListener('resize', resize)

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  })

  window.addEventListener('mouseleave', () => {
    mouseX = -9999
    mouseY = -9999
  })

  window.addEventListener('themechange', () => {
    readThemeColors()
  })

  animationId = requestAnimationFrame(animate)
}
