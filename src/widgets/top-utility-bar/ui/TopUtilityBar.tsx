'use client';

import { AmbientSoundbar } from '@/features/play-ambient-sound';
import { CommandPaletteTrigger } from '@/features/open-command-palette';
import { LanguageSwitcher } from '@/features/switch-language';
import { ThemeQuickControls } from '@/features/switch-theme';
import { CodeTag } from '@/shared/ui';

export function TopUtilityBar() {
  return (
    <header className="sticky top-0 z-30 mx-auto flex max-w-[82rem] items-start justify-between px-4 py-3 sm:px-8 lg:pr-12 lg:pl-28">
      <div className="flex flex-col leading-tight">
        <CodeTag tag="html" />
        <CodeTag tag="body" className="ml-4 sm:ml-6" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AmbientSoundbar />
        <CommandPaletteTrigger />
        <LanguageSwitcher />
        <ThemeQuickControls />
      </div>
    </header>
  );
}
