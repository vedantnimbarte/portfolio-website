import React from 'react';
import { HERO_DATA, STATS } from '../constants';
import { Github, Linkedin, Mail, Download, Code, Cpu, Cloud, Server, Database, Layout, Activity, Zap, BrainCircuit } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';
import { motion, useScroll, useTransform } from 'framer-motion';

const TechNode = ({ icon: Icon, label, x, y, delay = 0 }: { icon: any, label: string, x: string, y: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      y: ["0%", "-5%", "0%"]
    }}
    transition={{
      opacity: { duration: 0.8, delay },
      scale: { duration: 0.8, delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
    }}
    style={{ left: x, top: y }}
    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group cursor-default z-20"
  >
    <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all duration-500">
      <Icon size={24} />
    </div>
    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-200 transition-colors">{label}</span>
  </motion.div>
);

const DataPacket = ({ path, delay = 0 }: { path: string, delay?: number }) => (
  <motion.circle
    r="2"
    fill="#fbbf24"
    initial={{ offsetDistance: "0%" }}
    animate={{ offsetDistance: "100%" }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "linear",
      delay
    }}
    style={{ offsetPath: `path('${path}')`, filter: 'blur(1px)' }}
  />
);

const CloudArchitecture = () => {
  // SVG Paths for connections
  const paths = {
    ai: "M 200 250 L 100 100",
    cloud: "M 200 250 L 300 100",
    frontend: "M 200 250 L 50 250",
    backend: "M 200 250 L 350 250",
    data: "M 200 250 L 200 400"
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Central Core */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center z-10"
      >
        <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.1)]">
          <Zap size={32} className="text-accent animate-pulse" />
        </div>
      </motion.div>

      {/* SVG Connections Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 500">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        
        {/* Connection Lines */}
        {Object.values(paths).map((d, i) => (
          <path key={i} d={d} stroke="#fbbf24" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        ))}

        {/* Moving Packets */}
        <DataPacket path={paths.ai} delay={0} />
        <DataPacket path={paths.cloud} delay={1.5} />
        <DataPacket path={paths.frontend} delay={0.8} />
        <DataPacket path={paths.backend} delay={2.2} />
        <DataPacket path={paths.data} delay={1} />
      </svg>

      {/* Technology Nodes */}
      <TechNode icon={BrainCircuit} label="AI/ML" x="25%" y="20%" delay={0.2} />
      <TechNode icon={Cloud} label="DevOps" x="75%" y="20%" delay={0.4} />
      <TechNode icon={Layout} label="Frontend" x="12%" y="50%" delay={0.6} />
      <TechNode icon={Server} label="Backend" x="88%" y="50%" delay={0.8} />
      <TechNode icon={Database} label="Systems" x="50%" y="85%" delay={1.0} />

      {/* Floating background ambience specific to architecture */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />
    </div>
  );
};

