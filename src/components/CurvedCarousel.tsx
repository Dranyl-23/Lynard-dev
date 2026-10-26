// @ts-nocheck
/* oxlint-disable */
import React, { useRef, useEffect, useState, useMemo, useCallback, useId } from 'react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi'

export interface CurvedCarouselItem {
  title: string
  issuer: string
  year: string
  image: string
  aspect?: number
}

export interface CurvedCarouselProps {
  items: CurvedCarouselItem[]
  curve?: number // default 0.42
  autoplay?: boolean // default true
  speed?: number // px/s, default 36
  direction?: 'Left' | 'Right'
  cardWidth?: number // default 420
  cardHeight?: number // default 280
  gap?: number // default 30
  radius?: number // default 16
  momentum?: number // default 0.92
  paper?: string // default '#0c0c0c'
  cardBorder?: string // default 'rgba(255, 255, 255, 0.12)'
  captionColor?: string // default '#ffffff'
  captionSize?: number // default 15
  captionWeight?: number // default 500
  numberSize?: number // default 12
  captionPadding?: number // default 16
  captionFade?: number // default 0.75
  className?: string
  style?: React.CSSProperties
  onSelect?: (item: CurvedCarouselItem, index: number) => void
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const modulo = (v: number, total: number) => ((v % total) + total) % total

function outline(ctx: CanvasRenderingContext2D, x: number, w: number, h: number, radius: number) {
  const r = clamp(radius, 0, Math.min(w, h) / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, 0)
  ctx.lineTo(x + w - r, 0)
  ctx.quadraticCurveTo(x + w, 0, x + w, r)
  ctx.lineTo(x + w, h - r)
  ctx.quadraticCurveTo(x + w, h, x + w - r, h)
  ctx.lineTo(x + r, h)
  ctx.quadraticCurveTo(x, h, x, h - r)
  ctx.lineTo(x, r)
  ctx.quadraticCurveTo(x, 0, x + r, 0)
  ctx.closePath()
}

export default function CurvedCarousel({
  items = [],
  curve = 0.42,
  autoplay = true,
  speed: initialSpeed = 36,
  direction: initialDirection = 'Left',
  cardWidth = 420,
  cardHeight = 280,
  gap = 30,
  radius = 16,
  momentum = 0.92,
  paper = '#0c0c0c',
  cardBorder = 'rgba(255, 255, 255, 0.14)',
  captionColor = '#ffffff',
  captionSize = 15,
  captionWeight = 500,
  numberSize = 12,
  captionPadding = 16,
  captionFade = 0.78,
  className = '',
  style,
  onSelect,
}: CurvedCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textureRef = useRef<{ image: HTMLCanvasElement; scale: number; width: number; height: number } | null>(null)
  const drawingRef = useRef<() => void>(() => {})

  const motionRef = useRef({
    offset: 0,
    velocity: 0,
    pointer: -1,
    startX: 0,
    startY: 0,
    x: 0,
    time: 0,
    resume: 0,
    hasMoved: false,
  })

  const [size, setSize] = useState({ width: 1200, height: 480 })
  const [ready, setReady] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [paused, setPaused] = useState(!autoplay)
  const [direction, setDirection] = useState<'Left' | 'Right'>(initialDirection)
  const [speed, setSpeed] = useState(initialSpeed)
  const [inView, setInView] = useState(true)
  const [activeCenterIndex, setActiveCenterIndex] = useState(0)

  const instructionsId = useId()

  // Responsive card scaling
  const scale = Math.min(
    1,
    Math.max(160, size.width * 0.44) / Math.max(1, cardWidth),
    Math.max(140, size.height - 130) / Math.max(1, cardHeight)
  )
  const w = Math.max(180, Math.round(cardWidth * scale))
  const h = Math.max(120, Math.round(cardHeight * scale))
  const pitch = w + Math.max(12, Math.round(gap * scale))
  const total = Math.max(1, items.length * pitch)
  const inset = Math.max(8, captionPadding)
  const fadeHeight = Math.max(80, inset + captionSize + numberSize + 24)

  // 1. Precalculate the geometric panoramic projection curve
  const projection = useMemo(() => {
    const columns = Math.ceil(size.width)
    const rows = new Float64Array(columns * 4)
    const half = Math.max(260, size.width / 2)
    const bend = clamp(curve, 0, 1.5)
    const perspective = Math.max(900, size.width * 1.15)
    const lift = Math.min(bend * 110, Math.max(0, (size.height - h) / 2 + 14))
    const arc = (x: number) => x * (1 + bend * 0.2 * Math.pow(x / half, 2))

    for (let column = 0; column < columns; column++) {
      const x = column - size.width / 2
      const normal = (x + 0.5) / half
      const projected = perspective / (perspective + bend * 210 * normal * normal)
      const i = column * 4
      rows[i] = arc(x) + w / 2
      rows[i + 1] = arc(x + 1) - arc(x)
      rows[i + 2] = size.height / 2 - lift * normal * normal - h * 0.5 * projected
      rows[i + 3] = h * projected
    }
    return rows
  }, [size.width, size.height, w, h, curve])

  // 2. High-performance frame draw function: Slices atlas into vertical strips along curved lens
  drawingRef.current = () => {
    const surface = canvasRef.current
    const atlas = textureRef.current
    if (!surface || !atlas || !projection.length) return

    const ctx = surface.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const pw = Math.max(1, Math.round(size.width * dpr))
    const ph = Math.max(1, Math.round(size.height * dpr))
    if (surface.width !== pw) surface.width = pw
    if (surface.height !== ph) surface.height = ph

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size.width, size.height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    const columns = Math.ceil(size.width)
    for (let x = 0, i = 0; x < columns; x++, i += 4) {
      const source = modulo(projection[i] - motionRef.current.offset, atlas.width)
      const span = projection[i + 1]
      const first = Math.min(span, atlas.width - source)
      const destination = first / span

      ctx.drawImage(
        atlas.image,
        source * atlas.scale,
        0,
        first * atlas.scale,
        atlas.image.height,
        x,
        projection[i + 2],
        destination + 0.12,
        projection[i + 3]
      )

      if (first < span) {
        ctx.drawImage(
          atlas.image,
          0,
          0,
          (span - first) * atlas.scale,
          atlas.image.height,
          x + destination,
          projection[i + 2],
          1 - destination + 0.12,
          projection[i + 3]
        )
      }
    }

    // Determine front-center card
    const centerCol = Math.floor(columns / 2)
    const centerI = centerCol * 4
    if (centerI < projection.length) {
      const centerSource = modulo(projection[centerI] - motionRef.current.offset, atlas.width)
      const centerIdx = modulo(Math.floor(centerSource / pitch), items.length)
      if (centerIdx !== activeCenterIndex) {
        setActiveCenterIndex(centerIdx)
      }
    }
  }

  // 3. Build Card Atlas on offscreen canvas
  useEffect(() => {
    const host = rootRef.current
    if (!host || !items.length) return

    let cancelled = false
    let repaint = 0

    const density = Math.min(2, 8192 / Math.max(1, total), 2048 / Math.max(1, h))
    const atlas = document.createElement('canvas')
    atlas.width = Math.max(1, Math.round(total * density))
    atlas.height = Math.max(1, Math.round(h * density))

    const ctx = atlas.getContext('2d')
    if (!ctx) return

    const fontFace = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

    const paint = (loadedImages: (HTMLImageElement | null)[]) => {
      if (cancelled) return
      ctx.setTransform(density, 0, 0, density, 0, 0)
      ctx.clearRect(0, 0, total, h)

      items.forEach((slide, index) => {
        const x = index * pitch
        ctx.save()

        // Card clip rounded rectangle
        outline(ctx, x, w, h, radius)
        ctx.clip()

        // Card dark fill
        ctx.fillStyle = paper
        ctx.fillRect(x, 0, w, h)

        // Draw Certificate Image
        const img = loadedImages[index]
        if (img && img.naturalWidth > 0) {
          // Inner frame padding to look like a framed document
          const pad = 12
          const targetW = w - pad * 2
          const targetH = h - pad * 2

          // Contain aspect ratio to display full certificate cleanly
          const imgAspect = img.naturalWidth / img.naturalHeight
          const frameAspect = targetW / targetH
          let dw = targetW
          let dh = targetH
          let dx = x + pad
          let dy = pad

          if (imgAspect > frameAspect) {
            dh = targetW / imgAspect
            dy = pad + (targetH - dh) / 2
          } else {
            dw = targetH * imgAspect
            dx = x + pad + (targetW - dw) / 2
          }

          // Subtle inner document shadow
          ctx.fillStyle = '#050505'
          ctx.fillRect(dx - 1, dy - 1, dw + 2, dh + 2)

          ctx.drawImage(img, dx, dy, dw, dh)
        }

        // Bottom gradient shade for text legibility
        const fade = ctx.createLinearGradient(0, h - fadeHeight, 0, h)
        fade.addColorStop(0, 'rgba(0, 0, 0, 0)')
        fade.addColorStop(0.4, 'rgba(0, 0, 0, 0.45)')
        fade.addColorStop(1, 'rgba(0, 0, 0, 0.88)')
        ctx.fillStyle = fade
        ctx.fillRect(x, h - fadeHeight, w, fadeHeight)

        // Title text
        ctx.fillStyle = captionColor
        ctx.textBaseline = 'alphabetic'
        ctx.font = `${captionWeight} ${Math.round(captionSize * scale)}px ${fontFace}`
        ctx.textAlign = 'left'

        const allowance = w - inset * 2 - 40
        const titleStr = slide.title || 'Certificate'
        let label = titleStr
        while (label.length > 1 && ctx.measureText(label).width > allowance) {
          label = label.slice(0, -1)
        }
        if (label !== titleStr) label += '...'

        const textY = h - inset
        ctx.fillText(label, x + inset, textY)

        // Issuer & Year subtext above title
        ctx.fillStyle = 'rgba(245, 245, 243, 0.65)'
        ctx.font = `400 ${Math.max(10, Math.round(numberSize * scale))}px ${fontFace}`
        ctx.fillText(`${slide.issuer} · ${slide.year}`, x + inset, textY - captionSize * scale - 4)

        // Slide number on the right (e.g. 01, 02)
        ctx.font = `500 ${Math.max(10, Math.round(numberSize * scale))}px ${fontFace}`
        ctx.textAlign = 'right'
        ctx.fillStyle = '#10b981'
        const numStr = `0${index + 1}`
        ctx.fillText(numStr, x + w - inset, textY)

        // Card border stroke
        ctx.strokeStyle = cardBorder
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.restore()
      })

      textureRef.current = {
        image: atlas,
        scale: density,
        width: total,
        height: h,
      }
      drawingRef.current()
      setReady(true)
    }

    // Preload certificate images
    const loadPromises = items.map((slide) => {
      return new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = slide.image
      })
    })

    Promise.all(loadPromises).then((loadedImages) => {
      if (!cancelled) {
        repaint = requestAnimationFrame(() => paint(loadedImages))
      }
    })

    return () => {
      cancelled = true
      if (repaint) cancelAnimationFrame(repaint)
      if (textureRef.current?.image === atlas) {
        textureRef.current = null
      }
    }
  }, [items, w, h, pitch, total, radius, paper, cardBorder, captionColor, captionSize, captionWeight, numberSize, inset, fadeHeight, scale])

  // 4. Resize and Visibility Listeners
  useEffect(() => {
    const host = rootRef.current
    if (!host) return

    const measure = () => {
      const width = host.clientWidth || 1200
      const height = host.clientHeight || 480
      setSize((old) => (old.width === width && old.height === height ? old : { width, height }))
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(host)

    const io = new IntersectionObserver(([entry]) => {
      setInView(entry?.isIntersecting ?? true)
    })
    io.observe(host)

    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  // 5. Redraw when projection geometry or texture changes
  useEffect(() => {
    drawingRef.current()
  }, [projection, ready])

  // 6. Smooth Physics & Autoplay Loop
  useEffect(() => {
    if (!inView || !ready) return

    let frame = 0
    let last = 0

    const tick = (now: number) => {
      const dt = last ? Math.min(0.04, (now - last) / 1000) : 1 / 60
      last = now

      const m = motionRef.current
      if (m.pointer < 0) {
        const isAuto = !paused && now > m.resume
        const target = isAuto ? clamp(speed, 0, 300) * (direction === 'Left' ? -1 : 1) : 0
        m.velocity = m.velocity + (target - m.velocity) * (1 - Math.pow(clamp(momentum, 0.7, 0.98), dt * 60))

        if (Math.abs(m.velocity) > 0.01) {
          m.offset = modulo(m.offset + m.velocity * dt, total)
          drawingRef.current()
        }
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, ready, paused, speed, direction, momentum, total])

  // 7. Interactive Pointer Drag & Click
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !e.isPrimary) return
    const m = motionRef.current
    m.pointer = e.pointerId
    m.startX = e.clientX
    m.startY = e.clientY
    m.x = e.clientX
    m.time = performance.now()
    m.velocity = 0
    m.hasMoved = false

    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motionRef.current
    if (m.pointer !== e.pointerId) return

    const now = performance.now()
    const dx = e.clientX - m.x
    const totalDist = Math.hypot(e.clientX - m.startX, e.clientY - m.startY)

    if (totalDist > 6) {
      m.hasMoved = true
    }

    m.offset = modulo(m.offset + dx, total)
    m.velocity = clamp(0.35 * m.velocity + (0.65 * dx) / (Math.max(8, now - m.time) / 1000), -2200, 2200)
    m.x = e.clientX
    m.time = now

    drawingRef.current()
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motionRef.current
    if (m.pointer !== e.pointerId) return

    const elapsed = performance.now() - m.time
    const totalDist = Math.hypot(e.clientX - m.startX, e.clientY - m.startY)

    // Click Detection on the Curved Canvas:
    if (!m.hasMoved && totalDist < 6 && elapsed < 350) {
      const host = rootRef.current
      if (host) {
        const rect = host.getBoundingClientRect()
        const clickCol = clamp(Math.round(e.clientX - rect.left), 0, Math.ceil(size.width) - 1)
        const i = clickCol * 4
        if (i < projection.length) {
          const source = modulo(projection[i] - m.offset, total)
          const clickedIdx = modulo(Math.floor(source / pitch), items.length)
          if (items[clickedIdx]) {
            onSelect?.(items[clickedIdx], clickedIdx)
          }
        }
      }
    }

    m.pointer = -1
    m.resume = performance.now() + 1200
    setDragging(false)

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const nudge = e.key === 'ArrowLeft' ? pitch : -pitch
      motionRef.current.offset = modulo(motionRef.current.offset + nudge, total)
      motionRef.current.velocity = 0
      motionRef.current.resume = performance.now() + 1800
      drawingRef.current()
    } else if (e.key === ' ') {
      e.preventDefault()
      setPaused((prev) => !prev)
    }
  }

  // Step buttons
  const step = (dir: 'Left' | 'Right') => {
    const nudge = dir === 'Right' ? -pitch : pitch
    motionRef.current.offset = modulo(motionRef.current.offset + nudge, total)
    motionRef.current.velocity = 0
    motionRef.current.resume = performance.now() + 1800
    drawingRef.current()
  }

  return (
    <div className={`curved-carousel-wrapper ${className}`} style={style}>
      {/* Curved Carousel Top Toolbar */}
      <div className="curved-carousel__toolbar">
        <div className="curved-carousel__controls">
          {/* Direction flip */}
          <button
            type="button"
            className="curved-btn mono"
            onClick={() => setDirection((prev) => (prev === 'Left' ? 'Right' : 'Left'))}
            title={`Reverse direction (Current: ${direction})`}
          >
            {direction === 'Left' ? <FiArrowLeft /> : <FiArrowRight />}
            <span>{direction === 'Left' ? 'To Left' : 'To Right'}</span>
          </button>

          {/* Pause / Resume */}
          <button
            type="button"
            className={`curved-btn mono ${paused ? 'paused' : ''}`}
            onClick={() => setPaused((prev) => !prev)}
            title={paused ? 'Resume automatic sliding' : 'Pause sliding'}
          >
            {paused ? <FiPlay /> : <FiPause />}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Step Arrows */}
          <div className="curved-arrows-group">
            <button
              type="button"
              className="curved-arrow-btn"
              onClick={() => step('Left')}
              aria-label="Previous card"
              title="Previous card"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="curved-arrow-btn"
              onClick={() => step('Right')}
              aria-label="Next card"
              title="Next card"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Main Curved Canvas Host */}
      <div
        ref={rootRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Curved Carousel"
        aria-describedby={instructionsId}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="curved-carousel__stage"
        style={{
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="curved-carousel__canvas"
        />

        {/* Ambient Glass Reflections and Side Fade */}
        <div className="curved-carousel__fade curved-carousel__fade--left" />
        <div className="curved-carousel__fade curved-carousel__fade--right" />

        {/* Fallback while loading */}
        {!ready && (
          <div className="curved-carousel__loading mono muted">
            <span>PREPARING CURVED CAROUSEL ARC...</span>
          </div>
        )}
      </div>
    </div>
  )
}
