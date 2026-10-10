import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects, projectPalettes } from '../../data/portfolioData';
import { Project } from '../../types/portfolio';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectModal } from './ProjectModal';
import { useLenisScroll } from '../LenisProvider';
import { ArrowUpRight, CategoryIcon } from '../icons/UIIcons';
import { EXPO_OUT } from '../ui/FadeIn';

const ProjectCard: React.FC<{
  project: Project;
  palette: string;
  index: number;
  onOpen: () => void;
}> = ({ project, palette, index, onOpen }) => {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const rotateXQuick = useRef<((val: number) => void) | null>(null);
  const rotateYQuick = useRef<((val: number) => void) | null>(null);
  const thumbXQuick = useRef<((val: number) => void) | null>(null);
  const thumbYQuick = useRef<((val: number) => void) | null>(null);
  const arrowXQuick = useRef<((val: number) => void) | null>(null);
  const arrowYQuick = useRef<((val: number) => void) | null>(null);

  useGSAP(() => {
    if (!cardRef.current) return;
    rotateXQuick.current = gsap.quickTo(cardRef.current, 'rotateX', {
      duration: 0.3,
      ease: 'power2.out'
    });
    rotateYQuick.current = gsap.quickTo(cardRef.current, 'rotateY', {
      duration: 0.3,
      ease: 'power2.out'
    });
    if (thumbRef.current) {
      thumbXQuick.current = gsap.quickTo(thumbRef.current, 'x', {
        duration: 0.35,
        ease: 'power2.out'
      });
      thumbYQuick.current = gsap.quickTo(thumbRef.current, 'y', {
        duration: 0.35,
        ease: 'power2.out'
      });
    }
    if (arrowRef.current) {
      arrowXQuick.current = gsap.quickTo(arrowRef.current, 'x', {
        duration: 0.25,
        ease: 'power2.out'
      });
      arrowYQuick.current = gsap.quickTo(arrowRef.current, 'y', {
        duration: 0.25,
        ease: 'power2.out'
      });
    }
  }, { scope: cardRef });

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1.03,
      duration: 0.35,
      ease: 'power2.out'
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Palpable, responsive 14-degree tilt
    const maxTilt = 14;
    rotateXQuick.current?.(-y * maxTilt * 2);
    rotateYQuick.current?.(x * maxTilt * 2);

    // Multi-layer physical parallax offsets
    thumbXQuick.current?.(x * 12);
    thumbYQuick.current?.(y * 12);
    arrowXQuick.current?.(x * 24);
    arrowYQuick.current?.(y * 24);

    if (glareRef.current) {
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.65,
      ease: 'power2.out'
    });
    if (thumbRef.current) {
      gsap.to(thumbRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    }
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: EXPO_OUT }}
      style={{ perspective: 1100 }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onClick={onOpen}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title} project details`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="group relative h-full cursor-pointer rounded-2xl border border-line bg-card p-2.5 transition-shadow duration-300 hover:shadow-[0_32px_64px_-24px_rgba(20,20,20,0.32)] dark:hover:shadow-[0_32px_64px_-24px_rgba(0,0,0,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {/* Dynamic Specular Glare Overlay */}
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-2xl opacity-0 transition-opacity duration-300"
        />

        {/* Thumbnail Layer with 3D Elevation & Parallax Offset */}
        <div
          ref={thumbRef}
          style={{ transform: 'translateZ(26px)', transformStyle: 'preserve-3d' }}
          className={`relative h-44 overflow-hidden rounded-xl sm:h-64 ${
            project.image && !imgError ? 'bg-paper' : `bg-gradient-to-br ${palette}`
          }`}
        >
          {project.image && !imgError ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out-expo group-hover:scale-110">
              <span className="font-display px-6 text-center text-xl font-black uppercase text-white/25 sm:text-2xl">
                {project.title}
              </span>
            </div>
          )}

          {/* Hover Action Circle (Floating High in 3D) */}
          <div
            ref={arrowRef}
            style={{ transform: 'translateZ(44px)' }}
            className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-500 ease-out-expo group-hover:bg-ink/20 group-hover:opacity-100"
          >
            <span className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-white text-ink shadow-2xl transition-all duration-500 ease-out-expo group-hover:scale-100">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>

        {/* Title & Metadata Layer with 3D Elevation */}
        <div
          style={{ transform: 'translateZ(16px)' }}
          className="px-2 pb-2.5 pt-3 sm:px-2.5 sm:pb-3 sm:pt-4"
        >
          <h3 className="text-[15px] font-semibold leading-snug text-ink sm:text-[17px]">
            {project.title}
          </h3>

          <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
            <span className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[11px] text-ink/80 sm:px-3.5 sm:py-1.5 sm:text-xs">
              <CategoryIcon category={project.category} className="h-3 w-3" />
              {project.category}
            </span>
            <span className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[11px] text-ink/80 sm:px-3.5 sm:py-1.5 sm:text-xs">
              {project.stack.slice(0, 3).map((stk, sIdx) => (
                <span key={stk} className="inline-flex items-center gap-1">
                  {sIdx > 0 && <span className="text-ink/30">•</span>}
                  <span>{stk}</span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const Projects: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'Client' | 'Personal'>('Client');
  const [activeProject, setActiveProject] = useState<{
    project: Project;
    palette: string;
  } | null>(null);

  const { lockScroll } = useLenisScroll();

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.status === selectedTab);
  }, [selectedTab]);

  const counts = useMemo(
    () => ({
      Client: projects.filter((p) => p.status === 'Client').length,
      Personal: projects.filter((p) => p.status === 'Personal').length
    }),
    []
  );

  const handleOpen = (project: Project, palette?: string) => {
    const idx = filteredProjects.findIndex((p) => p.title === project.title);
    const pal = palette || projectPalettes[idx % projectPalettes.length];
    setActiveProject({ project, palette: pal });
  };

  useEffect(() => {
    lockScroll(!!activeProject);
    return () => lockScroll(false);
  }, [activeProject, lockScroll]);

  return (
    <section id="work" className="py-16 sm:py-24 lg:py-32">
      <div className="section-container">
        <SectionHeader ghost="WORK" label="SELECTED WORK" />

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
            Selected client builds and personal products across web, mobile, and decentralized systems.
          </p>

          {/* Project type filter tabs */}
          <div
            role="tablist"
            aria-label="Project filter"
            className="inline-flex shrink-0 items-center rounded-full border border-line bg-paper p-1"
          >
            {(['Client', 'Personal'] as const).map((tab) => {
              const isSelected = selectedTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedTab(tab)}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-300 cursor-pointer ${
                    isSelected ? 'work-tab-active font-bold' : 'work-tab-inactive'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="tab-pill"
                      className="work-tab-bg absolute inset-0 rounded-full"
                      transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab} ({counts[tab]})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const palette = projectPalettes[index % projectPalettes.length];
              return (
                <ProjectCard
                  key={project.title}
                  project={project}
                  palette={palette}
                  index={index}
                  onOpen={() => handleOpen(project, palette)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject.project}
            palette={activeProject.palette}
            siblings={filteredProjects}
            onClose={() => setActiveProject(null)}
            onSelect={(newProject) => handleOpen(newProject)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
