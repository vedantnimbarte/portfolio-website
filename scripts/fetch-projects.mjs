// Generates data/projects.json from GitHub via the `gh` CLI.
// Run locally after you push new work:  npm run fetch:projects
// The output JSON is committed, so Vercel builds need no gh auth.
//
// Hand-picked / ordered. Add `title` to override the display name,
// `blurb` to override an empty/weak GitHub description.

import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const OWNER = 'vedantnimbarte';

const FEATURED = [
  { repo: 'Arc' },
  { repo: 'dlm', title: 'DLM' },
  { repo: 'Wingman' },
  { repo: 'kortex-memory', title: 'Kortex Memory' },
  { repo: 'Aegis' },
  { repo: 'zero', title: 'Zero' },
  { repo: 'clifi', title: 'CLIFi' },
  { repo: 'Echo' },
  { repo: 'ROCm-Studio', title: 'ROCm Studio' },
  { repo: 'Arc-Data-Factory', title: 'Arc Data Factory' },
];

const gh = (args) =>
  execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

// Low-signal language detections to keep out of the tech chips.
const NOISE = new Set([
  'CSS', 'SCSS', 'HTML', 'Shell', 'PowerShell', 'Batchfile', 'Makefile',
  'Mako', 'Go Template', 'Dockerfile', 'Ruby', 'JavaScript',
]);

// One best-fit bucket per project for the filter bar. Priority order matters.
function categorize({ description }) {
  const d = description.toLowerCase();
  if (/\b(desktop|tauri|gui|keyboard|studio|app for|mission control)\b/.test(d)) return 'apps';
  if (/\b(browser|rendering engine|from scratch|ratatui|terminal-native|finance)\b/.test(d)) return 'systems';
  if (/\b(llm|inference|agent|model|ml|training|dataset|transformer|whisper|asr|memory|pentest|generative)\b/.test(d)) return 'ai';
  return 'systems';
}

function fetchRepo({ repo, title, blurb }) {
  const meta = JSON.parse(
    gh([
      'repo', 'view', `${OWNER}/${repo}`,
      '--json', 'name,description,stargazerCount,primaryLanguage,repositoryTopics,url,homepageUrl,updatedAt,isPrivate',
    ])
  );

  let languages = [];
  try {
    languages = Object.keys(JSON.parse(gh(['api', `repos/${OWNER}/${repo}/languages`])));
  } catch {
    // languages endpoint can 404 on empty repos — fall back to primary only
  }

  const language = meta.primaryLanguage?.name ?? null;
  const topics = (meta.repositoryTopics ?? []).map((t) => t.name);

  // tech chips: primary language first, then other meaningful languages, then topics — deduped
  const tech = [...new Set([language, ...languages, ...topics].filter(Boolean))]
    .filter((t) => t === language || !NOISE.has(t))
    .slice(0, 6);

  const project = {
    name: meta.name,
    title: title ?? meta.name,
    description: (meta.description || blurb || '').trim(),
    tech,
    language,
    stars: meta.stargazerCount ?? 0,
    updatedAt: meta.updatedAt,
    githubUrl: meta.url,
    homepageUrl: meta.homepageUrl || null,
    topics,
    private: meta.isPrivate ?? false,
  };
  project.category = categorize(project);
  return project;
}

console.log(`Fetching ${FEATURED.length} repos from github.com/${OWNER} …`);
const projects = FEATURED.map((f) => {
  const p = fetchRepo(f);
  console.log(`  ✓ ${p.title} — ${p.stars}★ ${p.language ?? '—'} [${p.category}]`);
  return p;
});

// self-check: every featured repo resolved with the fields the UI relies on
for (const p of projects) {
  if (!p.name || !p.description || !p.githubUrl || !Array.isArray(p.tech)) {
    throw new Error(`Incomplete project data for "${p.name || '?'}": ${JSON.stringify(p)}`);
  }
}
if (projects.length !== FEATURED.length) {
  throw new Error(`Expected ${FEATURED.length} projects, got ${projects.length}`);
}

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data');
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'projects.json');
writeFileSync(outFile, JSON.stringify(projects, null, 2) + '\n');
console.log(`Wrote ${projects.length} projects → ${outFile}`);
