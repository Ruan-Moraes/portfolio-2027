'use client';

import { memo, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { ContactForm } from '@/features/send-contact-message';
import { Badge, GlassCard, SectionHeading } from '@/shared/ui';

const BeloHorizonteMap = dynamic(
  () => import('./BeloHorizonteMap').then((mod) => mod.BeloHorizonteMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-slate-950 sm:h-80" />
    ),
  }
);

const CopyEmailButton = memo(function CopyEmailButtonComponent({
  copiedLabel,
  copyEmailLabel,
}: {
  copiedLabel: string;
  copyEmailLabel: string;
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
      setCopiedEmail(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedEmail(false);
        copyTimerRef.current = null;
      }, 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopyEmail}
      title={copiedEmail ? copiedLabel : copyEmailLabel}
      aria-label={copiedEmail ? copiedLabel : copyEmailLabel}
      className="group flex h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 px-3.5 text-left transition-colors hover:border-[var(--ui-accent)]"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Mail className="h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
        <span className="truncate font-mono text-xs font-semibold text-[var(--ui-text-primary)] transition-colors group-hover:text-[var(--ui-accent)]">
          {copiedEmail ? copiedLabel : DEVELOPER_PROFILE.email}
        </span>
      </div>
      {copiedEmail ? (
        <Check className="h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0 text-[var(--ui-accent)] transition-transform group-hover:scale-110" />
      )}
    </button>
  );
});

export function ContactMapSection() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');

  return (
    <section id="contact" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Form */}
        <GlassCard className="flex flex-col p-6 sm:p-8 lg:col-span-7">
          <ContactForm />
        </GlassCard>

        {/* Right Column: Interactive Map + Direct Contact Channels */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-5">
          <GlassCard className="p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <Badge variant="accent">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t('map.badge')}</span>
              </Badge>
              <span className="font-mono text-xs text-[var(--ui-text-muted)]">
                {t('map.workMode')}
              </span>
            </div>

            <BeloHorizonteMap />

            <p className="mt-3 font-mono text-xs font-semibold text-[var(--ui-text-secondary)]">
              {t('map.city')}
            </p>
          </GlassCard>

          <GlassCard className="space-y-2.5 p-5">
            {/* Top Bar: Full-width clickable Email Copy Button */}
            <CopyEmailButton
              copiedLabel={tCommon('copied')}
              copyEmailLabel={tCommon('copyEmail')}
            />

            {/* Two-Column Standardized Channels: Left (WhatsApp + Phone) | Right (LinkedIn + GitHub) */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="flex flex-col gap-2.5">
                <a
                  href={DEVELOPER_PROFILE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-start gap-2.5 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 px-3.5 text-left text-xs font-semibold text-[var(--ui-text-primary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
                  <span className="truncate">{tCommon('openWhatsApp')}</span>
                </a>

                <a
                  href={DEVELOPER_PROFILE.phoneHref}
                  className="flex h-12 items-center justify-start gap-2.5 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 px-3.5 text-left font-mono text-xs font-semibold text-[var(--ui-text-primary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
                  <span className="truncate">{DEVELOPER_PROFILE.phoneFormatted}</span>
                </a>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={DEVELOPER_PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-between rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 px-3.5 text-left text-xs font-semibold text-[var(--ui-text-primary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--ui-accent)]" />
                </a>

                <a
                  href={DEVELOPER_PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-between rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 px-3.5 text-left text-xs font-semibold text-[var(--ui-text-primary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
                >
                  <span>GitHub</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--ui-accent)]" />
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
