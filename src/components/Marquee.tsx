import { motion } from 'framer-motion'
import { stackIcons } from './StackIcons'

interface MarqueeProps {
  duration?: number
  reverse?: boolean
}

/** Hardware-accelerated infinite horizontal tech-stack icon ticker. */
export function Marquee({ duration = 36, reverse = false }: MarqueeProps) {
  return (
    <div className="marquee" aria-label="Tech stack icons">
      <motion.div
        className="marquee__track"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {[0, 1].map((group) => (
          <div className="marquee__group" key={group} aria-hidden={group === 1}>
            {stackIcons.map((item) => {
              const Icon = item.icon
              return (
                <div className="marquee__icon-item" key={item.name}>
                  <div className="marquee__icon-tile">
                    <Icon className="marquee__icon-svg" aria-hidden="true" />
                    <span className="mono marquee__icon-name">{item.name}</span>
                  </div>
                  <span className="marquee__star" aria-hidden="true">
                    ✦
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
