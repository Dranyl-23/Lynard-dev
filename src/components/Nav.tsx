import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { navLinks, profile } from '../data/content'
import { ease } from '../lib/motion'
import { openResumeModal, scrollToTarget } from '../lib/scroll'

export function Nav({ ready }: { ready: boolean }) {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(latest > prev && latest > 200)
  })

  const go = (e: React.MouseEvent, href: string | number) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <>
      <motion.header
        className="nav"
        initial={{ y: '-100%' }}
        animate={{ y: ready && (!hidden || open) ? 0 : '-100%' }}
        transition={{ duration: 0.7, ease }}
      >
        <a href="#top" className="nav__logo" onClick={(e) => go(e, 0)}>
          {profile.name}©
        </a>
        <nav className="nav__links mono">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav__link" onClick={(e) => go(e, link.href)}>
              <span>{link.label}</span>
              <span aria-hidden="true">{link.label}</span>
            </a>
          ))}
          <button
            type="button"
            className="nav__resume-btn mono"
            onClick={() => openResumeModal()}
          >
            Resume ↗
          </button>
        </nav>
        <button className="nav__toggle mono" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Close' : 'Menu'}
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 + i * 0.07, duration: 0.6, ease } }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.button
              type="button"
              className="menu__resume"
              onClick={() => {
                setOpen(false)
                openResumeModal()
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { delay: 0.3 + navLinks.length * 0.07, duration: 0.6, ease },
              }}
            >
              Resume ↗
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
