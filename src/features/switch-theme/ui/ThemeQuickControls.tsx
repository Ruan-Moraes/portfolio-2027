'use client';

import { Moon, Palette, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ACCENT_COLORS,
  ACCENT_HEX_MAP,
  type AccentColor,
} from '@/shared/config';
import { cn } from '@/shared/lib';
import { useThemePreferences } from '../model/theme.context';

export function ThemeQuickControls() {
  const t = useTranslations('theme');
  const { mode, accent, toggleMode, setAccent } = useThemePreferences();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggleMode}
        aria-label={t('modeLabel')}
        title={mode === 'dark' ? t('dark') : t('light')}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 text-[var(--ui-text-secondary)] backdrop-blur-md transition-colors hover:border-[var(--ui-accent)]/60 hover:text-[var(--ui-accent)]"
      >
        {mode === 'dark' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t('accentLabel')}
        aria-expanded={open}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/80 px-2.5 text-xs font-medium text-[var(--ui-text-secondary)] backdrop-blur-md transition-colors hover:border-[var(--ui-accent)]/60 hover:text-[var(--ui-text-primary)]"
      >
        <Palette className="h-3.5 w-3.5 text-[var(--ui-accent)]" />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: ACCENT_HEX_MAP[accent].primary }}
        />
      </button>

      {open && (
        <div className="absolute top-11 right-0 z-50 w-56 rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-3 shadow-2xl backdrop-blur-xl">
          <p className="mb-2 text-[11px] font-semibold tracking-wider text-[var(--ui-text-muted)] uppercase">
            {t('accentLabel')}
          </p>
          <div className="space-y-1">
            {ACCENT_COLORS.map((colorKey: AccentColor) => {
              const isSelected = accent === colorKey;
              return (
                <button
                  key={colorKey}
                  type="button"
                  onClick={() => {
                    setAccent(colorKey);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors',
                    isSelected
                      ? 'bg-[var(--ui-accent)]/15 font-semibold text-[var(--ui-accent)]'
                      : 'text-[var(--ui-text-secondary)] hover:bg-[var(--ui-surface-elevated)] hover:text-[var(--ui-text-primary)]'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: ACCENT_HEX_MAP[colorKey].primary,
                      }}
                    />
                    {t(`accents.${colorKey}`)}
                  </span>
                  {isSelected && <span>●</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
