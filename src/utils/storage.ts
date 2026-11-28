export const STORAGE_KEYS = {
  AUTH: 'skillmap_user_auth_v1',
  TOKEN: 'skillmap_auth_token_v1',
  PROFILE: 'skillmap_user_profile_v2',
  FAVORITES: 'skillmap_user_favorites_v2',
  ROADMAP_NODES: 'skillmap_frontend_nodes_v3',
  COMPLETED_PROJECTS: 'skillmap_completed_projects_v1',
} as const;

function notifyStorageSync(key: string): void {
  window.dispatchEvent(new Event('skillmap-storage-sync'));
  if (key === STORAGE_KEYS.AUTH) {
    window.dispatchEvent(new Event('auth-changed'));
  }
}

/**
 * Безопасное чтение и парсинг данных из localStorage
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Безопасная запись данных в localStorage с защитой от QuotaExceededError
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    notifyStorageSync(key);
    return true;
  } catch {
    // Безопасный перехват QuotaExceededError и приватных режимов
    return false;
  }
}

/**
 * Безопасное удаление ключа из localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.removeItem(key);
    notifyStorageSync(key);
    return true;
  } catch {
    return false;
  }
}

export function getAuthToken(): string | null {
  const token = getStorageItem<string | null>(STORAGE_KEYS.TOKEN, null);
  return typeof token === 'string' && token.length > 0 ? token : null;
}

export function setAuthToken(token: string | null): boolean {
  if (!token) {
    return removeStorageItem(STORAGE_KEYS.TOKEN);
  }
  return setStorageItem(STORAGE_KEYS.TOKEN, token);
}
