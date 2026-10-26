import Lenis from 'lenis'

let lenis: Lenis | null = null

/** Starts Lenis smooth scrolling. Returns a cleanup function. */
export function initSmoothScroll(): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
  lenis = instance
  let frame = requestAnimationFrame(function raf(time) {
    instance.raf(time)
    frame = requestAnimationFrame(raf)
  })

  return () => {
    cancelAnimationFrame(frame)
    instance.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}

export function stopScroll() {
  lenis?.stop()
  document.body.style.overflow = 'hidden'
}

export function startScroll() {
  lenis?.start()
  document.body.style.overflow = ''
}

export function openResumeModal() {
  window.dispatchEvent(new CustomEvent('open-resume'))
}
