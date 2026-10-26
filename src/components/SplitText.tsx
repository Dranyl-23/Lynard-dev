import { motion, type MotionProps } from 'framer-motion'
import { easeOut } from '../lib/motion'

interface SplitTextProps {
  text: string
  className?: string
  /** Split by word or by character. */
  by?: 'word' | 'char'
  delay?: number
  stagger?: number
  /** When provided, animation is controlled manually; otherwise it plays when scrolled into view. */
  active?: boolean
}

/** Masked text reveal — each word/char slides up from behind a clip. */
export function SplitText({
  text,
  className = '',
  by = 'word',
  delay = 0,
  stagger = 0.06,
  active,
}: SplitTextProps) {
  const units = by === 'char' ? Array.from(text) : text.split(' ')

  const trigger: MotionProps =
    active === undefined
      ? { initial: 'hidden', whileInView: 'show', viewport: { once: false, amount: 0.2 } }
      : { initial: 'hidden', animate: active ? 'show' : 'hidden' }

  return (
    <motion.span
      className={`split ${className}`}
      aria-label={text}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...trigger}
    >
      {units.map((unit, i) => (
        <span key={i} aria-hidden="true">
          <span className="split__mask">
            <motion.span
              className="split__unit"
              variants={{
                hidden: { y: '115%' },
                show: { y: '0%', transition: { duration: 1.1, ease: easeOut } },
              }}
            >
              {unit === ' ' ? '\u00a0' : unit}
            </motion.span>
          </span>
          {by === 'word' && i < units.length - 1 ? ' ' : ''}
        </span>
      ))}
    </motion.span>
  )
}
