import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

/* ───────────────────────── math & interpolation helpers ───────────────────────── */

const WAX_TEXTURE =
  'https://framerusercontent.com/images/iqHChEn0wRooi2chZFgQSbUUUw.png?scale-down-to=512'

const clamp = (n: number) => Math.max(0, Math.min(1, n))
const range = (n: number, a: number, b: number) => clamp((n - a) / (b - a))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (t: number) => t * t * (3 - 2 * t)
const soft = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

function mix(n: number, stops: number[], values: number[], easing = smooth): number {
  if (n <= stops[0]) return values[0]
  for (let i = 1; i < stops.length; i++) {
    if (n <= stops[i]) {
      return lerp(values[i - 1], values[i], easing(range(n, stops[i - 1], stops[i])))
    }
  }
  return values[values.length - 1]
}

function pose(p: number, width: number) {
  const unit = width / 600
  if (p <= 0.46) {
    return {
      x: 0,
      y: mix(p, [0, 0.18, 0.35, 0.4, 0.426, 0.46], [0, -12, -3, 0, 1.2, 0], soft),
      rotate: mix(p, [0, 0.18, 0.36, 0.46], [0, -2, -1, -2], soft),
      scale: mix(p, [0, 0.09, 0.32, 0.4, 0.426, 0.46], [1, 0.99, 0.62, 0.62, 0.617, 0.62], soft),
      rx: mix(p, [0, 0.18, 0.38, 0.46], [0, 14, 0, 0], soft),
      ry: 0,
    }
  }
  return {
    x: mix(p, [0.46, 0.49, 0.61, 0.8], [0, 0, -110, 158]) * unit,
    y: mix(p, [0.46, 0.49, 0.61, 0.8], [0, 0, 43, -15]) * unit,
    rotate: mix(p, [0.46, 0.61, 0.8], [-2, 7, 7]),
    scale: mix(p, [0.46, 0.49, 0.61], [0.62, 0.62, 0.34]),
    rx: mix(p, [0.46, 0.61, 0.8], [3, 55, 55]),
    ry: mix(p, [0.46, 0.61, 0.8], [0, 52, 52]),
  }
}

function postalSideFold(degrees: number, right: boolean) {
  const theta = (degrees * Math.PI) / 180
  const hingeX = right ? 1000 : 0
  const points = right
    ? [
        [1000, 0],
        [450, 318],
        [1000, 600],
      ]
    : [
        [0, 0],
        [550, 318],
        [0, 600],
      ]
  return (
    points
      .map(([x, y], i) => {
        const dx = x - hingeX
        const depth = -dx * Math.sin(theta)
        const perspective = 1800 / (1800 - depth)
        return `${i ? 'L' : 'M'}${hingeX + dx * Math.cos(theta) * perspective},${300 + (y - 300) * perspective}`
      })
      .join(' ') + ' Z'
  )
}

function postalTopFold(degrees: number) {
  const theta = (degrees * Math.PI) / 180
  return (
    [
      [0, 0],
      [1000, 0],
      [520, 390],
      [500, 398],
      [480, 390],
    ]
      .map(([x, y], i) => {
        const perspective = 1800 / (1800 - y * Math.sin(theta))
        return `${i ? 'L' : 'M'}${500 + (x - 500) * perspective},${y * Math.cos(theta) * perspective}`
      })
      .join(' ') + ' Z'
  )
}

function parseRgb(color: string): { r: number; g: number; b: number; a: number } {
  const hex = color.trim().replace(/^#/, '')
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) || 168,
      g: parseInt(hex.slice(2, 4), 16) || 43,
      b: parseInt(hex.slice(4, 6), 16) || 50,
      a: 1,
    }
  }
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (m) {
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] !== undefined ? Number(m[4]) : 1,
    }
  }
  return { r: 168, g: 43, b: 50, a: 1 }
}

/* ───────────────────────── PostalButtonIcon ───────────────────────── */

function PostalButtonIcon({
  active,
  quiet,
  filled,
  ready,
  checked,
}: {
  active: boolean
  quiet: boolean
  filled: boolean
  ready: boolean
  checked: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const loop = {
    duration: 2.65,
    times: [0, 0.14, 0.26, 0.6, 0.72, 0.88, 1],
    repeat: Infinity,
    ease: 'easeInOut' as const,
  }
  const rest = { duration: quiet ? 0 : 0.18 }

  return (
    <svg
      data-delivery-glyph=""
      data-postal-loop={active ? 'true' : 'false'}
      width="24"
      height="24"
      viewBox="0 2 32 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: 'visible', pointerEvents: 'none', flexShrink: 0 }}
    >
      <defs>
        <clipPath id={`postal-icon-entry-${uid}`}>
          <rect x="0" y="10" width="18.2" height="14" />
        </clipPath>
      </defs>
      <motion.g
        initial={false}
        animate={{ opacity: active || checked ? 0 : 1, scale: active ? 0.85 : 1 }}
        transition={rest}
        style={{ transformOrigin: '16px 16px' }}
      >
        <g transform="translate(0 -3)">
          <rect x="5" y="12" width="22" height="14" rx="3" />
          <motion.path
            d="M11 10V7h10v3M14 9h4"
            initial={false}
            animate={{ y: filled ? 0 : 3, opacity: filled ? 1 : 0 }}
            transition={{ duration: quiet ? 0 : 0.24 }}
          />
          <motion.path
            initial={false}
            animate={{ d: ready ? 'M6 13l10 4 10-4' : 'M6 13l10 7 10-7' }}
            transition={{ duration: quiet ? 0 : 0.25 }}
          />
        </g>
      </motion.g>
      <motion.g initial={false} animate={{ opacity: active ? 1 : 0 }} transition={rest}>
        <path
          d="M18 21h12v-9a4.5 4.5 0 0 0-4.5-4.5H22a4 4 0 0 0-4 4.5M22 7.5c2.5 0 4 1.8 4 4.5v9M24 21v6M21 27h6"
          strokeOpacity="1"
        />
        <motion.path
          d="M27 17V5h4v4h-4"
          initial={false}
          animate={{ rotate: active ? [-65, -65, -65, -65, 0, 0, -65] : -65 }}
          transition={active ? loop : rest}
          style={{ transformOrigin: '27px 17px' }}
        />
        <g clipPath={`url(#postal-icon-entry-${uid})`}>
          <motion.g
            initial={false}
            animate={{
              x: active ? [0, 0, 1, 18, 18, 18, 0] : 0,
              opacity: active ? [0, 1, 1, 1, 0, 0, 0] : 0,
            }}
            transition={active ? loop : rest}
          >
            <rect x="1" y="13.5" width="10" height="7" rx="1.2" />
            <path d="m2 14.5 4 3 4-3" strokeWidth="1.4" />
          </motion.g>
        </g>
        <motion.path
          initial={false}
          animate={{
            d: active
              ? [
                  'M18 12L18 21',
                  'M10 23L18 21',
                  'M10 23L18 21',
                  'M10 23L18 21',
                  'M18 12L18 21',
                  'M18 12L18 21',
                  'M18 12L18 21',
                ]
              : 'M18 12L18 21',
          }}
          transition={active ? loop : rest}
        />
      </motion.g>
      <motion.path
        d="m8 16 5 5L25 9"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ duration: quiet ? 0 : 0.3 }}
      />
    </svg>
  )
}

