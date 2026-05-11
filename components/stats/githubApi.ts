import type { RepoInfo, Release, Contributor, CommitWeek } from "./types";

const BASE = "https://api.github.com";

function parseRepo(input: string): { owner: string; repo: string } | null {
  const clean = input.trim().replace(/\/$/, "");
  const urlMatch = clean.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };
  const shortMatch = clean.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };
  return null;
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchRepoStats(input: string) {
  const parsed = parseRepo(input);
  if (!parsed) throw new Error("Invalid repo — use 'owner/repo' or a GitHub URL");

  const { owner, repo } = parsed;
  const base = `/${owner}/${repo}`;

  const [info, releases, contributors, languages, commitActivity] = await Promise.allSettled([
    ghFetch<RepoInfo>(`/repos${base}`),
    ghFetch<Release[]>(`/repos${base}/releases?per_page=100`),
    ghFetch<Contributor[]>(`/repos${base}/contributors?per_page=20`),
    ghFetch<Record<string, number>>(`/repos${base}/languages`),
    ghFetch<CommitWeek[]>(`/repos${base}/stats/commit_activity`),
  ]);

  if (info.status === "rejected") throw new Error(info.reason?.message || "Repo not found");

  return {
    info: info.value,
    releases: releases.status === "fulfilled" ? releases.value : [],
    contributors: contributors.status === "fulfilled" ? contributors.value : [],
    languages: languages.status === "fulfilled" ? languages.value : {},
    commitActivity: commitActivity.status === "fulfilled" ? commitActivity.value : [],
  };
}

export { parseRepo };
