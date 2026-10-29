/**
 * All portfolio content lives here.
 * Everything marked TODO is placeholder text — replace it with your real details.
 */

import profilePhoto from '../assets/Profile.webp'
import resumePdf from '../assets/Alfie-Lynard-Resume.pdf'
import arbitrumCert from '../assets/certificate/Arbitrum-Learner.webp'
import arbitrumBuild from '../assets/certificate/Arbitrum-Builder.png'
import baseCert from '../assets/certificate/Base-Certificate.webp'
import figmaFusionCert from '../assets/certificate/FigmaFusion-Cor-Jesu.webp'
import openxaiCert from '../assets/certificate/OpenxAI-Davao-DeFi.webp'
import rustSchoolCert from '../assets/certificate/Rust-School-HER-DAO.webp'
import stellarHackathonCert from '../assets/certificate/StellarX-Hackathon.webp'
import nexusImg from '../assets/projects/4PS-Nexus.jpg'
import chainbudgetImg from '../assets/projects/Chainbudget.webp'
import navySharksImg from '../assets/projects/NavySharks.webp'
import lemsImg from '../assets/projects/Dual-Screen College Library Workspace.png'
import remindaImg from '../assets/projects/Reminda.webp'
import reportDavaoImg from '../assets/projects/Report-Davao.webp'
import resumePage1 from '../assets/resume/46df439d-041d-4ec6-a0d3-6ca263610121_alfie-lynard-resume-1.jpg'
import resumePage2 from '../assets/resume/46df439d-041d-4ec6-a0d3-6ca263610121_alfie-lynard-resume-2.jpg'

export interface CertificateItem {
  title: string
  issuer: string
  year: string
  image: string
  fill?: 'framed' | 'bleed'
  description?: string
  skills?: string[]
}

export interface Social {
  label: string
  href: string
}

export interface ProjectHighlight {
  title: string
  detail: string
}

export interface ProjectMetric {
  label: string
  value: string
}

export interface Project {
  title: string
  year: string
  category: string
  description: string
  tagline: string
  overview: string
  metrics: ProjectMetric[]
  highlights: ProjectHighlight[]
  stack: string[]
  github?: string
  live?: string
  /** Path to a screenshot in /public (e.g. '/projects/one.png'). Null shows a placeholder. */
  image: string | null
}

export interface ExperienceItem {
  period: string
  role: string
  org: string
  description: string
  type: 'work' | 'education'
}

export interface SkillGroup {
  title: string
  items: string[]
}

export const profile = {
  name: 'Lynard',
  fullName: 'Alfie Lynard Polacas',
  role: 'Full-Stack & DevOps Engineer',
  location: 'Digos City, Philippines',
  timezone: 'Asia/Manila',
  timezoneLabel: 'GMT+8',
  availability: 'Available for work',
  intro:
    'I design and build <strong>fast, expressive</strong> web, mobile, and Web3 systems with a focus on detail and motion.',
  statement:
    'I turn ideas into clean, considered digital experiences — where scalable architecture, design, and motion work together.',
  bio: [
    'I am Alfie Lynard Polacas, a Full-Stack Software & DevOps Engineer based in Digos City, Davao del Sur, currently pursuing my BS in Information Technology at Cor Jesu College while partnering with international clients to ship production web, mobile, and blockchain systems.',
    'From architecting high-availability backend infrastructure and RESTful APIs for Navy Sharks in Australia to building AI-powered Flutter apps and on-chain governance platforms on Polygon and Stellar, I care deeply about performance, security, and craft.',
  ],
  photo: profilePhoto as string | null,
  resumePdf,
  resumePages: [resumePage1, resumePage2],
  email: 'alfielynard23@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Dranyl-23' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alfie-lynard-polacas-36ab87370/' },
    { label: 'Instagram', href: 'https://www.instagram.com/nyl_dr/' },
  ] satisfies Social[],
  stats: [
    { value: 3, suffix: '+', label: 'Years of experience' },
    { value: 20, suffix: '+', label: 'Projects built' },
    { value: 10, suffix: '+', label: 'Happy clients' },
  ],
}

