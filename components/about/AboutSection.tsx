'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const timeline = [
  {
    year: '2022',
    title: 'Started Open Source Journey',
    desc: 'First GitHub commit. Began exploring Assembly, C++ systems programming, and low-level hardware interfaces.',
  },
  {
    year: '2023',
    title: 'Qt / QML Specialization',
    desc: 'Deep dive into Qt ecosystem — built custom QML components, Sankey diagrams, and cross-platform desktop apps.',
  },
  {
    year: '2024',
    title: 'Blockchain & Web',
    desc: 'Explored Ethereum, smart contracts, and contributed to Status Desktop (Nim + QML). Expanded into web with Angular & Node.js.',
  },
  {
    year: '2025',
    title: 'Rust & Systems Architecture',
    desc: 'Started learning Rust for memory-safe systems. Built HTTP servers, worked on 3D CAD tooling with OpenCascade.',
  },
  {
    year: '2026',
    title: 'Team Lead & Architect',
    desc: 'Leading engineering teams, designing scalable architectures, and bridging low-level expertise with modern web stacks.',
  },
];

function TimelineItem({
  year,
  title,
  desc,
  index,
}: {
  year: string;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-[var(--particle-primary)] to-transparent" />
      {/* Dot */}
      <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-[var(--particle-primary)] shadow-[0_0_10px_var(--particle-primary)]" />

      <div className="font-mono text-xs text-[var(--particle-primary)] mb-1 tracking-widest">{year}</div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-150px' });

  return (
    <section id="about" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, var(--particle-secondary) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[var(--particle-primary)] tracking-widest uppercase">
              01. About
            </span>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Who I{' '}
            <span className="gradient-text">Am</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — bio */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-5 text-[var(--text-secondary)] leading-relaxed">
              <p>
                I&apos;m a developer who genuinely enjoys the full spectrum — from writing{' '}
                <span className="text-[var(--particle-primary)]">x86 Assembly</span> to architecting
                distributed blockchain systems. That breadth isn&apos;t random; it comes from a deep
                curiosity about how things work at every layer of the stack.
              </p>
              <p>
                My core strength is{' '}
                <span className="text-[var(--text-primary)]">Qt/QML and C++</span> — building
                performant, cross-platform desktop applications with pixel-perfect UI. I&apos;ve
                contributed to projects like{' '}
                <span className="text-[var(--particle-secondary)]">Status Desktop</span> and built
                custom 3D CAD tooling using OpenCascade.
              </p>
              <p>
                Recently, I&apos;ve been expanding into{' '}
                <span className="text-[var(--text-primary)]">Rust</span> for systems work and
                deepening my understanding of{' '}
                <span className="text-[var(--particle-primary)]">blockchain infrastructure</span> and
                decentralized protocols.
              </p>
            </div>

            {/* Interests */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {[
                'Systems Programming',
                'Blockchain / Web3',
                'Qt & QML',
                'Rust',
                '3D / CAD Tooling',
                'Software Architecture',
              ].map((interest) => (
                <div
                  key={interest}
                  className="flex items-center gap-2 text-sm font-mono text-[var(--text-secondary)]"
                >
                  <span className="text-[var(--particle-primary)] text-xs">▸</span>
                  {interest}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — timeline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="font-mono text-sm text-[var(--text-muted)] uppercase tracking-widest mb-8">
              Journey
            </h3>
            {timeline.map((item, i) => (
              <TimelineItem key={item.year} {...item} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