const FloatingCard = ({ icon: Icon, title, subtitle, delay, xOffset = 0 }: { icon: any, title: string, subtitle: string, delay: number, xOffset?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, x: 20 + xOffset }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
      x: xOffset
    }}
    transition={{
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      },
      opacity: { duration: 0.5, delay: 0.5 }
    }}
    className="relative p-4 rounded-2xl bg-zinc-800/40 backdrop-blur-md border border-zinc-700/50 shadow-xl flex items-center gap-4 w-fit min-w-[200px] hover:border-accent/50 transition-colors cursor-default group"
  >
    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:scale-110 transition-all">
      <Icon size={20} />
    </div>
    <div>
      <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{subtitle}</div>
      <div className="text-sm font-bold text-zinc-100">{title}</div>
    </div>
  </motion.div>
);

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax Transforms
  const yBg = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacityBg = useTransform(scrollY, [0, 500], [1, 0]);
  const yShape1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const yShape2 = useTransform(scrollY, [0, 1000], [0, 150]);
  const yArchitecture = useTransform(scrollY, [0, 1000], [0, 80]);
  const yCards = useTransform(scrollY, [0, 1000], [0, 160]);

  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-12 overflow-hidden bg-background snap-start">
      {/* Background Ambience */}
      <motion.div 
        style={{ y: yBg, opacity: opacityBg, x: "-50%" }}
        className="absolute top-0 left-1/2 w-[1400px] h-[800px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" 
      />
      
      {/* 3D Floating Objects (Decorative) */}
      <motion.div style={{ y: yShape1 }} className="absolute top-1/4 left-[5%] -z-10 hidden lg:block pointer-events-none">
        <motion.div 
          animate={{ rotate: 360, y: [0, -20, 0] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
          className="w-24 h-24 rounded-full border-2 border-zinc-800/30"
        />
      </motion.div>
      
      <motion.div style={{ y: yShape2 }} className="absolute bottom-1/4 right-[5%] -z-10 hidden lg:block pointer-events-none">
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: -10 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 bg-zinc-800/20 rounded-3xl rotate-12"
        />
      </motion.div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-8 lg:gap-0 items-center relative">
        
        {/* LEFT COLUMN: Typography & Info (Span 5) */}
        <div className="lg:col-span-5 relative z-20 order-1">
          <FadeIn>
            <div className="mb-2 pl-1">
               <span className="text-xl md:text-2xl text-zinc-400 font-medium tracking-tight">Hello, I'm</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter mb-6 leading-[0.9]">
              VEDANT<br />
              <span className="text-zinc-700">NIMBARTE</span>
            </h1>
            
            <p className="text-lg text-zinc-400 mb-8 max-w-md leading-relaxed">
              {HERO_DATA.subtitle}
            </p>

            {/* Quick Stats Integration */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-lg">
              {STATS.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.1), duration: 0.5 }}
                  className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3 flex flex-col items-start gap-0.5 hover:border-accent/30 transition-colors"
                >
                  <span className="text-accent font-display font-bold text-lg leading-tight">{stat.value}</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
               <div className="group relative">
                 <div className="absolute inset-0 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                 <a href={`mailto:${HERO_DATA.email}`} className="relative flex items-center gap-3 px-6 py-3.5 rounded-full bg-surface border border-zinc-800 text-zinc-300 hover:text-white hover:border-accent/50 transition-all duration-300">
                    <Mail size={18} className="text-accent" />
                    <span className="font-medium tracking-wide text-sm">{HERO_DATA.email}</span>
                 </a>
               </div>

               <div className="flex gap-3">
                 <a href="https://github.com" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 transition-all duration-300">
                   <Github size={20} />
                 </a>
                 <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 transition-all duration-300">
                   <Linkedin size={20} />
                 </a>
                 <a href="/resume.pdf" className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-110 transition-all duration-300" title="Download Resume">
                    <Download size={20} />
                 </a>
               </div>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-zinc-500 pl-1">
               <span className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 Available for freelance
               </span>
               <span className="w-1 h-1 rounded-full bg-zinc-700" />
               <span>Based in Surat, India</span>
            </div>
          </FadeIn>
        </div>

        {/* CENTER COLUMN: Architecture Visualization (Span 4) */}
        <motion.div 
          style={{ y: yArchitecture }}
          className="lg:col-span-4 relative z-10 h-[500px] lg:h-[600px] order-2 flex items-center justify-center"
        >
           <CloudArchitecture />
        </motion.div>

        {/* RIGHT COLUMN: Floating Widgets (Span 3) */}
        <motion.div 
          style={{ y: yCards }}
          className="lg:col-span-3 relative z-20 flex flex-col justify-center h-full gap-8 order-3 pl-8"
        >
           <FloatingCard icon={Code} title="Senior Full Stack" subtitle="Role" delay={0} xOffset={0} />
           <FloatingCard icon={Cpu} title="AI Integration" subtitle="Specialization" delay={1.5} xOffset={40} />
           <FloatingCard icon={Cloud} title="Cloud Architect" subtitle="Skill" delay={0.8} xOffset={10} />
           <FloatingCard icon={Server} title="DevOps & Scale" subtitle="Focus" delay={2.2} xOffset={50} />
        </motion.div>

      </div>
    </section>
  );
};