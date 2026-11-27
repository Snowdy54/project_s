import { describe, it, expect } from 'vitest';
import {
  defaultUserProfile,
  initialStartedMaps,
  initialFavoriteMaps,
  achievementsCatalog,
} from './achievementsData';

describe('Profile & Achievements Data Integrity', () => {
  it('provides a valid default user profile without forbidden quotes in nickname', () => {
    expect(defaultUserProfile.nickname.trim().length).toBeGreaterThan(0);
    expect(/[«»”]/.test(defaultUserProfile.nickname)).toBe(false);
    expect(defaultUserProfile.links).toEqual({
      github: '',
      vk: '',
      telegram: '',
      website: '',
    });
  });

  it('contains valid started and favorite maps with 0..100 progress bounds', () => {
    const allMaps = [...initialStartedMaps, ...initialFavoriteMaps];
    expect(allMaps.length).toBeGreaterThan(0);

    for (const map of allMaps) {
      expect(map.id).toBeTruthy();
      expect(map.title).toBeTruthy();
      expect(map.path.startsWith('/')).toBe(true);
      expect(map.progress).toBeGreaterThanOrEqual(0);
      expect(map.progress).toBeLessThanOrEqual(100);
    }
  });

  it('contains unique achievement IDs, valid types, and calculates total XP accurately', () => {
    const ids = new Set(achievementsCatalog.map((a) => a.id));
    expect(ids.size).toBe(achievementsCatalog.length);

    let totalPoints = 0;
    for (const ach of achievementsCatalog) {
      expect(ach.title).toBeTruthy();
      expect(ach.condition).toBeTruthy();
      expect(['unique', 'repeatable']).toContain(ach.type);
      expect(ach.points).toBeGreaterThan(0);
      expect(ach.unlockedCount).toBeGreaterThanOrEqual(0);
      if (ach.type === 'unique') {
        expect(ach.unlockedCount).toBeLessThanOrEqual(1);
      }
      totalPoints += ach.points * ach.unlockedCount;
    }

    expect(totalPoints).toBeGreaterThan(0);
  });
});
