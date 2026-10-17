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

const messageCache = new Map<SupportedLocale, AbstractIntlMessages>();

async function loadLocaleMessages(
  targetLocale: SupportedLocale
): Promise<AbstractIntlMessages> {
  const cached = messageCache.get(targetLocale);
  if (cached) return cached;

  let loaded: AbstractIntlMessages;
  switch (targetLocale) {
    case 'en-US':
      loaded = (await import('../../../../messages/en-US.json'))
        .default as unknown as AbstractIntlMessages;
      break;
    case 'es-ES':
      loaded = (await import('../../../../messages/es-ES.json'))
        .default as unknown as AbstractIntlMessages;
      break;
    case 'pt-BR':
    default:
      loaded = (await import('../../../../messages/pt-BR.json'))
        .default as unknown as AbstractIntlMessages;
      break;
  }

  messageCache.set(targetLocale, loaded);
  return loaded;
}

interface PortfolioLocaleContextValue {
  locale: SupportedLocale;
  setLocale: (nextLocale: SupportedLocale) => void;
}

const PortfolioLocaleContext = createContext<PortfolioLocaleContextValue | null>(
  null
);

interface PortfolioLocaleProviderProps {
  initialLocale: SupportedLocale;
  initialMessages?: AbstractIntlMessages;
  children: ReactNode;
}

export function PortfolioLocaleProvider({
  initialLocale,
  initialMessages,
  children,
}: PortfolioLocaleProviderProps) {
  if (initialMessages && !messageCache.has(initialLocale)) {
    messageCache.set(initialLocale, initialMessages);
  }

  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);
  const [messages, setMessages] = useState<AbstractIntlMessages | undefined>(
    () => initialMessages ?? messageCache.get(initialLocale)
  );

  // Warm the remaining locale dictionaries during browser idle time so switching is 0ms
  useEffect(() => {
    const warmOtherLocales = () => {
      SUPPORTED_LOCALES.forEach((loc) => {
        if (!messageCache.has(loc)) {
          void loadLocaleMessages(loc);
        }
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(warmOtherLocales, {
        timeout: 2000,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timerId = globalThis.setTimeout(warmOtherLocales, 300);
    return () => globalThis.clearTimeout(timerId);
  }, []);

  const applyBrowserLocaleMetadata = useCallback(
    (nextLocale: SupportedLocale, dict: AbstractIntlMessages) => {
      if (typeof window === 'undefined') return;
      document.documentElement.lang = nextLocale;

      const seoSection = (dict as Record<string, { title?: string }>)?.seo;
      if (seoSection?.title) {
        document.title = seoSection.title;
      }

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
    },
    []
  );

  const setLocale = useCallback(
    (nextLocale: SupportedLocale) => {
      if (!SUPPORTED_LOCALES.includes(nextLocale)) return;

      const cached = messageCache.get(nextLocale);
      if (cached) {
        setLocaleState(nextLocale);
        setMessages(cached);
        applyBrowserLocaleMetadata(nextLocale, cached);
        return;
      }

      void loadLocaleMessages(nextLocale).then((loaded) => {
        setLocaleState(nextLocale);
        setMessages(loaded);
        applyBrowserLocaleMetadata(nextLocale, loaded);
      });
    },
    [applyBrowserLocaleMetadata]
  );

  // Keep state synced if user navigates with browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const urlLocale = segments[0] as SupportedLocale | undefined;
      if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) {
        void loadLocaleMessages(urlLocale).then((loaded) => {
          setLocaleState(urlLocale);
          setMessages(loaded);
          document.documentElement.lang = urlLocale;
        });
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
        messages={messages}
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
