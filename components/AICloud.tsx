import React from 'react';
import { AI_CLOUD_FEATURES } from '../constants';
import { FadeIn } from './ui/FadeIn';
import { motion, Variants } from 'framer-motion';

export const AICloud: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="ai-cloud" className="py-24 max-w-7xl mx-auto px-6 lg:px-12 snap-start">
      <FadeIn>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cloud Native & <span className="text-accent">AI Ready</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Modern applications require more than just code. They need resilient architecture and intelligent integrations.
          </p>
        </div>
      </FadeIn>

      <motion.div 
        className="grid md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {AI_CLOUD_FEATURES.map((feature, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            className="relative p-8 rounded-2xl bg-gradient-to-b from-zinc-800/20 to-transparent border border-zinc-800 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg border border-zinc-700 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};