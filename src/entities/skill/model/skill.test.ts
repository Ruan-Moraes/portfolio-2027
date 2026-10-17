import { describe, expect, it } from 'vitest';
import { SKILLS_DATA, SKILL_CATEGORIES, CUBE_FACES_TECH } from './skill.data';

describe('skill entity', () => {
  it('covers all 10 skill categories from the resume and 6 3D cube faces', () => {
    expect(SKILL_CATEGORIES).toHaveLength(10);
    expect(CUBE_FACES_TECH).toHaveLength(6);
    expect(SKILLS_DATA.length).toBeGreaterThanOrEqual(35);

    for (const skill of SKILLS_DATA) {
      expect(SKILL_CATEGORIES).toContain(skill.category);
      expect(skill.name.length).toBeGreaterThan(0);
    }
  });
});
