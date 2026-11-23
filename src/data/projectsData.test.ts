import { describe, it, expect } from 'vitest';
import { backendProjectsData } from './projectsData';

describe('Projects and Exercise Data Integrity', () => {
  it('contains valid backend projects with required fields', () => {
    expect(backendProjectsData.length).toBeGreaterThan(0);

    for (const project of backendProjectsData) {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.estimatedTime).toBeTruthy();
      expect(['beginner', 'advanced', 'deep']).toContain(project.difficulty);
      expect(project.content).toBeInstanceOf(Array);
      expect(project.content.length).toBeGreaterThan(0);
    }
  });

  it('contains step-by-step-guide heading in all project guides', () => {
    for (const project of backendProjectsData) {
      const guideBlock = project.content.find(
        (b) => b.type === 'heading' && b.id === 'step-by-step-guide'
      );
      expect(guideBlock).toBeDefined();
    }
  });

  it('correctly filters projects by difficulty levels', () => {
    const beginnerProjects = backendProjectsData.filter(
      (p) => p.difficulty === 'beginner'
    );
    const advancedProjects = backendProjectsData.filter(
      (p) => p.difficulty === 'advanced'
    );
    const deepProjects = backendProjectsData.filter(
      (p) => p.difficulty === 'deep'
    );

    expect(beginnerProjects.length + advancedProjects.length + deepProjects.length).toBe(
      backendProjectsData.length
    );
  });
});
