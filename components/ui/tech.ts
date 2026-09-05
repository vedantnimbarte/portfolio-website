import {
  Code, Database, Cloud, Cpu, Server, LayoutGrid, LucideIcon,
} from 'lucide-react';

// Maps a tech string to an icon by substring. Shared by the Work module and
// ProjectModal — lives here rather than in a component so either can be
// deleted without breaking the other.
export const getTechDetails = (tech: string): { icon: LucideIcon; label: string } => {
  const l = tech.toLowerCase();
  if (l.includes('rust')) return { icon: Cpu, label: tech };
  if (l.includes('python')) return { icon: Code, label: tech };
  if (l.includes('typescript') || l.includes('javascript') || l.includes('react') || l.includes('next') || l.includes('tauri') || l.includes('vite')) return { icon: LayoutGrid, label: tech };
  if (l.includes('node') || l.includes('express') || l.includes('nest') || l.includes('go') || l.includes('c++') || l.includes('c ')) return { icon: Server, label: tech };
  if (l.includes('sql') || l.includes('mongo') || l.includes('redis') || l.includes('postgres')) return { icon: Database, label: tech };
  if (l.includes('cuda') || l.includes('gpu') || l.includes('rocm')) return { icon: Cpu, label: tech };
  if (l.includes('cloud') || l.includes('aws') || l.includes('gcp') || l.includes('kubernetes') || l.includes('docker')) return { icon: Cloud, label: tech };
  if (l.includes('ai') || l.includes('llm') || l.includes('agent') || l.includes('mcp')) return { icon: Cpu, label: tech };
  return { icon: Code, label: tech };
};
