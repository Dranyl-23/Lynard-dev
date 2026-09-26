export interface Project {
  title: string;
  category: string;
  status: 'Live' | 'Private';
  description: string;
  stack: string[];
  link?: string;
  image?: string;
  logo?: string;
  download?: string;
}

export interface Experience {
  index: string;
  years: string;
  role: string;
  company: string;
  bullets: string[];
}

export interface Achievement {
  title: string;
  org: string;
  year: string;
  detail: string;
}

export interface CertificateItem {
  name: string;
  src: string;
}

export interface CertificatesData {
  driveLink: string;
  it: CertificateItem[];
  nonIt: CertificateItem[];
}

export interface ServiceItem {
  title: string;
  description: string;
  image: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  org: string;
}

export interface TechStackItem {
  name: string;
  icon: string;
}

export interface TechStackGroup {
  group: string;
  items: TechStackItem[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  live?: string;
}

export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  location: string;
}
