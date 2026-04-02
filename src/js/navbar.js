export function init() {
  const hamburger = document.getElementById('navHamburger')
  const mobileMenu = document.getElementById('mobileMenu')
  const mobileLinks = mobileMenu?.querySelectorAll('a')

  if (!hamburger || !mobileMenu) return

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open')
    mobileMenu.classList.toggle('open')
    hamburger.classList.toggle('active')
    hamburger.setAttribute('aria-expanded', !isOpen)
    document.body.style.overflow = isOpen ? '' : 'hidden'
  }

  function closeMenu() {
    mobileMenu.classList.remove('open')
    hamburger.classList.remove('active')
    hamburger.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
  }

  hamburger.addEventListener('click', toggleMenu)
  mobileLinks?.forEach((link) => link.addEventListener('click', closeMenu))
}
