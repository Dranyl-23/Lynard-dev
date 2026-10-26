import { motion } from 'framer-motion'
import { experience } from '../../data/content'
import { ease, easeOut } from '../../lib/motion'
import { SectionHeader } from '../SectionHeader'

export function Experience() {
  return (
    <section className="section" id="experience">
      <SectionHeader index="05" title="Experience & Education" />

      <div>
        {experience.map((item, i) => (
          <motion.div
            key={`${item.role}-${item.period}`}
            className="exp__row"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.span
              className="exp__line"
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
              transition={{ duration: 1.3, delay: i * 0.05, ease }}
            />
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.9, delay: 0.1, ease: easeOut }}
            >
              <p className="mono">{item.period}</p>
              <p className="mono muted" style={{ marginTop: '0.4rem' }}>
                {item.type === 'work' ? 'Work' : 'Education'}
              </p>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.9, delay: 0.18, ease: easeOut }}
            >
              <h3 className="exp__role">{item.role}</h3>
              <p className="exp__org mono muted">{item.org}</p>
            </motion.div>
            <motion.p
              className="exp__desc"
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.9, delay: 0.26, ease: easeOut }}
            >
              {item.description}
            </motion.p>
          </motion.div>
        ))}
        <div className="exp__end" />
      </div>
    </section>
  )
}
