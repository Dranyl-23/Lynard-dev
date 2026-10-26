import { useEffect, useRef } from 'react'
import { MaskReveal } from './MaskReveal'

interface LanyardProps {
  photo: string | null
  name: string
  role: string
  location: string
}

interface Point {
  x: number
  y: number
  px: number
  py: number
}

const SEGMENTS = 10 // rope segments between the anchor and the card's hole
const STEP = 1 / 120 // fixed physics step (s)
const GRAVITY = 0.34 // px per step² — crisp, weighty free-fall
const DAMPING = 0.994
const ITERATIONS = 16

/**
 * A badge hanging from a strap. Verlet-integrated rope + card:
 * drops from above with an elastic strap bounce when scrolling into the About section,
 * and can be grabbed and thrown around.
 */
export function Lanyard({ photo, name, role, location }: LanyardProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const holeRef = useRef<HTMLSpanElement>(null)
  const strapRef = useRef<SVGPathElement>(null)
  const stitchRef = useRef<SVGPathElement>(null)
  const capRef = useRef<SVGCircleElement>(null)
  const nailRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const box = boxRef.current
    const card = cardRef.current
    const hole = holeRef.current
    const strap = strapRef.current
    const stitch = stitchRef.current
    const cap = capRef.current
    const nail = nailRef.current
    if (!box || !card || !hole || !strap || !stitch || !cap || !nail) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let pts: Point[] = []
    let baseLengths: number[] = []
    let lengths: number[] = []
    let baseRope = 220
    let maxReach = 0
    let cardW = 0
    let cardH = 0
    let cardArm = 0
    let anchorX = 0
    let dragging = false
    let target = { x: 0, y: 0 }
    let grab = { x: 0, y: 0 }
    let running = false
    let dropped = false
    let inFreeFall = false
    let stretch = 0
    let stretchV = 0
    let frame = 0
    let last = 0
    let acc = 0

    const placeAtRest = () => {
      pts = []
      baseLengths = []
      lengths = []
      const seg = baseRope / SEGMENTS
      for (let i = 0; i <= SEGMENTS; i++) {
        const y = i * seg
        pts.push({ x: anchorX, y, px: anchorX, py: y })
        if (i > 0) {
          baseLengths.push(seg)
          lengths.push(seg)
        }
      }
      const cy = baseRope + cardArm
      pts.push({ x: anchorX, y: cy, px: anchorX, py: cy })
      baseLengths.push(cardArm)
      lengths.push(cardArm)
      maxReach = baseLengths.reduce((a, b) => a + b, 0)
      inFreeFall = false
      stretch = 0
      stretchV = 0
    }

    /**
     * Coil the strap & badge high above the anchor so it drops down
     * in free-fall and snaps taut when the section enters view.
     */
    const prepareDrop = () => {
      pts = []
      baseLengths = []
      lengths = []
      const seg = baseRope / SEGMENTS
      const offsetX = Math.min(64, box.clientWidth * 0.16)
      const startY = -Math.min(180, cardH * 0.48)

      for (let i = 0; i <= SEGMENTS; i++) {
        const t = i / SEGMENTS
        // Accordion/loop the strap from the nail (0,0) up toward the raised card
        const x = anchorX + offsetX * Math.pow(t, 1.25)
        const y = startY * t
        // Initial downward velocity so the drop starts immediately without hesitation
        const vy = 2.4 * t
        pts.push({ x, y, px: x + 0.35 * t, py: y - vy })
        if (i > 0) {
          baseLengths.push(seg)
          lengths.push(seg)
        }
      }

      const attach = pts[SEGMENTS]
      // Tilt the card slightly in mid-air before it drops
      const tilt = -0.22
      const cx = attach.x + Math.sin(tilt) * cardArm
      const cy = attach.y + Math.cos(tilt) * cardArm
      pts.push({
        x: cx,
        y: cy,
        px: cx - 1.1,
        py: cy - 2.8,
      })
      baseLengths.push(cardArm)
      lengths.push(cardArm)
      maxReach = baseLengths.reduce((a, b) => a + b, 0)
      inFreeFall = true
      stretch = 0
      stretchV = 0
    }

    const setup = () => {
      const W = box.clientWidth
      cardW = card.offsetWidth
      cardH = card.offsetHeight
      const holeOffset = hole.offsetTop + hole.offsetHeight / 2
      anchorX = W / 2
      baseRope = W < 520 ? 150 : 220
      cardArm = cardH / 2 - holeOffset

      // Ensure container height always fits the full rope + hanging card so it never overlaps text below on mobile
      box.style.height = `${Math.ceil(baseRope - holeOffset + cardH + 28)}px`

      if (reduceMotion || dropped) {
        placeAtRest()
      } else {
        prepareDrop()
      }
      render()
    }

    const solve = () => {
      const n = pts.length - 1
      for (let it = 0; it < ITERATIONS; it++) {
        pts[0].x = anchorX
        pts[0].y = 0
        for (let i = 0; i < n; i++) {
          const a = pts[i]
          const b = pts[i + 1]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy) || 0.0001
          // While in free-fall, allow the strap to remain slack until it reaches its segment length
          if (inFreeFall && i < n - 1 && dist < lengths[i]) {
            continue
          }
          const diff = (dist - lengths[i]) / dist
          const aPinned = i === 0
          const bPinned = dragging && i + 1 === n
          if (aPinned && !bPinned) {
            b.x -= dx * diff
            b.y -= dy * diff
          } else if (bPinned && !aPinned) {
            a.x += dx * diff
            a.y += dy * diff
          } else if (!aPinned && !bPinned) {
            a.x += dx * diff * 0.5
            a.y += dy * diff * 0.5
            b.x -= dx * diff * 0.5
            b.y -= dy * diff * 0.5
          }
        }
        if (dragging) {
          pts[n].x = target.x
          pts[n].y = target.y
        }
      }
    }

    const step = () => {
      const n = pts.length - 1
      for (let i = 1; i <= n; i++) {
        const p = pts[i]
        if (dragging && i === n) {
          p.px = p.x
          p.py = p.y
          continue
        }
        const vx = (p.x - p.px) * DAMPING
        const vy = (p.y - p.py) * DAMPING
        p.px = p.x
        p.py = p.y
        p.x += vx
        p.y += vy + (i === n ? GRAVITY * 1.45 : GRAVITY)
      }

      // Detect the moment the falling badge pulls the strap taut -> trigger elastic bounce
      if (inFreeFall) {
        const attach = pts[n - 1]
        const distFromNail = Math.hypot(attach.x - anchorX, attach.y)
        if (attach.y > 0 && distFromNail >= baseRope * 0.96) {
          inFreeFall = false
          const fallVy = Math.max(0, pts[n].y - pts[n].py)
          stretchV = Math.min(5.2, fallVy * 0.62)
          // Give a subtle rotational kick as the strap catches the falling card
          pts[n].px += 1.4
        }
      }

      // Elastic strap spring (stretches on drop impact and rebounds)
      if (!dragging && (Math.abs(stretch) > 0.01 || Math.abs(stretchV) > 0.01)) {
        stretchV += -0.055 * stretch - 0.075 * stretchV
        stretch += stretchV
        stretch = Math.max(-22, Math.min(52, stretch))
        const segStretch = stretch / SEGMENTS
        for (let i = 0; i < SEGMENTS; i++) {
          lengths[i] = Math.max(4, baseLengths[i] + segStretch)
        }
      } else {
        for (let i = 0; i < SEGMENTS; i++) {
          lengths[i] = baseLengths[i]
        }
      }

      solve()
    }

    const render = () => {
      const n = pts.length - 1
      const c = pts[n]
      const attach = pts[n - 1]
      const angle = Math.atan2(attach.x - c.x, -(attach.y - c.y))
      card.style.transform = `translate3d(${c.x - cardW / 2}px, ${c.y - cardH / 2}px, 0) rotate(${angle}rad)`

      let d = `M${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < n - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2
        const my = (pts[i].y + pts[i + 1].y) / 2
        d += ` Q${pts[i].x} ${pts[i].y} ${mx} ${my}`
      }
      d += ` L${attach.x} ${attach.y}`
      strap.setAttribute('d', d)
      stitch.setAttribute('d', d)
      cap.setAttribute('cx', String(attach.x))
      cap.setAttribute('cy', String(attach.y))
      nail.setAttribute('cx', String(anchorX))
    }

    const loop = (time: number) => {
      acc += Math.min((time - last) / 1000, 0.05)
      last = time
      while (acc >= STEP) {
        step()
        acc -= STEP
      }
      render()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      acc = 0
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    // --- dragging ---
    const toLocal = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const updateTarget = (e: PointerEvent) => {
      const p = toLocal(e)
      let tx = p.x - grab.x
      let ty = p.y - grab.y
      const dx = tx - anchorX
      const dist = Math.hypot(dx, ty)
      if (dist > maxReach * 1.15) {
        tx = anchorX + (dx / dist) * (maxReach * 1.15)
        ty = (ty / dist) * (maxReach * 1.15)
      }
      target = { x: tx, y: ty }
    }
    const onDown = (e: PointerEvent) => {
      card.setPointerCapture(e.pointerId)
      const p = toLocal(e)
      const c = pts[pts.length - 1]
      grab = { x: p.x - c.x, y: p.y - c.y }
      dragging = true
      inFreeFall = false
      stretch = 0
      stretchV = 0
      updateTarget(e)
    }
    const onMove = (e: PointerEvent) => {
      if (dragging) updateTarget(e)
    }
    const onUp = () => {
      dragging = false
    }

    card.addEventListener('pointerdown', onDown)
    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerup', onUp)
    card.addEventListener('pointercancel', onUp)

    setup()

    // Hide until the About section enters view, then drop from above!
    if (!reduceMotion) {
      box.style.opacity = '0'
      box.style.transition = 'opacity 0.2s ease-out'
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.32) {
          if (!dropped && !reduceMotion) {
            dropped = true
            prepareDrop()
            render()
            box.style.opacity = '1'
          }
          start()
        } else if (!entry.isIntersecting) {
          stop()
          // Reset when scrolled completely out of view so scrolling back triggers the drop again
          if (!reduceMotion) {
            dropped = false
            box.style.opacity = '0'
            prepareDrop()
            render()
          }
        }
      },
      { threshold: [0, 0.32] },
    )
    io.observe(box)

    const ro = new ResizeObserver(() => setup())
    ro.observe(box)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      card.removeEventListener('pointerdown', onDown)
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerup', onUp)
      card.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <div className="lanyard" ref={boxRef}>
      <div className="lanyard__card" ref={cardRef} data-cursor="Drag">
        <span className="lanyard__hole" ref={holeRef} />
        <div className="lanyard__head mono">
          <span>{name} — Portfolio</span>
          <span>No. 001</span>
        </div>

        <div className="lanyard__photo">
          {photo ? (
            <MaskReveal src={photo} alt={name} radius={155} />
          ) : (
            <div className="photo__placeholder mono">Your photo</div>
          )}
        </div>

        <div className="lanyard__foot">
          <p className="lanyard__name">{name}</p>
          <p className="mono lanyard__role">
            {role} · {location}
          </p>
          <div className="lanyard__barcode" aria-hidden="true" />
        </div>
      </div>

      <svg className="lanyard__svg" aria-hidden="true">
        <path ref={strapRef} className="lanyard__strap" />
        <path ref={stitchRef} className="lanyard__stitch" />
        <circle ref={nailRef} cy="0" r="7" className="lanyard__nail" />
        <circle ref={capRef} r="5" className="lanyard__cap" />
      </svg>
    </div>
  )
}
