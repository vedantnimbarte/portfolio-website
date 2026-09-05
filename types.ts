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

export interface Stat {
  label: string;
  value: string;
}

export interface FeatureBlock {
  title: string;
  description: string;
  icon: LucideIcon;
}
/* ------------------------------------------------------------------- console */

export type ModuleId = 'identity' | 'ops' | 'work' | 'stack' | 'query';

export interface ModuleMeta {
  id: ModuleId;
  label: string;        // rail label, e.g. "OPERATIONS"
  title: string;        // panel heading
  hint: string;         // one-line mono descriptor under the heading
  icon: LucideIcon;
}

/* ----------------------------------------------------------------- knowledge */

// An action a knowledge entry can offer alongside its answer.
export type KbAction =
  | { kind: 'module'; label: string; module: ModuleId }
  | { kind: 'project'; label: string; name: string }
  | { kind: 'copy'; label: string; value: string }
  | { kind: 'link'; label: string; href: string };

export interface KbEntry {
  id: string;           // 'exp/cloudairy' | 'project/dlm' | 'intent/hire'
  cite: string;         // provenance line, e.g. '→ exp/cloudairy · 2024–present'
  body: string;         // the answer; hard facts verbatim from source data
  aliases?: string[];   // query terms absent from body, e.g. ['k8s','iac']
  actions?: KbAction[];
  weight?: number;      // default 1; hand-written intents lean slightly higher
}

export interface Answer {
  query: string;
  entries: KbEntry[];   // 1–3, best first; the fallback entry on a miss
  hit: boolean;
}

export interface Message {
  id: number;
  role: 'visitor' | 'console';
  text: string;
  answer?: Answer;
}

/* ------------------------------------------------------------------- command */

export interface Command {
  id: string;
  group: 'module' | 'action' | 'project';
  label: string;
  hint?: string;        // right-aligned, e.g. 'Rust · 2★'
  keywords?: string[];
  icon: LucideIcon;
}
