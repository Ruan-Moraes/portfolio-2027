'use client';

import {
  Award,
  Briefcase,
  Code2,
  Cpu,
  FileDown,
  FolderGit2,
  Home,
  Mail,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { PORTFOLIO_SECTIONS, type PortfolioSectionId } from '@/shared/config';
import { cn, useActiveSection } from '@/shared/lib';

const SECTION_ICONS: Record<PortfolioSectionId, typeof Home> = {
  home: Home,
  about: User,
  skills: Cpu,
  career: Briefcase,
  projects: FolderGit2,
  certificates: Award,
  services: Code2,
  contact: Mail,
};

export function SidebarNav() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const activeSection = useActiveSection(PORTFOLIO_SECTIONS, 'home');

  const scrollToSection = (id: PortfolioSectionId) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Desktop Left Spatial Sidebar (inspired by metal-oopa) */}
      <aside
        aria-label="Primary Sidebar Navigation"
        className="fixed top-0 left-0 z-40 hidden h-screen w-20 flex-col items-center justify-between border-r border-[var(--ui-border)] bg-[var(--ui-surface)]/90 py-6 backdrop-blur-xl lg:flex"
      >
        {/* Brand Monogram */}
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="group flex flex-col items-center focus:outline-none"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--ui-accent)]/50 bg-[var(--ui-accent)]/10 font-mono text-lg font-black text-[var(--ui-accent)] shadow-[0_0_20px_-4px_var(--ui-accent-glow)] transition-transform duration-300 group-hover:scale-105">
            {DEVELOPER_PROFILE.initials}
          </div>
        </button>

        {/* Section Icons */}
        <nav className="flex flex-col items-center gap-2">
          {PORTFOLIO_SECTIONS.map((sectionId) => {
            const Icon = SECTION_ICONS[sectionId];
            const isActive = activeSection === sectionId;
            const label = t(sectionId);

            return (
              <button
                key={sectionId}
                type="button"
                onClick={() => scrollToSection(sectionId)}
                aria-label={label}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-[var(--ui-accent)]/15 text-[var(--ui-accent)] shadow-[0_0_16px_-4px_var(--ui-accent-glow)]'
                    : 'text-[var(--ui-text-muted)] hover:bg-[var(--ui-surface-elevated)] hover:text-[var(--ui-text-primary)]'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[var(--ui-accent)]" />
                )}
                <Icon className="h-5 w-5" />
                <span className="pointer-events-none absolute left-14 z-50 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-surface)] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[var(--ui-text-primary)] opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Resume Download Quick Action */}
        <div className="flex flex-col items-center gap-3">
          <a
            href={DEVELOPER_PROFILE.cvPdfPath}
            download
            title={tCommon('downloadCV')}
            aria-label={tCommon('downloadCV')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)] text-[var(--ui-text-secondary)] transition-colors hover:border-[var(--ui-accent)] hover:text-[var(--ui-accent)]"
          >
            <FileDown className="h-4 w-4" />
          </a>
        </div>
      </aside>

      {/* Mobile Bottom Floating Dock */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="fixed right-3 bottom-3 left-3 z-40 flex items-center justify-around rounded-2xl border border-[var(--ui-border)] bg-[var(--ui-surface)]/95 px-2 py-2 shadow-2xl backdrop-blur-xl lg:hidden"
      >
        {PORTFOLIO_SECTIONS.map((sectionId) => {
          const Icon = SECTION_ICONS[sectionId];
          const isActive = activeSection === sectionId;

          return (
            <button
              key={sectionId}
              type="button"
              onClick={() => scrollToSection(sectionId)}
              aria-label={t(sectionId)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                isActive
                  ? 'bg-[var(--ui-accent)] text-white shadow-sm'
                  : 'text-[var(--ui-text-muted)] hover:text-[var(--ui-text-primary)]'
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </nav>
    </>
  );
}
