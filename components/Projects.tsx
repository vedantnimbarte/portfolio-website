import React, { useState, useMemo } from 'react';
import { PROJECTS_DATA } from '../constants';
import { FadeIn } from './ui/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectModal } from './ProjectModal';
import { Project } from '../types';
import { 
  Code, 
  Database, 
  Cloud, 
  Cpu, 
  Server, 
  Globe, 
  Zap, 
  Box, 
  Layout, 
  Chrome, 
  Layers, 
  HardDrive, 
  Video, 
  Activity, 
  Package,
  RefreshCw,
  LucideIcon,
  ChevronRight,
  Filter
} from 'lucide-react';

const getTechDetails = (tech: string): { icon: LucideIcon, label: string } => {
  const lower = tech.toLowerCase();
  
  if (lower.includes('react') || lower.includes('next') || lower.includes('frontend') || lower.includes('ui') || lower.includes('vite')) return { icon: Layout, label: tech };
  if (lower.includes('node') || lower.includes('express') || lower.includes('nest')) return { icon: Server, label: tech };
  if (lower.includes('data') || lower.includes('sql') || lower.includes('mongo') || lower.includes('redis')) return { icon: Database, label: tech };
  if (lower.includes('aws') || lower.includes('cloud') || lower.includes('gcp') || lower.includes('azure') || lower.includes('kubernetes') || lower.includes('docker')) return { icon: Cloud, label: tech };
  if (lower.includes('ai') || lower.includes('gpt') || lower.includes('openai') || lower.includes('gemini')) return { icon: Cpu, label: tech };
  if (lower.includes('kafka') || lower.includes('message') || lower.includes('stream') || lower.includes('zookeeper')) return { icon: Activity, label: tech };
  if (lower.includes('chrome') || lower.includes('extension')) return { icon: Chrome, label: tech };
  if (lower.includes('webpack') || lower.includes('build')) return { icon: Package, label: tech };
  if (lower.includes('video') || lower.includes('ffmpeg')) return { icon: Video, label: tech };
  if (lower.includes('s3') || lower.includes('r2') || lower.includes('minio') || lower.includes('storage')) return { icon: HardDrive, label: tech };
  if (lower.includes('mern') || lower.includes('stack')) return { icon: Layers, label: tech };
  if (lower.includes('web')) return { icon: Globe, label: tech };
  
  return { icon: Code, label: tech };
};

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Projects', icon: Box },
  { id: 'ai', label: 'AI & Data', icon: Cpu },
  { id: 'backend', label: 'Backend & Systems', icon: Server },
  { id: 'cloud', label: 'Infrastructure', icon: Cloud },
  { id: 'frontend', label: 'Interface', icon: Layout }
];

export const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return PROJECTS_DATA;
    
    return PROJECTS_DATA.filter(project => {
      const techStr = project.tech.join(' ').toLowerCase();
      const descStr = project.description.toLowerCase();
      const titleStr = project.title.toLowerCase();
      const allStr = `${techStr} ${descStr} ${titleStr}`;

      switch (activeFilter) {
        case 'ai':
          return allStr.includes('ai') || allStr.includes('openai') || allStr.includes('gemini') || allStr.includes('llm');
        case 'backend':
          return allStr.includes('node') || allStr.includes('express') || allStr.includes('nest') || allStr.includes('kafka') || allStr.includes('redis') || allStr.includes('sql') || allStr.includes('ffmpeg');
        case 'cloud':
          return allStr.includes('aws') || allStr.includes('docker') || allStr.includes('kubernetes') || allStr.includes('cloud') || allStr.includes('s3') || allStr.includes('r2') || allStr.includes('minio');
        case 'frontend':
          return allStr.includes('react') || allStr.includes('chrome') || allStr.includes('extension') || allStr.includes('ui') || allStr.includes('vite');
        default:
          return true;
      }
    });
  }, [activeFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <section id="projects" className="py-24 snap-start max-w-7xl mx-auto">
      <div className="bg-surface/30 rounded-3xl border border-zinc-800/50 mx-6 lg:mx-12 px-6 lg:px-12 py-16">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div>
              <div className="flex items-center gap-2 text-accent mb-4">
                <Filter size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Portfolio</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Projects</h2>
              <p className="text-zinc-400">Innovative full-stack solutions and high-scale architectures.</p>
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:border-accent/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shrink-0"
            >
              <RefreshCw size={14} className={`group-hover:text-accent transition-colors ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync View'}
            </button>
          </div>
        </FadeIn>

        {/* Filter Bar */}
        <div className="mb-10 flex flex-wrap gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {FILTER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive 
                  ? 'bg-accent text-zinc-900 border-accent shadow-[0_0_20px_rgba(251,191,36,0.2)]' 
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-zinc-900' : 'text-zinc-500'} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <motion.div 
          layout
          className={`grid md:grid-cols-2 gap-8 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div 
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: "0 20px 40px -15px rgba(251, 191, 36, 0.15)"
                }}
                className="h-full bg-background border border-zinc-800 hover:border-accent/50 rounded-2xl p-8 flex flex-col group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-10 -translate-y-10" />

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <div className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 shadow-inner group-hover:text-accent/70 group-hover:border-accent/30 transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </div>

                <p className="text-zinc-400 mb-6 flex-grow leading-relaxed relative z-10">
                  {project.description}
                </p>

                <div className="space-y-6 relative z-10">
                  <div className="flex flex-wrap gap-3">
                    {project.metrics.map((metric, mIdx) => (
                      <span key={mIdx} className="text-xs font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-md border border-green-400/20">
                        {metric}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-5 border-t border-zinc-800/80">
                    {project.tech.slice(0, 5).map((t, tIdx) => {
                      const { icon: Icon, label } = getTechDetails(t);
                      return (
                        <div 
                          key={tIdx} 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group/tech cursor-default"
                          title={label}
                        >
                          <Icon size={14} className="text-zinc-500 group-hover/tech:text-accent transition-colors" />
                          <span className="text-xs text-zinc-400 font-medium group-hover/tech:text-zinc-200 transition-colors">{label}</span>
                        </div>
                      );
                    })}
                    {project.tech.length > 5 && (
                      <span className="text-[10px] text-zinc-600 font-bold self-center">+{project.tech.length - 5} more</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-zinc-400">Try adjusting your filters to see more of my work.</p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="mt-6 text-accent font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};