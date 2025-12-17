import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';

interface NavbarProps {
  onOpenHireMe: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHireMe }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Smooth scroll animations
  const backgroundColor = useTransform(scrollY, [0, 50], ["rgba(14, 16, 21, 0)", "rgba(14, 16, 21, 0.8)"]);
  const backdropFilter = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const borderColor = useTransform(scrollY, [0, 50], ["rgba(39, 39, 42, 0)", "rgba(39, 39, 42, 0.6)"]);
  const paddingY = useTransform(scrollY, [0, 50], ["1.5rem", "0.75rem"]);
  const shadow = useTransform(scrollY, [0, 50], ["0 0 0 rgba(0,0,0,0)", "0 10px 15px -3px rgba(0, 0, 0, 0.1)"]);

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const mobileMenuVariants: Variants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const mobileItemVariants: Variants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({ x: 0, opacity: 1, transition: { delay: i * 0.05 } })
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      style={{ 
        backgroundColor, 
        backdropFilter, 
        borderBottomWidth: '1px', 
        borderBottomColor: borderColor, 
        paddingTop: paddingY, 
        paddingBottom: paddingY,
        boxShadow: shadow
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Brand Logo */}
        <motion.a 
          href="#" 
          className="flex items-center gap-3 group focus:outline-none"
          whileHover="hover"
          initial="initial"
          whileTap="tap"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative w-11 h-11">
            {/* Logo Container */}
            <motion.div 
              className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
              variants={{
                initial: { 
                  borderColor: "rgba(39, 39, 42, 0.5)",
                  rotate: 0,
                  scale: 1
                },
                hover: { 
                  borderColor: "rgba(251, 191, 36, 0.5)",
                  rotate: 45, // Rotate the background box for a dynamic effect
                  scale: 0.9,
                  borderRadius: "12px"
                }
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
               <motion.div 
                 className="absolute inset-0 bg-accent/10"
                 variants={{ initial: { opacity: 0 }, hover: { opacity: 1 } }}
               />
            </motion.div>
            
            {/* Initials - Keeping them upright while container spins */}
            <div className="absolute inset-0 flex items-center justify-center font-display font-black text-lg tracking-tighter select-none z-10">
              <motion.span 
                className="text-zinc-300 relative"
                variants={{
                  initial: { x: 1 },
                  hover: { x: -3, color: '#ffffff' }
                }}
              >
                V
              </motion.span>
              <motion.span 
                className="text-accent relative"
                variants={{
                  initial: { x: -1 },
                  hover: { x: 3 }
                }}
              >
                N
                <motion.span 
                  className="absolute -bottom-0.5 -right-1 w-1 h-1 bg-accent rounded-full"
                  variants={{
                    initial: { opacity: 0, scale: 0 },
                    hover: { opacity: 1, scale: 1 }
                  }}
                />
              </motion.span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-zinc-100 group-hover:text-white transition-colors duration-300 tracking-tight leading-none">
              Vedant Nimbarte
            </span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase group-hover:text-accent transition-colors duration-300 mt-0.5">
              Portfolio
            </span>
          </div>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <motion.a 
              key={item.label} 
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-full group overflow-hidden font-display cursor-pointer"
              whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.5)" }} // zinc-800/50
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10">{item.label}</span>
            </motion.a>
          ))}
          
          <div className="w-px h-6 bg-zinc-800 mx-4" />

          <motion.button 
            onClick={onOpenHireMe}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 bg-zinc-100 text-zinc-900 hover:bg-accent hover:text-zinc-900 text-sm font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] font-display"
          >
            Hire Me
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-zinc-800 overflow-hidden shadow-2xl"
          >
            <div className="p-6 flex flex-col gap-2">
              {NAV_ITEMS.map((item, idx) => (
                <motion.a 
                  key={item.label}
                  custom={idx}
                  variants={mobileItemVariants} 
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-4 py-3 text-lg font-medium text-zinc-300 hover:text-accent hover:bg-zinc-800/50 rounded-lg transition-colors font-display"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div 
                custom={NAV_ITEMS.length}
                variants={mobileItemVariants}
                className="pt-4 mt-2 border-t border-zinc-800"
              >
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHireMe();
                  }}
                  className="w-full py-3 bg-accent text-background font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-accent/20 font-display"
                >
                  Hire Me
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};