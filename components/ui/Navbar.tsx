'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-[rgba(5,5,16,0.85)] border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-mono text-[var(--particle-primary)] text-lg font-bold tracking-tight hover:text-white transition-colors"
        >
          icy<span className="text-[var(--particle-secondary)]">press</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={`font-mono text-sm transition-all duration-300 relative group ${
                  active === href
                    ? 'text-[var(--particle-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-[var(--particle-primary)] opacity-50 mr-1 text-xs">
                  {String(links.findIndex((l) => l.href === href) + 1).padStart(2, '0')}.
                </span>
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[var(--particle-primary)] transition-all duration-300 ${
                    active === href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://github.com/icypress99"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 text-sm font-mono px-4 py-2 border border-[var(--particle-primary)] text-[var(--particle-primary)] rounded hover:bg-[var(--particle-primary)] hover:text-[var(--bg)] transition-all duration-300"
        >
          GitHub
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-px bg-[var(--particle-primary)] transition-all duration-300 ${
                i === 1 ? 'w-5' : 'w-7'
              }`}
            />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl bg-[rgba(5,5,16,0.95)] border-b border-[var(--border)] px-6 pb-6"
          >
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-mono text-[var(--text-secondary)] hover:text-[var(--particle-primary)] transition-colors border-b border-[var(--border)]"
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
