// Generates data/github.json and assets/github/*.png from the public GitHub
// profile. Run locally:  npm run fetch:github
// Achievements have no API, so they are read from the profile page markup.
// Every number is what a logged-out visitor sees on github.com, so a local run
// and the weekly CI run agree.

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const OWNER = 'vedantnimbarte';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// GitHub's own wording, shortened. Unknown badges still render, just without
// a description.
const DESCRIPTIONS = {
  'pull-shark': 'Opened pull requests that have been merged',
  'pair-extraordinaire': 'Coauthored commits on merged pull requests',
  quickdraw: 'Closed an issue or pull request within 5 minutes of opening',
  yolo: 'Merged a pull request without code review',
  starstruck: 'Created a repository that has many stars',
  'galaxy-brain': 'Answered discussions',
  'public-sponsor': 'Sponsored open source work',
  'heart-on-your-sleeve': 'Reacted to something with a heart',
  'open-sourcerer': 'Had pull requests merged in multiple public repositories',
  'arctic-code-vault-contributor': 'Contributed code to the 2020 GitHub Archive Program',
};

const get = async (url, as = 'text') => {
  const res = await fetch(url, { headers: { 'User-Agent': `${OWNER}-portfolio` } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return as === 'buffer' ? Buffer.from(await res.arrayBuffer()) : res[as]();
};

/* ------------------------------------------------------------ achievements */
const profile = await get(`https://github.com/${OWNER}?tab=achievements`);
if (!profile.includes('Achievements')) {
  throw new Error('Profile page has no Achievements block — markup changed?');
}

const BADGE =
  /\?achievement=([a-z0-9-]+)&amp;tab=achievements"[^>]*><img src="([^"]+)"[^>]*alt="Achievement: ([^"]+)"[^>]*\/>(?:<span[^>]*>(x\d+)<\/span>)?/g;

const seen = new Map();
for (const [, slug, image, name, tier] of profile.matchAll(BADGE)) {
  if (!seen.has(slug)) seen.set(slug, { slug, name, tier: tier ?? null, image });
}
const achievements = [...seen.values()];

const badgeDir = resolve(root, 'assets', 'github');
mkdirSync(badgeDir, { recursive: true });
for (const a of achievements) {
  writeFileSync(resolve(badgeDir, `${a.slug}.png`), await get(a.image, 'buffer'));
  console.log(`  ✓ ${a.name}${a.tier ? ` ${a.tier}` : ''}`);
}

/* ------------------------------------------------------------------- stats */
const calendar = (await get(`https://github.com/users/${OWNER}/contributions`))
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ');
const contributions = calendar.match(/([\d,]+) contributions? in the last year/)?.[1];
if (!contributions) throw new Error('Could not read the contribution total');

const out = {
  login: OWNER,
  url: `https://github.com/${OWNER}`,
  contributionsLastYear: Number(contributions.replace(/,/g, '')),
  achievements: achievements.map(({ slug, name, tier }) => ({
    slug,
    name,
    tier,
    description: DESCRIPTIONS[slug] ?? null,
  })),
};

writeFileSync(resolve(root, 'data', 'github.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${achievements.length} achievements, ${out.contributionsLastYear} contributions → data/github.json`);
