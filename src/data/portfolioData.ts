import {
  Profile,
  StatItem,
  Project,
  Experience,
  Achievement,
  CertificatesData,
  ServiceItem,
  ProcessStep,
  Testimonial,
  TechStackGroup
} from '../types/portfolio';

export const profile: Profile = {
  name: 'Alfie Lynard',
  firstName: 'ALFIE',
  lastName: 'LYNARD',
  role: 'Software Engineer & Full Stack Developer',
  bio: "I'm a full-stack developer with a keen eye for design. I blend technical expertise with creative thinking to build seamless user experiences. When I'm not coding, I'm exploring new technologies, contributing to open-source, or sketching UI concepts.",
  email: 'alfielynard23@gmail.com',
  phone: '+63945553379',
  github: 'https://github.com/Dranyl-23',
  linkedin: 'https://www.linkedin.com/in/alfie-lynard-polacas',
  resume: '/Alfie-Lynard-Resume.pdf',
  location: 'Davao Region, Philippines'
};

export const stats: StatItem[] = [
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 1, suffix: 'x', label: 'StellarX Hackathon' }
];

export const about = {
  label: 'About',
  kicker: 'Get to know me',
  intro: 'I blend technical expertise with creative thinking to build seamless user experiences.',
  heading: 'Architecting modern web apps & decentralized systems',
  paragraphs: [
    "I'm Alfie Lynard, a software engineer and 4th-year IT student based in the Davao Region, Philippines. For over 3 years, I've designed, developed, and deployed full-stack web applications, decentralized platforms, and AI-powered mobile tools.",
    'From architecting backend infrastructure for international clients to engineering smart contracts on Stellar and Soroban, I focus on clean code, intuitive UI/UX, and high-performance system design.',
    "When I'm not coding, I actively contribute to open-source software, compete in tech hackathons, and experiment with cutting-edge developer workflows."
  ],
  strengths: [
    'Full-Stack Web & Mobile Architecture',
    'Web3 & Smart Contract Engineering',
    'UI/UX Design in Figma & Tailwind CSS',
    'RESTful APIs & Real-time WebSockets',
    'DevOps, Docker & Edge Deployments'
  ]
};