/* ───────────────────────── WaxSeal & VectorWaxSeal ───────────────────────── */

function VectorWaxSeal({
  color,
  imageSrc,
  size,
}: {
  color: string
  imageSrc?: string
  size: number
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const id = (name: string) => `wax-refined-${uid}-${name}`
  const url = (name: string) => `url(#${id(name)})`
  const diameter = Number.isFinite(size) ? Math.max(1, size) : 64
  const wax = color || '#A82B32'
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: diameter,
    height: diameter,
    flexShrink: 0,
    verticalAlign: 'middle',
    pointerEvents: 'none',
    userSelect: 'none',
  }
  if (imageSrc?.trim()) {
    return (
      <span aria-hidden="true" style={style}>
        <img
          src={imageSrc}
          alt=""
          draggable={false}
          decoding="async"
          width={diameter}
          height={diameter}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </span>
    )
  }

  const edge =
    'M48.2 6.2 C56.4 4.4 62.1 8.2 69.4 9.7 C78.2 11.5 82.3 18.2 85.3 25.1 C90.3 30.3 91.7 36.5 91.2 43.3 C94.2 51.4 91.7 58.3 88.7 64.4 C87.6 73.2 81.6 78.6 74.7 82.7 C69.7 88.9 62.4 90.2 55.4 89.8 C47.7 93.2 41.2 90.3 34.4 88.2 C25.5 87.3 20.3 81.8 17.2 75 C10.1 69.7 9.1 61.7 9.6 54.6 C6.2 47.2 8.9 40.5 11.1 34.3 C11.6 25.6 17.3 20.1 23.6 16.7 C29.3 9.4 37.6 7.9 43.3 8.1 C45.2 7.4 46.3 6.7 48.2 6.2Z'
  const well =
    'M49.3 16.2 C67.8 15.2 81.6 29.1 81.7 47.7 C82.4 66.3 69.4 80.5 50.4 80.9 C31.2 81.5 17.6 68 17.3 49.5 C16.7 31 30.4 17 49.3 16.2Z'
  const sprig = 'M36.9 68.8 C39.9 56.7 48.2 40.7 60.6 28.9'
  const leaves =
    'M41.2 59.4 C34.3 59.5 30.7 54.2 31.9 47.3 C38.5 47.7 42.3 52.4 41.2 59.4Z M45.3 53.9 C51.7 46.3 57.2 45.1 63.9 46.7 C61.5 53.6 54.5 57.4 45.3 53.9Z M49.2 43.5 C41.8 42.5 38.1 36.7 39.6 30.1 C46.2 30.4 50.4 35.6 49.2 43.5Z M54.4 37.1 C57.2 29.8 62.3 26.9 68.1 28.1 C67.5 34.3 62.1 39 54.4 37.1Z'

  return (
    <span aria-hidden="true" style={style}>
      <svg
        width={diameter}
        height={diameter}
        viewBox="0 0 100 100"
        fill="none"
        focusable="false"
        style={{ display: 'block', overflow: 'visible', pointerEvents: 'none' }}
      >
        <defs>
          <radialGradient id={id('surface')} cx="25%" cy="15%" r="95%">
            <stop stopColor="#F3D7CE" stopOpacity=".14" />
            <stop offset=".42" stopColor="#F3D7CE" stopOpacity=".025" />
            <stop offset=".74" stopColor="#17070B" stopOpacity=".035" />
            <stop offset="1" stopColor="#17070B" stopOpacity=".23" />
          </radialGradient>
          <linearGradient id={id('edge')} x1="13%" y1="4%" x2="78%" y2="98%">
            <stop stopColor="#E9BEB3" stopOpacity=".24" />
            <stop offset=".44" stopColor="#E9BEB3" stopOpacity=".035" />
            <stop offset=".7" stopColor="#1B060A" stopOpacity=".09" />
            <stop offset="1" stopColor="#1B060A" stopOpacity=".28" />
          </linearGradient>
          <linearGradient id={id('pressed')} x1="22%" y1="0%" x2="74%" y2="100%">
            <stop stopColor="#1B060A" stopOpacity=".19" />
            <stop offset=".34" stopColor="#1B060A" stopOpacity=".045" />
            <stop offset=".75" stopColor="#F0C9BE" stopOpacity=".015" />
            <stop offset="1" stopColor="#F0C9BE" stopOpacity=".09" />
          </linearGradient>
          <linearGradient id={id('impression')} x1="12%" y1="0%" x2="77%" y2="100%">
            <stop stopColor="#23070C" stopOpacity=".26" />
            <stop offset=".65" stopColor="#23070C" stopOpacity=".12" />
            <stop offset="1" stopColor="#23070C" stopOpacity=".075" />
          </linearGradient>
        </defs>
        <path d={edge} transform="translate(.2 2.8)" fill="#190A0D" fillOpacity=".09" />
        <path d={edge} transform="translate(0 1.5)" fill={wax} />
        <path d={edge} transform="translate(0 1.5)" fill="#1B060A" fillOpacity=".23" />
        <path d={edge} fill={wax} />
        <path d={edge} fill={url('surface')} />
        <path d={edge} stroke={url('edge')} strokeWidth="1.2" />
        <path d={well} transform="translate(.1 .75)" stroke="#F0C9BE" strokeOpacity=".1" strokeWidth="2.2" />
        <path d={well} fill={wax} />
        <path d={well} fill={url('pressed')} stroke="#24080E" strokeOpacity=".14" strokeWidth="1.7" />
        <path
          d="M20 47 C20.3 31.6 32.7 19 48.8 18.9 C60.1 18.2 69.5 22.6 75.7 30.7"
          stroke="#21070C"
          strokeOpacity=".09"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M26.6 71.7 C38.7 82.1 58.6 82 71.4 70.6"
          stroke="#EDC4B9"
          strokeOpacity=".14"
          strokeWidth=".9"
          strokeLinecap="round"
        />
        <g transform="translate(.4 .65)">
          <path d={leaves} fill="#EDC4B9" fillOpacity=".12" />
          <path d={sprig} stroke="#EDC4B9" strokeOpacity=".13" strokeWidth="1.65" strokeLinecap="round" />
        </g>
        <path d={leaves} fill={wax} />
        <path d={leaves} fill={url('impression')} />
        <path d={sprig} stroke="#25090F" strokeOpacity=".27" strokeWidth="1.65" strokeLinecap="round" />
        <path
          d="M35.2 51.3 L40.2 57.5 M48.1 53.2 L59.2 48.7 M42.4 33.8 L47.9 41.7 M57.1 35.7 L65 30.9"
          stroke="#25090F"
          strokeOpacity=".1"
          strokeWidth=".7"
          strokeLinecap="round"
        />
        <path
          d="M15.2 32.6 C17.8 23.6 24.5 17.6 31.8 14.9 M72.4 78.9 C79 74.7 83.7 68.9 85.3 62.5"
          stroke="#E8BEB2"
          strokeOpacity=".095"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function WaxSeal({
  color,
  imageSrc,
  size,
}: {
  color: string
  imageSrc?: string
  size: number
}) {
  const id = useId().replace(/:/g, '')
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (imageSrc) return
    let live = true
    const texture = new window.Image()
    texture.onload = () => {
      if (live) setLoaded(true)
    }
    texture.src = WAX_TEXTURE
    return () => {
      live = false
      texture.onload = null
    }
  }, [imageSrc])

  if (imageSrc || !loaded) {
    return <VectorWaxSeal color={color} imageSrc={imageSrc} size={size} />
  }
  const tone = parseRgb(color || '#A82B32')
  const channel = (value: number) => Math.max(0, Math.min(1, value / 255))
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        display: 'block',
        overflow: 'visible',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: Math.max(0, Math.min(1, tone.a)),
      }}
    >
      <defs>
        <filter
          id={`wax-tone-${id}`}
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="1" exponent=".58" offset="0" />
            <feFuncG type="gamma" amplitude="1" exponent=".58" offset="0" />
            <feFuncB type="gamma" amplitude="1" exponent=".58" offset="0" />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues={`0 ${channel(tone.r)} 1`} />
            <feFuncG type="table" tableValues={`0 ${channel(tone.g)} 1`} />
            <feFuncB type="table" tableValues={`0 ${channel(tone.b)} 1`} />
          </feComponentTransfer>
        </filter>
      </defs>
      <image
        href={WAX_TEXTURE}
        x="0"
        y="0"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid meet"
        filter={`url(#wax-tone-${id})`}
      />
    </svg>
  )
}

