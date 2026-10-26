import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { certificates, type CertificateItem } from '../../data/content'
import CurvedCarousel from '../CurvedCarousel'
import { SectionHeader } from '../SectionHeader'
import {
  FiX,
  FiExternalLink,
} from 'react-icons/fi'

export function Certificates() {
  const [activeModalCert, setActiveModalCert] = useState<CertificateItem | null>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModalCert) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveModalCert(null)
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        document.body.style.overflow = original
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [activeModalCert])

  return (
    <section className="section certificates" id="certificates">
      <SectionHeader index="04" title="Certificates" />

      {/* ========================================================================= */}
      {/* FRAMER CURVED CAROUSEL (PANORAMIC ARC) */}
      {/* ========================================================================= */}
      <div className="certificates__slider-wrapper">
        <CurvedCarousel
          items={certificates}
          curve={0.42}
          autoplay={true}
          speed={36}
          direction="Left"
          cardWidth={420}
          cardHeight={280}
          gap={32}
          radius={16}
          momentum={0.92}
          paper="#0d0d0d"
          cardBorder="rgba(255, 255, 255, 0.14)"
          captionColor="#ffffff"
          captionSize={15}
          numberSize={12}
          onSelect={(item) => {
            setActiveModalCert(item as CertificateItem)
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* FULL RESOLUTION LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalCert && (
          <motion.div
            className="cert-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={() => setActiveModalCert(null)}
          >
            <motion.div
              className="cert-lightbox-modal"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cert-lightbox__header">
                <div className="cert-lightbox__header-left">
                  <span className="mono muted cert-lightbox__kicker">
                    VERIFIED ARCHIVAL DOCUMENT // {activeModalCert.year}
                  </span>
                  <h2 className="cert-lightbox__title">
                    {activeModalCert.title}
                  </h2>
                  <p className="cert-lightbox__issuer mono muted">
                    {activeModalCert.issuer}
                  </p>
                </div>

                <button
                  type="button"
                  className="cert-lightbox__close-btn"
                  onClick={() => setActiveModalCert(null)}
                  aria-label="Close document viewer"
                >
                  <FiX />
                </button>
              </div>

              <div className="cert-lightbox__preview">
                <img
                  src={activeModalCert.image}
                  alt={activeModalCert.title}
                  className="cert-lightbox__img"
                />
              </div>

              <div className="cert-lightbox__footer mono">
                <span className="muted">
                  Issued by {activeModalCert.issuer} ({activeModalCert.year})
                </span>
                <a
                  href={activeModalCert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-lightbox__open-btn"
                >
                  <span>Open Full Image</span>
                  <FiExternalLink />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
