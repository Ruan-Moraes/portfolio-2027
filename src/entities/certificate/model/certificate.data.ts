import { z } from 'zod';
import snapshot from './certificates.snapshot.json';

const certificateSchema = z.object({
  name: z.string().trim().min(1),
  endDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$/),
  platform: z.string().trim().min(1),
  credentialUrl: z.string().url().refine((url) => url.startsWith('https://')),
  credentialId: z.string().trim().min(1).optional(),
});

export type CertificateRecord = z.infer<typeof certificateSchema>;
export type CertificateItem = CertificateRecord & { id: string };

export function parseCertificates(value: unknown): CertificateItem[] {
  const records = z.array(certificateSchema).min(1).parse(value);
  const unique = new Map<string, CertificateItem>();

  for (const record of records) {
    const identifier = record.credentialId ?? record.credentialUrl.replace(/\/$/, '');
    const id = `${record.platform}:${identifier}`;
    if (!unique.has(id)) unique.set(id, { ...record, id });
  }

  const dateKey = ({ endDate }: CertificateItem) => endDate.slice(3) + endDate.slice(0, 2);
  return [...unique.values()].sort((a, b) => dateKey(b).localeCompare(dateKey(a)));
}

export const FALLBACK_CERTIFICATES = parseCertificates(snapshot);
