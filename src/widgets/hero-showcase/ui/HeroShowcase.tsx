'use client';

import dynamic from 'next/dynamic';
import {
  ArrowRight,
  Download,
  MessageSquare,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import {
  AnimatedLetters,
  Badge,
  Button,
  CodeTag,
  GlassCard,
} from '@/shared/ui';

const TechCube3D = dynamic(
  () => import('./TechCube3D').then((mod) => mod.TechCube3D),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex flex-col items-center justify-center py-4">
        <div className="h-[280px] w-[280px] sm:h-[300px] sm:w-[300px]" />
      </div>
    ),
  }
);

export function HeroShowcase() {
  const t = useTranslations('hero');

  const tCommon = useTranslations('common');

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const metrics = [
    {
      value: t('metrics.experience'),
      label: t('metrics.experienceLabel'),
    },
    {
      value: t('metrics.production'),
      label: t('metrics.productionLabel'),
    },
    {
      value: t('metrics.architecture'),
      label: t('metrics.architectureLabel'),
    },
    {
      value: t('metrics.languages'),
      label: t('metrics.languagesLabel'),
    },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-5rem)] flex-col justify-center py-12"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12">
        {/* Left Zone: Animated Typography & CTAs */}
        <div className="space-y-6 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent" className="py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{tCommon('availableStatus')}</span>
            </Badge>
            <Badge variant="default" className="font-mono">
              <Terminal className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
              <span>{tCommon('locationValue')}</span>
            </Badge>
          </div>

          <div className="space-y-2">
            <CodeTag tag="h1" />
            <div className="space-y-2 pl-4 sm:pl-6">
              <p className="font-mono text-sm font-semibold tracking-wider text-[var(--ui-accent)] uppercase sm:text-base">
                {t('greeting')}
              </p>
              <h1 className="text-4xl font-black tracking-tight text-[var(--ui-text-primary)] sm:text-6xl lg:text-7xl">
                <AnimatedLetters text={t('name')} />
              </h1>
              <p className="text-xl font-bold text-[var(--ui-text-secondary)] sm:text-3xl">
                <AnimatedLetters text={t('role')} delayOffset={12} />
              </p>
            </div>
            <CodeTag tag="h1" closing />
          </div>

          <p className="font-mono text-xs font-semibold tracking-wide text-[var(--ui-accent)] sm:text-sm">
            {t('stackLine')}
          </p>

          <p className="max-w-2xl text-base leading-relaxed text-[var(--ui-text-secondary)] sm:text-lg">
            {t('summary')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" onClick={() => scrollTo('projects')}>
              <span>{t('ctaProjects')}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <a
              href={DEVELOPER_PROFILE.cvPdfPath}
              download
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] px-6 text-base font-semibold text-[var(--ui-text-primary)] transition-all hover:border-[var(--ui-accent)]/60 hover:text-[var(--ui-accent)]"
            >
              <Download className="h-4 w-4 text-[var(--ui-accent)]" />
              <span>{tCommon('downloadCV')}</span>
            </a>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollTo('contact')}
              className="border-[var(--ui-accent)]/40 bg-[var(--ui-accent)]/10 text-[var(--ui-accent)] hover:border-[var(--ui-accent)] hover:bg-[var(--ui-accent)]/20"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{t('ctaContact')}</span>
            </Button>
          </div>
        </div>

        {/* Right Zone: Interactive 3D Tech Cube (metal-oopa homage) */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <TechCube3D />
          <p className="mt-4 text-center font-mono text-xs text-[var(--ui-text-muted)]">
            {t('cubeCaption')}
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((metric) => (
          <GlassCard key={metric.label} className="p-4 sm:p-5">
            <p className="font-mono text-xl font-black text-[var(--ui-accent)] sm:text-2xl">
              {metric.value}
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--ui-text-secondary)] sm:text-sm">
              {metric.label}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
