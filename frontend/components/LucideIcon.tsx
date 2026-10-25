import React from 'react';
import {
  Users,
  FlaskConical,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Lightbulb,
  GraduationCap,
  Cog,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Crown,
  Globe,
  HelpCircle,
  FolderTree,
  Building2,
  Calendar,
  Compass,
  Eye,
  Layers,
  LucideProps,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Users,
  FlaskConical,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Lightbulb,
  GraduationCap,
  Cog,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Crown,
  Globe,
  FolderTree,
  Building2,
  Calendar,
  Compass,
  Eye,
  Layers,
  HelpCircle,
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP);

interface Props extends LucideProps {
  name?: string;
  fallback?: React.ComponentType<LucideProps>;
}

export function LucideIcon({ name, fallback: Fallback = HelpCircle, ...props }: Props) {
  if (!name || !ICON_MAP[name]) {
    return <Fallback {...props} />;
  }
  const IconComponent = ICON_MAP[name];
  return <IconComponent {...props} />;
}
