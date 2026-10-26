import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/content'
import { ease } from '../lib/motion'
import { startScroll, stopScroll } from '../lib/scroll'

export function ResumeModal() {
  const [open, setOpen] = useState(false)
  const [activePage, setActivePage] = useState<'all' | 0 | 1>('all')

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-resume', onOpen)
    return () => window.removeEventListener('open-resume', onOpen)
  }, [])

  useEffect(() => {
    if (!open) {
      startScroll()
      return
    }
    stopScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      startScroll()
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="resume-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${profile.fullName} Resume`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="resume-modal__dialog"
            initial={{ y: 32, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="resume-modal__bar mono">
              <div className="resume-modal__title">
                <span>Curriculum Vitae</span>
                <span className="muted">· {profile.fullName}</span>
              </div>

              <div className="resume-modal__tabs">
                <button
                  type="button"
                  className={`resume-modal__tab ${activePage === 'all' ? 'is-active' : ''}`}
                  onClick={() => setActivePage('all')}
                >
                  2-Page Spread
                </button>
                <button
                  type="button"
                  className={`resume-modal__tab ${activePage === 0 ? 'is-active' : ''}`}
                  onClick={() => setActivePage(0)}
                >
                  Page 01
                </button>
                <button
                  type="button"
                  className={`resume-modal__tab ${activePage === 1 ? 'is-active' : ''}`}
                  onClick={() => setActivePage(1)}
                >
                  Page 02
                </button>
              </div>

              <div className="resume-modal__actions">
                <a
                  href={profile.resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-modal__btn"
                >
                  Open PDF ↗
                </a>
                <a
                  href={profile.resumePdf}
                  download="Alfie-Lynard-Polacas-Resume.pdf"
                  className="resume-modal__btn resume-modal__btn--primary"
                >
                  Download ↓
                </a>
                <button
                  type="button"
                  className="resume-modal__close"
                  onClick={() => setOpen(false)}
                  aria-label="Close resume viewer"
                >
                  Close ✕
                </button>
              </div>
            </header>

            <div
              className="resume-modal__body"
              data-lenis-prevent
            >
              <div
                className={`resume-modal__pages ${
                  activePage === 'all' ? 'resume-modal__pages--spread' : 'resume-modal__pages--single'
                }`}
              >
                {profile.resumePages.map((src, idx) => {
                  if (activePage !== 'all' && activePage !== idx) return null
                  return (
                    <figure key={src} className="resume-sheet">
                      <div className="resume-sheet__frame">
                        <img
                          src={src}
                          alt={`${profile.fullName} — Resume Page ${idx + 1}`}
                          loading="eager"
                        />
                      </div>
                      <figcaption className="mono muted resume-sheet__caption">
                        <span>{profile.fullName} — Curriculum Vitae</span>
                        <span>Page 0{idx + 1} / 0{profile.resumePages.length}</span>
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
