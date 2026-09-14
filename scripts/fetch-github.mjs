// Generates data/github.json and assets/github/*.png from the public GitHub
// profile: achievements, contribution and commit/PR totals. Run locally:  npm run fetch:github
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
  const headers = { 'User-Agent': `${OWNER}-portfolio` };
  // CI passes its token to stay clear of the anonymous search rate limit. It
  // can only see public repos, so the totals match a logged-out visitor's.
  if (process.env.GH_TOKEN && url.startsWith('https://api.github.com/')) {
    headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  }
  const res = await fetch(url, { headers });
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
const calendarHtml = await get(`https://github.com/users/${OWNER}/contributions`);
const calendar = calendarHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const contributions = calendar.match(/([\d,]+) contributions? in the last year/)?.[1];
if (!contributions) throw new Error('Could not read the contribution total');

// One activity level (0-4) per day, oldest first, for the hero's calendar ring.
const days = [...calendarHtml.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"/g)]
  .map(([, date, level]) => ({ date, level }))
  .sort((a, b) => a.date.localeCompare(b.date));
if (days.length < 360) throw new Error(`Expected a year of calendar days, got ${days.length}`);

// All-time totals across public repositories, via the search API.
const total = async (kind, q) => {
  const { total_count } = await get(
    `https://api.github.com/search/${kind}?q=${encodeURIComponent(q)}&per_page=1`,
    'json'
  );
  if (typeof total_count !== 'number') throw new Error(`No total for ${kind} "${q}"`);
  return total_count;
};
const commits = await total('commits', `author:${OWNER}`);
const pullRequests = await total('issues', `type:pr author:${OWNER}`);
const mergedPullRequests = await total('issues', `type:pr author:${OWNER} is:merged`);

const out = {
  login: OWNER,
  url: `https://github.com/${OWNER}`,
  contributionsLastYear: Number(contributions.replace(/,/g, '')),
  calendar: { start: days[0].date, levels: days.map((d) => d.level).join('') },
  commits,
  pullRequests,
  mergedPullRequests,
  achievements: achievements.map(({ slug, name, tier }) => ({
    slug,
    name,
    tier,
    description: DESCRIPTIONS[slug] ?? null,
  })),
};

writeFileSync(resolve(root, 'data', 'github.json'), JSON.stringify(out, null, 2) + '\n');
console.log(
  `Wrote ${achievements.length} achievements, ${out.contributionsLastYear} contributions, ` +
    `${commits} commits, ${pullRequests} PRs (${mergedPullRequests} merged) → data/github.json`
);
