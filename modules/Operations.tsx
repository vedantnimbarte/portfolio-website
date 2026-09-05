import React from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE_DATA } from '../constants';
import { ModuleHeading } from '../components/ui/Panel';

const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

// Every measured number gets marked as a value rather than left in prose.
// Amber, not cyan: these were measured on employers' systems, not on this page.
const formatHighlight = (text: string) => {
  const parts = text.split(/(\d+(?:,\d+)*(?:\.\d+)?(?:%|\+|x|k|m|bn)?)/gi);
  return parts.map((part, i) =>
    /^\d/.test(part) ? (
      <span key={i} className="text-record">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
};

export const Operations: React.FC = () => (
  <div>
    <ModuleHeading
      title="OPERATIONS"
      hint={`${EXPERIENCE_DATA.length} posts · 2021 → present`}
    />

    <p className="t-prose mb-8 text-ink-dim">
      Deployment history, most recent first. Figures in amber were measured on the
      employer&apos;s production systems, not on this console.
    </p>

    <ol className="space-y-px">
      {EXPERIENCE_DATA.map((job, i) => (
        <motion.li
          key={job.company}
          variants={item}
          className="border border-trace bg-hull/60 p-6 transition-colors hover:border-signal/40"
        >
          <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {/* Numbering matches the "N posts" count in telemetry and boot. */}
            <span className="t-micro text-signal">
              POST {String(EXPERIENCE_DATA.length - i).padStart(2, '0')}
            </span>
            <h3 className="t-readout text-ink">{job.role}</h3>
            <span aria-hidden className="h-px flex-1 bg-trace" />
            <span className="t-micro text-ink-dim">
              {job.period} · {job.location}
            </span>
          </div>

          <p className="t-label mb-4 text-signal">{job.company}</p>

          <ul className="space-y-2">
            {job.highlights.map((h) => (
              <li key={h} className="t-prose flex gap-3 text-ink-dim">
                <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-trace" />
                <span>{formatHighlight(h)}</span>
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  </div>
);
