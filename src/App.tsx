import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LenisProvider, useLenisScroll } from './components/LenisProvider';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Navbar } from './components/sections/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { TechStack } from './components/sections/TechStack';
import { Projects } from './components/sections/Projects';
import { Experience } from './components/sections/Experience';
import { Achievements } from './components/sections/Achievements';
import { Certificates } from './components/sections/Certificates';
import { Services } from './components/sections/Services';
import { Process } from './components/sections/Process';
import { Testimonials } from './components/sections/Testimonials';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

function AppContent() {
  const { scrollRef, contentRef } = useLenisScroll();
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <div className="grain">
      {/* Cinematic Entrance Loading Screen */}
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {/* Drifting Clouds Fixed Background */}
      <div className="clouds" aria-hidden="true" />

      {/* Main Viewport Application Frame */}
      <div className="app-frame">
        <div ref={scrollRef} className="app-scroll">
          <div ref={contentRef} className="relative">
            <Navbar />
            <main>
              <Hero />
              <About />
              <TechStack />
              <Projects />
              <Experience />
              <Achievements />
              <Certificates />
              <Services />
              <Process />
              <Testimonials />
              <Contact />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <AppContent />
      </LenisProvider>
    </ThemeProvider>
  );
}
