/**
 * Safe storage utility that wraps localStorage/sessionStorage with error handling
 * and provides an in-memory fallback for restricted environments (e.g., iframes).
 */

type StorageType = 'local' | 'session';

// In-memory fallback storage
const memoryStorage = new Map<string, string>();

function getStorage(type: StorageType): Storage | null {
  try {
    const storage = type === 'local' ? localStorage : sessionStorage;
    // Test if we can actually use it
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

export function safeGetItem(key: string, type: StorageType = 'local'): string | null {
  try {
    const storage = getStorage(type);
    if (storage) {
      return storage.getItem(key);
    }
    // Fallback to memory storage
    return memoryStorage.get(`${type}:${key}`) ?? null;
  } catch {
    return memoryStorage.get(`${type}:${key}`) ?? null;
  }
}

export function safeSetItem(key: string, value: string, type: StorageType = 'local'): boolean {
  try {
    const storage = getStorage(type);
    if (storage) {
      storage.setItem(key, value);
      return true;
    }
    // Fallback to memory storage
    memoryStorage.set(`${type}:${key}`, value);
    return true;
  } catch {
    // Even memory storage failed, but don't throw
    memoryStorage.set(`${type}:${key}`, value);
    return false;
  }
}

export function safeRemoveItem(key: string, type: StorageType = 'local'): void {
  try {
    const storage = getStorage(type);
    if (storage) {
      storage.removeItem(key);
    }
    memoryStorage.delete(`${type}:${key}`);
  } catch {
    memoryStorage.delete(`${type}:${key}`);
  }
}
