import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from './storage';

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns fallback when key does not exist', () => {
    const value = getStorageItem('non_existent_key', 'default_value');
    expect(value).toBe('default_value');
  });

  it('safely saves and retrieves primitives and complex objects', () => {
    setStorageItem(STORAGE_KEYS.AUTH, true);
    expect(getStorageItem(STORAGE_KEYS.AUTH, false)).toBe(true);

    const testProfile = {
      nickname: 'Тестовый Пользователь',
      email: 'test@skillmap.ru',
      phone: '+79991234567',
    };
    setStorageItem(STORAGE_KEYS.PROFILE, testProfile);

    const retrieved = getStorageItem(STORAGE_KEYS.PROFILE, null);
    expect(retrieved).toEqual(testProfile);
  });

  it('gracefully handles corrupted JSON in localStorage without throwing', () => {
    localStorage.setItem('corrupted_key', 'invalid-json-{missing-bracket');
    const value = getStorageItem('corrupted_key', { fallback: true });
    expect(value).toEqual({ fallback: true });
  });

  it('removes items correctly', () => {
    setStorageItem('key_to_remove', 12345);
    expect(getStorageItem('key_to_remove', null)).toBe(12345);

    removeStorageItem('key_to_remove');
    expect(getStorageItem('key_to_remove', null)).toBeNull();
  });

  it('dispatches sync and auth-changed events on set and remove', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    setStorageItem(STORAGE_KEYS.PROFILE, { nickname: 'Test' });
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.mock.calls[0][0].type).toBe('skillmap-storage-sync');

    dispatchSpy.mockClear();
    setStorageItem(STORAGE_KEYS.AUTH, true);
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy.mock.calls.map((c) => c[0].type)).toEqual([
      'skillmap-storage-sync',
      'auth-changed',
    ]);

    dispatchSpy.mockClear();
    removeStorageItem(STORAGE_KEYS.AUTH);
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy.mock.calls.map((c) => c[0].type)).toEqual([
      'skillmap-storage-sync',
      'auth-changed',
    ]);
  });

  it('does not throw when localStorage throws QuotaExceededError', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const success = setStorageItem('heavy_data', 'large_string');
    expect(success).toBe(false);
  });
});
