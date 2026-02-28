const PREFIX = "dayboard:";

export function storageGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full — silently ignore
  }
}

export function storageRemove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREFIX + key);
}

export function storageGetAllKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(PREFIX)) {
      keys.push(k.slice(PREFIX.length));
    }
  }
  return keys;
}
