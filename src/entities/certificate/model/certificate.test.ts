import { describe, expect, it } from 'vitest';
import { CERTIFICATES_DATA } from './certificate.data';

describe('certificate entity', () => {
  it('includes all 13 verified certificates with unique IDs', () => {
    expect(CERTIFICATES_DATA).toHaveLength(13);
    const ids = new Set(CERTIFICATES_DATA.map((c) => c.id));
    expect(ids.size).toBe(13);
  });
});
