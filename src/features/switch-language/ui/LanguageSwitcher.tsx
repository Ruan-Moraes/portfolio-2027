'use client';

import { useLocale } from 'next-intl';
import {
  LOCALE_METADATA,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/shared/config';
import { usePathname, useRouter } from '@/shared/i18n';
import { cn } from '@/shared/lib';

export function LanguageSwitcher() {
  const currentLocale = useLocale() as SupportedLocale;
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectLocale = (nextLocale: SupportedLocale) => {
    if (nextLocale === currentLocale) return;
    router.replace(pathname, { locale: nextLocale, scroll: false });
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
                ? 'bg-[var(--ui-accent)] text-slate-950 shadow-sm'
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
