export const STORAGE_KEYS = {
  AUTH: 'skillmap_user_auth_v1',
  PROFILE: 'skillmap_user_profile_v2',
  FAVORITES: 'skillmap_user_favorites_v1',
  ROADMAP_NODES: 'skillmap_frontend_nodes_v3',
} as const;

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
    // Оповещение подписчиков о локальном изменении
    window.dispatchEvent(new Event('skillmap-storage-sync'));
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
    window.dispatchEvent(new Event('skillmap-storage-sync'));
    return true;
  } catch {
    return false;
  }
}
