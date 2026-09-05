import type { Answer, KbEntry, Project } from '../types';
import {
  ABOUT_PARAGRAPHS, CAPABILITIES, CONTACT, EXPERIENCE_DATA,
  HERO_DATA, SKILLS_DATA, STATS,
} from '../constants';
import projectsData from '../data/projects.json';
import { relativeTime } from './format';

const PROJECTS = projectsData as Project[];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ===========================================================================
   RECORD — aggregate facts, computed once from the committed repo snapshot.
   Every number the console displays traces back to here or to constants.ts.
   ========================================================================= */
export const RECORD = {
  repos: PROJECTS.length,
  stars: PROJECTS.reduce((n, p) => n + p.stars, 0),
  lastPush: PROJECTS.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b)),
  posts: EXPERIENCE_DATA.length,
  domains: SKILLS_DATA.length,
  since: EXPERIENCE_DATA[EXPERIENCE_DATA.length - 1].period.match(/\d{4}/)?.[0] ?? '2021',
  employer: EXPERIENCE_DATA[0].company,
};

/* ===========================================================================
   Derived entries. Nothing here retypes a fact — it indexes constants.ts and
   data/projects.json, so `npm run fetch:projects` updates what the console
   knows for free, and the answers cannot drift from the rendered content.
   ========================================================================= */

const identityEntries: KbEntry[] = [
  {
    id: 'identity/operator',
    cite: `→ identity · ${CONTACT.location}`,
    body: `${HERO_DATA.name} — ${HERO_DATA.title}, operating out of ${HERO_DATA.location}. ${HERO_DATA.subtitle}`,
    aliases: ['who', 'name', 'operator', 'vedant', 'nimbarte', 'title', 'role', 'based', 'located', 'location', 'city', 'india', 'surat', 'timezone'],
    actions: [{ kind: 'module', label: 'Open identity', module: 'identity' }],
  },
  {
    id: 'about/narrative',
    cite: '→ identity/narrative',
    body: ABOUT_PARAGRAPHS.join(' '),
    aliases: ['about', 'background', 'story', 'summary', 'bio', 'lifecycle', 'focus'],
    actions: [{ kind: 'module', label: 'Open identity', module: 'identity' }],
  },
  {
    id: 'record/scale',
    cite: `→ record/${slug(RECORD.employer)} · production systems, not this page`,
    body: `Measured on production systems at ${RECORD.employer}: ${STATS.map((s) => `${s.value} ${s.label.toLowerCase()}`).join(', ')}. Public code: ${RECORD.repos} repositories, ${RECORD.stars} stars, last push ${relativeTime(RECORD.lastPush.updatedAt)}.`,
    aliases: ['scale', 'metrics', 'numbers', 'stats', 'uptime', 'users', 'traffic', 'impact', 'throughput', 'stars', 'repos'],
    actions: [{ kind: 'module', label: 'Open work', module: 'work' }],
  },
];

const capabilityEntries: KbEntry[] = CAPABILITIES.map((c) => ({
  id: `capability/${slug(c.title)}`,
  cite: `→ identity/capability · ${c.title.toLowerCase()}`,
  body: `${c.title} — ${c.description}`,
  aliases: [...c.title.toLowerCase().split(/\W+/).filter(Boolean), 'capability', 'strength'],
}));

const experienceEntries: KbEntry[] = EXPERIENCE_DATA.map((e, i) => ({
  id: `exp/${slug(e.company)}`,
  cite: `→ exp/${slug(e.company)} · ${e.period} · ${e.location}`,
  body: `${e.role} at ${e.company}, ${e.period}, ${e.location}. ${e.highlights.join(' ')}`,
  aliases: [
    ...e.company.toLowerCase().split(/\W+/).filter(Boolean),
    ...e.role.toLowerCase().split(/\W+/).filter(Boolean),
    'experience', 'employment', 'worked', 'history', 'career', 'job',
    ...(i === 0 ? ['current', 'now', 'present', 'employer', 'today'] : ['previous', 'past', 'former']),
  ],
  actions: [{ kind: 'module', label: 'Open operations', module: 'ops' }],
}));

const skillEntries: KbEntry[] = SKILLS_DATA.map((s) => ({
  id: `skill/${slug(s.title)}`,
  cite: `→ stack/${slug(s.title)} · ${s.skills.length} entries`,
  body: `${s.title}: ${s.skills.join(', ')}.`,
  aliases: [
    ...s.skills.map((k) => k.toLowerCase()),
    ...s.title.toLowerCase().split(/\W+/).filter(Boolean),
    'stack', 'tech', 'technology', 'skills', 'toolkit',
  ],
  actions: [{ kind: 'module', label: 'Open stack', module: 'stack' }],
}));

