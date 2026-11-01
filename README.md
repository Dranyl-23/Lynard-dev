# Alfie Lynard Polacas — Full-Stack & DevOps Engineer Portfolio

An editorial, high-performance developer portfolio built with **React 19**, **TypeScript**, **Vite 8**, and **Framer Motion**, powered by **Lenis** momentum smooth scrolling, a sticky scroll-driven 3D certificate stack, Verlet-physics ID lanyard, pixel-art GitHub telemetry semi-truck, responsive project case studies, and a bespoke 3D origami postal contact experience.

🔗 **Live URL:** [https://www.lynard-dev.website](https://www.lynard-dev.website)  
👤 **Author:** Alfie Lynard Polacas ([@Dranyl-23](https://github.com/Dranyl-23))  
📍 **Location:** Digos City, Davao del Sur, Philippines (GMT+8)  
✉️ **Direct Contact:** [alfielynard23@gmail.com](mailto:alfielynard23@gmail.com)

---

## ✨ Features

- **Editorial Brutalist & Minimalist Design:** High-contrast dark/light themes (`Instrument Serif`, `Inter`, and `JetBrains Mono`) with a 5-column architectural curtain transition (`ThemeCurtain`).
- **Lenis Smooth Scroll:** 60fps desktop momentum scrolling synced with a spring scroll progress indicator and parallax depth (automatically yields to native touch scrolling on mobile).
- **Interactive Mouse Trail, Cursor & Glyph Physics:** Custom canvas-driven ribbon trail (`mix-blend-mode: difference`), magnetic cursor with contextual labels, and spring-physics character repulsion on the Hero heading.
- **2D Verlet Physics ID Lanyard:** Custom 120Hz fixed-timestep rope and rigid-body badge simulation with free-fall drop, elastic bounce, and interactive pointer drag/throw.
- **Scroll-Driven 3D Certificate Stack & Lightbox:**
  - Sticky-pinned 3D perspective card deck that peels cards upward as the user scrolls through the section track.
  - Interactive click-to-inspect fullscreen Lightbox modal with keyboard arrow navigation for high-resolution certificate verification.
- **Selected Projects Showcase:**
  - Dynamic cursor-following preview card with automatic hover suppression over action buttons.
  - Inline expandable project drawer with browser window mockups, key metrics, technical highlights, and direct live/source links.
- **Open-Source Contribution Semi-Truck:**
  - Live rolling 365-day GitHub contribution heatmap rendered onto a 53ft intermodal container pulled by a pixel-art European cab-over-engine semi-truck with spinning alloy wheels and static JSON fallback.
- **Interactive Origami Postal Contact Form:**
  - Real-time validation and Web3Forms submission that folds the contact letter into a 3D envelope, stamps a wax seal, and flies it into an animated two-layer SVG mailbox.
  - Direct one-click email copying with clipboard feedback and native `mailto:` fallback.
- **Procedural Ink-Reveal Footer:** HTML5 2D canvas footer with a procedural multi-harmonic deckle edge and scattered ink flecks.
- **Multi-Page Resume Viewer:** In-app modal viewer for resume inspection (2-Page Spread or single-page tabs) with direct PDF download support.
- **Interactive World Map Background:** Equirectangular vector world projection with animated signal arcs radiating from Digos City (`DVO`).

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Core** | React 19, TypeScript 6, Vite 8 |
| **Styling & Typography** | Custom Modern CSS & CSS Modules (Design Tokens, Grid, Fluid Clamps), Instrument Serif, Inter, JetBrains Mono |
| **Animation & Physics** | Framer Motion 14, Custom Verlet & Spring Physics, Lenis Smooth Scroll, HTML5 Canvas 2D |
| **Icons** | React Icons (`react-icons/fi`, `react-icons/si`, `react-icons/gr`) |
| **Tooling & Linter** | Oxlint, TypeScript Compiler (`tsc`) |
| **Deployment** | Vercel Edge Network |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dranyl-23/Lynard-dev.git
   cd Lynard-dev
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Lint code:**
   ```bash
   npm run lint
   ```

5. **Create production build:**
   ```bash
   npm run build
   ```

6. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
├── public/                     # Static public assets (favicon.svg)
├── src/
│   ├── assets/                 # Profile photos, resume PDF, certificates & project mockups
│   │   ├── certificate/        # Verified credentials and hackathon certificates (.webp)
│   │   ├── projects/           # High-resolution case study mockups (.webp / .jpg)
│   │   └── resume/             # Multi-page resume imagery (.webp)
│   ├── components/             # Reusable UI components & animations
│   │   ├── sections/           # Core page sections
│   │   │   ├── Hero.tsx        # Hero with Manila clock, dot-grid spotlight & glyph physics
│   │   │   ├── About.tsx       # ScrollText statement, Verlet Lanyard & stats counter
│   │   │   ├── Projects.tsx    # Project list with cursor preview & expandable drawer
│   │   │   ├── Skills.tsx      # Categorized skill badges & marquee ticker
│   │   │   ├── Certificates.tsx # Sticky scroll-driven 3D card stack & Lightbox modal
│   │   │   ├── Experience.tsx  # Work & education chronological timeline
│   │   │   ├── CommitTruck.tsx # Pixel-art GitHub contribution semi-truck
│   │   │   └── Contact.tsx     # World map, social links & origami postal form
│   │   ├── Cursor.tsx          # Custom spring-physics magnetic cursor
│   │   ├── Lanyard.tsx         # 2D Verlet rope & rigid-body ID badge simulation
│   │   ├── Magnetic.tsx        # Spring magnetic pull wrapper
│   │   ├── Marquee.tsx         # Infinite horizontal tech stack ticker
│   │   ├── MaskReveal.tsx      # Radial-gradient hover mask reveal
│   │   ├── MouseTrail.tsx      # Canvas quadratic-curve mouse ribbon trail
│   │   ├── Nav.tsx             # Scroll-direction-aware header & mobile drawer
│   │   ├── Photo.tsx           # Grayscale image wrapper with fallback
│   │   ├── PostalContactForm.tsx # 3D origami envelope, wax seal & mailbox animation
│   │   ├── Preloader.tsx       # Counter & 5-column curtain preloader
│   │   ├── ResumeModal.tsx     # Multi-page resume viewer & PDF download modal
│   │   ├── RevealFooter.tsx    # Procedural ink-reveal canvas footer
│   │   ├── ScrollProgress.tsx  # Top scroll progress bar
│   │   ├── ScrollText.tsx      # Scroll-linked word-by-word opacity illumination
│   │   ├── SectionHeader.tsx   # Numbered editorial section header
│   │   ├── SplitText.tsx       # Framer Motion staggered character/word reveal
│   │   ├── StackIcons.tsx      # Tech stack icon registry
│   │   ├── ThemeCurtain.tsx    # 5-column dark/light theme transition curtain
│   │   └── WorldMapBackground.tsx # Equirectangular world map & animated Bezier arcs
│   ├── data/
│   │   ├── content.ts          # Single source of truth (profile, projects, skills, certs)
│   │   ├── githubCommits.json  # Static fallback for GitHub contribution graph
│   │   └── worldMapPath.ts     # SVG coordinate paths for world map projection
│   ├── lib/
│   │   ├── motion.ts           # Shared easing curves and motion presets
│   │   ├── scroll.ts           # Lenis smooth scroll engine controller
│   │   └── theme.ts            # Dark/light theme state & transition coordinator
│   ├── App.tsx                 # Root layout & component composition
│   ├── index.css               # Design tokens, typography & editorial styling
│   └── main.tsx                # React application entrypoint
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler & chunk-splitting configuration
```

---

## 🌟 Featured Projects

- **[4Ps-Nexus](https://4-ps-nexus.vercel.app/)** *(2024)* &mdash; Programmable Social Welfare Disbursement portal on Stellar Soroban with WebAuthn biometric passkeys.
- **[Reminda](https://getreminda.vercel.app/)** *(2026)* &mdash; Smart Academic Timetable & AI Schedule Scanner built with Flutter, Next.js, Gemini AI, Firebase, and Hive DB.
- **[Chainbudget](https://chainbudget.vercel.app/)** *(2025)* &mdash; On-Chain Organizational Treasury & Budget Governance powered by Polygon Amoy, Solidity, Express, and MongoDB.
- **[Navy Sharks](https://www.navysharks.com/)** *(2025)* &mdash; Members-Only Luxury Lifestyle & Travel Concierge Club platform across Southeast Asia and LATAM.
- **[Report Davao](https://report-davao.vercel.app/)** *(2024)* &mdash; Civic Incident Mapping & Community Action Platform for Davao City residents.
- **Library Entrance & Attendance Monitoring System** *(2024)* &mdash; Dual-Screen Barcode Check-In & Real-Time Occupancy Kiosk built with Laravel, React, TypeScript, MySQL, and Pusher/Reverb WebSockets.

---

## 📜 Verified Certificates & Honors

- **Arbitrum Learner** &mdash; HackQuest × Arbitrum (2026)
- **Arbitrum Builder** &mdash; HackQuest × Arbitrum (2026)
- **Rust School — Systems & Web3** &mdash; H.E.R. DAO (2026)
- **Resource Speaker — FigmaFusion** &mdash; Cor Jesu College CCIS (2026)
- **OpenxAI Mini App Competition** &mdash; Davao DeFi × Certifika (2025)
- **Base Community Townhall IRL** &mdash; Base Philippines (2025)
- **Stellar PH Builder Hackathon** &mdash; Stellar Philippines (2025)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
