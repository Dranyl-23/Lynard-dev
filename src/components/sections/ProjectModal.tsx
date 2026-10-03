import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/portfolio';
import { profile, projectPalettes } from '../../data/portfolioData';
import { EXPO_OUT } from '../ui/FadeIn';
import { ArrowUpRight, Download, X, CategoryIcon } from '../icons/UIIcons';

interface ProjectModalProps {
  project: Project;
  palette: string;
  siblings: Project[];
  onClose: () => void;
  onSelect: (p: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  palette,
  siblings,
  onClose,
  onSelect
}) => {
  const [imgError, setImgError] = useState(false);
  const hasLink = project.link && project.link !== '#';
  const hasDownload = !!project.download;
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Compute 3 next projects for bottom section
  const currentIdx = siblings.findIndex((p) => p.title === project.title);
  const nextProjects = [
    ...siblings.slice(currentIdx + 1),
    ...siblings.slice(0, currentIdx)
  ].slice(0, 3);

  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 16;
    setCanScrollDown(!isAtBottom);
  };

  useEffect(() => {
    setImgError(false);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(checkScroll, 120);
    return () => clearTimeout(timer);
  }, [project.title]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Move focus into the dialog on open, restore it to the trigger on close
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => {
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-detail-title"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.9, ease: EXPO_OUT }}
      className="fixed inset-0 z-[70] flex items-stretch justify-center bg-black/40 outline-none backdrop-blur-sm lg:items-center"
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="flex h-dvh w-full max-h-dvh lg:mx-auto lg:h-auto lg:max-h-[min(88vh,760px)] lg:max-w-7xl lg:px-8">
        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-white lg:max-h-[min(88vh,760px)] lg:flex-none lg:rounded-3xl lg:shadow-[0_30px_80px_-30px_rgba(20,20,20,0.35),0_2px_6px_rgba(20,20,20,0.08)]">
          {/* Header */}
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-white/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md sm:px-5 lg:h-[3.75rem] lg:px-6 lg:py-0 lg:pt-0">
            <div className="flex min-w-0 items-center gap-3">
              {project.logo ? (
                <span className="flex h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-line bg-black p-1 lg:h-11 lg:w-11">
                  <img
                    src={project.logo}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper font-display text-sm font-bold text-ink"
                >
                  {project.title.charAt(0)}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Project details
                </p>
                <p className="truncate text-sm font-semibold leading-tight text-ink">
                  {project.title}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-paper text-ink transition-all duration-500 hover:bg-ink hover:text-white lg:h-9 lg:w-9"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Scrollable Body */}
          <div
            ref={scrollRef}
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            data-lenis-prevent
          >
            <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-stretch lg:gap-6 lg:px-6 lg:py-5">
              {/* Image Preview */}
              <div className="overflow-hidden bg-[#f3f1ea] lg:rounded-2xl lg:border lg:border-line">
                {project.image && !imgError ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    onError={() => setImgError(true)}
                    className="aspect-[4/3] w-full object-contain object-center sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:max-h-[min(46vh,340px)]"
                  />
                ) : (
                  <div
                    className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[220px] lg:max-h-[min(46vh,340px)] ${palette}`}
                  >
                    <span className="font-display display-tight px-6 text-center text-xl font-black uppercase text-white/25 sm:text-2xl">
                      {project.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Details & Info */}
              <div className="flex flex-col px-5 py-5 sm:px-6 sm:py-6 lg:px-0 lg:py-1">
                <div className="flex flex-wrap gap-1.5">
                  <span className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink">
                    <CategoryIcon category={project.category} className="h-3 w-3" />
                    {project.category}
                  </span>
                </div>

                <h2
                  id="project-detail-title"
                  className="font-display mt-3 text-[1.6rem] font-bold leading-tight text-ink sm:text-2xl"
                >
                  {project.title}
                </h2>

                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                  {project.description}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {project.category}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {project.status}
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Tools
                    </dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-ink"
                        >
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {hasLink && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-transform duration-500 hover:scale-[1.03]"
                    >
                      <span>Live Preview</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  )}
                  {hasDownload && (
                    <a
                      href={project.download}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-transform duration-500 hover:scale-[1.03]"
                    >
                      <span>Download</span>
                      <Download className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-y-0.5" />
                    </a>
                  )}
                  <a
                    href={`mailto:${profile.email}?subject=${encodeURIComponent(
                      `Inquiry about ${project.title}`
                    )}`}
                    className="pill-shadow inline-flex cursor-pointer items-center rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-transform duration-500 hover:scale-[1.03]"
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Sibling Projects: Up Next */}
            <section className="border-t border-line bg-paper px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-5 lg:px-6 lg:py-5 lg:pb-5">
              <div className="mb-3">
                <span className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  <span className="h-1 w-1 rounded-full bg-ink" />
                  Up next
                </span>
                <h3 className="font-display display-tight text-lg font-bold uppercase text-ink sm:text-xl">
                  MORE WORK
                </h3>
              </div>

              <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {nextProjects.map((sibling) => {
                  const sIdx = siblings.findIndex((p) => p.title === sibling.title);
                  const sibPalette = projectPalettes[sIdx % projectPalettes.length];
                  return (
                    <button
                      key={sibling.title}
                      type="button"
                      onClick={() => onSelect(sibling)}
                      className="group w-[85%] shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl border border-line bg-white p-2.5 text-left transition-shadow duration-500 hover:shadow-[0_20px_40px_-28px_rgba(20,20,20,0.4)] md:w-auto md:rounded-xl"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-paper">
                        {sibling.image ? (
                          <img
                            src={sibling.image}
                            alt={sibling.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${sibPalette}`}
                          >
                            <span className="font-display text-sm font-bold uppercase text-white/30">
                              {sibling.title}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pt-2">
                        <p className="truncate text-xs font-semibold text-ink">
                          {sibling.title}
                        </p>
                        <p className="text-[10px] text-muted">
                          {sibling.category}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Scroll cue: subtle fade at the bottom edge while more content exists */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-paper via-paper/70 to-transparent transition-opacity duration-300 z-10 ${
              canScrollDown ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};
