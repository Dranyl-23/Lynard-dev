# Alfie Lynard — Software Engineer & Full-Stack Developer Portfolio

An editorial, high-performance developer portfolio built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, featuring Lenis smooth scrolling, adaptive light/dark mode transitions, interactive project showcases, and a hardened contact system protected by **Google reCAPTCHA** and **Web3Forms**.

🔗 **Live URL:** [https://lynard.vercel.app](https://lynard.vercel.app)  
👤 **Author:** Alfie Lynard ([@Dranyl-23](https://github.com/Dranyl-23))

---

## ✨ Features

- **Editorial Brutalist Design:** Inspired by top-tier creative developer portfolios with sharp typography, grain textures, and fluid layouts.
- **Lenis Smooth Scroll:** 60fps momentum-based scrolling with custom cursor tracking and parallax depth.
- **Theme-Adaptive Visuals:** Silky smooth circular ripple theme transition between Light and Dark OLED themes with synchronized loading animation.
- **Responsive Architecture:** Fully auto-adjusting viewports (`100dvh` / mobile hero pills layout tested on all screen widths from 360px+ to 4K displays).
- **Interactive Work & Services:**
  - Case study modals with live preview links, tech badges, and high-res imagery.
  - Interactive certificates marquee and achievements showcase.
  - Full-stack capability cards with responsive status badges.
- **Hardened Contact System:**
  - Powered by **Web3Forms** with verified inbox delivery to `alfielynard23@gmail.com`.
  - **Google reCAPTCHA v2** verification ("I'm not a robot" check).
  - Multi-layer **Honeypot Trap (`botcheck`)** that silently catches and drops automated web scrapers.
  - **Human Interaction Timing Guard** & 45-second anti-flood submission cooldown.
  - Automatic `mailto:` client fallback for offline or blocked environments.
- **Enterprise Security & Performance:**
  - Optimized Vite chunk splitting (`vendor`, `motion`, `icons`, `lenis`) for edge caching (<150 kB gzipped JS).
  - `vercel.json` configured with HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, strict Referrer & Permissions policies) and SPA wildcard rewrites.
  - Rich OpenGraph & Twitter Cards for social media sharing previews on LinkedIn, Twitter, Discord, and WhatsApp.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Core** | React 19, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Custom CSS Animations, SVG filters |
| **Motion & Scroll** | Framer Motion, Lenis Smooth Scroll |
| **Icons** | Lucide React, Custom SVG Vectors |
| **Security & Forms** | Google reCAPTCHA v2, Web3Forms API, Honeypot Shield |
| **Deployment** | Vercel Edge Network |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm or pnpm / yarn

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

3. **Configure Environment Variables (Optional):**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   *(The project includes pre-configured fallbacks, so it works out of the box even without setting variables).*

4. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

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
├── public/                 # Static assets, certificate images, project screenshots, and profile
│   ├── certs/              # Verified credentials and hackathon certificates
│   └── projects/           # High-resolution case study mockups
├── src/
│   ├── components/
│   │   ├── icons/          # Tech stack and UI vector icons
│   │   ├── sections/       # Hero, About, TechStack, Work, Experience, Services, Contact, Footer
│   │   └── ui/             # Modals, CustomSelect, LoadingScreen, RecaptchaWidget, ThemeRipple
│   ├── context/            # ThemeContext (Light/Dark/System with accent colors)
│   ├── data/               # portfolioData.ts (Single source of truth for all content)
│   ├── services/           # contactService.ts (Web3Forms API + Honeypot & input sanitizer)
│   └── types/              # TypeScript interface definitions
├── vercel.json             # Vercel SPA routing and HTTP security headers
└── vite.config.ts          # Rollup manual chunking & Tailwind Vite plugin
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