export const projects: Project[] = [
  {
    title: 'Reminda',
    year: '2026',
    category: 'Web & Mobile App',
    description:
      'All-in-one schedule and reminder app for managing classes, work shifts, and daily routines across multiple profiles with cloud sync.',
    tagline: 'Smart Academic Timetable & AI Schedule Scanner',
    overview:
      'Built for students juggling classes, labs, and shifting routines. Reminda pairs a zero-blur Gemini 2.5 Flash COR/PDF scanner with native Android home screen widgets and 100% offline-first alarms synced across Windows PC and Android.',
    metrics: [
      { label: 'Release', value: 'v1.0.0+15 Prod' },
      { label: 'Platforms', value: 'Android & Windows' },
      { label: 'AI Engine', value: 'Gemini 2.5 Flash' },
    ],
    highlights: [
      {
        title: 'Direct PDF & COR Stream OCR',
        detail:
          'Extracts subject codes, room assignments, and class hours directly from official registration PDFs.',
      },
      {
        title: 'Native Home Screen Widget',
        detail:
          'Live Android Glance widget displays in-session lectures and upcoming rooms without draining battery.',
      },
      {
        title: 'Conflict Guard & 6-Digit Sync',
        detail:
          'Automatically flags overlapping lab blocks and shares full semester timetables via a 6-digit code.',
      },
    ],
    stack: ['Flutter', 'Next.js', 'Gemini AI', 'Firebase', 'Hive DB'],
    github: 'https://github.com/Dranyl-23/Reminda',
    live: 'https://getreminda.vercel.app/',
    image: remindaImg,
  },
  {
    title: 'Chainbudget',
    year: '2025',
    category: 'Web3 Finance',
    description:
      'Transparent organizational fund management powered by the Polygon network, featuring multi-signature approvals, real-time tracking, and role-based access.',
    tagline: 'On-Chain Organizational Treasury & Budget Governance',
    overview:
      'A transparent financial management platform powered by the Polygon Amoy network that eliminates spreadsheet reconciliation through verifiable on-chain ledgers, multi-signature approvals, and real-time cash flow analytics.',
    metrics: [
      { label: 'Network', value: 'Polygon Amoy' },
      { label: 'Auditability', value: '100% On-Chain' },
      { label: 'Access Control', value: '4-Tier RBAC' },
    ],
    highlights: [
      {
        title: 'Immutable Polygon Ledger',
        detail:
          'Every approved budget allocation and disbursement is permanently recorded on-chain for public auditability.',
      },
      {
        title: 'Multi-Signature Consensus',
        detail:
          'High-value treasury releases require multi-approver sign-off before smart contract execution.',
      },
      {
        title: 'Live Treasury Analytics',
        detail:
          'Tracks total balance, monthly burn rate, department budgets, and pending requests in real time.',
      },
    ],
    stack: ['Next.js', 'Solidity', 'Polygon', 'Express', 'MongoDB'],
    live: 'https://chainbudget.vercel.app/',
    image: chainbudgetImg,
  },
  {
    title: 'Navy Sharks',
    year: '2025',
    category: 'Luxury & Lifestyle',
    description:
      'Exclusive concierge club platform showcasing curated lifestyle destinations, yacht charters, and member experiences across Southeast Asia.',
    tagline: 'Members-Only Luxury Lifestyle & Travel Concierge Club',
    overview:
      'An exclusive concierge platform curating high-value destinations, private yacht charters, luxury villas, and priority nightlife access across Thailand, the Philippines, Colombia, and Brazil.',
    metrics: [
      { label: 'Regions', value: 'SEA & LATAM' },
      { label: 'Core Hubs', value: '4 Countries' },
      { label: 'Access Model', value: 'Tiered Club' },
    ],
    highlights: [
      {
        title: 'Curated Destination Guides',
        detail:
          'Bespoke itineraries across Bangkok, Phuket, Pattaya, Boracay, Siargao, Palawan, and South America.',
      },
      {
        title: 'Private Charters & Villas',
        detail:
          'Direct concierge booking for private island hopping, superyachts, and beachfront estates.',
      },
      {
        title: 'VIP Dining & Nightlife',
        detail:
          'Priority table reservations and partner privileges at premier coastal clubs and lounges.',
      },
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    live: 'https://www.navysharks.com/',
    image: navySharksImg,
  },
  {
    title: 'Report Davao',
    year: '2024',
    category: 'Civic Tech',
    description:
      'Community incident-reporting platform with interactive mapping to track infrastructure, sanitation, and public safety issues across Davao City.',
    tagline: 'Civic Incident Mapping & Community Action Platform',
    overview:
      'Empowers Davao City residents to report infrastructure, sanitation, and public safety issues with geotagged photos while tracking resolution progress across city districts in real time.',
    metrics: [
      { label: 'Total Reports', value: '1,248 Logged' },
      { label: 'In Progress', value: '1,053 Active' },
      { label: 'Resolved', value: '892 Closed' },
    ],
    highlights: [
      {
        title: 'Interactive District Mapping',
        detail:
          'Live spatial pinning across Buhangin, Tugbok, Agdao, Talomo, and surrounding Davao barangays.',
      },
      {
        title: 'Multi-Category Triage',
        detail:
          'Structured reporting for potholes, uncollected waste, broken streetlights, and environmental hazards.',
      },
      {
        title: 'Transparent Status Pipeline',
        detail:
          'Public lifecycle tracking from Open report to In Progress dispatch and verified Resolution.',
      },
    ],
    stack: ['React', 'Interactive Maps', 'PWA', 'CSS', 'Vercel'],
    live: 'https://report-davao.vercel.app/',
    image: reportDavaoImg,
  },
  {
    title: '4ps-Nexus',
    year: '2024',
    category: 'Welfare System',
    description:
      'Secure beneficiary portal for monitoring financial assistance disbursements, submitting applications, and receiving real-time program updates.',
    tagline: 'Programmable Social Welfare Disbursement on Stellar',
    overview:
      'A fraud-resistant financial assistance portal built for the Philippine DSWD 4Ps program, combining Stellar Soroban smart contracts with WebAuthn biometric passkeys so aid reaches verified families.',
    metrics: [
      { label: 'Protocol', value: 'Stellar Soroban' },
      { label: 'Auth Layer', value: 'WebAuthn Passkey' },
      { label: 'Target Program', value: 'DSWD 4Ps' },
    ],
    highlights: [
      {
        title: 'Biometric Passkey Login',
        detail:
          'Passwordless, seedless beneficiary authentication using native device FaceID and fingerprint sensors.',
      },
      {
        title: 'Smart Spending Guardrails',
        detail:
          'Rust smart contracts restrict token redemptions to accredited Education, Health, and Grocery merchants.',
      },
      {
        title: 'Zero-Leakage Audit Trail',
        detail:
          'Real-time on-chain verification for DSWD administrators, partner merchants, and household beneficiaries.',
      },
    ],
    stack: ['Next.js', 'Rust', 'Stellar Soroban', 'WebAuthn', 'Express'],
    live: 'https://4-ps-nexus.vercel.app/',
    image: nexusImg,
  },
  {
    title: 'Library Entrance & Attendance Monitoring System',
    year: '2026',
    category: 'Enterprise Library System',
    description:
      'Designed exclusively for Cor Jesu College — LIRC to streamline student patron check-ins, real-time foot traffic analytics, mobile scanning synchronization, and consolidated academic attendance reports.',
    tagline: 'Automating Library Foot Traffic & Academic Compliance',
    overview:
      'LIRC-LMS is an automated, real-time digital entrance monitoring and library management solution built specifically for Cor Jesu College (CJC). It upgrades the legacy system with a seamless kiosk that registers student and staff attendance upon entering or leaving, while equipping administrators with real-time occupancy monitoring, seating statistics, and comprehensive attendance analytics.',
    metrics: [
      { label: 'Campus Client', value: 'Cor Jesu College' },
      { label: 'Architecture', value: 'Electron & Mobile LAN' },
      { label: 'Live Telemetry', value: '2.5s Auto-Update' },
    ],
    highlights: [
      {
        title: 'Instant Barcode & ID Verification',
        detail:
          'Present student ID cards to the kiosk scanner for instant sound and photo check-in verification with 5-minute duplicate scan protection.',
      },
      {
        title: 'Mobile Scanner App & Subnet Sync',
        detail:
          'Library staff can scan student IDs anywhere inside the facility via the official mobile app synced over local Wi-Fi with token-authenticated LAN security.',
      },
      {
        title: 'Real-Time Heatmaps & Seating Statistics',
        detail:
          'Live graphics and doughnut charts auto-update every 2.5 seconds to track active occupants, prevent overcrowding, and visualize peak visitation hours.',
      },
      {
        title: 'Unified Academic Report Generator',
        detail:
          'Extract official compliance reports filtered by School Year, Month, Program, and Format across Excel (.xlsx), Word (.doc), and PDF (.pdf).',
      },
    ],
    stack: ['Laravel 11', 'Electron JS', 'React Native', 'PHP', 'MySQL', 'SQLite'],
    image: lemsImg,
  },
]

export const skillGroups: SkillGroup[] = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'Dart', 'PHP', 'Rust', 'Solidity'] },
  { title: 'Frontend & Mobile', items: ['React', 'Next.js', 'Flutter', 'Framer Motion', 'Tailwind CSS', 'Vue'] },
  { title: 'Backend & DB', items: ['Node.js', 'Express.js', 'Laravel', 'PostgreSQL', 'MySQL', 'MongoDB'] },
  { title: 'DevOps & Cloud', items: ['Docker', 'GitHub Actions', 'Firebase', 'WebSockets', 'Git', 'Vercel'] },
]

