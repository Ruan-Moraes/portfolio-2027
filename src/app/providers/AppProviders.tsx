'use client';

import type { ReactNode } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import { CommandPaletteProvider } from '@/features/open-command-palette';
import { PortfolioLocaleProvider } from '@/features/switch-language';
import { ThemePreferencesProvider } from '@/features/switch-theme';
import type { SupportedLocale } from '@/shared/config';

interface AppProvidersProps {
  initialLocale: SupportedLocale;
  initialMessages: AbstractIntlMessages;
  children: ReactNode;
}

export function AppProviders({
  initialLocale,
  initialMessages,
  children,
}: AppProvidersProps) {
  return (
    <PortfolioLocaleProvider
      initialLocale={initialLocale}
      initialMessages={initialMessages}
    >
      <ThemePreferencesProvider>
        <CommandPaletteProvider>{children}</CommandPaletteProvider>
      </ThemePreferencesProvider>
    </PortfolioLocaleProvider>
  );
}
