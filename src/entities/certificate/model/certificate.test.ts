import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCertificates } from '../api/get-certificates';
import { FALLBACK_CERTIFICATES } from './certificate.data';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('certificate feed', () => {
  it('uses the published records and distinguishes credentials that share a verification URL', async () => {
    const records = FALLBACK_CERTIFICATES.filter((c) => c.platform === 'Estudonauta').slice(0, 2);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json([...records, records[0]])));
    expect(await getCertificates()).toEqual(records);
    expect(records[0].credentialUrl).toBe(records[1].credentialUrl);
    expect(records[0].id).not.toBe(records[1].id);
  });

  it('keeps the complete catalogue available if the API returns an invalid response', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'Unavailable' })));
    expect(await getCertificates()).toBe(FALLBACK_CERTIFICATES);
    expect(FALLBACK_CERTIFICATES).toHaveLength(40);
  });
});
