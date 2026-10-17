import { describe, expect, it } from 'vitest';
import { FEATURED_PROJECTS, FALLBACK_GITHUB_REPOS } from './project.data';

describe('project entity', () => {
  it('includes architectural case studies and featured projects', () => {
    expect(FEATURED_PROJECTS.length).toBeGreaterThanOrEqual(6);
    expect(FEATURED_PROJECTS.some((p) => p.id === 'mangaReader')).toBe(true);
    expect(FEATURED_PROJECTS.some((p) => p.id === 'dbmind')).toBe(true);
    expect(FEATURED_PROJECTS.some((p) => p.id === 'debugInsight')).toBe(true);
    expect(FEATURED_PROJECTS.some((p) => p.id === 'capysCrm')).toBe(true);
    expect(FALLBACK_GITHUB_REPOS.length).toBeGreaterThanOrEqual(6);
  });
});
