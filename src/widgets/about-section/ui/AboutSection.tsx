'use client';

import Image from 'next/image';
import { Cpu, Database, Layers, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { GlassCard, SectionHeading } from '@/shared/ui';

export function AboutSection() {
  const t = useTranslations('about');

  const highlights = [
    {
      key: 'cleanCode',
      icon: Layers,
      title: t('highlights.cleanCode.title'),
      description: t('highlights.cleanCode.description'),
    },
    {
      key: 'sqlTuning',
      icon: Database,
      title: t('highlights.sqlTuning.title'),
      description: t('highlights.sqlTuning.description'),
    },
    {
      key: 'mobileWeb',
      icon: Smartphone,
      title: t('highlights.mobileWeb.title'),
      description: t('highlights.mobileWeb.description'),
    },
    {
      key: 'devops',
      icon: Cpu,
      title: t('highlights.devops.title'),
      description: t('highlights.devops.description'),
    },
  ];

  return (
    <section id="about" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Profile Card with Photo */}
        <GlassCard className="flex flex-col gap-6 p-6 sm:p-8 lg:col-span-5">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[var(--ui-accent)] shadow-[0_0_20px_-4px_var(--ui-accent-glow)]">
              <Image
                src={DEVELOPER_PROFILE.photoPath}
                alt={DEVELOPER_PROFILE.fullName}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--ui-text-primary)]">
                {DEVELOPER_PROFILE.fullName}
              </h3>
              <p className="font-mono text-xs text-[var(--ui-accent)]">
                Full Stack Software Developer @ CAPYS
              </p>
              <p className="mt-1 text-xs text-[var(--ui-text-muted)]">
                {DEVELOPER_PROFILE.location.city},{' '}
                {DEVELOPER_PROFILE.location.state} —{' '}
                {DEVELOPER_PROFILE.location.country}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-[var(--ui-text-secondary)] sm:text-base">
            <h4 className="font-mono text-xs font-bold tracking-wider text-[var(--ui-accent)] uppercase">
              {t('profileTitle')}
            </h4>
            <p>{t('profileP1')}</p>
            <p>{t('profileP2')}</p>
          </div>
        </GlassCard>

        {/* Personal Hardware & Software Journey + 4 Pillars */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-7">
          <GlassCard className="p-6 sm:p-8">
            <h3 className="mb-3 font-mono text-xs font-bold tracking-wider text-[var(--ui-accent)] uppercase">
              {t('journeyTitle')}
            </h3>
            <div className="space-y-3 text-sm leading-relaxed text-[var(--ui-text-secondary)] sm:text-base">
              <p>{t('journeyP1')}</p>
              <p>{t('journeyP2')}</p>
            </div>
          </GlassCard>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard key={item.key} interactive className="p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ui-accent)]/12 text-[var(--ui-accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-[var(--ui-text-primary)]">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--ui-text-secondary)] sm:text-sm">
                    {item.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
