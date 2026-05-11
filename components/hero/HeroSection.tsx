'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ParticleHead = dynamic(() => import('./ParticleHead'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});

const TYPED_STRINGS = [
  'Software Architect',
  'Blockchain Developer',
  'Systems Engineer',
  'Team Lead',
];

function TypedText() {
  const [text, setText] = useState('');
  const [stringIdx, setStringIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPED_STRINGS[stringIdx];
    const delay = deleting ? 40 : charIdx === current.length ? 1800 : 60;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setText(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setText(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setStringIdx((i) => (i + 1) % TYPED_STRINGS.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, stringIdx]);

  return (
    <span className="text-[var(--particle-secondary)]">
      {text}
      <span className="animate-[pulse_1s_ease-in-out_infinite] opacity-70">|</span>
    </span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Particle Canvas — full background */}
      <div className="absolute inset-0 z-0">
        <ParticleHead morphTarget="head" />
      </div>

      {/* Radial gradient overlay — fades edges */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 70% 50%, transparent 40%, var(--bg) 100%)',
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(var(--particle-primary) 1px, transparent 1px), linear-gradient(90deg, var(--particle-primary) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-[var(--particle-primary)]" />
            <span className="font-mono text-sm text-[var(--particle-primary)] tracking-widest uppercase">
              Portfolio
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-4"
          >
            <span className="gradient-text glow-text">icypress</span>
          </motion.h1>

          {/* Typed role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-2xl md:text-3xl font-mono mb-8 h-10"
          >
            <TypedText />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-[var(--text-secondary)] text-lg leading-relaxed mb-10 max-w-lg"
          >
            Building systems at the intersection of{' '}
            <span className="text-[var(--text-primary)]">low-level engineering</span> and the{' '}
            <span className="text-[var(--text-primary)]">modern web</span>. From assembly to
            blockchain — I architect things that last.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="group relative px-6 py-3 font-mono text-sm bg-[var(--particle-primary)] text-[var(--bg)] font-bold rounded overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10">View Work</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </a>
            <a
              href="#contact"
              className="px-6 py-3 font-mono text-sm border border-[var(--particle-primary)] text-[var(--particle-primary)] rounded hover:bg-[var(--particle-primary)] hover:text-[var(--bg)] transition-all duration-300"
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex gap-8 mt-16 pt-8 border-t border-[var(--border)]"
          >
            {[
              { value: '18+', label: 'Public Repos' },
              { value: '4+', label: 'Years Coding' },
              { value: '10+', label: 'Tech Stacks' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-[var(--particle-primary)] font-mono">
                  {value}
                </div>
                <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-1">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--particle-primary)] to-transparent animate-[float_2s_ease-in-out_infinite]" />
      </motion.div>
    </section>
  );
}
