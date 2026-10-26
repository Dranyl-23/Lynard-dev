import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '../../data/content'
import { ease, easeOut } from '../../lib/motion'

function useClock(timeZone: string) {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).format(new Date())
  const [time, setTime] = useState(format)
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone])
  return time
}

interface GlyphPhysics {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  vr: number
  sy: number
  vsy: number
}

export function Hero({ ready }: { ready: boolean }) {
  const time = useClock(profile.timezone)
  const { scrollY } = useScroll()
  const titleY = useTransform(scrollY, [0, 800], [0, 160])
  const fade = useTransform(scrollY, [0, 500], [1, 0])

  const heroRef = useRef<HTMLElement | null>(null)
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([])
  const chars = Array.from(profile.name)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const glyphs: GlyphPhysics[] = chars.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      vr: 0,
      sy: 1,
      vsy: 0,
    }))

    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.45,
      sx: window.innerWidth * 0.5,
      sy: window.innerHeight * 0.45,
      inside: false,
    }

    let raf = 0
    let running = false

    const tick = () => {
      raf = 0
      const rect = hero.getBoundingClientRect()

      // Smooth spotlight interpolation
      pointer.sx += (pointer.x - pointer.sx) * 0.14
      pointer.sy += (pointer.y - pointer.sy) * 0.14
      hero.style.setProperty('--mx', `${(pointer.sx - rect.left).toFixed(1)}px`)
      hero.style.setProperty('--my', `${(pointer.sy - rect.top).toFixed(1)}px`)

      let active =
        Math.hypot(pointer.x - pointer.sx, pointer.y - pointer.sy) > 0.35

      const radius = Math.min(320, Math.max(180, rect.width * 0.22))
      const stiffness = 0.14
      const damping = 0.78

      for (let i = 0; i < glyphs.length; i++) {
        const el = glyphRefs.current[i]
        const g = glyphs[i]
        if (!el || !g) continue

        let tx = 0
        let ty = 0
        let tr = 0
        let tsy = 1

        if (pointer.inside) {
          const box = el.getBoundingClientRect()
          const cx = box.left + box.width * 0.5
          const cy = box.top + box.height * 0.5
          const dx = cx - pointer.x
          const dy = cy - pointer.y
          const dist = Math.hypot(dx, dy)

          if (dist < radius && dist > 0.001) {
            const falloff = Math.pow(1 - dist / radius, 1.65)
            const ux = dx / dist
            const uy = dy / dist
            tx = ux * falloff * 34
            ty = uy * falloff * 28 - falloff * 10
            tr = ux * falloff * 7.5
            tsy = 1 + falloff * 0.085
          }
        }

        g.vx = (g.vx + (tx - g.x) * stiffness) * damping
        g.vy = (g.vy + (ty - g.y) * stiffness) * damping
        g.vr = (g.vr + (tr - g.r) * stiffness) * damping
        g.vsy = (g.vsy + (tsy - g.sy) * stiffness) * damping

        g.x += g.vx
        g.y += g.vy
        g.r += g.vr
        g.sy += g.vsy

        if (
          Math.abs(g.x - tx) > 0.05 ||
          Math.abs(g.y - ty) > 0.05 ||
          Math.abs(g.vx) > 0.05 ||
          Math.abs(g.vy) > 0.05 ||
          Math.abs(g.sy - 1) > 0.002
        ) {
          active = true
        }

        el.style.transform = `translate3d(${g.x.toFixed(2)}px, ${g.y.toFixed(2)}px, 0) rotate(${g.r.toFixed(2)}deg) scaleY(${g.sy.toFixed(3)})`
      }

      if (active || pointer.inside) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const wake = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.inside = true
      hero.style.setProperty('--spot-opacity', '1')
      wake()
    }

    const onLeave = () => {
      pointer.inside = false
      hero.style.setProperty('--spot-opacity', '0')
      wake()
    }

    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, delay, ease: easeOut },
  })

  return (
    <section ref={heroRef} className="hero" id="top">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__grid-base" />
        <div className="hero__grid-lit" />
        <div className="hero__spotlight" />
      </div>

      <motion.div className="hero__top" {...fadeUp(0.4)}>
        <div className="hero__meta mono">
          <span>{profile.location}</span>
          <span className="hero__coords">06°45&prime;N 125°21&prime;E</span>
          <span>
            {time} {profile.timezoneLabel}
          </span>
          <span className="hero__live">{profile.availability}</span>
        </div>
        <div className="hero__rule" />
      </motion.div>

      <motion.h1
        className="hero__title"
        style={{ y: titleY, opacity: fade }}
        aria-label={profile.name}
      >
        <span className="hero__title-row" aria-hidden="true">
          {chars.map((char, i) => (
            <span key={i} className="split__mask hero__char-mask">
              <motion.span
                className="split__unit hero__char-enter"
                initial={{ y: '110%' }}
                animate={ready ? { y: '0%' } : { y: '110%' }}
                transition={{ duration: 0.95, delay: 0.3 + i * 0.075, ease }}
              >
                <span
                  ref={(el) => {
                    glyphRefs.current[i] = el
                  }}
                  className="hero__glyph"
                >
                  {char}
                </span>
              </motion.span>
            </span>
          ))}
        </span>
      </motion.h1>

      <div className="hero__bottom-wrap">
        <motion.div className="hero__rule" {...fadeUp(0.85)} />
        <div className="hero__bottom">
          <motion.p
            className="hero__intro"
            dangerouslySetInnerHTML={{ __html: profile.intro }}
            {...fadeUp(0.9)}
          />
          <motion.p className="hero__role" {...fadeUp(1.0)}>
            {profile.role}
          </motion.p>
          <motion.div className="hero__scroll mono" {...fadeUp(1.1)}>
            <span>Scroll</span>
            <span className="hero__scroll-line" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
