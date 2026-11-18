import { FALLBACK_CERTIFICATES, parseCertificates } from '../model/certificate.data';

const DEFAULT_ENDPOINT = 'https://db-json-ruan-moraes-projects.vercel.app/certificates';

export async function getCertificates() {
  try {
    const response = await fetch(process.env.CERTIFICATES_API_URL?.trim() || DEFAULT_ENDPOINT, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseCertificates(await response.json());
  } catch (error) {
    console.warn('Using the certificate snapshot because the API could not be loaded.', error);
    return FALLBACK_CERTIFICATES;
  }
}
