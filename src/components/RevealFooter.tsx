import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import inkImage from '../assets/footer-ink-reveal.png'
import { navLinks, profile } from '../data/content'
import { ease } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'

const YEAR = new Date().getFullYear()

function hash(value: number): number {
  const x = Math.sin(value * 127.1 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function drawFitted(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const ratio = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const w = image.naturalWidth * ratio
  const h = image.naturalHeight * ratio
  ctx.drawImage(image, (width - w) / 2, height - h, w, h)
}

/**
 * Ink Reveal Canvas:
 * Left-to-right fragmented-ink reveal of the etched alpine panorama
 * with organic torn deckle edge and airborne flecks.
 */
function InkRevealCanvas() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()
  const isInView = useInView(rootRef, { once: true, amount: 0.15 })

  useEffect(() => {
    if (!isInView) return
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loaded = new Image()
    let frame = 0
    let start = 0
    let disposed = false
    let width = 0
    let height = 0

    const duration = 1.6
    const delay = 0.12
    const edgeRoughness = 24
    const flecks = 110
    const opacity = 0.95

    const paint = (progress: number) => {
      if (disposed || !loaded.naturalWidth) return
      ctx.clearRect(0, 0, width, height)
      if (progress <= 0) return

      if (progress >= 1) {
        ctx.globalAlpha = opacity
        drawFitted(ctx, loaded, width, height)
        ctx.globalAlpha = 1
        return
      }

      const front = width * progress
      const rough = Math.min(edgeRoughness, width * 0.08)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(0, 0)
      for (let y = 0; y <= height + 3; y += 3) {
        const offset =
          (Math.sin(y * 0.048 + progress * 5.1) * 0.39 +
            Math.sin(y * 0.193 + 1.7) * 0.22 +
            (hash(Math.floor(y / 5) + 21) - 0.5) * 0.78) *
          rough
        ctx.lineTo(Math.max(0, front + offset), y)
      }
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.clip()
      ctx.globalAlpha = opacity
      drawFitted(ctx, loaded, width, height)
      ctx.restore()

      // Source-coloured flecks ride just ahead of the torn frontier
      for (let i = 0; i < Math.round(flecks); i++) {
        const y = hash(i * 2 + 7) * height
        const distance = 3 + hash(i * 2 + 8) * rough * 2.5
        const x = front + distance
        if (x >= width) continue
        const size = 1 + hash(i * 3 + 13) * 3
        const sx = Math.max(
          0,
          Math.min(loaded.naturalWidth - 2, (x / width) * loaded.naturalWidth),
        )
        const sy = Math.max(
          0,
          Math.min(loaded.naturalHeight - 2, (y / height) * loaded.naturalHeight),
        )
        ctx.globalAlpha = opacity * (1 - distance / (rough * 2.5 + 3)) * 0.7
        ctx.drawImage(loaded, sx, sy, 2, 2, x, y, size, size)
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const rect = root.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (start) {
        paint(
          reducedMotion
            ? 1
            : Math.min(1, Math.max(0, ((performance.now() - start) / 1000 - delay) / duration)),
        )
      }
    }

    const tick = (now: number) => {
      if (disposed) return
      if (!start) start = now
      const u = Math.min(1, Math.max(0, ((now - start) / 1000 - delay) / Math.max(duration, 0.01)))
      const progress = u < 0.85 ? u : 1 - Math.pow((1 - u) / 0.15, 2) * 0.15
      paint(reducedMotion ? 1 : progress)
      if (u < 1 && !reducedMotion) {
        frame = requestAnimationFrame(tick)
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(root)

    loaded.onload = () => {
      if (disposed) return
      resize()
      frame = requestAnimationFrame(tick)
    }
    loaded.src = inkImage

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      loaded.onload = null
    }
  }, [isInView, reducedMotion])

  return (
    <div ref={rootRef} className="reveal-footer__canvas-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="reveal-footer__canvas" />
    </div>
  )
}

export function RevealFooter() {
  const go = (e: React.MouseEvent, href: string | number) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <footer className="reveal-footer" role="contentinfo">
      {/* 1. Background Ink Reveal Alpine Panorama Silhouette */}
      <InkRevealCanvas />

      {/* 2. Layered Foreground Content */}
      <div className="reveal-footer__content">
        <div className="reveal-footer__top">
          {/* Left Column: Brand Orbit + Headline + Copy */}
          <div className="reveal-footer__statement">
            <motion.div
              className="reveal-footer__logo"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, ease }}
            >
              <motion.div
                className="reveal-footer__orbit"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.45, ease }}
              >
                <div className="reveal-footer__orbit-core" />
              </motion.div>
              <span className="reveal-footer__wordmark mono">
                {profile.name}©
              </span>
            </motion.div>

            <div className="reveal-footer__headline">
              <h2 className="reveal-footer__headline-text">
                <span>Go beyond</span>
                <span className="serif-i">the last page.</span>
              </h2>
            </div>

            <p className="reveal-footer__copy muted">
              A little space for what comes next. Available for select engineering,
              architecture, and full-stack partnerships worldwide.
            </p>
          </div>

          {/* Right Column: Structured Navigation Links */}
          <nav className="reveal-footer__nav" aria-label="Footer Navigation">
            {/* Explore Column */}
            <div className="reveal-footer__col">
              <span className="reveal-footer__eyebrow mono">EXPLORE</span>
              <ul className="reveal-footer__links">
                <li>
                  <motion.a
                    href="#top"
                    onClick={(e) => go(e, 0)}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2, ease }}
                  >
                    Home
                  </motion.a>
                </li>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <motion.a
                      href={link.href}
                      onClick={(e) => go(e, link.href)}
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.2, ease }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Elsewhere / Follow Column */}
            <div className="reveal-footer__col">
              <span className="reveal-footer__eyebrow mono">ELSEWHERE</span>
              <ul className="reveal-footer__links">
                {profile.socials.map((social) => (
                  <li key={social.label}>
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.2, ease }}
                    >
                      {social.label} ↗
                    </motion.a>
                  </li>
                ))}
                <li>
                  <motion.a
                    href={`mailto:${profile.email}`}
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2, ease }}
                  >
                    Direct Email ↗
                  </motion.a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Details Bar */}
        <div className="reveal-footer__bottom mono">
          <span className="reveal-footer__copyright muted">
            © {YEAR} {profile.fullName} — All rights reserved.
          </span>
          <button
            type="button"
            className="reveal-footer__top-btn"
            onClick={() => scrollToTarget(0)}
          >
            <span>BACK TO TOP ↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
