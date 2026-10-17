'use client';

import { useState } from 'react';
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
import { BeloHorizonteMap } from './BeloHorizonteMap';

export function ContactMapSection() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Form */}
        <GlassCard className="p-6 sm:p-8 lg:col-span-7">
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

          <GlassCard className="space-y-3 p-5">
            <div className="flex items-center justify-between rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 p-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <Mail className="h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
                <span className="truncate font-mono text-xs text-[var(--ui-text-primary)]">
                  {DEVELOPER_PROFILE.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg bg-[var(--ui-accent)]/15 px-2.5 py-1 text-xs font-semibold text-[var(--ui-accent)] transition-colors hover:bg-[var(--ui-accent)] hover:text-white"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>{tCommon('copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{tCommon('copyEmail')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={DEVELOPER_PROFILE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] p-3 text-xs font-bold text-[var(--ui-text-primary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
              >
                <MessageCircle className="h-4 w-4 text-[var(--ui-accent)]" />
                <span>{tCommon('openWhatsApp')}</span>
              </a>

              <a
                href={DEVELOPER_PROFILE.phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] p-3 font-mono text-xs font-bold text-[var(--ui-text-primary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
              >
                <Phone className="h-4 w-4 text-[var(--ui-accent)]" />
                <span>{DEVELOPER_PROFILE.phoneFormatted}</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={DEVELOPER_PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 px-3.5 py-2.5 text-xs font-semibold text-[var(--ui-text-secondary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-text-primary)]"
              >
                <span>LinkedIn</span>
                <ExternalLink className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
              </a>

              <a
                href={DEVELOPER_PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/60 px-3.5 py-2.5 text-xs font-semibold text-[var(--ui-text-secondary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-text-primary)]"
              >
                <span>GitHub</span>
                <ExternalLink className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
