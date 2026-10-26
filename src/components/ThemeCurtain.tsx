import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiMoon, FiSun } from 'react-icons/fi'
import { ease } from '../lib/motion'
import {
  applyTheme,
  registerThemeCurtain,
  setCurtainBusy,
  type Theme,
} from '../lib/theme'

const SLATS = 5

export function ThemeCurtain() {
  const [active, setActive] = useState<{
    targetTheme: Theme
    phase: 'closing' | 'opening'
  } | null>(null)

  useEffect(() => {
    return registerThemeCurtain((targetTheme) => {
      setActive({ targetTheme, phase: 'closing' })
    })
  }, [])

  const handleClosingComplete = (index: number) => {
    // Column 0 is the last to finish in the right-to-left sweep
    if (!active || active.phase !== 'closing' || index !== 0) return

    // Apply the theme behind the curtains
    applyTheme(active.targetTheme)

    // Brief pause to settle, then lift up
    window.setTimeout(() => {
      setActive((prev) => (prev ? { ...prev, phase: 'opening' } : null))
    }, 70)
  }

  const handleOpeningComplete = (index: number) => {
    // When column 0 finishes lifting up
    if (index === 0) {
      setCurtainBusy(false)
      setActive(null)
    }
  }

  if (!active) return null

  const isLight = active.targetTheme === 'light'
  const isClosing = active.phase === 'closing'

  return (
    <div
      className={`theme-curtain theme-curtain--${active.targetTheme}`}
      aria-hidden="true"
    >
      <div className="theme-curtain__curtains">
        {Array.from({ length: SLATS }).map((_, i) => {
          // Wave from right to left (column 4 -> column 0)
          const order = SLATS - 1 - i

          return (
            <div key={i} className="theme-curtain__column">
              {/* Trailing accent layer (like preloader__slat--accent) */}
              <motion.div
                className="theme-curtain__slat theme-curtain__slat--accent"
                initial={{ y: '-100%' }}
                animate={{ y: isClosing ? '0%' : '-100%' }}
                transition={{
                  duration: isClosing ? 0.38 : 0.68,
                  delay: isClosing ? 0.04 + order * 0.045 : 0.08 + order * 0.055,
                  ease,
                }}
              />

              {/* Main theme slat (like preloader__slat--main) */}
              <motion.div
                className="theme-curtain__slat theme-curtain__slat--main"
                initial={{ y: '-100%' }}
                animate={{ y: isClosing ? '0%' : '-100%' }}
                transition={{
                  duration: isClosing ? 0.38 : 0.62,
                  delay: isClosing ? order * 0.045 : order * 0.055,
                  ease,
                }}
                onAnimationComplete={() => {
                  if (isClosing) {
                    handleClosingComplete(i)
                  } else {
                    handleOpeningComplete(i)
                  }
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Center HUD (like preloader HUD) */}
      <motion.div
        className="theme-curtain__hud mono"
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: isClosing ? 1 : 0,
          y: isClosing ? 0 : -24,
        }}
        transition={{
          duration: 0.3,
          delay: isClosing ? 0.15 : 0,
          ease,
        }}
      >
        <div className="theme-curtain__pill">
          <span className="theme-curtain__icon">
            {isLight ? <FiSun /> : <FiMoon />}
          </span>
          <span className="theme-curtain__title">
            {isLight ? 'LIGHT EDITION' : 'DARK EDITION'}
          </span>
        </div>
        <span className="theme-curtain__label">
          {isLight ? 'THEME TRANSITION • ARCHITECTURAL SLATS' : 'THEME TRANSITION • ARCHITECTURAL SLATS'}
        </span>
      </motion.div>
    </div>
  )
}
