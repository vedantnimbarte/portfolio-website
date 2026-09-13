import {
  Boxes, Briefcase, Download, HelpCircle, Home, Layers, Mail, Send, Terminal, Wrench,
} from 'lucide-react';
import type { Command, Project, SectionId } from '../types';
import projectsData from '../data/projects.json';

const PROJECTS = projectsData as Project[];

export type CommandRun =
  | { kind: 'section'; section: SectionId }
  | { kind: 'project'; name: string }
  | { kind: 'ask'; text: string };

export interface SiteCommand extends Command {
  run: CommandRun;
}

const sectionCommands: SiteCommand[] = [
  { id: 'cmd/home', group: 'section', label: 'Intro', hint: 'top of page', icon: Home, keywords: ['about', 'bio', 'home', 'top'], run: { kind: 'section', section: 'home' } },
  { id: 'cmd/work', group: 'section', label: 'Projects', hint: `${PROJECTS.length} repositories`, icon: Boxes, keywords: ['work', 'repos', 'github', 'code'], run: { kind: 'section', section: 'work' } },
  { id: 'cmd/experience', group: 'section', label: 'Experience', hint: 'past roles', icon: Briefcase, keywords: ['jobs', 'career', 'work history'], run: { kind: 'section', section: 'experience' } },
  { id: 'cmd/services', group: 'section', label: 'Services', hint: 'what I build', icon: Wrench, keywords: ['capabilities', 'offer', 'help'], run: { kind: 'section', section: 'services' } },
  { id: 'cmd/stack', group: 'section', label: 'Stack', hint: 'tools and languages', icon: Layers, keywords: ['skills', 'tech', 'toolkit'], run: { kind: 'section', section: 'stack' } },
  { id: 'cmd/contact', group: 'section', label: 'Contact', hint: 'email and socials', icon: Mail, keywords: ['email', 'linkedin', 'reach', 'message'], run: { kind: 'section', section: 'contact' } },
];

const actionCommands: SiteCommand[] = [
  { id: 'cmd/hire', group: 'action', label: 'Hire', hint: 'availability', icon: Send, keywords: ['available', 'recruit', 'freelance', 'contract'], run: { kind: 'ask', text: 'hire' } },
  { id: 'cmd/resume', group: 'action', label: 'Resume', hint: 'credentials', icon: Download, keywords: ['cv', 'pdf', 'download'], run: { kind: 'ask', text: 'resume' } },
  { id: 'cmd/help', group: 'action', label: 'Help', hint: 'what the assistant covers', icon: HelpCircle, keywords: ['commands', 'usage', 'index'], run: { kind: 'ask', text: 'help' } },
];

// Generated, not hand-listed — adding a repo to FEATURED in
// scripts/fetch-projects.mjs adds a command here for free.
const projectCommands: SiteCommand[] = PROJECTS.map((p) => ({
  id: `cmd/project/${p.name}`,
  group: 'project',
  label: p.title,
  hint: p.language ?? 'multi',
  icon: Terminal,
  keywords: [p.name, ...(p.language ? [p.language] : []), ...p.tech, p.category],
  run: { kind: 'project', name: p.name },
}));

export const COMMANDS: SiteCommand[] = [
  ...sectionCommands,
  ...actionCommands,
  ...projectCommands,
];

/**
 * Substring tiers, deliberately NOT the IDF scorer from knowledge.ts.
 * Command labels are one to three words; IDF over twenty short strings is
 * noise. Ties break by group order, then by curated array order.
 */
export const filterCommands = (query: string): SiteCommand[] => {
  const q = query.trim().toLowerCase();
  if (!q) return COMMANDS;

  const rank = (c: SiteCommand): number => {
    const label = c.label.toLowerCase();
    if (label.startsWith(q)) return 4;
    if (label.split(/\s+/).some((w) => w.startsWith(q))) return 3;
    if (label.includes(q)) return 2;
    if ((c.keywords ?? []).some((k) => k.toLowerCase().includes(q))) return 1;
    return 0;
  };

  return COMMANDS.map((c, i) => ({ c, r: rank(c), i }))
    .filter((x) => x.r > 0)
    .sort((a, b) => b.r - a.r || a.i - b.i)
    .map((x) => x.c);
};

/** A sentence, not a command — send it to the assistant instead. */
export const looksLikeQuestion = (query: string): boolean => {
  const q = query.trim();
  return q.endsWith('?') || q.split(/\s+/).length > 3;
};