/* ───────────────────────── MailboxArtwork ───────────────────────── */

function MailboxArtwork({
  progress,
  color,
  flagColor,
  layer,
}: {
  progress: MotionValue<number>
  color: string
  flagColor: string
  layer: 'back' | 'front'
}) {
  const id = useId().replace(/:/g, '')
  const ease = (v: number) => {
    const t = Math.max(0, Math.min(1, v))
    return t * t * (3 - 2 * t)
  }
  const angle = (p: number) =>
    ((Math.PI / 180) * 96 * ease((p - 0.64) / 0.095)) * (1 - ease((p - 0.875) / 0.07))
  const point = (u: number, v: number, theta: number) => {
    const depth = -(160 - v) * Math.sin(theta)
    return `${270 + 0.9 * u + depth * 0.62},${95 + 0.16 * u + 160 + (v - 160) * Math.cos(theta) - depth * 0.35}`
  }
  const face = (theta: number, inset = 0) => {
    const k = 33.14
    const left = inset
    const right = 120 - inset
    const top = inset
    const mid = 60
    const bottom = 160 - inset
    const r = 60 - inset
    return `M${point(left, bottom, theta)} L${point(left, 60, theta)} C${point(left, 60 - k * (r / 60), theta)} ${point(mid - k * (r / 60), top, theta)} ${point(mid, top, theta)} C${point(mid + k * (r / 60), top, theta)} ${point(right, 60 - k * (r / 60), theta)} ${point(right, 60, theta)} L${point(right, bottom, theta)} Z`
  }

  const door = useTransform(progress, (p) => face(angle(p)))
  const doorInset = useTransform(progress, (p) => face(angle(p), 5))
  const doorHighlight = useTransform(progress, (p) => {
    const a = angle(p)
    return `M${point(9, 149, a)} L${point(9, 60, a)} C${point(9, 33, a)} ${point(32, 9, a)} ${point(60, 9, a)}`
  })
  const doorShade = useTransform(progress, (p) => 0.09 + 0.21 * Math.sin(angle(p)))
  const latch = useTransform(progress, (p) => {
    const a = angle(p)
    return `M${point(50, 18, a)} L${point(70, 18, a)} L${point(70, 27, a)} L${point(50, 27, a)} Z`
  })
  const latchEdge = useTransform(progress, (p) => {
    const a = angle(p)
    return `M${point(52, 19, a)} L${point(68, 19, a)}`
  })

  const flagPoint = (x: number, y: number, p: number) => {
    const a = ((-76 * (1 - ease((p - 0.945) / 0.04))) * Math.PI) / 180
    return `${470 + (x - 470) * Math.cos(a) - (y - 189) * Math.sin(a)},${189 + (x - 470) * Math.sin(a) + (y - 189) * Math.cos(a)}`
  }
  const flagPath = (points: number[][], p: number, close = false) =>
    points.map(([x, y], i) => `${i ? 'L' : 'M'}${flagPoint(x, y, p)}`).join(' ') +
    (close ? ' Z' : '')

  const flag = useTransform(progress, (p) =>
    flagPath(
      [
        [467, 190],
        [467, 116],
        [470, 113],
        [493, 107],
        [495, 109],
        [495, 128],
        [473, 133.5],
        [473, 190],
      ],
      p,
      true,
    ),
  )
  const flagHighlight = useTransform(progress, (p) =>
    flagPath(
      [
        [470, 188],
        [470, 117],
        [492, 111],
      ],
      p,
    ),
  )
  const flagEdge = useTransform(progress, (p) =>
    flagPath(
      [
        [473, 134],
        [492.5, 129],
      ],
      p,
    ),
  )

  const url = (name: string) => `url(#${id}-${name})`
  const doorArtwork = (
    <>
      <motion.path d={door} fill={color} stroke="#14221B" strokeWidth="1.7" strokeLinejoin="round" />
      <motion.path d={door} fill={url('door')} />
      <motion.path d={door} fill="#07120C" style={{ opacity: doorShade }} />
      <motion.path d={doorInset} fill="none" stroke="white" strokeOpacity=".13" strokeWidth=".8" />
      <motion.path
        d={doorHighlight}
        fill="none"
        stroke="white"
        strokeOpacity=".19"
        strokeWidth=".8"
        strokeLinecap="round"
      />
      <motion.path
        d={latch}
        fill={url('brass')}
        stroke="#6B593A"
        strokeWidth=".8"
        strokeLinejoin="round"
      />
      <motion.path d={latchEdge} fill="none" stroke="#F2E3BD" strokeWidth=".7" strokeLinecap="round" />
    </>
  )

  return (
    <svg
      viewBox="0 0 600 400"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      style={{
        overflow: 'visible',
        pointerEvents: 'none',
        userSelect: 'none',
        position: 'absolute',
        inset: 0,
      }}
    >
      <defs>
        <linearGradient id={`${id}-roof`} x1="341" y1="84" x2="454" y2="216" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity=".23" />
          <stop offset=".34" stopColor="white" stopOpacity=".10" />
          <stop offset=".69" stopColor="black" stopOpacity=".03" />
          <stop offset="1" stopColor="black" stopOpacity=".24" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="370" y1="163" x2="492" y2="268" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity=".03" />
          <stop offset="1" stopColor="black" stopOpacity=".31" />
        </linearGradient>
        <linearGradient id={`${id}-inside`} x1="276" y1="167" x2="401" y2="231" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0C1413" />
          <stop offset=".55" stopColor="#111D1A" />
          <stop offset="1" stopColor="#263631" />
        </linearGradient>
        <linearGradient id={`${id}-door`} x1="242" y1="104" x2="313" y2="321" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity=".18" />
          <stop offset=".48" stopColor="white" stopOpacity=".025" />
          <stop offset="1" stopColor="black" stopOpacity=".21" />
        </linearGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#E6D5A4" />
          <stop offset=".46" stopColor="#B79B60" />
          <stop offset="1" stopColor="#806B44" />
        </linearGradient>
        <linearGradient id={`${id}-post`} x1="411" y1="270" x2="438" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#958B77" />
          <stop offset=".36" stopColor="#A69B85" />
          <stop offset="1" stopColor="#756D5D" />
        </linearGradient>
        <radialGradient id={`${id}-ground`}>
          <stop stopColor="#17241F" stopOpacity=".20" />
          <stop offset=".5" stopColor="#17241F" stopOpacity=".075" />
          <stop offset="1" stopColor="#17241F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {layer === 'back' ? (
        <>
          <ellipse cx="414" cy="357" rx="132" ry="23" fill={url('ground')} />
          <path d="M411 245 L430 240 L445 249 L426 255 Z" fill="#B0A38B" />
          <path d="M411 245 L426 251 L426 352 L411 346 Z" fill={url('post')} />
          <path d="M426 251 L442 247 L442 347 L426 352 Z" fill="#716A5A" />
          <path d="M415 269 L415 339 M422 286 L422 346" stroke="#554F43" strokeOpacity=".15" strokeWidth="1" />
          <path d="M387 261 L446 245 L469 250 L412 267 Z" fill="#26352F" />
          <path d="M412 267 L469 250 L469 256 L412 272 Z" fill="#16221D" />
          <path d="M387 261 L412 267 L412 272 L387 266 Z" fill="#43534A" />
          <path
            d="M270 155 L425 115 C425 81.86 449.174 59.298 479 64.6 L324 104.6 C294.174 99.298 270 121.86 270 155 Z"
            fill={color}
          />
          <path
            d="M270 155 L425 115 C425 81.86 449.174 59.298 479 64.6 L324 104.6 C294.174 99.298 270 121.86 270 155 Z"
            fill={url('roof')}
          />
          <path
            d="M270 255 L270 155 C270 121.86 294.174 99.298 324 104.6 C353.826 109.902 378 141.06 378 174.2 L378 274.2 Z"
            fill={url('inside')}
          />
          <path d="M274 253 L371 269 L506 234 L410 217 Z" fill="#314238" />
          <path
            d="M280 251 L368 267 L501 233"
            fill="none"
            stroke="#526255"
            strokeWidth="1"
            strokeOpacity=".55"
          />
          <path
            d="M283 155 C283 129 302 113 324 117 C346 121 365 146 365 173"
            fill="none"
            stroke="#526557"
            strokeWidth="1.2"
            strokeOpacity=".15"
          />
          <path
            d="M270 255 L270 155 C270 121.86 294.174 99.298 324 104.6"
            fill="none"
            stroke="#15241D"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M270 254 L270 155 C270 121.86 294.174 99.298 324 104.6"
            fill="none"
            stroke={color}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M271 152 C272 120 295 100.3 324 105.6"
            fill="none"
            stroke="white"
            strokeWidth=".85"
            strokeOpacity=".27"
          />
        </>
      ) : (
        <>
          <path
            d="M324 104.6 L479 64.6 C508.826 69.902 533 101.06 533 134.2 L378 174.2 C378 141.06 353.826 109.902 324 104.6 Z"
            fill={color}
          />
          <path
            d="M324 104.6 L479 64.6 C508.826 69.902 533 101.06 533 134.2 L378 174.2 C378 141.06 353.826 109.902 324 104.6 Z"
            fill={url('roof')}
          />
          <path d="M378 174.2 L533 134.2 L533 234.2 L378 274.2 Z" fill={color} />
          <path d="M378 174.2 L533 134.2 L533 234.2 L378 274.2 Z" fill={url('side')} />
          <path
            d="M529 133.4 L529 230.8 L381 269.1"
            fill="none"
            stroke="#070C0A"
            strokeWidth="1.1"
            strokeOpacity=".27"
          />
          <path d="M378 270.3 L533 230.3" fill="none" stroke="white" strokeWidth="1" strokeOpacity=".13" />
          <path d="M331 104 L482 65.2" fill="none" stroke="white" strokeWidth="1" strokeOpacity=".20" />
          <path
            d="M324 104.6 C353.826 109.902 378 141.06 378 174.2 L378 274.2 L270 255"
            fill="none"
            stroke="#15241D"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M324 104.6 C353.826 109.902 378 141.06 378 174.2 L378 273"
            fill="none"
            stroke={color}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M324 105.6 C352.5 110.7 376.7 142 377 172"
            fill="none"
            stroke="white"
            strokeWidth=".85"
            strokeOpacity=".27"
          />
          {doorArtwork}
          <path
            d="M283.5 257.4 L305.5 261.3 M341.5 267.7 L363.5 271.6"
            stroke="#17261D"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M283.5 256.8 L305.5 260.7 M341.5 267.1 L363.5 271"
            stroke="#6D7A6D"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g>
            <motion.path
              d={flag}
              fill={flagColor}
              stroke="#612623"
              strokeWidth=".8"
              strokeLinejoin="round"
            />
            <motion.path
              d={flagHighlight}
              fill="none"
              stroke="white"
              strokeOpacity=".22"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            <motion.path
              d={flagEdge}
              fill="none"
              stroke="black"
              strokeOpacity=".12"
              strokeWidth=".7"
            />
          </g>
          <ellipse cx="470" cy="189" rx="5" ry="5.3" fill="#17281D" />
          <ellipse cx="470" cy="189" rx="3.1" ry="3.3" fill={url('brass')} />
          <path d="M468.7 189.7 L471.3 188.3" stroke="#796640" strokeWidth=".8" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

/* ───────────────────────── Envelope 3D Stage ───────────────────────── */

interface Bounds {
  left: number
  top: number
  width: number
  height: number
  radius: number
  shadow: string
  border: string
}

interface SceneConfig {
  duration: number
  flight: number
  paper: string
  seal: string
  sealImageSrc?: string
  sealSize: number
  mailbox: string
}

function Envelope({
  progress: p,
  bounds: b,
  config: c,
}: {
  progress: MotionValue<number>
  bounds: Bounds
  config: SceneConfig
}) {
  const uid = useId().replace(/:/g, '')
  const leftGradient = `postal-left-${uid}`
  const rightGradient = `postal-right-${uid}`
  const topGradient = `postal-top-${uid}`
  const pocketGradient = `postal-pocket-${uid}`

  const paperTransform = useTransform(p, (v) => {
    if (v <= 0.46) {
      const q = pose(v, b.width)
      return `translate3d(0,${q.y}px,0) rotate(${q.rotate}deg) scale(${q.scale}) perspective(1200px) rotateX(${q.rx}deg)`
    }
    const t = smooth(range(v, 0.49, 0.6))
    const unit = b.width / 600
    const depth = mix(v, [0.735, 0.875], [-225, 90])
    const h = Math.min(b.width * 0.54, 250)
    const a = lerp(0.62 * Math.cos(-Math.PI / 90), 0.15, t)
    const bb = lerp(0.62 * Math.sin(-Math.PI / 90), 16 / 600, t)
    const cc = lerp(-0.62 * Math.sin(-Math.PI / 90), (-100 * unit) / h, t)
    const d = lerp(0.62 * Math.cos(-Math.PI / 90), (((100 * 40) / 155) * unit) / h, t)
    const lift = 48 - 36 * smooth(range(depth, 20, 90))
    return `matrix(${a},${bb},${cc},${d},${t * (24 + depth) * unit},${t * (64.6 - lift - (depth * 40) / 155) * unit})`
  })

  const height = useTransform(p, (v) =>
    mix(v, [0, 0.1, 0.32], [b.height, b.height, Math.min(b.width * 0.54, 250)]),
  )
  const marginTop = useTransform(height, (v) => -v / 2)
  const faceOpacity = useTransform(p, [0, 0.1, 0.2, 1], [0, 0, 1, 1])
  const cardOpacity = useTransform(p, [0, 0.08, 0.18, 0.95, 0.965, 1], [0, 0, 1, 1, 0, 0])
  const leftPath = useTransform(p, (v) => postalSideFold(mix(v, [0, 0.13, 0.27], [110, 110, 0]), false))
  const rightPath = useTransform(p, (v) =>
    postalSideFold(mix(v, [0, 0.16, 0.3], [-110, -110, 0]), true),
  )
  const topPath = useTransform(p, (v) => postalTopFold(mix(v, [0, 0.23, 0.4], [178, 178, 0], soft)))
  const topShade = useTransform(p, (v) => mix(v, [0, 0.23, 0.31, 0.4], [0.025, 0.025, 0.13, 0.025]))
  const sealScale = useTransform(p, (v) =>
    mix(v, [0, 0.35, 0.405, 0.426, 0.46], [1.035, 1.035, 1, 0.985, 1], soft),
  )
  const sealOpacity = useTransform(p, (v) => mix(v, [0, 0.35, 0.401, 1], [0, 0, 1, 1], soft))
  const sealY = useTransform(p, (v) =>
    mix(v, [0, 0.35, 0.405, 0.426, 0.46], [-9, -9, 0, 0.65, 0], soft),
  )
  const paperShadow = useTransform(p, (v) =>
    v < 0.32
      ? b.shadow
      : `0 ${mix(v, [0.32, 0.6, 0.78, 1], [12, 10, 5, 4])}px ${mix(v, [0.32, 0.6, 0.78, 1], [22, 18, 10, 9])}px -7px rgba(24,22,20,${0.25 * (1 - smooth(range(v, 0.49, 0.6)))}),0 1px 2px rgba(24,22,20,${0.09 * (1 - smooth(range(v, 0.49, 0.6)))})`,
  )
  const rounding = useTransform(p, (v) => mix(v, [0, 0.15, 0.33], [b.radius, b.radius, 7]))
  const radiusX = useTransform(rounding, (v) => (v / Math.max(1, b.width)) * 1000)
  const radiusY = useTransform(
    p,
    (v) =>
      (mix(v, [0, 0.15, 0.33], [b.radius, b.radius, 7]) /
        Math.max(1, mix(v, [0, 0.1, 0.32], [b.height, b.height, Math.min(b.width * 0.54, 250)]))) *
      600,
  )
  const stageOpacity = useTransform(p, (v) => 1 - smooth(range(v, 1, 1.05)))
  const stageScale = useTransform(p, (v) =>
    mix(v, [0, 0.46, 0.61], [1, 1, Math.max(0.65, Math.min(1.05, c.flight))]),
  )
  const mailboxOpacity = useTransform(p, (v) => smooth(range(v, 0.58, 0.64)))
  const mailboxX = useTransform(p, (v) => mix(v, [0.58, 0.64], [16, 0]))
  const mailboxY = useTransform(p, (v) => mix(v, [0.58, 0.64], [5, 0]))
  const interiorDepth = useTransform(
    p,
    (v) => `${clamp((mix(v, [0.735, 0.875], [-225, 90]) + 50) / 100) * 100}%`,
  )
  const border = 'rgba(24,22,20,.12)'

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: b.left,
        top: b.top,
        width: b.width,
        height: b.height,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'visible',
        perspective: 1200,
        zIndex: 20,
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: stageOpacity,
          scale: stageScale,
          transformOrigin: '50% 50%',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: b.height / 2 - b.width / 3,
            width: b.width,
            height: (b.width * 2) / 3,
            opacity: mailboxOpacity,
            x: mailboxX,
            y: mailboxY,
            zIndex: 0,
          }}
        >
          <MailboxArtwork progress={p} color={c.mailbox} flagColor={c.seal} layer="back" />
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            width: '100%',
            height,
            marginTop,
            transform: paperTransform,
            zIndex: 1,
            opacity: cardOpacity,
            background: c.paper,
            border: b.border,
            borderRadius: rounding,
            boxShadow: paperShadow,
            transformOrigin: '50% 50%',
            boxSizing: 'border-box',
            willChange: 'transform',
          }}
        >
          <motion.svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: faceOpacity }}
          >
            <defs>
              <linearGradient id={leftGradient} x1="0" y1="0" x2="1" y2=".5">
                <stop stopColor="#181614" stopOpacity="0" />
                <stop offset="1" stopColor="#181614" stopOpacity=".065" />
              </linearGradient>
              <linearGradient id={rightGradient} x1="1" y1="0" x2="0" y2=".5">
                <stop stopColor="#181614" stopOpacity="0" />
                <stop offset="1" stopColor="#181614" stopOpacity=".055" />
              </linearGradient>
              <linearGradient id={topGradient} x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#181614" stopOpacity="0" />
                <stop offset="1" stopColor="#181614" stopOpacity=".045" />
              </linearGradient>
              <linearGradient id={pocketGradient} x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#181614" stopOpacity=".07" />
                <stop offset=".5" stopColor="#181614" stopOpacity="0" />
                <stop offset="1" stopColor="#181614" stopOpacity=".015" />
              </linearGradient>
            </defs>
            <motion.rect width="1000" height="600" rx={radiusX} ry={radiusY} fill={c.paper} />
            <motion.rect
              width="1000"
              height="600"
              rx={radiusX}
              ry={radiusY}
              fill="#181614"
              fillOpacity=".045"
            />
            <motion.path
              d={leftPath}
              fill={c.paper}
              stroke={border}
              strokeWidth=".6"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
            <motion.path d={leftPath} fill={`url(#${leftGradient})`} />
            <motion.path
              d={rightPath}
              fill={c.paper}
              stroke={border}
              strokeWidth=".6"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
            <motion.path d={rightPath} fill={`url(#${rightGradient})`} />
            <path
              d="M0 592 L0 586 L480 259 Q500 245 520 259 L1000 586 L1000 592 Q1000 600 992 600 L8 600 Q0 600 0 592Z"
              fill={c.paper}
            />
            <path
              d="M0 592 L0 586 L480 259 Q500 245 520 259 L1000 586 L1000 592 Q1000 600 992 600 L8 600 Q0 600 0 592Z"
              fill={`url(#${pocketGradient})`}
            />
            <path
              d="M0 586 L480 259 Q500 245 520 259 L1000 586"
              fill="none"
              stroke="rgba(24,22,20,.11)"
              strokeWidth=".65"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M3 589 L482 262 Q500 249 518 262 L997 589"
              fill="none"
              stroke="rgba(255,255,255,.65)"
              strokeWidth=".65"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d={topPath}
              fill={c.paper}
              stroke="rgba(24,22,20,.14)"
              strokeWidth=".75"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
            <motion.path d={topPath} fill={`url(#${topGradient})`} />
            <motion.path d={topPath} fill="#181614" style={{ fillOpacity: topShade }} />
            <path
              d="M8 1 H992"
              stroke="rgba(255,255,255,.65)"
              strokeWidth=".7"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>

          <motion.div
            style={{
              position: 'absolute',
              left: '50%',
              top: '63%',
              marginLeft: -c.sealSize / 2,
              marginTop: -c.sealSize / 2,
              width: c.sealSize,
              height: c.sealSize,
              scale: sealScale,
              y: sealY,
              opacity: sealOpacity,
              pointerEvents: 'none',
            }}
          >
            <WaxSeal color={c.seal} imageSrc={c.sealImageSrc} size={c.sealSize} />
          </motion.div>

          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: interiorDepth,
              borderRadius: 'inherit',
              background:
                'linear-gradient(to bottom,rgba(10,18,14,.16),rgba(10,18,14,.10) 70%,transparent)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: b.height / 2 - b.width / 3,
            width: b.width,
            height: (b.width * 2) / 3,
            opacity: mailboxOpacity,
            x: mailboxX,
            y: mailboxY,
            zIndex: 2,
          }}
        >
          <MailboxArtwork progress={p} color={c.mailbox} flagColor={c.seal} layer="front" />
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ───────────────────────── PostalContactForm ───────────────────────── */

