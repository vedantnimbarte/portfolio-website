import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS_DATA } from '../constants';
import { ModuleHeading } from '../components/ui/Panel';

const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export const Stack: React.FC = () => (
  <div>
    <ModuleHeading title="STACK" hint={`${SKILLS_DATA.length} domains`} />

    <p className="t-prose mb-8 text-ink-dim">
      Production-proven toolkit, grouped by domain — browser down to the metal.
    </p>

    <div className="grid gap-px sm:grid-cols-2">
      {SKILLS_DATA.map((domain) => (
        <motion.section
          key={domain.title}
          variants={item}
          className="border border-trace bg-hull/60 p-5"
        >
          <div className="mb-4 flex items-baseline gap-3">
            <h3 className="t-label text-ink">{domain.title}</h3>
            <span aria-hidden className="h-px flex-1 bg-trace" />
            <span className="t-micro text-ink-dim">
              {String(domain.skills.length).padStart(2, '0')}
            </span>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {domain.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-[2px] border border-trace bg-void px-2 py-1 t-micro text-ink-dim"
              >
                {skill}
              </li>
            ))}
          </ul>
        </motion.section>
      ))}
    </div>
  </div>
);
