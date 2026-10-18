'use client';

import { memo } from 'react';
import { Command } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCommandPalette } from '../model/command-palette.context';

function CommandPaletteTriggerComponent() {
  const t = useTranslations('common');

  const { openPalette } = useCommandPalette();

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Open Command Palette (Cmd+K)"
      className="flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 px-3 text-xs font-medium text-[var(--ui-text-secondary)] backdrop-blur-md transition-colors hover:border-[var(--ui-accent)]/60 hover:text-[var(--ui-text-primary)]"
    >
      <Command className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
      <span className="hidden sm:inline">{t('commandPaletteHint')}</span>
      <kbd className="rounded bg-[var(--ui-surface-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ui-text-muted)]">
        ⌘K
      </kbd>
    </button>
  );
}

export const CommandPaletteTrigger = memo(CommandPaletteTriggerComponent);

