# VN-OS

Personal portfolio for Vedant Nimbarte, built as a fixed cockpit console rather
than a scrolling page. Five modules swap inside one full-viewport chassis;
below 900px it becomes a handheld device layout with a bottom dock.

React 19 + Vite + TypeScript + Tailwind v4. No backend, no API keys, no runtime
network calls.

## Develop

```
npm install
npm run dev        # http://localhost:3000
npm run build
npm run preview
```

## How it is put together

- `console/` - the chassis: status bar, module rail (desktop) or dock (handheld),
  viewport, telemetry column, ticker, boot overlay.
- `modules/` - the five panels. `modules/index.ts` is the single registry that
  drives the rail, the dock, the hash routing and the command palette.
- `lib/knowledge.ts` - the assistant. A keyword index **derived** from
  `constants.ts` and `data/projects.json` rather than a second copy of the same
  facts, so it cannot drift and cannot invent an answer. Matching is
  IDF-weighted token overlap with an extra weight on technology names. Dev-only
  assertions at the bottom of the file fail loudly if the matcher regresses.
- `hooks/useConsole.tsx` - one reducer holds the active module, boot state,
  prompt focus, transcript and event log, and syncs the URL hash.

### Two rules worth keeping

**Cyan is now, amber is the record.** Cyan readouts are measured in this
session, in this browser. Amber readouts were measured on Cloudairy production
systems and are historical. They are never mixed in one row, because `99.9%
uptime` in live cyan next to a blinking dot would read as a claim about this
website. There is deliberately no CPU gauge, request rate or latency readout -
there is no backend, so all three would be fabricated.

**Ticking state stays in leaves.** The clock and session timer use
`useSyncExternalStore`, not the console context. A 1Hz value in a top-level
provider re-renders the whole shell, three.js host included, once a second.

## Data

`data/projects.json` is a committed snapshot generated from GitHub:

```
npm run fetch:projects      # needs the gh CLI, authenticated
```

`.github/workflows/refresh-projects.yml` runs this weekly and commits only when
something changed.

## Before launch

- Replace the placeholder origin (`https://vedantnimbarte.vercel.app/`) in
  `index.html` - it appears in the canonical link, the OG tags and the JSON-LD.
- Drop a `resume.pdf` into `public/` and set `CONTACT.resumeUrl` in
  `constants.ts`. Until then the resume command answers honestly instead of
  serving a dead link.
