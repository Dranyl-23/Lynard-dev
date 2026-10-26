import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Custom cursor: dot that grows over links and shows a label for [data-cursor] elements. */
export function Cursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [hover, setHover] = useState(false)
  const [hideDot, setHideDot] = useState(false)
  const [label, setLabel] = useState('')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.35 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const inReveal = Boolean(target.closest('.reveal'))
      setHideDot(inReveal)
      if (inReveal) {
        setHover(false)
        setLabel('')
        return
      }
      const el = target.closest<HTMLElement>('a, button, [data-cursor]')
      setHover(Boolean(el))
      setLabel(el?.dataset.cursor ?? '')
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      className={`cursor ${label ? 'cursor--label' : ''}`}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <motion.div
        className="cursor__dot"
        animate={{ scale: hideDot ? 0 : label ? 5 : hover ? 2.6 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      {label && !hideDot && <span className="cursor__label">{label}</span>}
    </motion.div>
  )
}
