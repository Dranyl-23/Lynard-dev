import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { profile } from '../../data/content'
import { ease } from '../../lib/motion'
import { openResumeModal } from '../../lib/scroll'
import { Lanyard } from '../Lanyard'
import { ScrollText } from '../ScrollText'
import { SectionHeader } from '../SectionHeader'

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (latest) => setValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {inView ? value : 0}
      {suffix}
    </span>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <SectionHeader index="01" title="About" />

      <ScrollText text={profile.statement} className="about__statement" />

      <div className="about__grid">
        <Lanyard photo={profile.photo} name={profile.name} role={profile.role} location={profile.location} />

        <div className="about__text">
          {profile.bio.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease }}
            >
              {paragraph}
            </motion.p>
          ))}

          <div className="stats">
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <div className="stat__value">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mono muted" style={{ marginTop: '0.5rem' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="about__actions mono">
            <button
              type="button"
              className="resume-cta resume-cta--primary"
              onClick={() => openResumeModal()}
            >
              Preview Resume ↗
            </button>
            <a
              href={profile.resumePdf}
              download="Alfie-Lynard-Polacas-Resume.pdf"
              className="resume-cta"
            >
              Download CV ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
