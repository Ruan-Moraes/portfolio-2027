'use client';

import { memo, useState } from 'react';
import { Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import {
  CERTIFICATES_DATA,
  type CertificateItem,
  type CertificatePlatform,
} from '@/entities/certificate';
import type { SupportedLocale } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Badge, GlassCard, SectionHeading } from '@/shared/ui';

const CERTIFICATES_BY_PLATFORM: Record<
  'all' | CertificatePlatform,
  CertificateItem[]
> = {
  all: CERTIFICATES_DATA,
  Udemy: CERTIFICATES_DATA.filter((c) => c.platform === 'Udemy'),
  DIO: CERTIFICATES_DATA.filter((c) => c.platform === 'DIO'),
};

interface CertificateCardProps {
  cert: CertificateItem;
  locale: SupportedLocale;
  verifyLabel: string;
}

const CertificateCard = memo(function CertificateCardComponent({
  cert,
  locale,
  verifyLabel,
}: CertificateCardProps) {
  const localizedTitle = cert.titles[locale] ?? cert.titles['pt-BR'];

  return (
    <GlassCard interactive className="flex flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="accent">{cert.platform}</Badge>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--ui-text-muted)]">
            <Calendar className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
            {cert.endDate}
          </span>
        </div>

        <div className="mt-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--ui-accent)]/12 text-[var(--ui-accent)]">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[var(--ui-text-primary)]">
            {localizedTitle}
          </h3>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {cert.skills.map((skill) => (
            <Badge key={skill} variant="default">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--ui-border)] pt-4">
        <a
          href={cert.credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] px-3 py-2 text-xs font-semibold text-[var(--ui-text-primary)] transition-all hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
        >
          <span>{verifyLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </GlassCard>
  );
});

export function CertificatesVault() {
  const t = useTranslations('certificates');
  const tCommon = useTranslations('common');
  const locale = useLocale() as SupportedLocale;
  const [platformFilter, setPlatformFilter] = useState<
    'all' | CertificatePlatform
  >('all');

  const filtered = CERTIFICATES_BY_PLATFORM[platformFilter];
  const verifyLabel = tCommon('verifyCredential');

  return (
    <section id="certificates" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'Udemy', 'DIO'] as const).map((platform) => {
            const isSelected = platformFilter === platform;
            const count = CERTIFICATES_BY_PLATFORM[platform].length;

            return (
              <button
                key={platform}
                type="button"
                onClick={() => setPlatformFilter(platform)}
                className={cn(
                  'cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all',
                  isSelected
                    ? 'bg-[var(--ui-accent)] text-white shadow-sm'
                    : 'border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)]/50'
                )}
              >
                {platform === 'all'
                  ? t('filterAll', { count })
                  : `${platform} (${count})`}
              </button>
            );
          })}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-[var(--ui-text-muted)]">
          <ShieldCheck className="h-4 w-4 text-[var(--ui-accent)]" />
          <span>{t('linkedinNote')}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cert) => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            locale={locale}
            verifyLabel={verifyLabel}
          />
        ))}
      </div>
    </section>
  );
}