export const marqueeSkills = ['React', 'TypeScript', 'Motion', 'Postgre', 'Design', 'Vite', 'MySql', 'Node.js', 'Rust', 'MongoDB', 'Solidity']

export const experience: ExperienceItem[] = [
  {
    period: 'Jul 2025 — Present',
    role: 'Backend & DevOps Engineer (Contract)',
    org: 'Navy Sharks · Remote, Australia',
    description:
      'Partnered directly with an Australian client to architect the backend infrastructure, scalable RESTful APIs, database schemas, and CI/CD deployment pipelines for an elite lifestyle concierge & club platform.',
    type: 'work',
  },
  {
    period: 'Feb 2023 — Dec 2025',
    role: 'Full-Stack Developer & Freelancer',
    org: 'Independent Software Developer · Digos City',
    description:
      'Spearheaded end-to-end design, development, and deployment of client web and mobile applications using Laravel, React, TypeScript, Flutter, WebSockets (Reverb/Pusher), and MySQL/PostgreSQL/MongoDB.',
    type: 'work',
  },
  {
    period: 'Aug 2024 — May 2025',
    role: 'Student Developer & Tech Mentor',
    org: 'Cor Jesu College TECJ Community · Digos City',
    description:
      'Mentored junior IT students in Git, GitHub workflows, full-stack web development, and debugging best practices while prototyping software solutions for regional hackathons.',
    type: 'work',
  },
  {
    period: '2023 — Present',
    role: 'BS in Information Technology',
    org: 'Cor Jesu College (CJC) · Digos City',
    description:
      'Relevant coursework in Data Structures & Algorithms, Software Engineering, Frontend & Backend Architecture, Database Systems, and Web & Mobile Development.',
    type: 'education',
  },
  {
    period: '2023',
    role: 'Full-Stack Web Development Bootcamp',
    org: 'Intensive MERN Stack Program · Remote',
    description:
      'Completed intensive hands-on training in full-stack software engineering with MongoDB, Express.js, React, and Node.js.',
    type: 'education',
  },
]

