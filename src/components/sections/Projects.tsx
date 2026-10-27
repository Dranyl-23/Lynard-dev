import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { projects } from '../../data/content'
import { ease, easeOut } from '../../lib/motion'
import { Photo } from '../Photo'
import { SectionHeader } from '../SectionHeader'
import { SplitText } from '../SplitText'

export function Projects() {
  const [active, setActive] = useState<number | null>(null)
  const [openPreview, setOpenPreview] = useState<number | null>(null)
  const [isBtnHovered, setIsBtnHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.4 })

  const current =
    active !== null && openPreview !== active && !isBtnHovered
      ? projects[active]
      : null

  return (
    <section className="section" id="projects">
      <SectionHeader index="02" title="Selected Projects" />

      <div
        className="projects__list"
        onMouseMove={(e) => {
          x.set(e.clientX)
          y.set(e.clientY)
        }}
        onMouseLeave={() => {
          setActive(null)
          setIsBtnHovered(false)
        }}
      >
        {projects.map((project, i) => {
          const isExpanded = openPreview === i
          return (
            <motion.article
              key={project.title}
              className={`project ${isExpanded ? 'project--expanded' : ''}`}
              onMouseEnter={() => setActive(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.04, ease: easeOut }}
            >
              <div className="project__row">
                <span className="mono muted project__index">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="project__title">
                    <SplitText text={project.title} />
                  </h3>
                  <p className="project__desc muted">{project.description}</p>
                </div>

                <div>
                  <p className="mono" style={{ marginBottom: '0.6rem' }}>
                    {project.category} · {project.year}
                  </p>
                  <ul className="project__stack mono muted">
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>

                <div
                  className="project__links mono"
                  onMouseEnter={() => setIsBtnHovered(true)}
                  onMouseLeave={() => setIsBtnHovered(false)}
                >
                  {project.image && (
                    <button
                      type="button"
                      className="project__link project__preview-btn"
                      onClick={() => setOpenPreview(isExpanded ? null : i)}
                      onMouseEnter={() => setIsBtnHovered(true)}
                      onMouseLeave={() => setIsBtnHovered(false)}
                      onFocus={() => setIsBtnHovered(true)}
                      onBlur={() => setIsBtnHovered(false)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Hide Preview ↑' : 'Show Preview ↓'}
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && project.image && (
                  <motion.div
                    className="project__drawer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <div className="project__drawer-inner">
                      <div className="project__preview-grid">
                        <div className="project__frame">
                          <div className="project__frame-bar mono">
                            <div className="project__frame-dots">
                              <span />
                              <span />
                              <span />
                            </div>
                            <span className="project__frame-url">
                              {project.live ?? project.title}
                            </span>
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noreferrer"
                                className="project__frame-open"
                              >
                                Open ↗
                              </a>
                            )}
                          </div>
                          <div className="project__frame-media">
                            <img
                              src={project.image}
                              alt={`${project.title} preview`}
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <aside className="project__details">
                          <div className="project__details-head">
                            <span className="mono project__details-kicker">
                              Project Brief · {project.category}
                            </span>
                            <h4 className="project__tagline">{project.tagline}</h4>
                            <p className="project__overview">{project.overview}</p>
                          </div>

                          <div className="project__metrics">
                            {project.metrics.map((metric) => (
                              <div key={metric.label} className="project__metric">
                                <span className="mono project__metric-label">
                                  {metric.label}
                                </span>
                                <strong className="project__metric-value">
                                  {metric.value}
                                </strong>
                              </div>
                            ))}
                          </div>

                          <ul className="project__highlights">
                            {project.highlights.map((item, idx) => (
                              <li key={item.title} className="project__highlight">
                                <span className="mono project__highlight-num">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <div>
                                  <h5 className="project__highlight-title">
                                    {item.title}
                                  </h5>
                                  <p className="project__highlight-detail">
                                    {item.detail}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="project__details-actions mono">
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noreferrer"
                                className="project__action-btn project__action-btn--primary"
                              >
                                Visit Live Site ↗
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="project__action-btn"
                              >
                                Source Code ↗
                              </a>
                            )}
                          </div>
                        </aside>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>

      <motion.div className="preview" style={{ x: sx, y: sy }}>
        <div className="preview__inner">
          <AnimatePresence>
            {current && (
              <motion.div
                key={current.title}
                initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
                transition={{ duration: 0.45, ease }}
              >
                <Photo src={current.image} label={`${current.title} — screenshot`} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
