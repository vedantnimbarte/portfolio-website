# Vedant Nimbarte — portfolio

A single scrolling page on a deep navy ground: hero with a three.js crystal,
featured GitHub projects, past-role highlights, services, a three-step process,
side projects, production numbers and a closing call to action. A floating
chat answers questions about the work, and Cmd-K / Ctrl-K opens a palette
that jumps to any section or project.

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

- `sections/` - the page, top to bottom: `Hero` (nav, hero, stack marquee),
  `Work` (featured grid, side-project strip), `Services` (experience marquee,
  services bento, steps), `Closing` (numbers fan, bands, contact, footer).
- `components/ProjectCover.tsx` - generated cover art for repos, which have no
  screenshots. Colour is fixed by project order.
- `components/Assistant.tsx` - the floating chat and the command palette.
- `lib/knowledge.ts` - the assistant's answers. A keyword index **derived** from
  `constants.ts` and `data/projects.json` rather than a second copy of the same
  facts, so it cannot drift and cannot invent an answer. Dev-only assertions at
  the bottom of the file fail loudly if the matcher regresses.
- `hooks/useSite.tsx` - one reducer for chat, palette, transcript and the open
  project modal.
- Design tokens live in `index.css` (`@theme`).

## Data

`data/projects.json` is a committed snapshot generated from GitHub:

```
npm run fetch:projects      # needs the gh CLI, authenticated
```

`.github/workflows/refresh-projects.yml` runs this weekly and commits only when
something changed.

## Before launch

- Drop a `resume.pdf` into `public/` and set `CONTACT.resumeUrl` in
  `constants.ts`. Until then the resume command answers honestly instead of
  serving a dead link.
