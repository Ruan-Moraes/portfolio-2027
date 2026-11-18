'use client';

import { Command } from 'cmdk';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  Download,
  Globe,
  Mail,
  MessageCircle,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, type ReactNode } from 'react';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { useCommandPalette } from '@/features/open-command-palette';
import { usePortfolioLocale } from '@/features/switch-language';
import { useThemePreferences } from '@/features/switch-theme';
import {
  ACCENT_COLORS,
  ACCENT_HEX_MAP,
  LOCALE_METADATA,
  PORTFOLIO_SECTIONS,
  SUPPORTED_LOCALES,
} from '@/shared/config';

const GROUP_CLASS =
  'mb-3 last:mb-0 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-[var(--ui-text-muted)]';

const KEY_CLASS =
  'inline-flex min-h-5 min-w-5 items-center justify-center rounded border border-[var(--ui-border)] bg-[var(--ui-surface)] px-1 font-mono text-[10px]';

function PaletteItem({
  label,
  value,
  icon,
  onSelect,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={`${label} ${value}`}
      onSelect={onSelect}
      className="group flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-medium text-[var(--ui-text-secondary)] aria-selected:border-[var(--ui-border-strong)] aria-selected:bg-[var(--ui-surface-elevated)] aria-selected:text-[var(--ui-text-primary)]"
    >
      <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--ui-surface-elevated)] text-[var(--ui-text-muted)] group-aria-selected:text-[var(--ui-accent)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      <CornerDownLeft
        aria-hidden="true"
        className="hidden h-3.5 w-3.5 shrink-0 text-[var(--ui-accent)] group-aria-selected:sm:block"
      />
    </Command.Item>
  );
}

export function CommandPaletteDialog() {
  const { closePalette } = useCommandPalette();
  const { mode, toggleMode, setAccent } = useThemePreferences();
  const { setLocale } = usePortfolioLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tTheme = useTranslations('theme');
  const tCmd = useTranslations('commandPalette');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const opener = document.activeElement;
    dialog.showModal();
    inputRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = DEVELOPER_PROFILE.cvPdfPath;
    link.download = '';
    document.body.append(link);
    link.click();
    link.remove();
    closePalette();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={tCmd('title')}
      onCancel={(event) => {
        event.preventDefault();
        closePalette();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePalette();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-[var(--ui-border-strong)] bg-[var(--ui-surface)] p-0 text-[var(--ui-text-primary)] shadow-2xl backdrop:bg-slate-950/65 backdrop:backdrop-blur-sm"
    >
      <Command label={tCmd('title')} loop className="flex max-h-[min(38rem,calc(100dvh-2rem))] min-h-0 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--ui-border)] px-3 py-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] px-3 focus-within:border-[var(--ui-accent)]">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ui-accent)]" />
            <Command.Input
              ref={inputRef}
              placeholder={tCmd('placeholder')}
              className="h-11 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-[var(--ui-text-muted)]"
            />
          </div>
          <button
            type="button"
            onClick={closePalette}
            aria-label={tCommon('close')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--ui-border)] text-[var(--ui-text-secondary)] hover:border-[var(--ui-accent)] focus-visible:outline-2 focus-visible:outline-[var(--ui-accent)]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <Command.List className="min-h-0 overflow-y-auto overscroll-contain px-2 py-2 [scrollbar-color:var(--ui-border-strong)_transparent] [scrollbar-width:thin] sm:px-3">
          <Command.Empty className="px-4 py-12 text-center text-sm text-[var(--ui-text-muted)]">
            {tCmd('empty')}
          </Command.Empty>

          <Command.Group heading={tCmd('groups.actions')} className={GROUP_CLASS}>
            <PaletteItem
              label={tCommon('downloadCV')}
              value="download cv resume pdf curriculo"
              icon={<Download className="h-4 w-4" />}
              onSelect={downloadResume}
            />
            <PaletteItem
              label={tCommon('copyEmail')}
              value={`copy email copiar ${DEVELOPER_PROFILE.email}`}
              icon={<Mail className="h-4 w-4" />}
              onSelect={() => {
                void navigator.clipboard.writeText(DEVELOPER_PROFILE.email).catch(() => {
                  window.location.href = `mailto:${DEVELOPER_PROFILE.email}`;
                });
                closePalette();
              }}
            />
            <PaletteItem
              label={tCommon('openWhatsApp')}
              value="whatsapp chat"
              icon={<MessageCircle className="h-4 w-4" />}
              onSelect={() => {
                window.open(DEVELOPER_PROFILE.whatsappHref, '_blank', 'noopener,noreferrer');
                closePalette();
              }}
            />
          </Command.Group>

          <Command.Group heading={tCmd('groups.navigation')} className={GROUP_CLASS}>
            {PORTFOLIO_SECTIONS.map((id) => (
              <PaletteItem
                key={id}
                label={tNav(id)}
                value={`nav ${id}`}
                icon={<ArrowRight className="h-4 w-4" />}
                onSelect={() => {
                  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
                  closePalette();
                }}
              />
            ))}
          </Command.Group>

          <Command.Group heading={tCmd('groups.language')} className={GROUP_CLASS}>
            {SUPPORTED_LOCALES.map((locale) => (
              <PaletteItem
                key={locale}
                label={LOCALE_METADATA[locale].label}
                value={`language idioma ${locale}`}
                icon={<Globe className="h-4 w-4" />}
                onSelect={() => {
                  setLocale(locale);
                  closePalette();
                }}
              />
            ))}
          </Command.Group>

          <Command.Group heading={tCmd('groups.theme')} className={GROUP_CLASS}>
            <PaletteItem
              label={mode === 'dark' ? tTheme('light') : tTheme('dark')}
              value="toggle theme dark light mode tema"
              icon={mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              onSelect={() => {
                toggleMode();
                closePalette();
              }}
            />
            {ACCENT_COLORS.map((color) => (
              <PaletteItem
                key={color}
                label={tTheme(`accents.${color}`)}
                value={`accent color neon ${color}`}
                icon={<span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: ACCENT_HEX_MAP[color].primary }} />}
                onSelect={() => {
                  setAccent(color);
                  closePalette();
                }}
              />
            ))}
          </Command.Group>
        </Command.List>

        <div className="hidden shrink-0 items-center gap-4 border-t border-[var(--ui-border)] px-4 py-2.5 text-xs text-[var(--ui-text-muted)] sm:flex">
          <span className="flex items-center gap-1">
            <kbd className={KEY_CLASS}><ArrowUp aria-hidden="true" className="h-3 w-3" /><span className="sr-only">↑</span></kbd>
            <kbd className={KEY_CLASS}><ArrowDown aria-hidden="true" className="h-3 w-3" /><span className="sr-only">↓</span></kbd>
            <span className="ml-1">{tCmd('navigate')}</span>
          </span>
          <span className="flex items-center gap-1.5"><kbd className={KEY_CLASS}>Enter</kbd>{tCmd('select')}</span>
          <span className="ml-auto flex items-center gap-1.5"><kbd className={KEY_CLASS}>Esc</kbd>{tCommon('close')}</span>
        </div>
      </Command>
    </dialog>
  );
}
