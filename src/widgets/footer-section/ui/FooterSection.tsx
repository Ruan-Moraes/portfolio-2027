'use client';

import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';

export function FooterSection() {
  const tCommon = useTranslations('common');

  return (
    <footer className="mt-12 border-t border-[var(--ui-border)] py-10 pb-24 lg:pb-10">

      <div className="flex flex-col items-start justify-between gap-4 text-xs text-[var(--ui-text-muted)] sm:flex-row sm:items-center">
        <p className="font-mono">
          © {new Date().getFullYear()} {DEVELOPER_PROFILE.fullName} •{' '}
          <span className="text-[var(--ui-accent)]">
            {tCommon('portfolio')}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-4 font-mono">
          {DEVELOPER_PROFILE.socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target={social.id === 'email' ? undefined : '_blank'}
              rel={social.id === 'email' ? undefined : 'noopener noreferrer'}
              className="transition-colors hover:text-[var(--ui-accent)]"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
