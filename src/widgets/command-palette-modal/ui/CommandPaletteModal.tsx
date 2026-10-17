'use client';

import { Command } from 'cmdk';
import {
  ArrowRight,
  Download,
  Globe,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { useCommandPalette } from '@/features/open-command-palette';
import { useThemePreferences } from '@/features/switch-theme';
import {
  ACCENT_COLORS,
  ACCENT_HEX_MAP,
  LOCALE_METADATA,
  PORTFOLIO_SECTIONS,
  SUPPORTED_LOCALES,
  type AccentColor,
  type PortfolioSectionId,
  type SupportedLocale,
} from '@/shared/config';
import { usePathname, useRouter } from '@/shared/i18n';

export function CommandPaletteModal() {
  const { isOpen, closePalette } = useCommandPalette();
  const { mode, toggleMode, setAccent } = useThemePreferences();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tTheme = useTranslations('theme');
  const tCmd = useTranslations('commandPalette');
  const router = useRouter();
  const pathname = usePathname();

  if (!isOpen) return null;

  const jumpToSection = (id: PortfolioSectionId) => {
    closePalette();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const switchLocale = (locale: SupportedLocale) => {
    closePalette();
    router.replace(pathname, { locale, scroll: false });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/75 p-4 pt-20 backdrop-blur-md"
      onClick={closePalette}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full">
          <div className="flex items-center border-b border-[var(--ui-border)] px-4 py-3">
            <Search className="mr-3 h-4 w-4 text-[var(--ui-accent)]" />
            <Command.Input
              autoFocus
              placeholder={tCmd('placeholder')}
              className="w-full bg-transparent text-sm text-[var(--ui-text-primary)] placeholder:text-[var(--ui-text-muted)] focus:outline-none"
            />
            <button
              type="button"
              onClick={closePalette}
              aria-label={tCommon('close')}
              className="cursor-pointer rounded-lg p-1 text-[var(--ui-text-muted)] hover:text-[var(--ui-text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-xs text-[var(--ui-text-muted)]">
              {tCmd('empty')}
            </Command.Empty>

            {/* Group 1: Navigation */}
            <Command.Group
              heading={tCmd('groups.navigation')}
              className="px-2 py-1.5 text-[11px] font-semibold tracking-wider text-[var(--ui-text-muted)] uppercase"
            >
              {PORTFOLIO_SECTIONS.map((sectionId) => (
                <Command.Item
                  key={sectionId}
                  value={`nav ${sectionId} ${tNav(sectionId)}`}
                  onSelect={() => jumpToSection(sectionId)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--ui-text-secondary)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-accent)]"
                >
                  <span>{tNav(sectionId)}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group 2: Recruiter Actions */}
            <Command.Group
              heading={tCmd('groups.actions')}
              className="mt-2 px-2 py-1.5 text-[11px] font-semibold tracking-wider text-[var(--ui-text-muted)] uppercase"
            >
              <Command.Item
                value="download cv resume pdf curriculo"
                onSelect={() => {
                  closePalette();
                  window.open(DEVELOPER_PROFILE.cvPdfPath, '_blank');
                }}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--ui-text-secondary)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-accent)]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{tCommon('downloadCV')}</span>
              </Command.Item>

              <Command.Item
                value="copy email copiar"
                onSelect={() => {
                  void navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
                  closePalette();
                }}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--ui-text-secondary)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-accent)]"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>
                  {tCommon('copyEmail')} ({DEVELOPER_PROFILE.email})
                </span>
              </Command.Item>

              <Command.Item
                value="whatsapp chat"
                onSelect={() => {
                  closePalette();
                  window.open(DEVELOPER_PROFILE.whatsappHref, '_blank');
                }}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--ui-text-secondary)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-accent)]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{tCommon('openWhatsApp')}</span>
              </Command.Item>
            </Command.Group>

            {/* Group 3: Languages */}
            <Command.Group
              heading={tCmd('groups.language')}
              className="mt-2 px-2 py-1.5 text-[11px] font-semibold tracking-wider text-[var(--ui-text-muted)] uppercase"
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <Command.Item
                  key={loc}
                  value={`language idioma ${loc} ${LOCALE_METADATA[loc].label}`}
                  onSelect={() => switchLocale(loc)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--ui-text-secondary)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-accent)]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>
                    {LOCALE_METADATA[loc].flag} {LOCALE_METADATA[loc].label}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group 4: Theme & Neon Accents */}
            <Command.Group
              heading={tCmd('groups.theme')}
              className="mt-2 px-2 py-1.5 text-[11px] font-semibold tracking-wider text-[var(--ui-text-muted)] uppercase"
            >
              <Command.Item
                value="toggle theme dark light mode"
                onSelect={() => {
                  toggleMode();
                  closePalette();
                }}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--ui-text-secondary)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-accent)]"
              >
                {mode === 'dark' ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
                <span>
                  {tTheme('modeLabel')}:{' '}
                  {mode === 'dark' ? tTheme('light') : tTheme('dark')}
                </span>
              </Command.Item>

              {ACCENT_COLORS.map((colorKey: AccentColor) => (
                <Command.Item
                  key={colorKey}
                  value={`accent color neon ${colorKey} ${tTheme(`accents.${colorKey}`)}`}
                  onSelect={() => {
                    setAccent(colorKey);
                    closePalette();
                  }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[var(--ui-text-secondary)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-accent)]"
                >
                  <Palette className="h-3.5 w-3.5" />
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: ACCENT_HEX_MAP[colorKey].primary,
                    }}
                  />
                  <span>{tTheme(`accents.${colorKey}`)}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
