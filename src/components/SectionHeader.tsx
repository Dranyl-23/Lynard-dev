import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export function SectionHeader({ index, title }: { index: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.92', 'start 0.38'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.3,
  })
  const scaleX = useTransform(smooth, [0, 1], [0, 1])
  const y = useTransform(smooth, [0, 0.7], [18, 0])
  const opacity = useTransform(smooth, [0, 0.6], [0.25, 1])

  return (
    <div ref={ref} className="section-header">
      <motion.span className="mono" style={{ y, opacity }}>
        ({index})
      </motion.span>
      <motion.span className="mono" style={{ y, opacity }}>
        {title}
      </motion.span>
      <motion.span className="section-header__line" style={{ scaleX }} />
    </div>
  )
}
