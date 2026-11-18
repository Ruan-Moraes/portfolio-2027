import { describe, expect, it } from 'vitest';
import { SKILLS_DATA, SKILL_CATEGORIES, CUBE_FACES_TECH } from './skill.data';

describe('skill entity', () => {
  it('covers every declared skill category and 6 3D cube faces', () => {
    expect(CUBE_FACES_TECH).toHaveLength(6);
    expect(new Set(SKILLS_DATA.map((skill) => skill.category))).toEqual(
      new Set(SKILL_CATEGORIES)
    );

    for (const skill of SKILLS_DATA) {
      expect(SKILL_CATEGORIES).toContain(skill.category);
      expect(skill.name.length).toBeGreaterThan(0);
    }
  });

  it('lists Azure and native mobile languages under studies', () => {
    for (const name of ['Microsoft Azure', 'Kotlin', 'Swift']) {
      expect(SKILLS_DATA.filter((skill) => skill.name === name)).toEqual([
        { name, category: 'studies' },
      ]);
    }
  });
});
