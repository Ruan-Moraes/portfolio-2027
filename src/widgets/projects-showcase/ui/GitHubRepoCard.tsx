'use client';

import { memo } from 'react';
import { ExternalLink, GitFork, Star } from 'lucide-react';
import type { GitHubRepositoryItem } from '@/entities/project';
import { Badge, GlassCard } from '@/shared/ui';

interface GitHubRepoCardProps {
  repo: GitHubRepositoryItem;
  liveDemoLabel: string;
}

function GitHubRepoCardComponent({ repo, liveDemoLabel }: GitHubRepoCardProps) {
  return (
    <GlassCard interactive className="flex flex-col justify-between p-5">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-mono text-base font-bold text-[var(--ui-text-primary)]">
            {repo.name}
          </h3>
          {repo.language && <Badge variant="accent">{repo.language}</Badge>}
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
              {liveDemoLabel}
            </a>
          )}
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--ui-accent)]/15 px-2.5 py-1 text-xs font-bold text-[var(--ui-accent)] transition-colors hover:bg-[var(--ui-accent)] hover:text-white"
          >
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </GlassCard>
  );
}

export const GitHubRepoCard = memo(GitHubRepoCardComponent);
