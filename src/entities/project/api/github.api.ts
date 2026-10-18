import {
  FALLBACK_GITHUB_REPOS,
  type GitHubRepositoryItem,
} from '../model/project.data';

let cachedRepos: GitHubRepositoryItem[] | null = null;
let inflightRequest: Promise<GitHubRepositoryItem[]> | null = null;

export async function fetchGitHubReposClient(): Promise<GitHubRepositoryItem[]> {
  if (cachedRepos) {
    return cachedRepos;
  }

  if (inflightRequest) {
    return inflightRequest;
  }

  inflightRequest = (async () => {
    try {
      const response = await fetch('/api/github', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        return FALLBACK_GITHUB_REPOS;
      }

      const data = (await response.json()) as GitHubRepositoryItem[];

      if (Array.isArray(data) && data.length > 0) {
        cachedRepos = data;

        return data;
      }

      return FALLBACK_GITHUB_REPOS;
    } catch {
      return FALLBACK_GITHUB_REPOS;
    } finally {
      inflightRequest = null;
    }
  })();

  return inflightRequest;
}
