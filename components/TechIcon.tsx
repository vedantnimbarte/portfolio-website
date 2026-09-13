import React from 'react';
import {
  Boxes, Cloud, Code, Cpu, Database, Gauge, GitBranch, Network, Sparkles, type LucideIcon,
} from 'lucide-react';
import {
  type SimpleIcon,
  siApachekafka, siClaude, siDocker, siExpress, siFastapi, siGithub, siGooglecloud, siJavascript,
  siKubernetes, siModelcontextprotocol, siMongodb, siMongoose, siNestjs, siNextdotjs,
  siNodedotjs, siNvidia, siPostgresql, siPrisma, siPython, siReact, siRedis, siRust, siSolid,
  siTailwindcss, siTauri, siTerraform, siThreedotjs, siTypescript,
} from 'simple-icons';

// Keyed by the lowercased names used in constants.ts and data/projects.json.
const BRANDS: Record<string, SimpleIcon> = {
  typescript: siTypescript, javascript: siJavascript, rust: siRust, python: siPython,
  react: siReact, 'next.js': siNextdotjs, solidjs: siSolid, tauri: siTauri,
  'tailwind css': siTailwindcss, 'three.js': siThreedotjs, 'node.js': siNodedotjs,
  'express.js': siExpress, nestjs: siNestjs, kafka: siApachekafka, postgresql: siPostgresql,
  mongodb: siMongodb, redis: siRedis, prisma: siPrisma, mongoose: siMongoose,
  github: siGithub, gcp: siGooglecloud, docker: siDocker, kubernetes: siKubernetes, terraform: siTerraform,
  mcp: siModelcontextprotocol, cuda: siNvidia, fastapi: siFastapi, 'claude-code': siClaude,
};

// No brand mark (AWS left Simple Icons over trademark) or not a brand at all.
const fallback = (name: string): LucideIcon => {
  const l = name.toLowerCase();
  if (l === 'aws' || l.includes('cloud')) return Cloud;
  if (l.includes('sql') || l.includes('data')) return Database;
  if (l.includes('microservice')) return Boxes;
  if (l.includes('ci/cd')) return GitBranch;
  if (l.includes('system design')) return Network;
  if (l.includes('performance')) return Gauge;
  if (l.includes('inference')) return Cpu;
  if (l.includes('llm') || l.includes('ai')) return Sparkles;
  return Code;
};

// Several marks are pure black, which vanishes on navy.
const onNavy = (hex: string) => {
  const n = parseInt(hex, 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum < 60 ? '#ffffff' : `#${hex}`;
};

export const TechIcon: React.FC<{
  name: string;
  size?: number;
  className?: string;
  /** Brand colour instead of currentColor. */
  color?: boolean;
}> = ({ name, size = 16, className, color = false }) => {
  const brand = BRANDS[name.toLowerCase()];
  if (!brand) {
    const Icon = fallback(name);
    return <Icon size={size} className={className} aria-hidden />;
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color ? onNavy(brand.hex) : 'currentColor'}
      className={className}
      aria-hidden
    >
      <path d={brand.path} />
    </svg>
  );
};
