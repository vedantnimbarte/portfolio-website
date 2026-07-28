import React, { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';

interface NavbarProps {
  onOpenHireMe: () => void;
}

// Scroll spy: which section is currently in view.
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
};

const SECTION_IDS = NAV_ITEMS.map((i) => i.href.replace('#', ''));

export const Navbar: React.FC<NavbarProps> = ({ onOpenHireMe }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const active = useActiveSection(SECTION_IDS);

  const backgroundColor = useTransform(scrollY, [0, 50], ['rgba(14, 16, 21, 0)', 'rgba(14, 16, 21, 0.72)']);
  const backdropFilter = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(12px)']);
  const borderColor = useTransform(scrollY, [0, 50], ['rgba(39, 39, 42, 0)', 'rgba(39, 39, 42, 0.6)']);
  const paddingY = useTransform(scrollY, [0, 50], ['1.5rem', '0.75rem']);

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const mobileMenuVariants: Variants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const mobileItemVariants: Variants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({ x: 0, opacity: 1, transition: { delay: i * 0.05 } }),
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
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
      }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-transparent"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand */}
        <a
          href="#hero"
          className="group flex items-center gap-3 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 font-display text-lg font-black tracking-tighter transition-colors group-hover:border-accent/50">
            <span className="text-zinc-300">V</span>
            <span className="text-accent">N</span>
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-base font-bold leading-none tracking-tight text-zinc-100">
              Vedant Nimbarte
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-accent">
              Portfolio
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href.replace('#', '');
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative rounded-full px-4 py-2 font-display text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-zinc-800/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}

          <div className="mx-4 h-6 w-px bg-zinc-800" />

          <motion.button
            onClick={onOpenHireMe}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-zinc-100 px-5 py-2.5 font-display text-sm font-bold text-zinc-900 transition-colors hover:bg-accent"
          >
            Hire Me
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="absolute left-0 right-0 top-full overflow-hidden border-b border-zinc-800 bg-surface shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              {NAV_ITEMS.map((item, idx) => (
                <motion.a
                  key={item.label}
                  custom={idx}
                  variants={mobileItemVariants}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="rounded-lg px-4 py-3 font-display text-lg font-medium text-zinc-300 transition-colors hover:bg-zinc-800/50 hover:text-accent"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div custom={NAV_ITEMS.length} variants={mobileItemVariants} className="mt-2 border-t border-zinc-800 pt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHireMe();
                  }}
                  className="w-full rounded-lg bg-accent py-3 font-display font-bold text-background transition-colors hover:bg-[#fcd34d]"
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
