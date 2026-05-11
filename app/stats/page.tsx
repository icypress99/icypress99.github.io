import type { Metadata } from "next";
import RepoAnalyzer from "@/components/stats/RepoAnalyzer";

export const metadata: Metadata = {
  title: "Repo Analyzer — icypress",
  description: "GitHub repository statistics analyzer — releases, downloads, contributors, languages.",
};

export default function StatsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <RepoAnalyzer />
    </main>
  );
}
