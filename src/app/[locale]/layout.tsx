import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, La_Belle_Aurore } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/shared/config';
import { routing } from '@/shared/i18n';
import { AppProviders } from '../providers/AppProviders';
import '../styles/globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const fontScript = La_Belle_Aurore({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: 'seo' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [
      {
        name: DEVELOPER_PROFILE.fullName,
        url: DEVELOPER_PROFILE.githubUrl,
      },
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: validLocale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} ${fontScript.variable}`}
    >
      <body className="antialiased">
        <AppProviders initialLocale={locale as SupportedLocale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
