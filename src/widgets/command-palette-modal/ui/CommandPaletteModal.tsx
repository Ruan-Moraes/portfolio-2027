'use client';

import dynamic from 'next/dynamic';
import { useCommandPalette } from '@/features/open-command-palette';

const LazyCommandPaletteDialog = dynamic(
  () =>
    import('./CommandPaletteDialog').then((mod) => mod.CommandPaletteDialog),
  { ssr: false }
);

export function CommandPaletteModal() {
  const { isOpen } = useCommandPalette();

  if (!isOpen) return null;

  return <LazyCommandPaletteDialog />;
}
