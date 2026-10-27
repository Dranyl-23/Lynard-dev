import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Cursor } from './components/Cursor'
import { MouseTrail } from './components/MouseTrail'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { ResumeModal } from './components/ResumeModal'
import { RevealFooter } from './components/RevealFooter'
import { ScrollProgress } from './components/ScrollProgress'
import { ThemeCurtain } from './components/ThemeCurtain'
import { About } from './components/sections/About'
import { Certificates } from './components/sections/Certificates'
import { CommitTruck } from './components/sections/CommitTruck'
import { Contact } from './components/sections/Contact'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { initSmoothScroll, startScroll, stopScroll } from './lib/scroll'

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (ready) startScroll()
    else stopScroll()
  }, [ready])

  return (
    <MotionConfig reducedMotion="user">
      <MouseTrail />
      <Cursor />
      <ScrollProgress />
      <ThemeCurtain />
      <AnimatePresence>{!ready && <Preloader onDone={done} />}</AnimatePresence>
      <Nav ready={ready} />
      <ResumeModal />
      <main>
        <Hero ready={ready} />
        <About />
        <Projects />
        <Skills />
        <Certificates />
        <Experience />
        <CommitTruck />
        <Contact />
      </main>
      <RevealFooter />
    </MotionConfig>
  )
}
