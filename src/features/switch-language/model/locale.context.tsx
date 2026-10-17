'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/shared/config';
import enUSMessages from '../../../../messages/en-US.json';
import esESMessages from '../../../../messages/es-ES.json';
import ptBRMessages from '../../../../messages/pt-BR.json';

const MESSAGES_BY_LOCALE: Record<SupportedLocale, AbstractIntlMessages> = {
  'pt-BR': ptBRMessages as unknown as AbstractIntlMessages,
  'en-US': enUSMessages as unknown as AbstractIntlMessages,
  'es-ES': esESMessages as unknown as AbstractIntlMessages,
};

interface PortfolioLocaleContextValue {
  locale: SupportedLocale;
  setLocale: (nextLocale: SupportedLocale) => void;
}

const PortfolioLocaleContext = createContext<PortfolioLocaleContextValue | null>(
  null
);

interface PortfolioLocaleProviderProps {
  initialLocale: SupportedLocale;
  children: ReactNode;
}

export function PortfolioLocaleProvider({
  initialLocale,
  children,
}: PortfolioLocaleProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  const setLocale = useCallback((nextLocale: SupportedLocale) => {
    if (!SUPPORTED_LOCALES.includes(nextLocale)) return;

    setLocaleState((prev) => {
      if (prev === nextLocale) return prev;
      return nextLocale;
    });

    if (typeof window !== 'undefined') {
      document.documentElement.lang = nextLocale;

      const seoSection = (
        MESSAGES_BY_LOCALE[nextLocale] as Record<string, { title?: string }>
      )?.seo;
      if (seoSection?.title) {
        document.title = seoSection.title;
      }

      // Update the URL path in-place without triggering a Next.js route remount
      const { pathname, search, hash } = window.location;
      const segments = pathname.split('/').filter(Boolean);
      if (
        segments.length > 0 &&
        SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)
      ) {
        segments[0] = nextLocale;
      } else {
        segments.unshift(nextLocale);
      }
      const nextUrl = `/${segments.join('/')}${search}${hash}`;
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  }, []);

  // Keep state synced if user navigates with browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const urlLocale = segments[0] as SupportedLocale | undefined;
      if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) {
        setLocaleState(urlLocale);
        document.documentElement.lang = urlLocale;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const contextValue = useMemo(
    () => ({ locale, setLocale }),
    [locale, setLocale]
  );

  return (
    <PortfolioLocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES_BY_LOCALE[locale]}
        timeZone="America/Sao_Paulo"
      >
        {children}
      </NextIntlClientProvider>
    </PortfolioLocaleContext.Provider>
  );
}

export function usePortfolioLocale(): PortfolioLocaleContextValue {
  const context = useContext(PortfolioLocaleContext);
  if (!context) {
    throw new Error(
      'usePortfolioLocale must be used within a PortfolioLocaleProvider'
    );
  }
  return context;
}
