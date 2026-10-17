import { describe, expect, it } from 'vitest';
import { CAREER_ENTRIES } from './career.data';

describe('career-entry entity', () => {
  it('includes work experience (CAPYS), academic entry (UNINTER), and milestones', () => {
    const workEntries = CAREER_ENTRIES.filter((e) => e.type === 'work');
    const educationEntries = CAREER_ENTRIES.filter((e) => e.type === 'education');
    const milestoneEntries = CAREER_ENTRIES.filter((e) => e.type === 'milestone');

    expect(workEntries.length).toBeGreaterThanOrEqual(1);
    expect(educationEntries.length).toBeGreaterThanOrEqual(1);
    expect(milestoneEntries.length).toBeGreaterThanOrEqual(3);
    expect(CAREER_ENTRIES.some((e) => e.id === 'capys')).toBe(true);
    expect(CAREER_ENTRIES.some((e) => e.id === 'uninter')).toBe(true);
  });
});
