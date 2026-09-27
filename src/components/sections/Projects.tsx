import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: EXPO_OUT }}
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl border border-line bg-white p-2.5 transition-shadow duration-500 hover:shadow-[0_32px_64px_-32px_rgba(20,20,20,0.4)]"
    >
      {/* Thumbnail */}
      <div
        className={`relative h-44 overflow-hidden rounded-xl sm:h-64 ${
          project.image && !imgError ? 'bg-paper' : `bg-gradient-to-br ${palette}`
        }`}
      >
        {project.image && !imgError ? (
          <img
            src={project.image}
            alt={project.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out-expo group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out-expo group-hover:scale-110">
            <span className="font-display display-tight px-6 text-center text-xl font-black uppercase text-white/25 sm:text-2xl">
              {project.title}
            </span>
          </div>
        )}

        {/* Hover Action Circle */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-700 ease-out-expo group-hover:bg-ink/25 group-hover:opacity-100">
          <span className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-white text-ink shadow-xl transition-all duration-700 ease-out-expo group-hover:scale-100">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="px-2 pb-2.5 pt-3 sm:px-2.5 sm:pb-3 sm:pt-4">
        <h3 className="text-[15px] font-semibold leading-snug text-ink sm:text-[17px]">
          {project.title}
        </h3>

        <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
          <span className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[11px] text-ink/80 sm:px-3.5 sm:py-1.5 sm:text-xs">
            <CategoryIcon category={project.category} className="h-3 w-3" />
            {project.category}
          </span>
          <span className="pill-shadow inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[11px] text-ink/80 sm:px-3.5 sm:py-1.5 sm:text-xs">
            {project.stack.slice(0, 3).map((stk, sIdx) => (
              <span key={stk} className="inline-flex items-center gap-1">
                {sIdx > 0 && <span className="text-ink/30">•</span>}
                <span>{stk}</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export const Projects: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'Live' | 'Private'>('Live');
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
      Live: projects.filter((p) => p.status === 'Live').length,
      Private: projects.filter((p) => p.status === 'Private').length
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
        <SectionHeader ghost="WORK" label="SELECTED WORK" kicker="Featured" />

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
            Live products and private builds across web, mobile, education, and government systems.
          </p>

          {/* Visibility filter tabs */}
          <div
            role="tablist"
            aria-label="Project visibility"
            className="inline-flex shrink-0 items-center rounded-full border border-line bg-paper p-1"
          >
            {(['Live', 'Private'] as const).map((tab) => {
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
                      transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
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
