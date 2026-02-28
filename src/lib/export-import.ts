import { storageGet, storageSet } from "./storage";

export function exportAllData() {
  const data: Record<string, unknown> = {};
  const keys = ["boards", "daily-notes", "settings"];
  for (const key of keys) {
    data[key] = storageGet(key, null);
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dayboard-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importAllData(): Promise<boolean> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(false);
        return;
      }
      try {
        const text = await file.text();
        const data = JSON.parse(text) as Record<string, unknown>;
        for (const [key, value] of Object.entries(data)) {
          if (value !== null) {
            storageSet(key, value);
          }
        }
        resolve(true);
      } catch {
        alert("Invalid backup file");
        resolve(false);
      }
    };
    input.click();
  });
}
