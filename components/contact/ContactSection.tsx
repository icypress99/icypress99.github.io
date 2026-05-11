'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const socials = [
  {
    label: 'GitHub',
    handle: '@icypress99',
    href: 'https://github.com/icypress99',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'Email',
    handle: 'icypress999@gmail.com',
    href: 'mailto:icypress999@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-150px' });

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[var(--particle-primary)] to-transparent opacity-30" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[var(--particle-primary)] tracking-widest uppercase">
              04. Contact
            </span>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Let&apos;s{' '}
            <span className="gradient-text">Connect</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — message */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">
              Whether you have a project in mind, want to collaborate, or just want to talk
              about low-level systems and blockchain — my inbox is open.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-10">
              I&apos;m currently open to{' '}
              <span className="text-[var(--particle-primary)]">senior engineering roles</span>,{' '}
              <span className="text-[var(--particle-primary)]">consulting</span>, and interesting
              open source collaborations.
            </p>

            {/* Status indicator */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] w-fit">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--particle-primary)]" />
                <div className="absolute inset-0 rounded-full bg-[var(--particle-primary)] animate-ping opacity-40" />
              </div>
              <span className="font-mono text-sm text-[var(--text-secondary)]">
                Available for opportunities
              </span>
            </div>
          </motion.div>

          {/* Right — links */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="group flex items-center gap-4 p-5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--particle-primary)] transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at left, rgba(77,255,180,0.05) 0%, transparent 70%)' }} />

                <div className="text-[var(--text-muted)] group-hover:text-[var(--particle-primary)] transition-colors duration-300">
                  {s.icon}
                </div>
                <div>
                  <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-1">
                    {s.label}
                  </div>
                  <div className="text-[var(--text-primary)] font-medium group-hover:text-[var(--particle-primary)] transition-colors duration-300">
                    {s.handle}
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-[var(--text-muted)] ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                </svg>
              </motion.a>
            ))}

            {/* Big CTA */}
            <motion.a
              href="mailto:icypress999@gmail.com"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="group flex items-center justify-center gap-2 w-full py-4 mt-6 font-mono text-sm font-bold bg-[var(--particle-primary)] text-[var(--bg)] rounded-lg hover:bg-white transition-all duration-300 relative overflow-hidden"
            >
              Say Hello →
            </motion.a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-24 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <span className="font-mono text-xs text-[var(--text-muted)]">
            Designed & Built by{' '}
            <span className="text-[var(--particle-primary)]">icypress</span> — 2026
          </span>
          <span className="font-mono text-xs text-[var(--text-muted)]">
            Next.js · Three.js · GSAP · Framer Motion
          </span>
        </motion.div>
      </div>
    </section>
  );
}
