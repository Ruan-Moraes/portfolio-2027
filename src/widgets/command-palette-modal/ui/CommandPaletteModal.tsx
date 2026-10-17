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

const GROUP_CLASS =
  'mb-5 last:mb-0 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[var(--ui-text-muted)] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1.5';

const ITEM_CLASS =
  'group flex cursor-pointer items-center justify-between gap-3.5 rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] px-3.5 py-2.5 text-sm font-medium text-[var(--ui-text-secondary)] transition-all aria-selected:border-[var(--ui-accent)] aria-selected:bg-[var(--ui-accent)]/15 aria-selected:text-[var(--ui-text-primary)]';

const ICON_BOX_CLASS =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] text-[var(--ui-text-muted)] transition-colors group-aria-selected:border-[var(--ui-accent)] group-aria-selected:bg-[var(--ui-accent)]/20 group-aria-selected:text-[var(--ui-text-primary)]';

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md sm:p-6 ${
        mode === 'light' ? 'bg-slate-900/35' : 'bg-slate-950/80'
      }`}
      onClick={closePalette}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--ui-border-strong)] bg-[var(--ui-surface)] text-[var(--ui-text-primary)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full bg-[var(--ui-surface)] text-[var(--ui-text-primary)]">
          {/* Search Header */}
          <div className="flex items-center gap-3.5 border-b border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--ui-accent)] bg-[var(--ui-accent)]/15 text-[var(--ui-text-primary)]">
              <Search className="h-4 w-4" />
            </div>

            <Command.Input
              autoFocus
              placeholder={tCmd('placeholder')}
              className="w-full bg-transparent text-sm text-[var(--ui-text-primary)] placeholder:text-[var(--ui-text-muted)] focus:outline-none sm:text-base"
            />

            <div className="flex shrink-0 items-center gap-2">
              <kbd className="hidden rounded-lg border border-[var(--ui-border)] bg-[var(--ui-surface)] px-2 py-1 font-mono text-[10px] font-semibold text-[var(--ui-text-muted)] sm:inline-block">
                ESC
              </kbd>
              <button
                type="button"
                onClick={closePalette}
                aria-label={tCommon('close')}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Command List */}
          <Command.List className="max-h-[65vh] overflow-y-auto p-4 sm:p-5">
            <Command.Empty className="py-10 text-center text-sm text-[var(--ui-text-muted)]">
              {tCmd('empty')}
            </Command.Empty>

            {/* Group 1: Navigation */}
            <Command.Group
              heading={tCmd('groups.navigation')}
              className={GROUP_CLASS}
            >
              {PORTFOLIO_SECTIONS.map((sectionId) => (
                <Command.Item
                  key={sectionId}
                  value={`nav ${sectionId} ${tNav(sectionId)}`}
                  onSelect={() => jumpToSection(sectionId)}
                  className={ITEM_CLASS}
                >
                  <div className="flex items-center gap-3">
                    <span className={ICON_BOX_CLASS}>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span>{tNav(sectionId)}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ui-text-muted)] opacity-0 transition-all group-aria-selected:translate-x-0.5 group-aria-selected:text-[var(--ui-accent)] group-aria-selected:opacity-100" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group 2: Recruiter Actions */}
            <Command.Group
              heading={tCmd('groups.actions')}
              className={GROUP_CLASS}
            >
              <Command.Item
                value="download cv resume pdf curriculo"
                onSelect={() => {
                  closePalette();
                  window.open(DEVELOPER_PROFILE.cvPdfPath, '_blank');
                }}
                className={ITEM_CLASS}
              >
                <div className="flex items-center gap-3">
                  <span className={ICON_BOX_CLASS}>
                    <Download className="h-3.5 w-3.5" />
                  </span>
                  <span>{tCommon('downloadCV')}</span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ui-text-muted)] opacity-0 transition-all group-aria-selected:translate-x-0.5 group-aria-selected:text-[var(--ui-accent)] group-aria-selected:opacity-100" />
              </Command.Item>

              <Command.Item
                value="copy email copiar"
                onSelect={() => {
                  void navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
                  closePalette();
                }}
                className={ITEM_CLASS}
              >
                <div className="flex items-center gap-3">
                  <span className={ICON_BOX_CLASS}>
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">
                    {tCommon('copyEmail')}{' '}
                    <span className="font-mono text-xs text-[var(--ui-text-muted)]">
                      ({DEVELOPER_PROFILE.email})
                    </span>
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ui-text-muted)] opacity-0 transition-all group-aria-selected:translate-x-0.5 group-aria-selected:text-[var(--ui-accent)] group-aria-selected:opacity-100" />
              </Command.Item>

              <Command.Item
                value="whatsapp chat"
                onSelect={() => {
                  closePalette();
                  window.open(DEVELOPER_PROFILE.whatsappHref, '_blank');
                }}
                className={ITEM_CLASS}
              >
                <div className="flex items-center gap-3">
                  <span className={ICON_BOX_CLASS}>
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  <span>{tCommon('openWhatsApp')}</span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ui-text-muted)] opacity-0 transition-all group-aria-selected:translate-x-0.5 group-aria-selected:text-[var(--ui-accent)] group-aria-selected:opacity-100" />
              </Command.Item>
            </Command.Group>

            {/* Group 3: Languages */}
            <Command.Group
              heading={tCmd('groups.language')}
              className={GROUP_CLASS}
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <Command.Item
                  key={loc}
                  value={`language idioma ${loc} ${LOCALE_METADATA[loc].label}`}
                  onSelect={() => switchLocale(loc)}
                  className={ITEM_CLASS}
                >
                  <div className="flex items-center gap-3">
                    <span className={ICON_BOX_CLASS}>
                      <Globe className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      {LOCALE_METADATA[loc].flag} {LOCALE_METADATA[loc].label}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ui-text-muted)] opacity-0 transition-all group-aria-selected:translate-x-0.5 group-aria-selected:text-[var(--ui-accent)] group-aria-selected:opacity-100" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group 4: Theme & Neon Accents */}
            <Command.Group
              heading={tCmd('groups.theme')}
              className={GROUP_CLASS}
            >
              <Command.Item
                value="toggle theme dark light mode"
                onSelect={() => {
                  toggleMode();
                  closePalette();
                }}
                className={ITEM_CLASS}
              >
                <div className="flex items-center gap-3">
                  <span className={ICON_BOX_CLASS}>
                    {mode === 'dark' ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <Moon className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span>
                    {tTheme('modeLabel')}:{' '}
                    {mode === 'dark' ? tTheme('light') : tTheme('dark')}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ui-text-muted)] opacity-0 transition-all group-aria-selected:translate-x-0.5 group-aria-selected:text-[var(--ui-accent)] group-aria-selected:opacity-100" />
              </Command.Item>

              {ACCENT_COLORS.map((colorKey: AccentColor) => (
                <Command.Item
                  key={colorKey}
                  value={`accent color neon ${colorKey} ${tTheme(`accents.${colorKey}`)}`}
                  onSelect={() => {
                    setAccent(colorKey);
                    closePalette();
                  }}
                  className={ITEM_CLASS}
                >
                  <div className="flex items-center gap-3">
                    <span className={ICON_BOX_CLASS}>
                      <Palette className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full ring-2 ring-white/15"
                        style={{
                          backgroundColor: ACCENT_HEX_MAP[colorKey].primary,
                        }}
                      />
                      <span>{tTheme(`accents.${colorKey}`)}</span>
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ui-text-muted)] opacity-0 transition-all group-aria-selected:translate-x-0.5 group-aria-selected:text-[var(--ui-accent)] group-aria-selected:opacity-100" />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
