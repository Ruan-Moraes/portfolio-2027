'use client';

import { useState } from 'react';
import { Briefcase, CheckCircle2, GraduationCap, Rocket } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  CAREER_ENTRIES,
  type CareerEntryType,
} from '@/entities/career-entry';
import { cn } from '@/shared/lib';
import { Badge, GlassCard, SectionHeading } from '@/shared/ui';

const TYPE_ICONS: Record<CareerEntryType, typeof Briefcase> = {
  work: Briefcase,
  education: GraduationCap,
  milestone: Rocket,
};

export function CareerTimeline() {
  const t = useTranslations('career');
  const [filter, setFilter] = useState<'all' | CareerEntryType>('all');

  const filteredEntries =
    filter === 'all'
      ? CAREER_ENTRIES
      : CAREER_ENTRIES.filter((entry) => entry.type === filter);

  const tabs: { id: 'all' | CareerEntryType; label: string }[] = [
    { id: 'all', label: t('tabs.all') },
    { id: 'work', label: t('tabs.work') },
    { id: 'education', label: t('tabs.education') },
    { id: 'milestone', label: t('tabs.milestone') },
  ];

  return (
    <section id="career" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                'cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-all sm:text-sm',
                isActive
                  ? 'bg-[var(--ui-accent)] text-white shadow-[0_0_16px_-4px_var(--ui-accent-glow)]'
                  : 'border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)]/50 hover:text-[var(--ui-text-primary)]'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Vertical Timeline */}
      <div className="relative space-y-6 before:absolute before:top-4 before:bottom-4 before:left-5 before:z-0 before:w-px before:bg-gradient-to-b before:from-[var(--ui-accent)] before:via-[var(--ui-border)] before:to-transparent sm:before:left-6">
        {filteredEntries.map((entry) => {
          const Icon = TYPE_ICONS[entry.type];
          const achievements = t.raw(`entries.${entry.id}.achievements`) as string[];

          return (
            <div key={entry.id} className="relative pl-14 sm:pl-16">
              {/* Timeline Node Icon */}
              <div
                className={cn(
                  'absolute top-6 left-0 z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border bg-[var(--ui-surface)] sm:h-12 sm:w-12',
                  entry.isCurrent
                    ? 'border-[var(--ui-accent)] text-[var(--ui-accent)] shadow-[0_0_20px_-4px_var(--ui-accent-glow)]'
                    : 'border-[var(--ui-border)] text-[var(--ui-text-secondary)]'
                )}
              >
                <div
                  className={cn(
                    'flex h-full w-full items-center justify-center',
                    entry.isCurrent && 'bg-[var(--ui-accent)]/15'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <GlassCard interactive className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--ui-accent)]">
                        {t(`entries.${entry.id}.period`)}
                      </span>
                      {entry.isCurrent && (
                        <Badge variant="accent">{t('currentBadge')}</Badge>
                      )}
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-[var(--ui-text-primary)] sm:text-2xl">
                      {t(`entries.${entry.id}.role`)}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--ui-text-secondary)]">
                      {t(`entries.${entry.id}.organization`)} •{' '}
                      <span className="font-normal text-[var(--ui-text-muted)]">
                        {t(`entries.${entry.id}.location`)}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[var(--ui-text-secondary)] sm:text-base">
                  {t(`entries.${entry.id}.summary`)}
                </p>

                {Array.isArray(achievements) && achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {achievements.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ui-text-secondary)] sm:text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[var(--ui-border)] pt-4">
                  {entry.technologies.map((tech) => (
                    <Badge key={tech} variant="default">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
