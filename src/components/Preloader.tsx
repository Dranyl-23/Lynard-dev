import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ease } from '../lib/motion'

const SLATS = 5

/**
 * Editorial Curtain Reveal Preloader:
 * Counts 00 → 100 with a live hairline progress bar, then lifts
 * staggered architectural curtain slats with an ivory trailing layer.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1750
    const start = performance.now()
    let frame = 0
    let timeout = 0

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) frame = requestAnimationFrame(tick)
      else timeout = window.setTimeout(onDone, 240)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
    }
  }, [onDone])

  const formatted = String(count).padStart(2, '0')

  return (
    <motion.div
      className="preloader"
      initial="initial"
      exit="exit"
      aria-label="Loading portfolio"
    >
      {/* Staggered vertical curtain slats (ivory accent + dark architectural slats) */}
      <div className="preloader__curtains" aria-hidden="true">
        {Array.from({ length: SLATS }).map((_, i) => (
          <div key={i} className="preloader__column">
            <motion.div
              className="preloader__slat preloader__slat--accent"
              variants={{
                initial: { y: '0%' },
                exit: {
                  y: '-100%',
                  transition: {
                    duration: 0.92,
                    delay: 0.1 + i * 0.065,
                    ease,
                  },
                },
              }}
            />
            <motion.div
              className="preloader__slat preloader__slat--main"
              variants={{
                initial: { y: '0%' },
                exit: {
                  y: '-100%',
                  transition: {
                    duration: 0.88,
                    delay: i * 0.065,
                    ease,
                  },
                },
              }}
            />
          </div>
        ))}
      </div>

      {/* Foreground HUD content that masks out as curtains lift */}
      <motion.div
        className="preloader__hud"
        variants={{
          initial: { opacity: 1, y: 0 },
          exit: {
            opacity: 0,
            y: -36,
            transition: { duration: 0.42, ease },
          },
        }}
      >
        <div className="preloader__top mono">
          <span>Lynard — Portfolio</span>
          <span className="muted">Edition ©2026</span>
        </div>

        <div className="preloader__center">
          <div className="preloader__bar-track">
            <div
              className="preloader__bar-fill"
              style={{ transform: `scaleX(${count / 100})` }}
            />
          </div>
        </div>

        <div className="preloader__bottom">
          <span className="mono muted preloader__status">
            {count < 100 ? 'Loading Archive…' : 'Ready'}
          </span>
          <span className="preloader__count">
            {formatted}
            <span className="preloader__pct">%</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
