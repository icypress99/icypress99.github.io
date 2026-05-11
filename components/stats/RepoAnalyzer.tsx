'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRepoStats } from './githubApi';
import type { RepoInfo, Release, Contributor, CommitWeek } from './types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return n.toString();
}

function fmtBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  'C++': '#f34b7d', C: '#555555', Rust: '#dea584', Go: '#00ADD8',
  Java: '#b07219', Kotlin: '#A97BFF', Swift: '#F05138',
  Ruby: '#701516', PHP: '#4F5D95', CSS: '#563d7c', HTML: '#e34c26',
  Shell: '#89e051', Nim: '#ffc200', QML: '#44a51c', Assembly: '#6E4C13',
  Dart: '#00B4AB', Scala: '#c22d40', Elixir: '#6e4a7e',
};

function langColor(name: string): string {
  return LANG_COLORS[name] ?? '#8888aa';
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col gap-1">
      <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-bold" style={{ color: color ?? 'var(--particle-primary)' }}>{value}</span>
      {sub && <span className="text-xs text-[var(--text-muted)]">{sub}</span>}
    </div>
  );
}

function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (total === 0) return null;
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h3 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Languages</h3>
      {/* Bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-px">
        {sorted.map(([lang, bytes]) => (
          <motion.div
            key={lang}
            initial={{ width: 0 }}
            animate={{ width: `${(bytes / total) * 100}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: langColor(lang), minWidth: bytes / total > 0.005 ? 2 : 0 }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {sorted.map(([lang, bytes]) => {
          const pct = ((bytes / total) * 100).toFixed(1);
          return (
            <div key={lang} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: langColor(lang) }} />
              <span className="text-xs text-[var(--text-secondary)]">{lang}</span>
              <span className="text-xs text-[var(--text-muted)]">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommitChart({ data }: { data: CommitWeek[] }) {
  if (!data.length) return null;
  const last52 = data.slice(-52);
  const max = Math.max(...last52.map((w) => w.total), 1);

  return (
    <div>
      <h3 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">
        Commit Activity — last 52 weeks
      </h3>
      <div className="flex items-end gap-0.5 h-16">
        {last52.map((week, i) => (
          <motion.div
            key={week.week}
            className="flex-1 rounded-sm"
            style={{ background: week.total > 0 ? 'var(--particle-primary)' : 'rgba(255,255,255,0.05)' }}
            initial={{ height: 0 }}
            animate={{ height: `${(week.total / max) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.005 }}
            title={`${week.total} commits`}
          />
        ))}
      </div>
    </div>
  );
}

function ReleaseRow({ release }: { release: Release }) {
  const [open, setOpen] = useState(false);
  const totalDownloads = release.assets.reduce((s, a) => s + a.download_count, 0);
  const sourceDownloads = 0; // tarball/zipball don't expose counts

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[rgba(77,255,180,0.03)] transition-colors"
      >
        {/* Tag */}
        <span className="font-mono text-sm text-[var(--particle-primary)] shrink-0">{release.tag_name}</span>
        {release.prerelease && (
          <span className="text-xs px-1.5 py-0.5 rounded border border-[var(--accent)] text-[var(--accent)] font-mono shrink-0">pre</span>
        )}
        <span className="text-sm text-[var(--text-secondary)] truncate flex-1">
          {release.name || release.tag_name}
        </span>
        <span className="text-xs text-[var(--text-muted)] shrink-0">{fmtDate(release.published_at)}</span>
        {/* Downloads badge */}
        <div className="flex items-center gap-1 shrink-0">
          <svg className="w-3.5 h-3.5 text-[var(--particle-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="font-mono text-sm font-bold text-[var(--particle-secondary)]">{fmtNum(totalDownloads)}</span>
        </div>
        {/* Chevron */}
        <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--border)]"
          >
            <div className="p-4 space-y-2">
              {release.assets.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] italic">No binary assets — source only</p>
              ) : (
                release.assets.map((asset) => {
                  const pct = totalDownloads > 0 ? (asset.download_count / totalDownloads) * 100 : 0;
                  return (
                    <div key={asset.name} className="group">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <a
                          href={asset.browser_download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--particle-primary)] transition-colors truncate flex-1"
                        >
                          {asset.name}
                        </a>
                        <span className="font-mono text-xs text-[var(--text-muted)] shrink-0">{fmtBytes(asset.size)}</span>
                        <span className="font-mono text-xs font-bold text-[var(--particle-secondary)] shrink-0 w-16 text-right">
                          {fmtNum(asset.download_count)} ↓
                        </span>
                      </div>
                      <div className="h-0.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[var(--particle-secondary)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface RepoData {
  info: RepoInfo;
  releases: Release[];
  contributors: Contributor[];
  languages: Record<string, number>;
  commitActivity: CommitWeek[];
}

export default function RepoAnalyzer() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepoData | null>(null);

  const analyze = useCallback(async (value?: string) => {
    const query = (value ?? input).trim();
    if (!query) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchRepoStats(query);
      setData(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const totalDownloads = data?.releases.reduce(
    (sum, r) => sum + r.assets.reduce((s, a) => s + a.download_count, 0), 0
  ) ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <a href="/" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--particle-primary)] transition-colors">
            ← back
          </a>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="font-mono text-xs text-[var(--particle-primary)] tracking-widest uppercase">Repo Analyzer</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">
          GitHub <span className="gradient-text">Stats</span>
        </h1>
        <p className="text-[var(--text-secondary)]">Full repository statistics — releases, downloads, contributors, activity.</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-10">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--text-muted)]">gh/</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyze()}
              placeholder="owner/repo or GitHub URL"
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--particle-primary)] transition-colors"
            />
          </div>
          <button
            onClick={() => analyze()}
            disabled={loading}
            className="px-6 py-3 bg-[var(--particle-primary)] text-[var(--bg)] font-mono text-sm font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border border-[var(--bg)] border-t-transparent rounded-full animate-spin" />
                Loading
              </span>
            ) : 'Analyze'}
          </button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-[var(--text-muted)] font-mono">Try:</span>
          {['icypress99/status-desktop', 'vercel/next.js', 'microsoft/vscode'].map((ex) => (
            <button
              key={ex}
              onClick={() => { setInput(ex); analyze(ex); }}
              className="text-xs font-mono text-[var(--particle-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-lg border border-[var(--accent)] bg-[rgba(255,107,107,0.08)] text-[var(--accent)] font-mono text-sm">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">

            {/* Repo header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="flex items-start gap-4">
                <img src={data.info.owner.avatar_url} alt={data.info.owner.login}
                  className="w-14 h-14 rounded-full border border-[var(--border)]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={data.info.html_url} target="_blank" rel="noopener noreferrer"
                      className="text-xl font-bold text-[var(--text-primary)] hover:text-[var(--particle-primary)] transition-colors">
                      {data.info.full_name}
                    </a>
                    <span className="text-xs font-mono px-2 py-0.5 border border-[var(--border)] rounded text-[var(--text-muted)]">
                      {data.info.visibility}
                    </span>
                    {data.info.language && (
                      <span className="text-xs font-mono flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: langColor(data.info.language) }} />
                        <span className="text-[var(--text-muted)]">{data.info.language}</span>
                      </span>
                    )}
                  </div>
                  {data.info.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{data.info.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[var(--text-muted)] font-mono">
                    {data.info.license && <span>📄 {data.info.license.name}</span>}
                    <span>Created {fmtDate(data.info.created_at)}</span>
                    <span>Updated {timeAgo(data.info.updated_at)}</span>
                    <span>Pushed {timeAgo(data.info.pushed_at)}</span>
                  </div>
                  {data.info.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {data.info.topics.map((t) => (
                        <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-full border border-[rgba(77,255,180,0.2)] text-[var(--particle-primary)] bg-[rgba(77,255,180,0.05)]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Key stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Stars" value={fmtNum(data.info.stargazers_count)} color="var(--particle-primary)" />
              <StatCard label="Forks" value={fmtNum(data.info.forks_count)} color="var(--particle-secondary)" />
              <StatCard label="Watchers" value={fmtNum(data.info.subscribers_count)} color="var(--accent)" />
              <StatCard label="Open Issues" value={fmtNum(data.info.open_issues_count)} color="#facc15" />
              <StatCard label="Total Downloads" value={fmtNum(totalDownloads)} sub={`${data.releases.length} releases`} color="var(--particle-primary)" />
              <StatCard label="Repo Size" value={fmtBytes(data.info.size * 1024)} />
              <StatCard label="Contributors" value={fmtNum(data.contributors.length)} sub="top 20 shown" color="var(--particle-secondary)" />
              <StatCard label="Default Branch" value={data.info.default_branch} color="var(--text-secondary)" />
            </motion.div>

            {/* Languages + commit activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                <LanguageBar languages={data.languages} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                <CommitChart data={data.commitActivity} />
              </motion.div>
            </div>

            {/* Contributors */}
            {data.contributors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                <h3 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4">Top Contributors</h3>
                <div className="flex flex-wrap gap-3">
                  {data.contributors.map((c, i) => (
                    <a key={c.login} href={c.html_url} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-2 p-2 rounded-lg hover:bg-[rgba(77,255,180,0.05)] transition-colors">
                      <div className="relative">
                        <img src={c.avatar_url} alt={c.login} className="w-8 h-8 rounded-full border border-[var(--border)]" />
                        {i === 0 && (
                          <span className="absolute -top-1 -right-1 text-xs">👑</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-[var(--text-secondary)] group-hover:text-[var(--particle-primary)] transition-colors">
                          {c.login}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">{fmtNum(c.contributions)} commits</div>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Releases */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
                  Releases ({data.releases.length})
                </h3>
                {totalDownloads > 0 && (
                  <span className="font-mono text-sm text-[var(--particle-secondary)]">
                    {fmtNum(totalDownloads)} total downloads
                  </span>
                )}
              </div>
              {data.releases.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] p-4 border border-[var(--border)] rounded-lg">No releases yet.</p>
              ) : (
                <div className="space-y-2">
                  {data.releases.map((r) => <ReleaseRow key={r.id} release={r} />)}
                </div>
              )}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
