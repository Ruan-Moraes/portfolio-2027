'use client';

import { memo } from 'react';
import { useLocale } from 'next-intl';
import {
  LOCALE_METADATA,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/shared/config';
import { cn } from '@/shared/lib';
import { usePortfolioLocale } from '../model/locale.context';

function LanguageSwitcherComponent() {
  const currentLocale = useLocale() as SupportedLocale;
  const { setLocale } = usePortfolioLocale();

  const handleSelectLocale = (nextLocale: SupportedLocale) => {
    if (nextLocale === currentLocale) return;
    setLocale(nextLocale);
  };

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="inline-flex h-9 items-center gap-0.5 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 p-1 backdrop-blur-md"
    >
      {SUPPORTED_LOCALES.map((locale) => {
        const meta = LOCALE_METADATA[locale];
        const isActive = locale === currentLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleSelectLocale(locale)}
            title={meta.label}
            className={cn(
              'flex h-full cursor-pointer items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition-all duration-200',
              isActive
                ? 'bg-[var(--ui-accent)] text-white shadow-sm'
                : 'text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)]'
            )}
          >
            {meta.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

export const LanguageSwitcher = memo(LanguageSwitcherComponent);

