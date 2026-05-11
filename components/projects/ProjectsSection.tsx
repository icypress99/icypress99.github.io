'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const projects = [
  {
    title: 'Status Desktop',
    description:
      'Contributed to the Status Desktop client — a decentralized messaging app built in Nim & QML. Full Ethereum integration with peer-to-peer networking.',
    tags: ['QML', 'Nim', 'Ethereum', 'P2P'],
    link: 'https://github.com/icypress99/status-desktop',
    year: '2025',
    featured: true,
    index: '01',
  },
  {
    title: 'Mayo — 3D CAD Viewer',
    description:
      'Cross-platform 3D CAD viewer and converter built on Qt + OpenCascade Technology. Supports STEP, IGES, OBJ, STL formats.',
    tags: ['C++', 'Qt', 'OpenCascade', '3D'],
    link: 'https://github.com/icypress99/mayo',
    year: '2026',
    featured: true,
    index: '02',
  },
  {
    title: 'QML Sankey Diagram',
    description:
      'Custom QML component for rendering interactive Sankey (flow) diagrams. Zero external dependencies, fully declarative API.',
    tags: ['QML', 'Qt', 'Data Viz'],
    link: 'https://github.com/icypress99/-QML-Sankey-Diagram',
    year: '2024',
    featured: false,
    index: '03',
  },
  {
    title: 'HTTP Server in C',
    description:
      'Bare-metal HTTP/1.1 server written in C from scratch — sockets, request parsing, response handling. No stdlib HTTP layers.',
    tags: ['C', 'Networking', 'Sockets'],
    link: 'https://github.com/icypress99/simple-HTTP-server',
    year: '2024',
    featured: false,
    index: '04',
  },
  {
    title: 'QtZeroConf',
    description:
      'Qt wrapper for ZeroConf/mDNS service discovery libraries. Cross-platform Bonjour/Avahi integration for Qt applications.',
    tags: ['C++', 'Qt', 'Networking'],
    link: 'https://github.com/icypress99/QtZeroConf',
    year: '2026',
    featured: false,
    index: '05',
  },
  {
    title: 'Flow Nodes',
    description:
      'Node-based visual programming editor. Connect functional nodes to build data pipelines and logic graphs visually.',
    tags: ['Node Editor', 'Visual Programming'],
    link: 'https://github.com/icypress99/flow-nodes',
    year: '2026',
    featured: false,
    index: '06',
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--particle-primary)] transition-all duration-500 cursor-pointer overflow-hidden ${
        project.featured ? 'md:col-span-2' : ''
      }`}
      onClick={() => window.open(project.link, '_blank')}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(77,255,180,0.06) 0%, transparent 60%)' }} />

      {/* Scan line on hover */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--particle-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 top-0" />

      <div className="flex justify-between items-start mb-4">
        <span className="font-mono text-xs text-[var(--particle-primary)] opacity-50">
          {project.index}
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[var(--text-muted)]">{project.year}</span>
          <svg
            className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--particle-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--particle-primary)] transition-colors duration-300">
        {project.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--text-muted)] group-hover:border-[rgba(77,255,180,0.2)] group-hover:text-[var(--particle-primary)] transition-all duration-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-150px' });

  return (
    <section id="projects" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, var(--particle-primary) 0%, transparent 70%)' }}
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
              02. Projects
            </span>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Things I&apos;ve{' '}
            <span className="gradient-text">Built</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/icypress99"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--particle-primary)] transition-colors duration-300 group"
          >
            View all repositories on GitHub
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
