export {
  FEATURED_PROJECTS,
  FALLBACK_GITHUB_REPOS,
} from './model/project.data';

export { fetchGitHubReposClient } from './api/github.api';

export type {
  ProjectCategoryFilter,
  FeaturedProjectId,
  FeaturedProjectMetadata,
  GitHubRepositoryItem,
} from './model/project.data';
