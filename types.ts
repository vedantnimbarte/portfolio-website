import { LucideIcon } from "lucide-react";

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

// Shape emitted by scripts/fetch-projects.mjs → data/projects.json
export interface Project {
  name: string;
  title: string;
  description: string;
  tech: string[];
  language: string | null;
  stars: number;
  updatedAt: string;
  githubUrl: string;
  homepageUrl: string | null;
  topics: string[];
  private: boolean;
  category: 'ai' | 'systems' | 'apps';
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