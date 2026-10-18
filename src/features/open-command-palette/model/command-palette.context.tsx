'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface CommandPaletteContextValue {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null
);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const isOpenRef = useRef(false);

  const openPalette = useCallback(() => {
    isOpenRef.current = true;

    setIsOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    if (!isOpenRef.current) return;

    isOpenRef.current = false;

    setIsOpen(false);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;

      isOpenRef.current = next;

      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();

        togglePalette();
      } else if (event.key === 'Escape' && isOpenRef.current) {
        closePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePalette, closePalette]);

  const value = useMemo(
    () => ({ isOpen, openPalette, closePalette, togglePalette }),
    [isOpen, openPalette, closePalette, togglePalette]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error(
      'useCommandPalette must be used within a CommandPaletteProvider'
    );
  }

  return context;
}
