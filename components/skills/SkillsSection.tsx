'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const skillGroups = [
  {
    category: 'Systems & Native',
    color: 'var(--particle-primary)',
    skills: [
      { name: 'C++', level: 92 },
      { name: 'Qt / QML', level: 90 },
      { name: 'C', level: 78 },
      { name: 'Rust', level: 55 },
      { name: 'Assembly x86', level: 60 },
    ],
  },
  {
    category: 'Web & Scripting',
    color: 'var(--particle-secondary)',
    skills: [
      { name: 'TypeScript', level: 72 },
      { name: 'Angular', level: 65 },
      { name: 'Node.js', level: 68 },
      { name: 'Python', level: 75 },
    ],
  },
  {
    category: 'Blockchain & Infrastructure',
    color: 'var(--accent)',
    skills: [
      { name: 'Ethereum / EVM', level: 70 },
      { name: 'Smart Contracts', level: 62 },
      { name: 'P2P Networking', level: 68 },
      { name: 'Docker', level: 60 },
    ],
  },
];

const tools = [
  'Git', 'CMake', 'Qt Creator', 'VS Code', 'OpenCascade',
  'GDB', 'Valgrind', 'Linux', 'Nim', 'ZeroConf/mDNS',
];

function SkillBar({
  name,
  level,
  color,
  index,
  inView,
}: {
  name: string;
  level: number;
  color: string;
  index: number;
  inView: boolean;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-sm text-[var(--text-secondary)]">{name}</span>
        <span className="font-mono text-xs text-[var(--text-muted)]">{level}%</span>
      </div>
      <div className="h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-150px' });

  return (
    <section id="skills" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-3"
        style={{ background: 'radial-gradient(circle, var(--particle-secondary) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[var(--particle-primary)] tracking-widest uppercase">
              03. Skills
            </span>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Tech{' '}
            <span className="gradient-text">Stack</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: gi * 0.15 }}
              className="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]"
            >
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: group.color, boxShadow: `0 0 8px ${group.color}` }}
                />
                <h3
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: group.color }}
                >
                  {group.category}
                </h3>
              </div>
              {group.skills.map((skill, si) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={group.color}
                  index={si}
                  inView={inView}
                />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h3 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-6 text-center">
            Tools & Environment
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
                className="font-mono text-sm px-3 py-2 rounded border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--particle-primary)] hover:text-[var(--particle-primary)] transition-all duration-300 cursor-default"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
