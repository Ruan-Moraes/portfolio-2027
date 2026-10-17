'use client';

import type { ReactNode } from 'react';
import { CommandPaletteProvider } from '@/features/open-command-palette';
import { ThemePreferencesProvider } from '@/features/switch-theme';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemePreferencesProvider>
      <CommandPaletteProvider>{children}</CommandPaletteProvider>
    </ThemePreferencesProvider>
  );
}
