import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

interface MaskRevealProps {
  src: string
  alt: string
  /** Radius (px) of the reveal circle while hovering. */
  radius?: number
  /** true: the reveal shows the photo in full colour. false: bright black & white. */
  color?: boolean
  /** Optional vertical parallax applied to the image inside the frame. */
  parallaxY?: MotionValue<string>
}

/**
 * Dark, dimmed photo by default. A circular mask follows the cursor and
 * reveals the bright version underneath.
 */
export function MaskReveal({ src, alt, radius = 150, color = true, parallaxY }: MaskRevealProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const r = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 })
  const sr = useSpring(r, { stiffness: 160, damping: 18, mass: 0.6 })

  // Clamp: springs can overshoot below 0 and a zero/negative radius is invalid CSS (the mask would drop and show the full layer)
  const safe = useTransform(sr, (v) => Math.max(v, 0.5))
  const mask = useMotionTemplate`radial-gradient(circle ${safe}px at ${sx}px ${sy}px, #000 0%, rgba(0, 0, 0, 0.85) 40%, rgba(0, 0, 0, 0.3) 72%, transparent 100%)`

  const update = (e: React.PointerEvent) => {
    // offsetX/Y are in the element's own (untransformed) coordinate space, so this
    // keeps working while a parent is rotating or scaling (e.g. the swinging lanyard card).
    x.set(e.nativeEvent.offsetX)
    y.set(e.nativeEvent.offsetY)
  }

  return (
    <div
      className="reveal"
      onPointerEnter={(e) => {
        // jump the spring to the entry point so the circle grows from the cursor
        update(e)
        sx.jump(x.get())
        sy.jump(y.get())
        r.set(radius)
      }}
      onPointerMove={update}
      onPointerLeave={() => r.set(0)}
      onPointerDown={(e) => {
        update(e)
        r.set(radius)
      }}
    >
      <div className="reveal__layer reveal__base">
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          style={{ y: parallaxY, scale: parallaxY ? 1.2 : 1 }}
        />
      </div>
      <motion.div
        className={`reveal__layer reveal__top ${color ? '' : 'reveal__top--bw'}`}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        aria-hidden="true"
      >
        <motion.img
          src={src}
          alt=""
          loading="lazy"
          draggable={false}
          style={{ y: parallaxY, scale: parallaxY ? 1.2 : 1 }}
        />
      </motion.div>
    </div>
  )
}
