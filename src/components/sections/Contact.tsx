import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../../data/content'
import { easeOut } from '../../lib/motion'
import { PostalContactForm } from '../PostalContactForm'
import { SectionHeader } from '../SectionHeader'
import { SplitText } from '../SplitText'
import { WorldMapBackground } from '../WorldMapBackground'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="section contact" id="contact">
      <WorldMapBackground />
      <SectionHeader index="06" title="Contact" />

      <div className="contact__grid">
        <div className="contact__left">
          <h2 className="contact__title">
            <SplitText text="Let’s work" stagger={0.1} />
            <br />
            <span className="serif-i">
              <SplitText text="together." delay={0.2} stagger={0.1} />
            </span>
          </h2>

          <div className="contact__info">
            <div>
              <p className="mono muted contact__label">Direct Email</p>
              <button className="contact__email" onClick={copyEmail} data-cursor="Copy">
                {profile.email}
              </button>
              <span className="contact__copied mono muted" aria-live="polite">
                {copied ? 'Copied to clipboard ✓' : 'Click to copy'}
              </span>
            </div>

            <ul className="contact__socials mono">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <a
                    className="contact__social"
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{social.label}</span>
                    <span>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          className="contact__right"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, delay: 0.1, ease: easeOut }}
        >
          <PostalContactForm />
        </motion.div>
      </div>
    </section>
  )
}
