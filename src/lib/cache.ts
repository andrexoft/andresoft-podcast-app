const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function getCachedData<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cached = localStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const item: CacheItem<T> = JSON.parse(cached);
    const isExpired = Date.now() - item.timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error("Error al leer la caché:", error);
    localStorage.removeItem(key);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  if (typeof window === "undefined") {
    return;
  }

  const item: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error("Error al guardar la caché:", error);
  }
}