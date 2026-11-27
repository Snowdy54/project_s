import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AboutPage } from '../../pages/About';
import { STORAGE_KEYS, setStorageItem } from '../../utils/storage';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Layout & Auth Synchronization UI Integration', () => {
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

  it('synchronizes Navbar auth state dynamically on STORAGE_KEYS.AUTH updates', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/roadmap']}>
          <Navbar />
        </MemoryRouter>
      );
    });

    expect(container.querySelector('a[href="/profile"]')).not.toBeNull();
    expect(container.querySelector('a[href="/login"]')).toBeNull();

    // Имитация выхода из профиля
    await act(async () => {
      setStorageItem(STORAGE_KEYS.AUTH, false);
    });

    expect(container.querySelector('a[href="/login"]')).not.toBeNull();
    expect(container.querySelector('a[href="/profile"]')).toBeNull();

    // Имитация входа через модалку RoadmapPage (setStorageItem без ручного auth-changed)
    await act(async () => {
      setStorageItem(STORAGE_KEYS.AUTH, true);
    });

    expect(container.querySelector('a[href="/profile"]')).not.toBeNull();
    expect(container.querySelector('a[href="/login"]')).toBeNull();
  });

  it('renders Footer with correct MySkill branding and mailto link', async () => {
    await act(async () => {
      root.render(<Footer />);
    });

    const mailLink = container.querySelector('a[href^="mailto:"]');
    expect(mailLink).not.toBeNull();
    expect(mailLink?.getAttribute('href')).toBe('mailto:roadmaps@myskill.com');
    expect(mailLink?.textContent).toBe('roadmaps@myskill.com');
    expect(container.textContent).toContain('MySkill');
  });

  it('renders AboutPage cleanly inside Router', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('О проекте SkillMap');
  });
});
