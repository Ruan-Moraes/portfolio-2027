'use client';

import { memo } from 'react';
import { CheckCircle2, ExternalLink, GitBranch, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { FeaturedProjectMetadata } from '@/entities/project';
import { Badge, GlassCard } from '@/shared/ui';

interface FeaturedProjectCardProps {
  project: FeaturedProjectMetadata;
}

function FeaturedProjectCardComponent({ project }: FeaturedProjectCardProps) {
  const t = useTranslations('projects');

  const tCommon = useTranslations('common');

  const features = t.raw(`items.${project.id}.features`) as string[];

  return (
    <GlassCard
      interactive
      className="flex flex-col justify-between overflow-hidden p-6 sm:p-8"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{t(`items.${project.id}.category`)}</Badge>
            <span className="font-mono text-xs text-[var(--ui-text-muted)]">
              {t(`items.${project.id}.year`)}
            </span>
          </div>

          <Badge variant="default">{t(`items.${project.id}.status`)}</Badge>
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
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--ui-accent)]/50 bg-[var(--ui-accent)]/12 px-4 py-2 text-xs font-bold text-[var(--ui-accent)] transition-all hover:bg-[var(--ui-accent)] hover:text-white"
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
}

export const FeaturedProjectCard = memo(FeaturedProjectCardComponent);
