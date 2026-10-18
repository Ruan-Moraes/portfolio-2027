'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  FEATURED_PROJECTS,
  FALLBACK_GITHUB_REPOS,
  fetchGitHubReposClient,
  type FeaturedProjectMetadata,
  type GitHubRepositoryItem,
  type ProjectCategoryFilter,
} from '@/entities/project';
import { cn, useElementVisibility } from '@/shared/lib';
import { SectionHeading } from '@/shared/ui';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { GitHubRepoCard } from './GitHubRepoCard';

const PROJECT_CATEGORIES: ProjectCategoryFilter[] = [
  'all',
  'fullstack',
  'backend',
  'frontend',
  'mobile',
  'corporate',
];

const FEATURED_BY_CATEGORY: Record<
  ProjectCategoryFilter,
  FeaturedProjectMetadata[]
> = PROJECT_CATEGORIES.reduce(
  (acc, category) => {
    acc[category] =
      category === 'all'
        ? FEATURED_PROJECTS
        : FEATURED_PROJECTS.filter((project) =>
            project.filterTags.includes(category)
          );
    return acc;
  },
  {} as Record<ProjectCategoryFilter, FeaturedProjectMetadata[]>
);

export function ProjectsShowcase() {
  const t = useTranslations('projects');

  const sectionRef = useRef<HTMLElement | null>(null);

  const isNearViewport = useElementVisibility(sectionRef, {
    rootMargin: '320px',
  });

  const [activeTab, setActiveTab] = useState<'featured' | 'github'>('featured');

  const [categoryFilter, setCategoryFilter] =
    useState<ProjectCategoryFilter>('all');
  const [repos, setRepos] =
    useState<GitHubRepositoryItem[]>(FALLBACK_GITHUB_REPOS);
  const [hasLoadedRemoteRepos, setHasLoadedRemoteRepos] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Lazy-fetch live GitHub repos only when section approaches viewport or user opens GitHub tab
  useEffect(() => {
    if (hasLoadedRemoteRepos || (!isNearViewport && activeTab !== 'github')) {
      return;
    }

    let mounted = true;

    fetchGitHubReposClient().then((data) => {
      if (mounted) {
        setRepos(data);

        setHasLoadedRemoteRepos(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [isNearViewport, activeTab, hasLoadedRemoteRepos]);

  const filteredFeatured = FEATURED_BY_CATEGORY[categoryFilter];

  // Pre-normalize lowercase search strings once per repo dataset load
  const indexedRepos = useMemo(
    () =>
      repos.map((repo) => ({
        repo,
        searchBlob:
          `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''}`.toLowerCase(),
      })),
    [repos]
  );

  const filteredRepos = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

    if (!query) return repos;

    return indexedRepos
      .filter((entry) => entry.searchBlob.includes(query))
      .map((entry) => entry.repo);
  }, [repos, indexedRepos, deferredSearchQuery]);

  const categoryButtons: { id: ProjectCategoryFilter; label: string }[] = [
    { id: 'all', label: t('filters.all') },
    { id: 'fullstack', label: t('filters.fullstack') },
    { id: 'backend', label: t('filters.backend') },
    { id: 'frontend', label: t('filters.frontend') },
    { id: 'mobile', label: t('filters.mobile') },
    { id: 'corporate', label: t('filters.corporate') },
  ];

  const liveDemoLabel = t('githubSection.liveDemo');

  return (
    <section ref={sectionRef} id="projects" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Mode Switcher: Case Studies vs Live GitHub API */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/90 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('featured')}
            className={cn(
              'cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm',
              activeTab === 'featured'
                ? 'bg-[var(--ui-accent)] text-white shadow-sm'
                : 'text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)]'
            )}
          >
            {t('tabs.featured')} ({FEATURED_PROJECTS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={cn(
              'cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm',
              activeTab === 'github'
                ? 'bg-[var(--ui-accent)] text-white shadow-sm'
                : 'text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)]'
            )}
          >
            {t('tabs.github')} ({repos.length})
          </button>
        </div>

        {activeTab === 'featured' && (
          <div className="flex flex-wrap gap-1.5">
            {categoryButtons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setCategoryFilter(btn.id)}
                className={cn(
                  'cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                  categoryFilter === btn.id
                    ? 'border border-[var(--ui-accent)] bg-[var(--ui-accent)]/15 text-[var(--ui-accent)]'
                    : 'border border-[var(--ui-border)] bg-[var(--ui-surface)]/70 text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)]/40'
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Featured Case Studies */}
      {activeTab === 'featured' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredFeatured.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* TAB 2: Live GitHub API Repositories */
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--ui-text-muted)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('githubSection.searchPlaceholder')}
                className="w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] py-2.5 pr-4 pl-10 text-sm text-[var(--ui-text-primary)] placeholder:text-[var(--ui-text-muted)] focus:border-[var(--ui-accent)] focus:outline-none"
              />
            </div>

            <p className="font-mono text-xs text-[var(--ui-text-muted)]">
              {t('githubSection.totalRepos', { count: filteredRepos.length })}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => (
              <GitHubRepoCard
                key={repo.id}
                repo={repo}
                liveDemoLabel={liveDemoLabel}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
