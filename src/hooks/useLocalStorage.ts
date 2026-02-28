"use client";

import { useState, useEffect, useCallback } from "react";
import { storageGet, storageSet } from "@/lib/storage";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const val = storageGet<T>(key, initialValue);
    setStoredValue(val);
    setHydrated(true);
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        storageSet(key, next);
        return next;
      });
    },
    [key]
  );

  return [hydrated ? storedValue : initialValue, setValue];
}
