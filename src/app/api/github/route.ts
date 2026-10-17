import { NextResponse } from 'next/server';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import {
  FALLBACK_GITHUB_REPOS,
  type GitHubRepositoryItem,
} from '@/entities/project';

interface RawGitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  fork: boolean;
}

export const revalidate = 1800; // ISR cache for 30 minutes

export async function GET() {
  const username =
    process.env.GITHUB_USERNAME || DEVELOPER_PROFILE.githubUsername;
  const token = process.env.GITHUB_TOKEN;

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-2027-nextjs',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 1800 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(FALLBACK_GITHUB_REPOS);
    }

    const rawRepos = (await response.json()) as RawGitHubRepo[];
    if (!Array.isArray(rawRepos) || rawRepos.length === 0) {
      return NextResponse.json(FALLBACK_GITHUB_REPOS);
    }

    const mapped: GitHubRepositoryItem[] = rawRepos
      .filter((repo) => !repo.fork && repo.name !== username)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        topics: repo.topics ?? [],
        updatedAt: repo.updated_at,
      }));

    return NextResponse.json(
      mapped.length > 0 ? mapped : FALLBACK_GITHUB_REPOS
    );
  } catch {
    return NextResponse.json(FALLBACK_GITHUB_REPOS);
  }
}
