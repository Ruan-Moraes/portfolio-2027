import { describe, expect, it } from 'vitest';
import { DEVELOPER_PROFILE } from './profile.data';

describe('developer-profile entity', () => {
  it('contains verified developer profile data for Ruan Moraes', () => {
    expect(DEVELOPER_PROFILE.fullName).toBe('Ruan Moraes Santos Barbosa');
    expect(DEVELOPER_PROFILE.githubUsername).toBe('Ruan-Moraes');
    expect(DEVELOPER_PROFILE.location.coordinates[0]).toBeCloseTo(-19.9191, 3);
    expect(DEVELOPER_PROFILE.location.coordinates[1]).toBeCloseTo(-43.9386, 3);
    expect(DEVELOPER_PROFILE.socialLinks.length).toBeGreaterThanOrEqual(4);
  });
});