import { Magnetic } from './Magnetic'

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
}

export interface PostalContactFormProps {
  onSubmitMessage?: (data: ContactSubmission) => Promise<void> | void
  duration?: number
  paperColor?: string
  sealColor?: string
  sealSize?: number
  mailboxColor?: string
  successLabel?: string
}

export function PostalContactForm({
  onSubmitMessage,
  duration = 5.6,
  paperColor = '#f4f1ea',
  sealColor = '#A82B32',
  sealSize = 64,
  mailboxColor = '#343E3C',
  successLabel = 'Message received — talk soon ✓',
}: PostalContactFormProps) {
  const systemReduced = useReducedMotion()
  const quiet = !!systemReduced

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [completed, setCompleted] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const [scene, setScene] = useState<SceneConfig | null>(null)
  const [bounds, setBounds] = useState<Bounds>({
    left: 0,
    top: 0,
    width: 560,
    height: 440,
    radius: 12,
    shadow: '0 16px 40px -20px rgba(24,22,20,.3)',
    border: '1px solid rgba(245,245,243,0.12)',
  })

  const formRef = useRef<HTMLFormElement | null>(null)
  const boundsRef = useRef(bounds)
  const progress = useMotionValue(0)
  const animRef = useRef<{ stop: () => void } | null>(null)
  const busyRef = useRef(false)

  const filled =
    name.trim().length > 0 ||
    email.trim().length > 0 ||
    subject.trim().length > 0 ||
    message.trim().length > 0

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const ready = name.trim().length > 0 && emailValid && message.trim().length > 0

  const measure = useCallback(() => {
    const form = formRef.current
    if (!form) return
    const css = getComputedStyle(form)
    const next: Bounds = {
      left: form.offsetLeft,
      top: form.offsetTop,
      width: form.offsetWidth,
      height: form.offsetHeight,
      radius: parseFloat(css.borderTopLeftRadius) || 12,
      shadow: css.boxShadow,
      border: css.border,
    }
    boundsRef.current = next
    setBounds((old) =>
      (Object.keys(next) as (keyof Bounds)[]).every((k) => old[k] === next[k]) ? old : next,
    )
  }, [])

  useEffect(() => {
    const form = formRef.current
    if (!form) return
    measure()
    const ro = new ResizeObserver(() => {
      if (form.isConnected) measure()
    })
    ro.observe(form)
    return () => ro.disconnect()
  }, [measure])

  useEffect(() => {
    return progress.on('change', (p) => {
      const form = formRef.current
      if (!form || !busyRef.current) return
      const returning = !quiet && p >= 1.01
      if (returning) {
        setCompleted(true)
      }
      const op = returning ? soft(range(p, 1.01, 1.08)) : 1 - smooth(range(p, 0.08, 0.18))
      form.style.opacity = String(op)
      if (!quiet) {
        const q = pose(Math.min(p, 0.46), boundsRef.current.width)
        form.style.transform = returning
          ? ''
          : `translate3d(${q.x}px,${q.y}px,0) rotate(${q.rotate}deg) scale(${q.scale}) perspective(1200px) rotateX(${q.rx}deg)`
      }
    })
  }, [progress, quiet])

  const moveProgress = (to: number, seconds: number) => {
    animRef.current?.stop()
    return new Promise<boolean>((resolve) => {
      let finished = false
      const finish = (ok: boolean) => {
        if (finished) return
        finished = true
        resolve(ok)
      }
      const controls = animate(progress, to, {
        duration: Math.max(0.01, seconds),
        ease: 'linear',
        onComplete: () => finish(true),
      })
      animRef.current = {
        stop: () => {
          controls.stop()
          finish(false)
        },
      }
    })
  }

  const handleFieldChange = (setter: (v: string) => void) => (v: string) => {
    if (completed) {
      setCompleted(false)
      setStatus('idle')
    }
    setter(v)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busyRef.current || completed || !ready) return
    const form = formRef.current
    if (!form) return

    busyRef.current = true
    setStatus('pending')
    measure()

    form.style.transformOrigin = '50% 50%'
    form.style.willChange = 'transform, opacity'
    form.style.transition = 'none'

    const nextScene: SceneConfig = {
      duration: Math.max(3, duration),
      flight: 1,
      paper: paperColor,
      seal: sealColor,
      sealSize,
      mailbox: mailboxColor,
    }

    progress.set(0)
    if (!quiet) setScene(nextScene)

    // Fold form into envelope & stamp wax seal (0 -> 0.46)
    const foldPromise = moveProgress(0.46, quiet ? 0.12 : nextScene.duration * 0.34)
    const submitPromise = Promise.resolve(
      onSubmitMessage?.({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      }),
    )

    try {
      await Promise.all([foldPromise, submitPromise])
    } catch {
      await moveProgress(0, 0.35)
      form.style.opacity = '1'
      form.style.transform = ''
      form.style.willChange = ''
      setScene(null)
      setStatus('error')
      busyRef.current = false
      return
    }

    // Fly sealed letter into 3D mailbox & raise flag (0.46 -> 1.0)
    await moveProgress(quiet ? 0 : 1, quiet ? 0.15 : nextScene.duration * 0.66)
    if (!quiet) {
      await moveProgress(1.08, 0.7)
    }

    form.style.opacity = '1'
    form.style.transform = ''
    form.style.willChange = ''
    setScene(null)
    setCompleted(true)
    setStatus('success')
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    busyRef.current = false
  }

  const activeHover = (engaged || status === 'pending') && !quiet && !completed

  return (
    <div className="postal-stage">
      <form
        ref={formRef}
        className="contact__form"
        onSubmit={handleSubmit}
        aria-busy={status === 'pending'}
      >
        <div className="contact__field-row">
          <label className="contact__field">
            <span className="mono muted">
              (01) Your Name <span className="contact__req">*</span>
            </span>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => handleFieldChange(setName)(e.target.value)}
              disabled={status === 'pending'}
              autoComplete="name"
            />
          </label>

          <label className="contact__field">
            <span className="mono muted">
              (02) Your Email <span className="contact__req">*</span>
            </span>
            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => handleFieldChange(setEmail)(e.target.value)}
              disabled={status === 'pending'}
              autoComplete="email"
            />
          </label>
        </div>

        <label className="contact__field">
          <span className="mono muted">(03) Subject</span>
          <input
            type="text"
            name="subject"
            placeholder="Project inquiry, collaboration, etc."
            value={subject}
            onChange={(e) => handleFieldChange(setSubject)(e.target.value)}
            disabled={status === 'pending'}
          />
        </label>

        <label className="contact__field">
          <span className="mono muted">
            (04) Message <span className="contact__req">*</span>
          </span>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tell me about your project, timeline, or idea..."
            value={message}
            onChange={(e) => handleFieldChange(setMessage)(e.target.value)}
            disabled={status === 'pending'}
          />
        </label>

        <div className="contact__form-footer">
          <p className="mono muted" aria-live="polite">
            {status === 'pending'
              ? 'Sealing & delivering your message...'
              : completed
                ? successLabel
                : status === 'error'
                  ? 'Could not send — please try again'
                  : 'Fields marked with * are required'}
          </p>

          <Magnetic strength={0.25}>
            <button
              type="submit"
              className="contact__submit mono"
              disabled={status === 'pending'}
              data-cursor="Send"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'touch') setEngaged(true)
              }}
              onPointerLeave={() => setEngaged(false)}
              onFocus={() => setEngaged(true)}
              onBlur={() => setEngaged(false)}
            >
              <span>
                {status === 'pending'
                  ? 'Sending…'
                  : completed
                    ? 'Sent ✓'
                    : 'Send message'}
              </span>
              <PostalButtonIcon
                active={activeHover}
                quiet={quiet}
                filled={filled}
                ready={ready}
                checked={completed}
              />
            </button>
          </Magnetic>
        </div>

        {/* Preload wax texture */}
        <img
          src={WAX_TEXTURE}
          alt=""
          width="1"
          height="1"
          draggable={false}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />
      </form>

      {scene && <Envelope progress={progress} bounds={bounds} config={scene} />}
    </div>
  )
}