export const certificates: CertificateItem[] = [
  {
    title: 'Arbitrum Learner',
    issuer: 'HackQuest × Arbitrum',
    year: '2026',
    image: arbitrumCert,
    fill: 'framed',
    description:
      'Verified foundational mastery in Ethereum Layer-2 rollup mechanics, Arbitrum Nitro architecture, Stylus WASM smart contracts, and gas-optimized EVM execution.',
    skills: ['Arbitrum Nitro', 'Layer-2 Rollups', 'Stylus WASM', 'EVM Gas Optimization'],
  },
  {
    title: 'Rust School — Systems & Web3',
    issuer: 'H.E.R. DAO',
    year: '2026',
    image: rustSchoolCert,
    fill: 'framed',
    description:
      'Intensive training in systems-level programming, memory safety & borrow checker semantics, concurrent multi-threaded execution, and Web3 protocol architecture.',
    skills: ['Rust', 'Systems Programming', 'Concurrency', 'Web3 Protocols'],
  },
  {
    title: 'Resource Speaker — FigmaFusion',
    issuer: 'Cor Jesu College CCIS',
    year: '2026',
    image: figmaFusionCert,
    fill: 'framed',
    description:
      'Invited technical resource speaker at Cor Jesu College, delivering hands-on workshops on atomic design systems, responsive auto-layout, and seamless designer-to-developer handoff.',
    skills: ['Design Systems', 'Figma Prototyping', 'Component Architecture', 'Tech Mentorship'],
  },
  {
    title: 'OpenxAI Mini App Competition',
    issuer: 'Davao DeFi × Certifika',
    year: '2025',
    image: openxaiCert,
    fill: 'framed',
    description:
      'Recognized in regional hackathon competition for prototyping AI-driven Telegram mini apps integrating decentralized financial data feeds and automated agent workflows.',
    skills: ['AI Mini Apps', 'DeFi Integrations', 'Telegram SDK', 'Full-Stack Web'],
  },
  {
    title: 'Base Community Townhall IRL',
    issuer: 'Base Philippines',
    year: '2025',
    image: baseCert,
    fill: 'framed',
    description:
      'Credentialed attendee and builder in Base ecosystem community sprints, exploring OnchainKit developer toolchains, Smart Wallets, and scalable consumer crypto applications.',
    skills: ['Base Ecosystem', 'OnchainKit', 'Smart Wallets', 'EVM Scaling'],
  },
  {
    title: 'Stellar PH Builder Hackathon',
    issuer: 'Stellar Philippines',
    year: '2025',
    image: stellarHackathonCert,
    fill: 'framed',
    description:
      'Awarded hackathon credential for designing Soroban smart contracts, decentralized payment channels, and automated cross-border financial settlement rails.',
    skills: ['Stellar Network', 'Soroban Contracts', 'Rust / WASM', 'Fintech Rails'],
  },
  {
    title: 'Arbitrum Builder',
    issuer: 'HackQuest × Arbitrum',
    year: '2024',
    image: arbitrumBuild,
    fill: 'framed',
    description:
      'Certified developer credential awarded by HackQuest and Arbitrum for building and deploying decentralized applications on Arbitrum Nitro, implementing Stylus multi-language smart contracts (Rust & Solidity), and optimizing Layer-2 EVM scalability.',
    skills: ['Arbitrum Nitro', 'Arbitrum Stylus', 'Rust & Solidity', 'Layer-2 Rollups', 'Smart Contracts'],
  },
]

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Experience', href: '#experience' },
  { label: 'Activity', href: '#activity' },
  { label: 'Contact', href: '#contact' },
]
