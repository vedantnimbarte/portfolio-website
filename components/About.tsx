import React from 'react';
import { FadeIn } from './ui/FadeIn';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 max-w-7xl mx-auto snap-start">
      <div className="bg-surface/50 border border-zinc-800/50 rounded-3xl mx-6 lg:mx-12 px-6 py-16 text-center">
        <FadeIn>
          <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">About Me</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Building the bridge between <br className="hidden md:block" />
            complex systems and user experience.
          </h3>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-4xl mx-auto">
            With over 5 years of experience in the full software development lifecycle, I specialize in building 
            scalable web applications using the MERN stack, Python, and modern cloud platforms.
          </p>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-4xl mx-auto">
            My expertise lies not just in writing code, but in architecting fault-tolerant solutions on AWS, Azure, 
            and GCP. Recently, I've been deeply focused on integrating generative AI into production workflows, 
            helping businesses leverage LLMs for data analysis and automation. I don't just ship features; I optimize 
            systems for performance, security, and long-term maintainability.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};