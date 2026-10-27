import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { certificates, type CertificateItem } from '../../data/content'
import { useTheme } from '../../lib/theme'
import { SectionHeader } from '../SectionHeader'
import {
  FiX,
  FiExternalLink,
  FiMaximize2,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
} from 'react-icons/fi'

interface StackCardItemProps {
  cert: CertificateItem
  index: number
  total: number
  deckProgress: MotionValue<number>
  onInspect: (index: number) => void
  isLight: boolean
  isMobile: boolean
}

function StackCardItem({
  cert,
  index,
  total,
  deckProgress,
  onInspect,
  isLight,
  isMobile,
}: StackCardItemProps) {
  const isFirst = index === 0
  const isLast = index === total - 1
  const step = 0.88 / (total - 1)

  // Intervals: Card exits UPWARDS to reveal the next card underneath
  const predExitStart = isFirst ? 0 : (index - 1) * step + 0.03
  const predExitEnd = isFirst ? 0 : index * step
  const exitStart = isLast ? 1 : index * step + 0.03
  const exitEnd = isLast ? 1 : (index + 1) * step

  const dimMax = isLight ? 0.25 : 0.45

  // 1. Y Transform: When this card's turn to exit arrives, it flies UPWARDS (-850px)
  const y = useTransform(
    deckProgress,
    isFirst
      ? [0, exitStart, exitEnd, 1]
      : isLast
      ? [0, predExitStart, predExitEnd, 1]
      : [0, predExitStart, predExitEnd, exitStart, exitEnd, 1],
    isFirst
      ? [0, 0, -850, -850]
      : isLast
      ? [14, 14, 0, 0]
      : [14, 14, 0, 0, -850, -850]
  )

  // 2. 3D Tilt: On mobile, 3D tilt is disabled (0deg) to prevent GPU rasterization bottleneck.
  // On desktop, subtle -18deg tilt gives physical peel feel.
  const rotateX = useTransform(
    deckProgress,
    isLast || isMobile
      ? [0, 1]
      : isFirst
      ? [0, exitStart, exitEnd, 1]
      : [0, predExitStart, predExitEnd, exitStart, exitEnd, 1],
    isLast || isMobile
      ? [0, 0]
      : isFirst
      ? [0, 0, -18, -18]
      : [0, 0, 0, 0, -18, -18]
  )

  // 3. Scale: Starts at 0.95 in the deck, scales up to 1.0 when active, then scales slightly as it flies away
  const scale = useTransform(
    deckProgress,
    isFirst
      ? [0, exitStart, exitEnd, 1]
      : isLast
      ? [0, predExitStart, predExitEnd, 1]
      : [0, predExitStart, predExitEnd, exitStart, exitEnd, 1],
    isFirst
      ? [1, 1, 0.95, 0.95]
      : isLast
      ? [0.95, 0.95, 1, 1]
      : [0.95, 0.95, 1, 1, 0.95, 0.95]
  )

  // 4. Opacity: Fades out as it flies off the top
  const opacity = useTransform(
    deckProgress,
    isLast
      ? [0, 1]
      : [0, exitStart, Math.max(exitStart, exitEnd - 0.02), exitEnd, 1],
    isLast
      ? [1, 1]
      : [1, 1, 0.45, 0, 0]
  )

  // 5. Dimmer: Darkens when waiting underneath in the deck
  const dimOpacity = useTransform(
    deckProgress,
    isFirst
      ? [0, 1]
      : [0, predExitStart, predExitEnd, 1],
    isFirst
      ? [0, 0]
      : [dimMax, dimMax, 0, 0]
  )

  // 6. Pointer events: Disable interaction once the card has peeled off upwards
  const pointerEvents = useTransform(deckProgress, (v) =>
    !isLast && v >= exitEnd ? 'none' : 'auto'
  )

  // 7. GPU optimization: Skip painting off-screen cards (without layout reflow)
  const visibility = useTransform(deckProgress, (v) => {
    if (!isLast && v >= exitEnd) return 'hidden'
    if (!isFirst && v < predExitStart - 0.08) return 'hidden'
    return 'visible'
  })

  return (
    <motion.div
      className="stack-card-entry-stage"
      style={{
        visibility,
        y,
        rotateX,
        scale,
        opacity,
        pointerEvents,
        zIndex: (total - index) * 10,
        transformOrigin: 'top center',
      }}
    >
      <article
        className="stack-card"
        onClick={() => onInspect(index)}
      >
        {/* Soft dimming backdrop when waiting underneath in the deck */}
        <motion.div
          className="stack-card__dimmer"
          style={{ opacity: dimOpacity }}
          aria-hidden="true"
        />

        {/* Card Header Bar */}
        <div className="stack-card__header">
          <div className="stack-card__header-left mono">
            <span className="stack-card__index">
              DOC // {String(index + 1).padStart(2, '0')} OF {String(total).padStart(2, '0')}
            </span>
            <span className="stack-card__status">
              <span className="status-live-dot" />
              <span>VERIFIED ARCHIVE</span>
            </span>
          </div>

          <div className="stack-card__header-right mono muted">
            <span className="stack-card__issuer-pill">{cert.issuer}</span>
            <span className="stack-card__year-pill">{cert.year}</span>
          </div>
        </div>

        {/* Card Hero Visual: High-Resolution Landscape Certificate Stage */}
        <div
          className="stack-card__stage"
          onClick={(e) => {
            e.stopPropagation()
            onInspect(index)
          }}
        >
          <div className="stack-card__stage-frame">
            <img
              src={cert.image}
              alt={cert.title}
              className="stack-card__img"
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="stack-card__stage-glass" />
          </div>

          {/* Hover overlay hint */}
          <div className="stack-card__stage-overlay">
            <div className="hover-inspect-pill">
              <FiEye />
              <span>Click to Inspect Full Document</span>
            </div>
          </div>
        </div>

        {/* Card Bottom Bar: Title, Tags & Inspect Action */}
        <div className="stack-card__footer">
          <div className="stack-card__footer-info">
            <h3 className="stack-card__title">{cert.title}</h3>
            {cert.skills && cert.skills.length > 0 && (
              <div className="stack-card__tags mono">
                {cert.skills.map((skill) => (
                  <span key={skill} className="stack-card__tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="stack-card__actions mono">
            <button
              type="button"
              className="stack-card__inspect-btn"
              onClick={(e) => {
                e.stopPropagation()
                onInspect(index)
              }}
              aria-label={`Inspect ${cert.title}`}
            >
              <FiMaximize2 className="btn-icon" />
              <span>Inspect</span>
            </button>

            <a
              href={cert.image}
              target="_blank"
              rel="noopener noreferrer"
              className="stack-card__link-btn"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open original image of ${cert.title} in new tab`}
              title="Open Full Image"
            >
              <FiExternalLink className="btn-icon" />
            </a>
          </div>
        </div>
      </article>
    </motion.div>
  )
}

export function Certificates() {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches
      : false
  )

  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches
      )
    }
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const trackRef = useRef<HTMLDivElement>(null)

  // Track overall scroll progress through the track
  const { scrollYProgress: deckProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const activeModalCert =
    activeModalIndex !== null ? certificates[activeModalIndex] : null

  const handlePrev = useCallback(() => {
    setActiveModalIndex((prev) =>
      prev !== null ? (prev - 1 + certificates.length) % certificates.length : 0
    )
  }, [])

  const handleNext = useCallback(() => {
    setActiveModalIndex((prev) =>
      prev !== null ? (prev + 1) % certificates.length : 0
    )
  }, [])

  // Lock body scroll and handle keyboard navigation when lightbox modal is open
  useEffect(() => {
    if (activeModalIndex !== null) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveModalIndex(null)
        if (e.key === 'ArrowLeft') handlePrev()
        if (e.key === 'ArrowRight') handleNext()
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        document.body.style.overflow = original
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [activeModalIndex, handlePrev, handleNext])

  return (
    <section className="section certificates" id="certificates">
      {/* ========================================================================= */}
      {/* TALL SCROLL TRACK FOR STACK SCROLL REVEAL */}
      {/* ========================================================================= */}
      <div ref={trackRef} className="certificates__scroll-track">
        {/* ======================================================================= */}
        {/* PINNED VIEWPORT: Stays 100vh locked in screen while cards peel off */}
        {/* ======================================================================= */}
        <div className="certificates__pinned-viewport">
          {/* Top Section Header */}
          <div className="certificates__top-container">
            <SectionHeader index="04" title="Certificates" />
          </div>

          {/* Central Card Stack Stage */}
          <div className="certificates__stack-stage">
            {certificates.map((cert, index) => (
              <StackCardItem
                key={cert.title}
                cert={cert}
                index={index}
                total={certificates.length}
                deckProgress={deckProgress}
                onInspect={(idx) => setActiveModalIndex(idx)}
                isLight={isLight}
                isMobile={isMobile}
              />
            ))}
          </div>

          <div className="certificates__bottom-spacer" aria-hidden="true" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL RESOLUTION LIGHTBOX MODAL WITH NEXT / PREV NAVIGATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalCert && activeModalIndex !== null && (
          <motion.div
            className="cert-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setActiveModalIndex(null)}
          >
            <motion.div
              className="cert-lightbox-modal"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cert-lightbox__header">
                <div className="cert-lightbox__header-left">
                  <div className="cert-lightbox__meta-row mono">
                    <span className="cert-lightbox__verified-tag">
                      <FiCheckCircle className="badge-icon" />
                      VERIFIED ARCHIVAL DOCUMENT
                    </span>
                    <span className="muted">// {activeModalCert.year}</span>
                    <span className="muted">
                      // DOC {String(activeModalIndex + 1).padStart(2, '0')} OF {String(certificates.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="cert-lightbox__title">
                    {activeModalCert.title}
                  </h2>
                  <p className="cert-lightbox__issuer mono muted">
                    Issued by <strong className="fg-solid">{activeModalCert.issuer}</strong> ({activeModalCert.year})
                  </p>
                </div>

                <div className="cert-lightbox__header-controls">
                  <div className="cert-lightbox__nav-group mono">
                    <button
                      type="button"
                      className="cert-lightbox__nav-btn"
                      onClick={handlePrev}
                      aria-label="Previous certificate"
                      title="Previous (Left Arrow)"
                    >
                      <FiChevronLeft />
                    </button>
                    <span className="cert-lightbox__nav-counter">
                      {activeModalIndex + 1} / {certificates.length}
                    </span>
                    <button
                      type="button"
                      className="cert-lightbox__nav-btn"
                      onClick={handleNext}
                      aria-label="Next certificate"
                      title="Next (Right Arrow)"
                    >
                      <FiChevronRight />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cert-lightbox__close-btn"
                    onClick={() => setActiveModalIndex(null)}
                    aria-label="Close document viewer"
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="cert-lightbox__preview">
                <img
                  src={activeModalCert.image}
                  alt={activeModalCert.title}
                  className="cert-lightbox__img"
                />
              </div>

              {activeModalCert.description && (
                <div className="cert-lightbox__desc-strip">
                  <p className="mono muted cert-lightbox__desc-text">
                    {activeModalCert.description}
                  </p>
                </div>
              )}

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
