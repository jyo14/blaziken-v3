export function init() {
  const preloader = document.getElementById('preloader')
  if (!preloader) return

  const text = preloader.querySelector('.preloader-text')
  let progress = 0

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4
    if (progress > 95) progress = 95
    if (text) text.textContent = Math.floor(progress) + '%'
  }, 180)

  window.addEventListener('load', () => {
    clearInterval(interval)
    if (text) text.textContent = '100%'

    setTimeout(() => {
      preloader.classList.add('done')
      document.body.classList.remove('loading')
    }, 350)

    setTimeout(() => preloader.remove(), 1100)
  })
}
