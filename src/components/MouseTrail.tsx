import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  t: number
}

const LIFE = 520 // ms a point of the ribbon lives
const FOLLOW = 0.28 // how quickly the head chases the cursor (0–1 per 60fps frame)
const MAX_WIDTH = 7 // px, at the head

/** Silky white ribbon that glides behind the cursor, tapering and fading out. */
export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canFollow = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    if (!canFollow || reduce || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const points: Point[] = []
    const mouse = { x: 0, y: 0 }
    const head = { x: 0, y: 0 }
    let hasMouse = false
    let running = false
    let frame = 0
    let prev = 0

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!hasMouse) {
        head.x = mouse.x
        head.y = mouse.y
        hasMouse = true
      }
      start()
    }

    const draw = (now: number) => {
      const dt = Math.min((now - prev) / 16.67 || 1, 3)
      prev = now

      // ease the head toward the cursor (frame-rate independent)
      const k = 1 - Math.pow(1 - FOLLOW, dt)
      head.x += (mouse.x - head.x) * k
      head.y += (mouse.y - head.y) * k

      const last = points[points.length - 1]
      if (!last || Math.hypot(head.x - last.x, head.y - last.y) > 0.4) {
        points.push({ x: head.x, y: head.y, t: now })
      }
      while (points.length && now - points[0].t > LIFE) points.shift()

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#fff'

      // quadratic smoothing through the midpoints, each piece tapered by age
      for (let i = 1; i < points.length - 1; i++) {
        const a = points[i - 1]
        const b = points[i]
        const c = points[i + 1]
        const life = 1 - (now - b.t) / LIFE
        if (life <= 0) continue
        ctx.globalAlpha = Math.min(life * 1.2, 1)
        ctx.lineWidth = Math.max(MAX_WIDTH * Math.pow(life, 1.4), 0.4)
        ctx.beginPath()
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2)
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // keep going while the ribbon still has points (they expire on their own once the mouse rests)
      if (points.length > 0) {
        frame = requestAnimationFrame(draw)
      } else {
        running = false
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }

    function start() {
      if (running) return
      running = true
      prev = performance.now()
      frame = requestAnimationFrame(draw)
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="mouse-trail" aria-hidden="true" />
}
