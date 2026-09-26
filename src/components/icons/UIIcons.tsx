import React from 'react';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Lock,
  Check,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  Smartphone,
  Users,
  Clock,
  Tv,
  Store,
  Globe,
  Quote,
  Sun,
  Moon,
  Palette
} from 'lucide-react';

export {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Lock,
  Check,
  Quote,
  Sun,
  Moon,
  Palette
};

export const CategoryIcon: React.FC<{ category: string; className?: string }> = ({
  category,
  className = 'h-3.5 w-3.5'
}) => {
  switch (category) {
    case 'Hospitality':
      return <Building className={className} />;
    case 'Enterprise':
      return <Briefcase className={className} />;
    case 'Construction':
      return <Layers className={className} />;
    case 'ISP Platform':
      return <Globe className={className} />;
    case 'Mobile App':
      return <Smartphone className={className} />;
    case 'Family App':
      return <Tv className={className} />;
    case 'Queue System':
      return <Clock className={className} />;
    case 'Education':
      return <GraduationCap className={className} />;
    case 'Government':
      return <Building className={className} />;
    case 'Media':
      return <Globe className={className} />;
    case 'POS System':
      return <Store className={className} />;
    case 'Brand Website':
      return <Globe className={className} />;
    default:
      return <Layers className={className} />;
  }
};