const projectEntries: KbEntry[] = PROJECTS.map((p) => ({
  id: `project/${slug(p.name)}`,
  cite: `→ work/${slug(p.name)} · ${p.language ?? 'multi'} · ${p.stars}★ · updated ${relativeTime(p.updatedAt)}`,
  body: `${p.title} — ${p.description}`,
  aliases: [
    p.name.toLowerCase(),
    ...p.title.toLowerCase().split(/\W+/).filter(Boolean),
    ...p.tech.map((t) => t.toLowerCase()),
    ...p.topics.map((t) => t.toLowerCase()),
    p.category, 'project', 'repo', 'repository', 'built', 'shipped',
  ],
  actions: [
    { kind: 'project', label: `Open ${p.title}`, name: p.name },
    { kind: 'link', label: 'GitHub', href: p.githubUrl },
  ],
}));

/* ===========================================================================
   Hand-written intents. The only entries with no upstream source, because
   conversation has none. Everything else is derived above.
   ========================================================================= */

const CONTACT_ACTIONS = [
  { kind: 'copy' as const, label: 'Copy email', value: CONTACT.email },
  { kind: 'link' as const, label: 'LinkedIn', href: CONTACT.linkedin },
  { kind: 'link' as const, label: `GitHub ${CONTACT.githubHandle}`, href: CONTACT.github },
];

const intentEntries: KbEntry[] = [
  {
    id: 'intent/greeting',
    cite: '→ console/ready',
    body: `Console online. I hold the operator's record — ${RECORD.posts} posts, ${RECORD.domains} stack domains, ${RECORD.repos} repositories. Ask a question, or press Cmd-K for commands.`,
    aliases: ['hello', 'hi', 'hey', 'greetings', 'yo'],
    weight: 1.15,
  },
  {
    id: 'intent/hire',
    cite: '→ contact/hire',
    body: 'The operator is open to work — full-time, contract, or consultation. Fastest route is email; he replies to real briefs, typically inside 24 hours.',
    aliases: ['hire', 'hiring', 'recruit', 'recruiter', 'available', 'availability', 'open', 'rate', 'rates', 'salary', 'freelance', 'contract', 'consulting', 'role', 'position', 'opportunity', 'onboard'],
    actions: CONTACT_ACTIONS,
    weight: 1.15,
  },
  {
    id: 'intent/contact',
    cite: '→ contact/channels',
    body: `Channels: ${CONTACT.email} · ${CONTACT.linkedinHandle} · ${CONTACT.githubHandle}. Based in ${CONTACT.location} (${CONTACT.timeZone}). No contact form — mail lands directly.`,
    aliases: ['contact', 'email', 'mail', 'reach', 'talk', 'message', 'linkedin', 'github', 'social', 'connect'],
    actions: CONTACT_ACTIONS,
    weight: 1.15,
  },
  {
    id: 'intent/resume',
    cite: '→ contact/credentials',
    body: CONTACT.resumeUrl
      ? 'Résumé is published — download it below.'
      : "No résumé PDF is published on this console yet. The full record is here in OPERATIONS and STACK, and he'll send a PDF on request.",
    aliases: ['resume', 'cv', 'curriculum', 'vitae', 'pdf', 'download', 'credentials'],
    actions: CONTACT.resumeUrl
      ? [{ kind: 'link' as const, label: 'Download résumé', href: CONTACT.resumeUrl }, ...CONTACT_ACTIONS]
      : CONTACT_ACTIONS,
    weight: 1.15,
  },
  {
    id: 'intent/help',
    cite: '→ console/index',
    body: `This index covers identity, operations (${RECORD.posts} posts since ${RECORD.since}), stack (${RECORD.domains} domains), work (${RECORD.repos} repositories), and contact. Ask in plain language — "rust work", "is he available", "what has he built with AI". Cmd-K runs commands instead.`,
    aliases: ['help', 'commands', 'usage', 'index', 'topics', 'ask'],
    weight: 1.15,
  },
];

const FALLBACK: KbEntry = {
  id: 'intent/fallback',
  cite: '→ index miss · 0 external calls',
  body: `Not in the index. This console answers only from the operator's recorded work — no model, no network, so it does not guess. Covered: identity, operations, stack, ${RECORD.repos} repositories, contact.`,
  actions: [...CONTACT_ACTIONS, { kind: 'module' as const, label: 'Browse work', module: 'work' as const }],
  weight: 0,
};

