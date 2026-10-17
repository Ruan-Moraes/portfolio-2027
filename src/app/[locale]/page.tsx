import { setRequestLocale } from 'next-intl/server';
import { PortfolioHomeView } from '@/views/portfolio-home';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortfolioHomeView />;
}
