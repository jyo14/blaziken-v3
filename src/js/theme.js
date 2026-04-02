const STORAGE_KEY = 'blaziken-theme'
const TRANSITION_DURATION = 600

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY)
}

function setTheme(theme, animate = true) {
  const root = document.documentElement

  if (animate) {
    root.classList.add('theme-transitioning')
    setTimeout(() => root.classList.remove('theme-transitioning'), TRANSITION_DURATION)
  }

  root.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_KEY, theme)

  // Update toggle button aria-label
  const toggle = document.getElementById('themeToggle')
  if (toggle) {
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`)
  }

  // Dispatch custom event for canvas and other listeners
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))
}

function toggle() {
  const current = document.documentElement.getAttribute('data-theme') || getSystemTheme()
  setTheme(current === 'dark' ? 'light' : 'dark')
}

export function init() {
  // Theme is already set by inline script in <head> (FOUC prevention)
  // Just wire up the toggle button and system preference listener

  const toggleBtn = document.getElementById('themeToggle')
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggle)
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })
}
