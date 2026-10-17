import {
  FALLBACK_GITHUB_REPOS,
  type GitHubRepositoryItem,
} from '../model/project.data';

export async function fetchGitHubReposClient(): Promise<GitHubRepositoryItem[]> {
  try {
    const response = await fetch('/api/github', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return FALLBACK_GITHUB_REPOS;
    }

    const data = (await response.json()) as GitHubRepositoryItem[];
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_GITHUB_REPOS;
  } catch {
    return FALLBACK_GITHUB_REPOS;
  }
}
