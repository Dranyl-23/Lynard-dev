import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

interface WordProps {
  word: string
  range: [number, number]
  progress: MotionValue<number>
}

function Word({ word, range, progress }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{' '}
    </>
  )
}

/** Paragraph whose words light up one by one as you scroll. */
export function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />
      })}
    </p>
  )
}
