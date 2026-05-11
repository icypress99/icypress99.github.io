export interface RepoInfo {
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  subscribers_count: number;
  size: number;
  language: string | null;
  license: { name: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  topics: string[];
  visibility: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface ReleaseAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  content_type: string;
}

export interface Release {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  body: string | null;
  html_url: string;
  assets: ReleaseAsset[];
  tarball_url: string;
  zipball_url: string;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface CommitWeek {
  week: number;
  total: number;
  days: number[];
}
