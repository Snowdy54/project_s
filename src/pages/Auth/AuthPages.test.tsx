import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ProfilePage } from '../Profile';
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  getAuthToken,
} from '../../utils/storage';
import type { UserProfileData } from '../../types/profile';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  );
  descriptor?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('Auth & Profile UI Integration', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
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

  it('validates LoginPage fields and authorizes via /api/auth/login', async () => {
    setStorageItem(STORAGE_KEYS.AUTH, false);

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.endsWith('/auth/login')) {
        return new Response(
          JSON.stringify({ token: 'jwt-test-token', user_id: 1, nickname: 'Tester' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<div data-testid="profile-ok">Profile</div>} />
          </Routes>
        </MemoryRouter>
      );
    });

    const form = container.querySelector('form')!;
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Введите Email или телефон.');
    expect(container.textContent).toContain('Введите пароль.');
    expect(getStorageItem(STORAGE_KEYS.AUTH, false)).toBe(false);

    const loginInput = container.querySelector('#login-contact') as HTMLInputElement;
    const passInput = container.querySelector('#login-password') as HTMLInputElement;

    await act(async () => {
      setNativeInputValue(loginInput, 'user@myskill.ru');
      setNativeInputValue(passInput, 'secret123');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(getStorageItem(STORAGE_KEYS.AUTH, false)).toBe(true);
    expect(getAuthToken()).toBe('jwt-test-token');
    expect(container.querySelector('[data-testid="profile-ok"]')).not.toBeNull();
  });

  it('validates RegisterPage rules and stores new user profile via /api/auth/register', async () => {
    setStorageItem(STORAGE_KEYS.AUTH, false);

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.endsWith('/auth/register')) {
        return new Response(
          JSON.stringify({ token: 'jwt-reg-token', user_id: 2, nickname: 'Иван Петров' }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<div data-testid="profile-ok">Profile</div>} />
          </Routes>
        </MemoryRouter>
      );
    });

    const nameInput = container.querySelector('#reg-name') as HTMLInputElement;
    const contactInput = container.querySelector('#reg-contact') as HTMLInputElement;
    const passInput = container.querySelector('#reg-password') as HTMLInputElement;
    const form = container.querySelector('form')!;

    await act(async () => {
      setNativeInputValue(nameInput, 'Иван «Тест»');
      setNativeInputValue(contactInput, 'bad-contact');
      setNativeInputValue(passInput, '123456');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Введите корректное имя');
    expect(container.textContent).toContain('Введите корректный Email или телефон');
    expect(getStorageItem(STORAGE_KEYS.AUTH, false)).toBe(false);

    await act(async () => {
      setNativeInputValue(nameInput, 'Иван Петров');
      setNativeInputValue(contactInput, 'ivan@myskill.ru');
      setNativeInputValue(passInput, '123456');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await Promise.resolve();
      await Promise.resolve();
    });

    const saved = getStorageItem<UserProfileData | null>(STORAGE_KEYS.PROFILE, null);
    expect(saved).not.toBeNull();
    expect(saved?.nickname).toBe('Иван Петров');
    expect(saved?.email).toBe('ivan@myskill.ru');
    expect(saved?.phone).toBe('');
    expect(getAuthToken()).toBe('jwt-reg-token');
    expect(getStorageItem(STORAGE_KEYS.AUTH, false)).toBe(true);
    expect(container.querySelector('[data-testid="profile-ok"]')).not.toBeNull();
  });

  it('redirects unauthorized users from ProfilePage to /login', async () => {
    setStorageItem(STORAGE_KEYS.AUTH, false);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<div data-testid="login-redirect">Login</div>} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(container.querySelector('[data-testid="login-redirect"]')).not.toBeNull();
  });

  it('renders ProfilePage tabs (Activity, Profile, Achievements) for authorized user', async () => {
    setStorageItem(STORAGE_KEYS.AUTH, true);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Избранные карты');
    expect(container.textContent).toContain('Ваши карты');

    const buttons = Array.from(container.querySelectorAll('aside nav button'));
    const profileTabBtn = buttons.find((b) => b.textContent?.includes('Профиль')) as HTMLButtonElement;
    const achievementsTabBtn = buttons.find((b) => b.textContent?.includes('Достижения')) as HTMLButtonElement;

    await act(async () => {
      profileTabBtn.click();
    });
    expect(container.textContent).toContain('Основная информация');
    expect(container.querySelector('#profile-nickname')).not.toBeNull();

    await act(async () => {
      achievementsTabBtn.click();
    });
    expect(container.textContent).toContain('Ваши достижения:');
    expect(container.textContent).toContain('Каталог достижений:');
  });
});
