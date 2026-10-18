import { describe, expect, it } from 'vitest';
import ptBR from '../../../messages/pt-BR.json';
import enUS from '../../../messages/en-US.json';
import esES from '../../../messages/es-ES.json';

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value as Record<string, unknown>, path);
    }

    return [path];
  });
}

describe('i18n dictionaries parity (pt-BR, en-US, es-ES)', () => {
  const ptKeys = flattenKeys(ptBR).sort();
  const enKeys = flattenKeys(enUS).sort();
  const esKeys = flattenKeys(esES).sort();

  it('has identical translation keys between pt-BR and en-US', () => {
    expect(enKeys).toEqual(ptKeys);
  });

  it('has identical translation keys between pt-BR and es-ES', () => {
    expect(esKeys).toEqual(ptKeys);
  });

  it('has no empty string values in any locale dictionary', () => {
    const checkNoEmptyStrings = (obj: Record<string, unknown>, locale: string, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
          expect(value.trim().length, `${locale}:${path} should not be empty`).toBeGreaterThan(0);
        } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          checkNoEmptyStrings(value as Record<string, unknown>, locale, path);
        }
      }
    };

    checkNoEmptyStrings(ptBR, 'pt-BR');
    checkNoEmptyStrings(enUS, 'en-US');
    checkNoEmptyStrings(esES, 'es-ES');
  });
});
