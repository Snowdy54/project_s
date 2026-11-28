import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MiniRoadmapPreview } from '../home/MiniRoadmapPreview';
import { computeEdgePath } from '../../utils/roadmapEdges';
import { RoadmapHeader } from './RoadmapHeader';
import { RoadmapFooterRecommendations } from './RoadmapFooterRecommendations';
import { initialFrontendNodes, frontendDirectionInfo } from '../../data/frontendRoadmapData';
import { resolveRoadmapTrack } from '../../data/roadmapTracks';
import { ProjectDetailPage } from '../../pages/Projects/ProjectDetail';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Roadmap, Home Mini-Map & Project CTA Fixes', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it('MiniRoadmapPreview renders 3 clickable nodes and cycles status on click', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <MiniRoadmapPreview />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('HTML5 & Семантика');
    expect(container.textContent).toContain('JavaScript Основы');
    expect(container.textContent).toContain('React Основы');
    expect(container.textContent).toContain('33%');

    const jsButton = container.querySelector(
      'button[aria-label^="Узел JavaScript Основы"]'
    ) as HTMLButtonElement;
    expect(jsButton).not.toBeNull();

    await act(async () => {
      jsButton.click();
    });

    // in_progress -> completed, progress jumps from 33% to 67%
    expect(container.textContent).toContain('67%');
  });

  it('computeEdgePath curves around intermediate nodes on flat horizontal jumps', () => {
    const jsEs6 = initialFrontendNodes.find((n) => n.id === 'js-es6')!;
    const tsBasics = initialFrontendNodes.find((n) => n.id === 'ts-basics')!;
    const stylingReact = initialFrontendNodes.find((n) => n.id === 'styling-react')!;

    expect(stylingReact.labelPosition).toBe('top');

    const path = computeEdgePath(jsEs6, tsBasics, initialFrontendNodes);
    expect(path.startsWith(`M ${jsEs6.x} ${jsEs6.y} C `)).toBe(true);
    // Control points must arch away from y=507 so it does not slice straight across neighbors
    expect(path).not.toContain(`${jsEs6.y},`);
  });

  it('RoadmapHeader renders non-clickable auth badge and clickable related links', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <RoadmapHeader
            directionInfo={frontendDirectionInfo}
            isAuthorized={false}
          />
        </MemoryRouter>
      );
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    const guestBadgeAsButton = buttons.find((b) =>
      b.textContent?.includes('Гость (без входа)')
    );
    expect(guestBadgeAsButton).toBeUndefined();
    expect(container.textContent).toContain('Гость (без входа)');

    const relatedToggle = buttons.find((b) =>
      b.textContent?.includes('Связанные направления')
    ) as HTMLButtonElement;
    await act(async () => {
      relatedToggle.click();
    });

    const uiUxLink = container.querySelector('a[href="/roadmap/ui-ux"]');
    const backendLink = container.querySelector('a[href="/roadmap/backend-node"]');
    expect(uiUxLink).not.toBeNull();
    expect(backendLink).not.toBeNull();
  });

  it('RoadmapFooterRecommendations and resolveRoadmapTrack link to distinct tracks', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <RoadmapFooterRecommendations />
        </MemoryRouter>
      );
    });

    expect(container.querySelector('a[href="/roadmap/fullstack"]')).not.toBeNull();
    expect(container.querySelector('a[href="/roadmap/architecture"]')).not.toBeNull();
    expect(container.querySelector('a[href="/roadmap/mobile"]')).not.toBeNull();

    expect(resolveRoadmapTrack('backend').backendId).toBe(2);
    expect(resolveRoadmapTrack('ui-ux').info.title).toBe('UI/UX Дизайн');
    expect(resolveRoadmapTrack(undefined).id).toBe('frontend');
  });

  it('ProjectDetailPage toggles CTA from start-guide to persistent project completion', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/projects/task-tracker-cli']}>
          <Routes>
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Трекер задач');
    // В Happy-DOM rect.top=0 -> пользователь в секции руководства, доступна кнопка завершения
    const ctaBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Отметить выполненным')
    ) as HTMLButtonElement;
    expect(ctaBtn).toBeDefined();

    await act(async () => {
      ctaBtn.click();
    });

    expect(container.textContent).toContain('Проект выполнен ✓');

    // Проверяем до скролла к гайду (rect.top = 1200)
    const guideEl = document.getElementById('step-by-step-guide');
    if (guideEl) {
      guideEl.getBoundingClientRect = () =>
        ({ top: 1200, bottom: 1300, left: 0, right: 0, width: 100, height: 100, x: 0, y: 1200, toJSON: () => ({}) });
      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
      });
      expect(container.textContent).toContain('Приступить к выполнению');
    }
  });
});
