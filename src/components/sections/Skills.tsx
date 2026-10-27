import { motion } from 'framer-motion'
import { skillGroups } from '../../data/content'
import { easeOut } from '../../lib/motion'
import { Marquee } from '../Marquee'
import { SectionHeader } from '../SectionHeader'
import { skillIconMap } from '../StackIcons'

export function Skills() {
  return (
    <section className="section" id="skills">
      <SectionHeader index="03" title="Skills & Stack" />

      <div className="skills__marquee">
        <Marquee duration={38} reverse />
      </div>

      <div className="skills__grid">
        {skillGroups.map((group, g) => (
          <div key={group.title}>
            <h3 className="skills__title mono">{group.title}</h3>
            <ul>
              {group.items.map((item, i) => {
                const Icon = skillIconMap[item]
                return (
                  <motion.li
                    key={item}
                    className="skills__item"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: Math.min(g * 0.04 + i * 0.03, 0.25), ease: easeOut }}
                  >
                    <span className="skills__item-name">
                      {Icon && <Icon className="skills__item-icon" aria-hidden="true" />}
                      <span>{item}</span>
                    </span>
                    <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
