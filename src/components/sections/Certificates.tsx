import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { certificatesData } from '../../data/portfolioData';
import { CertificateItem } from '../../types/portfolio';
import { SectionHeader } from '../ui/SectionHeader';
import { EXPO_OUT } from '../ui/FadeIn';
import { useLenisScroll } from '../LenisProvider';
import { X, ExternalLink } from '../icons/UIIcons';

interface CertificateCardProps {
  cert: CertificateItem;
  onSelect: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ cert, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-[260px] shrink-0 cursor-pointer flex-col rounded-2xl border border-line bg-white p-3 text-left shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_20px_40px_-20px_rgba(20,20,20,0.25)] sm:w-[310px] sm:rounded-3xl sm:p-4"
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-paper p-2 sm:rounded-2xl sm:p-3">
        <img
          src={cert.src}
          alt={cert.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain object-center grayscale transition-all duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
      <div className="px-1 pb-0.5 pt-3 sm:pt-3.5">
        <p className="truncate text-xs font-semibold text-ink transition-colors group-hover:text-ink sm:text-[13.5px]">
          {cert.name}
        </p>
      </div>
    </button>
  );
};

export const Certificates: React.FC = () => {
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);
  const { lockScroll } = useLenisScroll();

  useEffect(() => {
    lockScroll(!!activeCert);
    return () => lockScroll(false);
  }, [activeCert, lockScroll]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCert(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Multipliers to guarantee seamless loop even on ultra-wide screens
  const itRepeats = [...certificatesData.it, ...certificatesData.it];
  const nonItRepeats = [
    ...certificatesData.nonIt,
    ...certificatesData.nonIt,
    ...certificatesData.nonIt
  ];

  return (
    <section id="certificates" className="overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <SectionHeader
          ghost="CREDENTIALS"
          label="CERTIFICATES"
          sub="Gallery of certifications in IT and non-IT fields."
        />
      </div>

      {/* Row 1: IT Field Horizontal Marquee */}
      <div className="mt-10 sm:mt-14">
        <div className="section-container mb-3 sm:mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            IT Field · {certificatesData.it.length} Certificates
          </span>
        </div>

        <div className="marquee-mask relative w-full overflow-hidden py-2">
          <div
            className="marquee-track flex gap-4 sm:gap-6"
            style={{ '--marquee-duration': '42s' } as React.CSSProperties}
          >
            {/* Loop Segment 1 */}
            <div className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6">
              {itRepeats.map((cert, idx) => (
                <CertificateCard
                  key={`it-1-${cert.name}-${idx}`}
                  cert={cert}
                  onSelect={() => setActiveCert(cert)}
                />
              ))}
            </div>
            {/* Loop Segment 2 */}
            <div
              className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6"
              aria-hidden="true"
            >
              {itRepeats.map((cert, idx) => (
                <CertificateCard
                  key={`it-2-${cert.name}-${idx}`}
                  cert={cert}
                  onSelect={() => setActiveCert(cert)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Non-IT Field Horizontal Marquee */}
      <div className="mt-8 sm:mt-12">
        <div className="section-container mb-3 sm:mb-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Non-IT Field · {certificatesData.nonIt.length} Certificates
          </span>
        </div>

        <div className="marquee-mask relative w-full overflow-hidden py-2">
          <div
            className="marquee-track reverse flex gap-4 sm:gap-6"
            style={{ '--marquee-duration': '48s' } as React.CSSProperties}
          >
            {/* Loop Segment 1 */}
            <div className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6">
              {nonItRepeats.map((cert, idx) => (
                <CertificateCard
                  key={`nonit-1-${cert.name}-${idx}`}
                  cert={cert}
                  onSelect={() => setActiveCert(cert)}
                />
              ))}
            </div>
            {/* Loop Segment 2 */}
            <div
              className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6"
              aria-hidden="true"
            >
              {nonItRepeats.map((cert, idx) => (
                <CertificateCard
                  key={`nonit-2-${cert.name}-${idx}`}
                  cert={cert}
                  onSelect={() => setActiveCert(cert)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            data-lenis-prevent
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: EXPO_OUT }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] max-w-4xl flex-col items-center overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-2xl sm:p-6"
            >
              <div className="mb-4 flex w-full items-center justify-between border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Credential Preview
                  </span>
                  <h3 className="font-display text-base font-bold text-ink sm:text-lg">
                    {activeCert.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-paper p-2">
                <img
                  src={activeCert.src}
                  alt={activeCert.name}
                  className="max-h-full max-w-full object-contain shadow-sm"
                />
              </div>

              <div className="mt-4 flex w-full items-center justify-end">
                <a
                  href={activeCert.src}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-neutral-950 dark:hover:bg-accent dark:hover:text-neutral-950"
                >
                  <span>Open Full Resolution</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
