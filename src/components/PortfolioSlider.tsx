// @ts-nocheck
/* oxlint-disable */
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import {
  FiMaximize2,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiPlay,
  FiRotateCw,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi'

export interface SliderCertificateItem {
  title: string
  issuer: string
  year: string
  image: string
  fill?: string
  aspect?: number
}

export interface PortfolioSliderProps {
  items: SliderCertificateItem[]
  speed?: number // px per second, default 45
  direction?: 'left' | 'right'
  gap?: number // gap between cards in px, default 24
  pauseOnHover?: boolean
  className?: string
  style?: React.CSSProperties
  onSelect?: (item: SliderCertificateItem, index: number) => void
}

export default function PortfolioSlider({
  items = [],
  speed: initialSpeed = 45,
  direction: initialDirection = 'left',
  gap = 24,
  pauseOnHover = true,
  className = '',
  style,
  onSelect,
}: PortfolioSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [direction, setDirection] = useState<'left' | 'right'>(initialDirection)
  const [speedLevel, setSpeedLevel] = useState<'normal' | 'fast' | 'slow'>('normal')
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Dragging state
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartYRef = useRef(0)
  const dragStartPosRef = useRef(0)
  const hasDraggedRef = useRef(false)

  // Position state (in px)
  const posRef = useRef(0)
  const singleSetWidthRef = useRef(0)
  const animationFrameRef = useRef(0)
  const lastTimeRef = useRef(0)

  // Speed value mapping
  const currentSpeed = useMemo(() => {
    if (isPaused) return 0
    if (pauseOnHover && isHovered && !isDraggingRef.current) return 6 // gentle crawl on hover
    if (speedLevel === 'slow') return 24
    if (speedLevel === 'fast') return 80
    return initialSpeed // 45
  }, [isPaused, pauseOnHover, isHovered, speedLevel, initialSpeed])

  // Triple items for perfectly smooth, seamless infinite loop
  const loopItems = useMemo(() => {
    if (!items.length) return []
    return [...items, ...items, ...items]
  }, [items])

  // Measure single-set width
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track || !items.length) return
    // One set of items is 1/3 of total track scrollWidth
    singleSetWidthRef.current = track.scrollWidth / 3
  }, [items.length])

  // ResizeObserver for responsive width recalculation
  useEffect(() => {
    measure()
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const ro = new ResizeObserver(() => {
      measure()
    })
    ro.observe(container)
    ro.observe(track)
    window.addEventListener('resize', measure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // Continuous animation loop using requestAnimationFrame
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    lastTimeRef.current = performance.now()

    const animate = (now: number) => {
      const dt = Math.max(0, Math.min(0.05, (now - lastTimeRef.current) / 1000))
      lastTimeRef.current = now

      // If not dragging and not stopped
      if (!isDraggingRef.current && currentSpeed > 0) {
        const delta = (direction === 'left' ? -1 : 1) * currentSpeed * dt
        posRef.current += delta

        const half = singleSetWidthRef.current
        if (half > 0) {
          if (direction === 'left' && -posRef.current >= half) {
            posRef.current += half
          } else if (direction === 'right' && posRef.current >= 0) {
            posRef.current -= half
          }
        }

        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [currentSpeed, direction])

  // Pointer drag events for manual scrubbing (without blocking button clicks!)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    isDraggingRef.current = true
    hasDraggedRef.current = false
    dragStartXRef.current = e.clientX
    dragStartYRef.current = e.clientY
    dragStartPosRef.current = posRef.current
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const deltaX = e.clientX - dragStartXRef.current
    const deltaY = e.clientY - dragStartYRef.current

    // Only initiate true pointer capture and drag if moved beyond threshold (> 6px)
    if (!hasDraggedRef.current && Math.hypot(deltaX, deltaY) > 6) {
      hasDraggedRef.current = true
      const track = trackRef.current
      if (track) {
        track.style.transition = 'none'
        try {
          track.setPointerCapture(e.pointerId)
        } catch {
          // ignore if already captured
        }
        track.style.cursor = 'grabbing'
      }
    }

    if (hasDraggedRef.current) {
      posRef.current = dragStartPosRef.current + deltaX
      const half = singleSetWidthRef.current
      if (half > 0) {
        if (-posRef.current >= half * 2) {
          posRef.current += half
          dragStartPosRef.current += half
        } else if (posRef.current >= 0) {
          posRef.current -= half
          dragStartPosRef.current -= half
        }
      }

      const track = trackRef.current
      if (track) {
        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const track = trackRef.current
    if (track) {
      try {
        if (track.hasPointerCapture(e.pointerId)) {
          track.releasePointerCapture(e.pointerId)
        }
      } catch {
        // ignore
      }
      track.style.cursor = 'grab'
    }
  }

  // Step button navigation (Left / Right nudge)
  const stepSlide = (dir: 'left' | 'right') => {
    const cardWidth = containerRef.current
      ? Math.min(588, Math.max(320, containerRef.current.clientWidth * 0.42)) + gap
      : 588 + gap
    const nudge = (dir === 'left' ? -1 : 1) * cardWidth

    posRef.current += nudge
    const half = singleSetWidthRef.current
    if (half > 0) {
      if (-posRef.current >= half * 2) posRef.current += half
      if (posRef.current >= 0) posRef.current -= half
    }

    const track = trackRef.current
    if (track) {
      track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
      setTimeout(() => {
        if (track) track.style.transition = 'none'
      }, 420)
    }
  }

  return (
    <div className={`portfolio-slider-root ${className}`} style={style}>
      {/* Interactive Controls Bar */}
      <div className="portfolio-slider__toolbar">
        {/* Left Status Pill */}
        <div className="portfolio-slider__live-badge mono">
          <span className={`slider-pulse-dot ${!isPaused ? 'active' : 'paused'}`} />
          <span>
            {isPaused ? 'SLIDER PAUSED' : `FLOWING ${direction.toUpperCase()} // 60 FPS`}
          </span>
        </div>

        {/* Center / Right Control Actions */}
        <div className="portfolio-slider__actions">
          {/* Direction toggle */}
          <button
            type="button"
            className="slider-control-btn mono"
            onClick={() => setDirection(prev => (prev === 'left' ? 'right' : 'left'))}
            title={`Reverse direction (Current: ${direction})`}
          >
            {direction === 'left' ? <FiArrowLeft /> : <FiArrowRight />}
            <span>{direction === 'left' ? 'To Left' : 'To Right'}</span>
          </button>

          {/* Speed Toggle */}
          <button
            type="button"
            className={`slider-control-btn mono ${speedLevel === 'fast' ? 'active' : ''}`}
            onClick={() =>
              setSpeedLevel(prev =>
                prev === 'normal' ? 'fast' : prev === 'fast' ? 'slow' : 'normal'
              )
            }
            title="Cycle slider speed"
          >
            <FiRotateCw />
            <span>Speed: {speedLevel.toUpperCase()}</span>
          </button>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            className={`slider-control-btn mono ${isPaused ? 'paused' : ''}`}
            onClick={() => setIsPaused(prev => !prev)}
            title={isPaused ? 'Resume sliding' : 'Pause slider'}
          >
            {isPaused ? <FiPlay /> : <FiPause />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Manual Step Arrows */}
          <div className="slider-nav-arrows">
            <button
              type="button"
              className="slider-arrow-btn"
              onClick={() => stepSlide('right')}
              aria-label="Nudge slider left"
              title="Step backward"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              className="slider-arrow-btn"
              onClick={() => stepSlide('left')}
              aria-label="Nudge slider right"
              title="Step forward"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        className="portfolio-slider__viewport"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft edge blur vignettes on left and right */}
        <div className="portfolio-slider__fade portfolio-slider__fade--left" />
        <div className="portfolio-slider__fade portfolio-slider__fade--right" />

        {/* Infinite Moving Track */}
        <div
          ref={trackRef}
          className="portfolio-slider__track"
          style={{ gap: `${gap}px` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {loopItems.map((item, index) => {
            const actualIndex = index % items.length
            return (
              <div
                key={`${item.title}-${index}`}
                className="portfolio-slider__item-wrapper"
              >
                <article
                  className="portfolio-slider-card"
                  onClick={() => {
                    if (!hasDraggedRef.current) {
                      onSelect?.(item, actualIndex)
                    }
                  }}
                >
                  {/* Card Header Meta */}
                  <div className="portfolio-slider-card__header mono">
                    <span className="slider-card__index-pill">
                      0{actualIndex + 1} / 0{items.length}
                    </span>
                    <span className="slider-card__verified-badge">
                      <FiCheckCircle className="badge-icon" />
                      <span>VERIFIED ARCHIVE</span>
                    </span>
                  </div>

                  {/* Card Media Stage (High-Res Certificate) */}
                  <div className="portfolio-slider-card__stage">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      draggable={false}
                      className="portfolio-slider-card__image"
                    />

                    {/* Subtle Inner Glass Sheen & Dark Corner Gradient */}
                    <div className="portfolio-slider-card__glass" />

                    {/* Hover Quick Action Overlay */}
                    <div className="portfolio-slider-card__hover-overlay mono">
                      <button
                        type="button"
                        className="hover-inspect-pill"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect?.(item, actualIndex)
                        }}
                        title={`Inspect ${item.title}`}
                        aria-label={`Inspect ${item.title}`}
                      >
                        <span>Inspect Document</span>
                        <FiMaximize2 />
                      </button>
                    </div>
                  </div>

                  {/* Card Footer Details */}
                  <div className="portfolio-slider-card__footer">
                    <div className="portfolio-slider-card__info">
                      <h3 className="portfolio-slider-card__title">
                        {item.title}
                      </h3>
                      <p className="portfolio-slider-card__sub mono">
                        <span>{item.issuer}</span>
                        <span className="dot-sep">·</span>
                        <span className="year-pill">{item.year}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="portfolio-slider-card__btn"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect?.(item, actualIndex)
                      }}
                      title={`Inspect ${item.title}`}
                      aria-label={`Inspect ${item.title}`}
                    >
                      <FiMaximize2 />
                    </button>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="portfolio-slider__hint mono muted">
        <span>Drag track left / right to scrub freely · Hover to slow down · Click any card to inspect full credential</span>
      </div>
    </div>
  )
}
