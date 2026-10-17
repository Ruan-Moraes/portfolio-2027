'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  GitFork,
  GitBranch,
  Lock,
  Search,
  Star,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  FEATURED_PROJECTS,
  FALLBACK_GITHUB_REPOS,
  fetchGitHubReposClient,
  type GitHubRepositoryItem,
  type ProjectCategoryFilter,
} from '@/entities/project';
import { cn } from '@/shared/lib';
import { Badge, GlassCard, SectionHeading } from '@/shared/ui';

export function ProjectsShowcase() {
  const t = useTranslations('projects');
  const tCommon = useTranslations('common');

  const [activeTab, setActiveTab] = useState<'featured' | 'github'>('featured');
  const [categoryFilter, setCategoryFilter] =
    useState<ProjectCategoryFilter>('all');
  const [repos, setRepos] =
    useState<GitHubRepositoryItem[]>(FALLBACK_GITHUB_REPOS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchGitHubReposClient().then((data) => {
      if (mounted) {
        setRepos(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredFeatured = useMemo(() => {
    if (categoryFilter === 'all') return FEATURED_PROJECTS;
    return FEATURED_PROJECTS.filter((project) =>
      project.filterTags.includes(categoryFilter)
    );
  }, [categoryFilter]);

  const filteredRepos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return repos;
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        (repo.description && repo.description.toLowerCase().includes(query)) ||
        (repo.language && repo.language.toLowerCase().includes(query))
    );
  }, [repos, searchQuery]);

  const categoryButtons: { id: ProjectCategoryFilter; label: string }[] = [
    { id: 'all', label: t('filters.all') },
    { id: 'fullstack', label: t('filters.fullstack') },
    { id: 'backend', label: t('filters.backend') },
    { id: 'frontend', label: t('filters.frontend') },
    { id: 'mobile', label: t('filters.mobile') },
    { id: 'corporate', label: t('filters.corporate') },
  ];

  return (
    <section id="projects" className="scroll-mt-20 py-20">
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
                ? 'bg-[var(--ui-accent)] text-slate-950 shadow-sm'
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
                ? 'bg-[var(--ui-accent)] text-slate-950 shadow-sm'
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
          {filteredFeatured.map((project) => {
            const features = t.raw(
              `items.${project.id}.features`
            ) as string[];

            return (
              <GlassCard
                key={project.id}
                interactive
                className="flex flex-col justify-between overflow-hidden p-6 sm:p-8"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="accent">
                        {t(`items.${project.id}.category`)}
                      </Badge>
                      <span className="font-mono text-xs text-[var(--ui-text-muted)]">
                        {t(`items.${project.id}.year`)}
                      </span>
                    </div>

                    <Badge variant="default">
                      {t(`items.${project.id}.status`)}
                    </Badge>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-[var(--ui-text-primary)]">
                    {t(`items.${project.id}.title`)}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-[var(--ui-accent)] sm:text-sm">
                    {t(`items.${project.id}.subtitle`)} •{' '}
                    <span className="text-[var(--ui-text-muted)]">
                      {t(`items.${project.id}.company`)}
                    </span>
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-[var(--ui-text-secondary)]">
                    {t(`items.${project.id}.description`)}
                  </p>

                  <div className="mt-4 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 p-3">
                    <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--ui-accent)] uppercase">
                      {t('architectureLabel')}{' '}
                    </span>
                    <span className="font-mono text-xs text-[var(--ui-text-primary)]">
                      {t(`items.${project.id}.architecture`)}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h4 className="mb-2.5 font-mono text-xs font-bold tracking-wider text-[var(--ui-text-primary)] uppercase">
                      {t('keyFeatures')}
                    </h4>
                    <ul className="space-y-2">
                      {Array.isArray(features) &&
                        features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ui-text-secondary)] sm:text-sm"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 space-y-4 border-t border-[var(--ui-border)] pt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="default">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--ui-accent)]/50 bg-[var(--ui-accent)]/12 px-4 py-2 text-xs font-bold text-[var(--ui-accent)] transition-all hover:bg-[var(--ui-accent)] hover:text-slate-950"
                      >
                        <GitBranch className="h-3.5 w-3.5" />
                        <span>{tCommon('viewCode')}</span>
                      </a>
                    )}

                    {project.secondaryGithubUrl && (
                      <a
                        href={project.secondaryGithubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] px-4 py-2 text-xs font-semibold text-[var(--ui-text-primary)] transition-all hover:border-[var(--ui-accent)]/50"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
                        <span>UI Repo</span>
                      </a>
                    )}

                    {project.isPrivate && (
                      <span className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300">
                        <Lock className="h-3.5 w-3.5" />
                        <span>{tCommon('privateProject')}</span>
                      </span>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
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
              <GlassCard
                key={repo.id}
                interactive
                className="flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-base font-bold text-[var(--ui-text-primary)]">
                      {repo.name}
                    </h3>
                    {repo.language && (
                      <Badge variant="accent">{repo.language}</Badge>
                    )}
                  </div>

                  <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-[var(--ui-text-secondary)] sm:text-sm">
                    {repo.description || '—'}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[var(--ui-border)] pt-4">
                  <div className="flex items-center gap-3 font-mono text-xs text-[var(--ui-text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
                      {repo.stargazersCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {repo.forksCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[var(--ui-border)] px-2.5 py-1 text-xs font-medium text-[var(--ui-text-secondary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
                      >
                        {t('githubSection.liveDemo')}
                      </a>
                    )}
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--ui-accent)]/15 px-2.5 py-1 text-xs font-bold text-[var(--ui-accent)] transition-colors hover:bg-[var(--ui-accent)] hover:text-slate-950"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
