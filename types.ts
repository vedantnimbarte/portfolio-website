import { LucideIcon } from "lucide-react";

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  metrics: string[];
  link?: string;
  private?: boolean;
  snapshots?: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface FeatureBlock {
  title: string;
  description: string;
  icon: LucideIcon;
}