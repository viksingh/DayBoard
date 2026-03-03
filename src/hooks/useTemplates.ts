"use client";

import { useState, useEffect, useCallback } from "react";
import { CardTemplate } from "@/types/board";
import { storageGet, storageSet } from "@/lib/storage";
import { generateId } from "@/lib/ids";

const STORAGE_KEY = "card-templates";

export function useTemplates() {
  const [templates, setTemplates] = useState<CardTemplate[]>([]);

  useEffect(() => {
    setTemplates(storageGet<CardTemplate[]>(STORAGE_KEY, []));
  }, []);

  const persist = (next: CardTemplate[]) => {
    setTemplates(next);
    storageSet(STORAGE_KEY, next);
  };

  const addTemplate = useCallback(
    (template: Omit<CardTemplate, "id">) => {
      const next = [...templates, { ...template, id: generateId() }];
      persist(next);
    },
    [templates]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      persist(templates.filter((t) => t.id !== id));
    },
    [templates]
  );

  return { templates, addTemplate, deleteTemplate };
}
