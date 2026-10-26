# Alfie Lynard Polacas — Full-Stack & DevOps Engineer Portfolio

An editorial, high-performance developer portfolio built with **React 19**, **TypeScript**, **Vite 8**, and **Framer Motion**, powered by **Lenis** momentum smooth scrolling, interactive 3D canvas perspective carousels, responsive project showcases, and a bespoke origami postal contact experience.

🔗 **Live URL:** [https://www.lynard-dev.website](https://www.lynard-dev.website)  
👤 **Author:** Alfie Lynard Polacas ([@Dranyl-23](https://github.com/Dranyl-23))  
📍 **Location:** Digos City, Davao del Sur, Philippines (GMT+8)  
✉️ **Direct Contact:** [alfielynard23@gmail.com](mailto:alfielynard23@gmail.com)

---

## ✨ Features

- **Editorial Brutalist & Minimalist Design:** High-contrast dark typography (`Instrument Serif`, `Inter`, and `JetBrains Mono`), refined layout rhythms, and an OLED dark aesthetic (`#0a0a0a`).
- **Lenis Smooth Scroll:** 60fps momentum-based scrolling synced with a smooth scroll progress indicator and parallax depth.
- **Interactive Mouse Trail & Cursor:** Custom canvas-driven particle trailing effect paired with a magnetic custom cursor that scales and highlights interactive targets.
- **Framer Curved Carousel (Certificates):**
  - Real-time 2D cylindrical arc projection rendered on an offscreen canvas atlas with 1px column slicing.
  - Smooth autoplay physics with drag momentum, directional flip, step buttons, and pause/resume controls.
  - Interactive click-to-inspect Lightbox modal for high-resolution certificate verification.
- **Selected Projects Showcase:**
  - Dynamic cursor-following preview card with instant hover suppression when aiming for action buttons.
  - Inline expandable project drawer with browser window mockups, key metrics, technical highlights, and direct live/source links.
- **Interactive Origami Postal Contact Form:**
  - Real-time form state calculation that folds the contact card into a digital envelope.
  - 3D wax seal stamping animation and animated mailbox delivery sequence.
  - Direct one-click email copying with clipboard feedback and native `mailto:` fallback.
- **Multi-Page Resume Viewer:** In-app modal viewer for resume inspection (Pages 1 & 2) with direct PDF download support.
- **Interactive World Map Background:** Vector world projection background subtly anchoring the global contact section.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Core** | React 19, TypeScript, Vite 8 |
| **Styling & Typography** | Custom Modern CSS (Design Tokens, Grid, Flexbox, Fluid Clamps), Instrument Serif, Inter, JetBrains Mono |
| **Animation & Physics** | Framer Motion, Lenis Smooth Scroll, HTML5 Canvas 2D |
| **Icons** | React Icons (`react-icons/fi`) |
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
│   │   ├── certificate/        # Verified credentials and hackathon certificates
│   │   ├── projects/           # High-resolution case study mockups
│   │   └── resume/             # Multi-page resume imagery
│   ├── components/             # Reusable UI components & animations
│   │   ├── sections/           # Core page sections
│   │   │   ├── Hero.tsx        # Hero with status pill, editorial titles & stats
│   │   │   ├── About.tsx       # Bio, image reveal & resume preview modal trigger
│   │   │   ├── Projects.tsx    # Project list with cursor preview & expandable drawer
│   │   │   ├── Skills.tsx      # Categorized skill badges & marquee ticker
│   │   │   ├── Certificates.tsx # Certificates section hosting CurvedCarousel & Lightbox
│   │   │   ├── Experience.tsx  # Work & education chronological timeline
│   │   │   └── Contact.tsx     # Contact info, social links & postal letter form
│   │   ├── Cursor.tsx          # Custom magnetic cursor
│   │   ├── CurvedCarousel.tsx  # Framer 3D cylindrical arc canvas carousel
│   │   ├── MouseTrail.tsx      # Canvas mouse particle trail
│   │   ├── Nav.tsx             # Fixed header with magnetic navigation links
│   │   ├── Photo.tsx           # Image wrapper with reveal animations
│   │   ├── PostalContactForm.tsx # Origami postal letter & 3D wax-seal animation
│   │   ├── Preloader.tsx       # Typography countdown preloader
│   │   ├── ResumeModal.tsx     # Multi-page resume viewer & PDF download modal
│   │   ├── ScrollProgress.tsx  # Top scroll progress bar
│   │   ├── SectionHeader.tsx   # Numbered editorial section header
│   │   ├── SplitText.tsx       # Framer Motion staggered character/word reveal
│   │   └── WorldMapBackground.tsx # Interactive vector world map background
│   ├── data/
│   │   ├── content.ts          # Single source of truth (profile, projects, skills, certs)
│   │   └── worldMapPath.ts     # SVG coordinate paths for world map projection
│   ├── lib/
│   │   ├── motion.ts           # Shared easing curves and motion presets
│   │   └── scroll.ts           # Lenis smooth scroll engine controller
│   ├── App.tsx                 # Root layout & component composition
│   ├── index.css               # Design tokens, typography & brutalist styling
│   └── main.tsx                # React application entrypoint
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🌟 Featured Projects

- **[Reminda](https://getreminda.vercel.app/)** *(2026)* &mdash; Smart Academic Timetable & AI Schedule Scanner built with Flutter, Next.js, Gemini AI, Firebase, and Hive DB.
- **[Chainbudget](https://chainbudget.vercel.app/)** *(2025)* &mdash; On-Chain Organizational Treasury & Budget Governance powered by Polygon Amoy, Solidity, Express, and MongoDB.
- **[Navy Sharks](https://www.navysharks.com/)** *(2025)* &mdash; Members-Only Luxury Lifestyle & Travel Concierge Club platform across Southeast Asia and LATAM.
- **[Report Davao](https://report-davao.vercel.app/)** *(2024)* &mdash; Civic Incident Mapping & Community Action Platform for Davao City residents.
- **[4ps-Nexus](https://4-ps-nexus.vercel.app/)** *(2024)* &mdash; Programmable Social Welfare Disbursement portal on Stellar Soroban with WebAuthn biometric passkeys.

---

## 📜 Verified Certificates & Honors

- **Arbitrum Learner** &mdash; HackQuest × Arbitrum (2026)
- **Rust School — Systems & Web3** &mdash; H.E.R. DAO (2026)
- **Resource Speaker — FigmaFusion** &mdash; Cor Jesu College CCIS (2026)
- **OpenxAI Mini App Competition** &mdash; Davao DeFi × Certifika (2025)
- **Base Community Townhall IRL** &mdash; Base Philippines (2025)
- **Stellar PH Builder Hackathon** &mdash; Stellar Philippines (2025)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
