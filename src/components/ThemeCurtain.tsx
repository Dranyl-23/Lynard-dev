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
    step: 'enter' | 'exit'
  } | null>(null)

  useEffect(() => {
    return registerThemeCurtain((targetTheme) => {
      setActive({ targetTheme, step: 'enter' })
    })
  }, [])

  const handleEnterComplete = () => {
    if (!active) return
    // Curtain is now fully covering the screen from the right
    // Switch the theme underneath
    applyTheme(active.targetTheme)
    // Small timeout for smooth breathing room, then glide out to the left
    window.setTimeout(() => {
      setActive((prev) => (prev ? { ...prev, step: 'exit' } : null))
    }, 60)
  }

  const handleExitComplete = () => {
    setCurtainBusy(false)
    setActive(null)
  }

  if (!active) return null

  const isLight = active.targetTheme === 'light'
  const isEntering = active.step === 'enter'

  return (
    <div
      className={`theme-curtain theme-curtain--${active.targetTheme}`}
      aria-hidden="true"
    >
      {/* Accent Lead Strip (slight trailing offset from right to left) */}
      <motion.div
        className="theme-curtain__layer theme-curtain__layer--accent"
        initial={{ x: '100%' }}
        animate={{ x: isEntering ? '0%' : '-100%' }}
        transition={{
          duration: 0.42,
          delay: isEntering ? 0 : 0.05,
          ease,
        }}
      />

      {/* Main Solid Curtain Layer */}
      <motion.div
        className="theme-curtain__layer theme-curtain__layer--main"
        initial={{ x: '100%' }}
        animate={{ x: isEntering ? '0%' : '-100%' }}
        transition={{
          duration: 0.42,
          delay: isEntering ? 0.04 : 0,
          ease,
        }}
        onAnimationComplete={() => {
          if (isEntering) {
            handleEnterComplete()
          } else {
            handleExitComplete()
          }
        }}
      >
        {/* Architectural Vertical Slats / Columns */}
        <div className="theme-curtain__grid">
          {Array.from({ length: SLATS }).map((_, i) => (
            <div key={i} className="theme-curtain__col" />
          ))}
        </div>

        {/* Minimalist Editorial HUD Badge in Center */}
        <div className="theme-curtain__hud mono">
          <div className="theme-curtain__pill">
            <span className="theme-curtain__icon">
              {isLight ? <FiSun /> : <FiMoon />}
            </span>
            <span className="theme-curtain__title">
              {isLight ? 'LIGHT EDITION' : 'DARK EDITION'}
            </span>
          </div>
          <span className="theme-curtain__label">
            {isLight ? 'SWITCHING THEME • RIGHT TO LEFT' : 'SWITCHING THEME • RIGHT TO LEFT'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