export const techStack: TechStackGroup[] = [
  {
    group: 'Frontend',
    items: [
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'Vue.js', icon: 'react' },
      { name: 'Nuxt.js', icon: 'nextjs' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css3' },
      { name: 'JavaScript', icon: 'javascript' }
    ]
  },
  {
    group: 'Backend',
    items: [
      { name: 'Laravel', icon: 'laravel' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'Express.js', icon: 'express' },
      { name: 'Python', icon: 'C' },
      { name: 'Rust', icon: 'MK' },
      { name: 'PHP', icon: 'php' },
      { name: 'REST APIs', icon: 'api' },
      { name: 'WebSockets', icon: 'api' }
    ]
  },
  {
    group: 'Database',
    items: [
      { name: 'PostgreSQL', icon: 'mysql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'Supabase', icon: 'api' }
    ]
  },
  {
    group: 'Mobile & AI',
    items: [
      { name: 'Flutter', icon: 'flutter' },
      { name: 'Dart', icon: 'dart' },
      { name: 'Gemini AI', icon: 'C' },
      { name: 'Google ML Kit', icon: 'C' }
    ]
  },
  {
    group: 'Web3 & Blockchain',
    items: [
      { name: 'Stellar & Soroban', icon: 'MK' },
      { name: 'Polygon', icon: 'api' },
      { name: 'Smart Contracts', icon: 'api' },
      { name: 'Web3.js', icon: 'javascript' }
    ]
  },
  {
    group: 'Tools & DevOps',
    items: [
      { name: 'Docker', icon: 'linux' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Figma', icon: 'figma' },
      { name: 'Postman', icon: 'postman' },
      { name: 'Vercel', icon: 'vercel' },
      { name: 'AWS', icon: 'cloudflare' },
      { name: 'CI/CD', icon: 'api' }
    ]
  }
];

export const marqueeTech = techStack.flatMap((g) => g.items);

export const projects: Project[] = [
  {
    title: '4PS-Nexus',
    category: 'GovTech',
    status: 'Live',
    description:
      'A blockchain-based disbursement system for the Philippine 4Ps program. Powered by Stellar and Soroban smart contracts to enforce financial transparency using programmable money.',
    stack: ['TypeScript', 'Stellar', 'Soroban', 'Rust', 'Next.js'],
    link: 'https://4ps-nexus.vercel.app',
    image: '/projects/4ps-nexus.webp',
    logo: '/projects/4ps-nexus.webp'
  },
  {
    title: 'Navy Sharks',
    category: 'Enterprise',
    status: 'Live',
    description:
      'Global lifestyle concierge and private club platform for international clients. Discover safe zones, premium venues, and luxury experiences with secure multi-tenant data architecture.',
    stack: ['Laravel', 'TypeScript', 'PostgreSQL', 'DevOps'],
    link: 'https://navysharks.com',
    image: '/mockups/NavySharks.webp',
    logo: '/projects/navysharks.webp'
  },
  {
    title: 'Reminda (Schedly)',
    category: 'AI Mobile App',
    status: 'Live',
    description:
      'AI-Powered Smart Schedule & Timetable Assistant built with Flutter & Dart. Uses On-Device Neural Vision (Google ML Kit) and Gemini AI to turn timetable screenshots into smart, reminder-ready schedules.',
    stack: ['Flutter', 'Dart', 'Gemini AI', 'Firebase'],
    link: 'https://github.com/Dranyl-23/Reminda',
    image: '/mockups/Reminda.webp',
    logo: '/projects/reminda.webp'
  },
  {
    title: 'Chainbudget',
    category: 'DeFi Platform',
    status: 'Live',
    description:
      'A Blockchain-Based Budget Management System for Transparent Organizational Fund Monitoring. Architected using Polygon Amoy smart contracts and Express.js to ensure financial transparency across departments.',
    stack: ['Polygon', 'Express.js', 'TypeScript', 'React'],
    link: 'https://chainbudget.vercel.app',
    image: '/mockups/Chainbudget.webp',
    logo: '/projects/chainbudget.webp'
  },
  {
    title: 'Report-Davao',
    category: 'Civic Tech',
    status: 'Live',
    description:
      'A modern civic issue reporting platform. Empowers citizens to report, track, and resolve community problems in real-time across local government units.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
    link: 'https://Report-Davao.vercel.app',
    image: '/mockups/Report-Davao.webp',
    logo: '/projects/report-davao.webp'
  },
  {
    title: 'Lynard Portfolio',
    category: 'Brand Website',
    status: 'Live',
    description:
      'Personal developer portfolio built with modern typography, reactive presence indicators, and interactive terminal chat.',
    stack: ['Tailwind', 'TypeScript', 'Vercel'],
    link: 'https://lynard.vercel.app',
    image: '/mockups/Lynard-Portfolio.webp',
    logo: '/favicon.svg',
  },
  {
    title: 'ai-assistant-workflows',
    category: 'Productivity',
    status: 'Private',
    description:
      'Personal AI assistant workflows mapped to daily work routines, leveraging local LLMs and specialized agents to automate freelance business tasks.',
    stack: ['TypeScript', 'Python', 'AI / LLM'],
    link: 'https://github.com/Dranyl-23/ai-assistant-workflows'
  },
  {
    title: 'Brgy-app',
    category: 'Government',
    status: 'Private',
    description:
      'Local government unit (Barangay) management and operations portal for resident records, blotters, and clearance certificates.',
    stack: ['Laravel', 'React', 'TypeScript', 'MySQL'],
    link: 'https://github.com/Dranyl-23/Brgy-app'
  },
  {
    title: 'Sleep_Optimizer',
    category: 'Mobile App',
    status: 'Private',
    description:
      'A mobile application built with Flutter for tracking and optimizing circadian rhythm and user sleep patterns.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    link: 'https://github.com/Dranyl-23/Sleep_Optimizer'
  }
];

export const projectPalettes = [
  'from-zinc-900 via-zinc-800 to-zinc-600',
  'from-stone-800 via-stone-600 to-stone-500',
  'from-neutral-900 via-zinc-700 to-stone-500',
  'from-zinc-800 via-neutral-600 to-zinc-500'
];

export const experiences: Experience[] = [
  {
    index: '01',
    years: '2026 to Present',
    role: 'Backend & DevOps Engineer',
    company: 'Navy Sharks (Australia · Remote)',
    bullets: [
      'Partnered with an Australian client to architect the backend infrastructure and database schema for Navy Sharks, an elite lifestyle concierge and club platform.',
      'Engineered scalable RESTful APIs and optimized database queries to ensure fast data processing and secure multi-tenant data management for international users.',
      'Managed DevOps workflows, CI/CD deployment pipelines, and server environment configurations to maintain high availability and performance.'
    ]
  },
  {
    index: '02',
    years: '2025',
    role: 'Full Stack Developer',
    company: 'Independent Software Developer (Freelance)',
    bullets: [
      'Spearheaded the end-to-end design, development, and deployment of comprehensive web applications tailored to address real-world problem scenarios.',
      'Engineered scalable RESTful APIs and real-time WebSocket communication utilizing Laravel and Reverb/Pusher, significantly improving responsiveness.',
      'Architected complex database schemas in MySQL/PostgreSQL to handle multi-tenant data securely, ensuring robust data integrity.'
    ]
  },
  {
    index: '03',
    years: '2024',
    role: 'Freelance UI/UX Designer',
    company: 'Independent Software Developer',
    bullets: [
      'Translated complex business requirements into intuitive, aesthetically pleasing, and highly accessible user interfaces using Figma and modern design principles.',
      'Created comprehensive wireframes, interactive prototypes, and scalable design systems that drastically accelerated frontend development workflows.',
      'Conducted user research and usability testing to iterate on designs, ensuring seamless user experiences across mobile and desktop platforms.'
    ]
  },
  {
    index: '04',
    years: '2024',
    role: 'Open Source Contributor & Builder',
    company: 'Tech Community & Open Source',
    bullets: [
      'Actively developed and maintained public GitHub repositories focusing on civic tech, blockchain disbursement (4PS-Nexus), and AI-assisted productivity tools.',
      'Collaborated with the open-source community by reviewing pull requests, optimizing algorithms, and resolving critical bugs in decentralized applications.',
      'Explored and integrated cutting-edge technologies including Web3 smart contracts (Stellar/Soroban) and AI-assisted workflows.'
    ]
  }
];

export const achievements: Achievement[] = [
  {
    title: 'StellarX Hackathon Builder',
    org: 'StellarX / Soroban',
    year: '2023',
    detail:
      'Competed in the StellarX hackathon, rapidly learning Soroban and implementing secure smart contracts for decentralized disbursements in under 48 hours.'
  },
  {
    title: 'Capstone Full Stack Developer',
    org: 'Cor Jesu College',
    year: '2025',
    detail:
      'Lead full-stack developer on flagship capstone project addressing governmental financial transparency through blockchain technology.'
  },
  {
    title: 'Rust School Graduate',
    org: 'Rust School x H.E.R. DAO',
    year: '2024',
    detail:
      'Completed comprehensive intensive program covering Rust systems programming, Web3 protocols, and low-level networking.'
  },
  {
    title: 'Arbitrum Learner Credential',
    org: 'Hackquest & Arbitrum',
    year: '2024',
    detail:
      'Certified proficiency in Arbitrum layer-2 ecosystem, EVM rollups, and smart contract architecture.'
  },
  {
    title: 'FigmaFusion UI/UX Winner',
    org: 'FigmaFusion x Cor Jesu',
    year: '2024',
    detail:
      'Recognized for exceptional interface design from concept to interactive prototype during the regional design sprint.'
  },
  {
    title: 'Cisco Certified Network Defender',
    org: 'Cisco Networking Academy',
    year: '2024',
    detail:
      'Validated foundational knowledge in network defense, cybersecurity analysis, and threat containment methodologies.'
  }
];

export const certificatesData: CertificatesData = {
  driveLink: 'https://github.com/Dranyl-23',
  it: [
    {
      name: 'Rust School x H.E.R. DAO',
      src: '/certs/Rust-School-HER-DAO.webp'
    },
    {
      name: 'Arbitrum Learner',
      src: '/certs/Arbitrum-Learner.webp'
    },
    {
      name: 'FigmaFusion x Cor Jesu',
      src: '/certs/FigmaFusion-Cor-Jesu.webp'
    },
    {
      name: 'OpenxAI x Davao DeFi',
      src: '/certs/OpenxAI-Davao-DeFi.webp'
    },
    {
      name: 'Base Certificate',
      src: '/certs/Base-Certificate.webp'
    },
    {
      name: 'StellarX Hackathon',
      src: '/certs/StellarX-Hackathon.webp'
    }
  ],
  nonIt: [
    {
      name: 'StellarX Hackathon Participant',
      src: '/certs/StellarX-Hackathon.webp'
    },
    {
      name: 'OpenxAI Workshop',
      src: '/certs/OpenxAI-Davao-DeFi.webp'
    }
  ]
};

export const services: ServiceItem[] = [
  {
    title: 'Full-Stack Web Development',
    description: 'Modern, high-performance web applications built with React, Next.js, and Laravel.',
    image: '/svc-web-development.webp'
  },
  {
    title: 'Blockchain & Smart Contracts',
    description: 'Decentralized platforms on Stellar (Soroban) and Polygon with tamper-proof financial transparency.',
    image: '/svc-custom-systems.webp'
  },
  {
    title: 'Backend & Database Architecture',
    description: 'Scalable multi-tenant schemas and high-throughput REST APIs with PostgreSQL & MySQL.',
    image: '/svc-database-design.webp'
  },
  {
    title: 'AI & Automated Workflows',
    description: 'Integration of Gemini AI, on-device neural vision, and custom automated agent workflows.',
    image: '/svc-api-integration.webp'
  },
  {
    title: 'Mobile App Development',
    description: 'Cross-platform iOS and Android applications crafted with Flutter, Dart, and Firebase.',
    image: '/svc-mobile-development.webp'
  },
  {
    title: 'DevOps & Cloud Deployments',
    description: 'CI/CD automation, Docker containerization, edge network hosting, and server management.',
    image: '/svc-maintenance-support.webp'
  }
];

export const process: ProcessStep[] = [
  {
    step: '01',
    title: 'Research & Architecture',
    description: 'We explore requirements, map user flows, and plan the database schema and system architecture.'
  },
  {
    step: '02',
    title: 'Design & Prototyping',
    description: 'I create interactive Figma mockups and high-fidelity component designs before code.'
  },
  {
    step: '03',
    title: 'Full-Stack Engineering',
    description: 'I build the frontend and backend with type-safe, tested code and frequent live progress demos.'
  },
  {
    step: '04',
    title: 'Testing & Launch',
    description: 'End-to-end testing, security checks, CI/CD pipeline setup, and seamless production deployment.'
  }
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Alfie was instrumental in delivering the 4Ps-Nexus project on time. His ability to balance strict government accessibility requirements with a modern, performant architecture is incredibly rare. He doesn't just write code; he thinks deeply about the end-user. Highly recommended for any complex full-stack project.",
    initials: 'MS',
    name: 'Maria Santos',
    org: 'Project Manager @ GovTech Solutions'
  },
  {
    quote:
      "I had the pleasure of teaming up with Alfie during the StellarX hackathon. Coming from a PHP background, his ability to quickly pick up Rust Soroban and write secure, efficient smart contracts in under 48 hours blew me away. He's a fast learner, a great communicator, and a true team player.",
    initials: 'JC',
    name: 'James Chen',
    org: 'Senior Engineer @ StellarX'
  },
  {
    quote:
      "Working with Alfie is a designer's dream. He has a fantastic eye for detail and perfectly translates Figma mockups into pixel-perfect Tailwind CSS. He's also proactive in suggesting UI improvements that make the user experience smoother. I'd jump at the chance to collaborate with him again.",
    initials: 'ER',
    name: 'Elena Rodriguez',
    org: 'Lead Designer @ Creative Digital'
  },
  {
    quote:
      'We hired Alfie to help migrate our legacy backend to a modern Node.js and Next.js microservices architecture. His expertise across multiple stacks was invaluable. He provided excellent architectural guidance and delivered extremely high-quality code. A top-tier developer.',
    initials: 'MW',
    name: 'Markus Weber',
    org: 'CTO @ FinTech Startup'
  },
  {
    quote:
      "Alfie is one of the most reliable developers I've ever worked with. Whenever we hit a roadblock on the frontend, his deep knowledge of React and Vue always provided a clear path forward. He's also incredibly generous with his time when mentoring junior developers on the team.",
    initials: 'SJ',
    name: 'Sarah Jenkins',
    org: 'Frontend Developer'
  }
];

export const contactProjectTypes = [
  'Full-Stack Web Application',
  'Blockchain / Web3 System',
  'Mobile App (Flutter / Dart)',
  'Backend & Database Architecture',
  'AI / Workflow Automation',
  'UI/UX Design in Figma',
  'Other'
];

export const navLinks = [
  { label: 'About', sup: null, href: '#about' },
  { label: 'Tech Stack', sup: '[7]', href: '#stack' },
  { label: 'Work', sup: '[9]', href: '#work' },
  { label: 'Experience', sup: '[3y+]', href: '#experience' },
  { label: 'Contact', sup: null, href: '#contact' }
];

export const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Tech Stack', href: '#stack' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' }
];
