'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  SKILLS_DATA,
  SKILL_CATEGORIES,
  type SkillCategoryKey,
} from '@/entities/skill';
import { cn } from '@/shared/lib';
import { Badge, GlassCard, SectionHeading } from '@/shared/ui';
import { InteractiveSkillSphere } from './InteractiveSkillSphere';

export function SkillsSphereSection() {
  const t = useTranslations('skills');
  const [selectedCategory, setSelectedCategory] = useState<
    SkillCategoryKey | 'all'
  >('all');

  const visibleCategories =
    selectedCategory === 'all' ? SKILL_CATEGORIES : [selectedCategory];

  return (
    <section id="skills" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Category Filter Pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'cursor-pointer rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
            selectedCategory === 'all'
              ? 'bg-[var(--ui-accent)] text-slate-950 shadow-[0_0_16px_-4px_var(--ui-accent-glow)]'
              : 'border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)]/50 hover:text-[var(--ui-text-primary)]'
          )}
        >
          {t('allCategories')} ({SKILLS_DATA.length})
        </button>

        {SKILL_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count = SKILLS_DATA.filter(
            (s) => s.category === category
          ).length;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'cursor-pointer rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                isSelected
                  ? 'bg-[var(--ui-accent)] text-slate-950 shadow-[0_0_16px_-4px_var(--ui-accent-glow)]'
                  : 'border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)]/50 hover:text-[var(--ui-text-primary)]'
              )}
            >
              {t(`categories.${category}`)} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        {/* 3D Interactive Sphere Card */}
        <GlassCard className="p-4 sm:p-6 lg:sticky lg:top-24 lg:col-span-5">
          <InteractiveSkillSphere selectedCategory={selectedCategory} />
          <p className="mt-2 text-center font-mono text-xs text-[var(--ui-text-muted)]">
            {t('sphereHint')}
          </p>
        </GlassCard>

        {/* Categorized Resume Matrix */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {visibleCategories.map((category) => {
            const categorySkills = SKILLS_DATA.filter(
              (skill) => skill.category === category
            );

            return (
              <GlassCard key={category} interactive className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold tracking-wider text-[var(--ui-accent)] uppercase">
                    {t(`categories.${category}`)}
                  </h3>
                  <span className="font-mono text-xs text-[var(--ui-text-muted)]">
                    {categorySkills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categorySkills.map((skill) => (
                    <Badge
                      key={skill.name}
                      variant={skill.highlight ? 'accent' : 'default'}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
