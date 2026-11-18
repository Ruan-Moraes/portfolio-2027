import { setRequestLocale } from 'next-intl/server';
import { getCertificates } from '@/entities/certificate';
import { PortfolioHomeView } from '@/views/portfolio-home';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const certificates = await getCertificates();

  return <PortfolioHomeView certificates={certificates} />;
}