export const KB: KbEntry[] = [
  ...identityEntries, ...capabilityEntries, ...experienceEntries,
  ...skillEntries, ...projectEntries, ...intentEntries,
];

/* ===========================================================================
   Matching — IDF-weighted token overlap. No dependency, ~40 lines.
   ========================================================================= */

const STOP = new Set(
  ('a an and any are as at be been by can did do does for from get got had has have he ' +
   'her him his how i in into is it its just like me more most of on or over she so some ' +
   'tell than that the their them then there they this to us use used uses using was we ' +
   'were what whats when where which who whose why will with would you your').split(' ')
);

// Expand, never replace — `llm` must still match "LLM Integration" *and* reach `ai`.
const SYNONYMS: Record<string, string[]> = {
  k8s: ['kubernetes'], kube: ['kubernetes'], iac: ['terraform'],
  js: ['javascript'], ts: ['typescript'], rs: ['rust'], py: ['python'],
  ml: ['ai', 'llm', 'model'], ai: ['llm'], genai: ['ai', 'llm'], gpt: ['openai', 'llm'],
  llm: ['ai'], mcp: ['memory', 'agent'], rag: ['llm', 'memory'],
  cv: ['resume'], db: ['database'], pg: ['postgresql'], postgres: ['postgresql'],
  mongo: ['mongodb'], node: ['nodejs'],
  aws: ['cloud'], gcp: ['cloud'], devops: ['docker', 'kubernetes'],
  frontend: ['react'], backend: ['nodejs'], infra: ['cloud', 'kubernetes'],
  mern: ['mongodb', 'express', 'react', 'nodejs'],
  cost: ['rate'], pricing: ['rate'], pay: ['rate'],
  mail: ['email'], reach: ['contact'],
};

const tokenize = (s: string): string[] =>
  s.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').split(' ').filter((t) => t && !STOP.has(t));

const expand = (tokens: string[]): string[] => {
  const out = new Set<string>();
  for (const t of tokens) {
    out.add(t);
    for (const syn of SYNONYMS[t] ?? []) out.add(syn);
  }
  return [...out];
};

interface Indexed { entry: KbEntry; tokens: Set<string>; boost: Set<string> }

const INDEX: Indexed[] = KB.map((entry) => ({
  entry,
  tokens: new Set([
    ...tokenize(entry.body),
    ...tokenize(entry.id),
    ...(entry.aliases ?? []).flatMap(tokenize),
  ]),
  boost: new Set([...tokenize(entry.id), ...(entry.aliases ?? []).flatMap(tokenize)]),
}));

// Technology names are the primary query axis on a portfolio, and raw IDF gets
// this backwards: "experience" appears in only the four job entries, so it
// scores as *rarer* than "rust" and a query for "rust experience" returns the
// employment list with no Rust in it. Weighting tech tokens restores the
// intent - the topic word beats the framing word.
const TECH = new Set<string>([
  ...SKILLS_DATA.flatMap((s) => s.skills.flatMap(tokenize)),
  ...PROJECTS.flatMap((p) => [...(p.language ? [p.language] : []), ...p.tech].flatMap(tokenize)),
]);
const topicWeight = (t: string) => (TECH.has(t) ? 2.5 : 1);

const DF = new Map<string, number>();
for (const { tokens } of INDEX) for (const t of tokens) DF.set(t, (DF.get(t) ?? 0) + 1);
const idf = (t: string) => Math.log(1 + INDEX.length / (1 + (DF.get(t) ?? 0)));

const hit = (t: string, ix: Indexed): number => {
  if (ix.tokens.has(t)) return 1;
  if (t.length >= 4) for (const u of ix.tokens) if (u.startsWith(t)) return 0.6;
  return 0;
};

const THRESHOLD = 0.35;
const CLIFF = 0.5;   // drop anything under half the top score
const MAX = 3;

export const search = (query: string): Answer => {
  // Drop tokens no entry has ever seen. Without this, one unknown word carries
  // maximum IDF and tanks an otherwise perfect match.
  const q = expand(tokenize(query)).filter((t) => (DF.get(t) ?? 0) > 0);
  if (!q.length) return { query, entries: [FALLBACK], hit: false };

  const denom = q.reduce((n, t) => n + idf(t) * topicWeight(t), 0) || 1;

  const scored = INDEX
    .map((ix) => {
      const raw = q.reduce(
        (n, t) => n + hit(t, ix) * idf(t) * topicWeight(t) * (ix.boost.has(t) ? 2 : 1),
        0
      );
      return { entry: ix.entry, score: (raw / denom) * (ix.entry.weight ?? 1) };
    })
    .filter((r) => r.score >= THRESHOLD)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return { query, entries: [FALLBACK], hit: false };

  const top = scored[0].score;
  let kept = scored.filter((r) => r.score >= top * CLIFF).slice(0, MAX).map((r) => r.entry);

  // Collapse a run of near-identical repo cards into one summary. Count over
  // every repo that cleared the threshold, not just the ones that survived the
  // MAX cap, or the summary undercounts and reads as a wrong answer.
  const allRepos = scored
    .filter((r) => r.entry.id.startsWith('project/'))
    .map((r) => r.entry);
  if (allRepos.length >= 2) {
    const titles = allRepos.map(
      (e) => PROJECTS.find((p) => slug(p.name) === e.id.slice('project/'.length))?.title ?? e.id
    );
    const shown = titles.slice(0, 5);
    const rest = titles.length - shown.length;
    kept = [
      ...kept.filter((e) => !e.id.startsWith('project/')).slice(0, MAX - 1),
      {
        id: 'project/group',
        cite: `→ work · ${titles.length} of ${RECORD.repos} repositories`,
        body: `${titles.length} matching repositories: ${shown.join(', ')}${
          rest > 0 ? `, and ${rest} more` : ''
        }.`,
        actions: [{ kind: 'module', label: 'Open work', module: 'work' }],
      },
    ];
  }

  return { query, entries: kept, hit: true };
};

/* ===========================================================================
   Boot script. Every count is interpolated from the same modules the index
   reads, so the sequence cannot drift from reality. The "verifying record"
   line names the employer so even the boot text doesn't let 99.9% float free.
   ========================================================================= */

export const BOOT_LINES: { text: string; hold?: number }[] = [
  { text: '  VN-OS · personal console · v1' },
  { text: `> mounting operator profile ......... ${HERO_DATA.name.toLowerCase()}` },
  { text: `> role .............................. ${HERO_DATA.title.toLowerCase()}` },
  { text: '> station ........................... surat, gujarat · asia/kolkata' },
  { text: `> indexing experience ............... ${RECORD.posts} posts · ${RECORD.since} → present` },
  { text: `> indexing stack .................... ${RECORD.domains} domains · rust, mern, aws/gcp` },
  { text: `> indexing repositories ............. ${RECORD.repos} public · ${RECORD.stars} ★`, hold: 260 },
  { text: '> loading inference notes ........... dlm · wingman · kortex-memory' },
  { text: `> verifying record .................. ${STATS[2].value} uptime · ${STATS[1].value} daily users · ${RECORD.employer.toLowerCase()}`, hold: 260 },
  { text: `> knowledge index ................... ${KB.length} entries · 0 external calls` },
  { text: '> console online. no model, no network — just his record.', hold: 400 },
  { text: '  Cmd-K for commands, or ask a question.' },
];

export const SUGGESTED = ['Rust work?', 'Is he available?', 'AI projects', 'Where has he worked?'];

/* --------------------------------------------------------------- self-check
   Smallest thing that fails if the matcher breaks. Dead-stripped from prod. */
if (import.meta.env.DEV) {
  const expect = (label: string, ok: boolean) => {
    if (!ok) console.error(`[knowledge] self-check failed: ${label}`);
  };
  expect('rust → languages', search('rust').entries.some((e) => e.id === 'skill/languages'));
  expect('k8s → cloud-devops', search('k8s').entries[0].id === 'skill/cloud-devops');
  expect('hire intent', search('how do i hire him').entries[0].id === 'intent/hire');
  expect('kortex → repo', search('kortex').entries.some((e) => e.id.startsWith('project/')));
  expect('cloudairy → exp', search('where does he work now').entries.some((e) => e.id === 'exp/cloudairy'));
  expect('nonsense → miss', search('qwertyuiop zxcvbn').hit === false);
  // The topic word must beat the framing word, or this query returns the job
  // list with no Rust in it.
  expect(
    'rust experience → not the job list',
    ['skill/languages', 'project/group'].includes(search('what is his rust experience').entries[0].id)
  );
  expect('kb size', KB.length > 25);
}
