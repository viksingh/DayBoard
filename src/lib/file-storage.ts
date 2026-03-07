import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage, isStorageConfigured } from "./firebase";

const MAX_TOTAL_BYTES = 100 * 1024 * 1024; // 100 MB
const BASE_PATH = "attachments";

export interface FileAttachment {
  id: string;
  cardId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
}

// --- IndexedDB fallback for when Firebase Storage is not configured ---

const DB_NAME = "dayboard-files";
const DB_VERSION = 1;
const STORE_NAME = "attachments";

interface StoredFile extends FileAttachment {
  data: ArrayBuffer;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("cardId", "cardId", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGetTotalUsed(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => {
      resolve((req.result as StoredFile[]).reduce((sum, f) => sum + f.size, 0));
    };
    req.onerror = () => reject(req.error);
  });
}

async function idbSaveFile(id: string, cardId: string, file: File): Promise<FileAttachment> {
  const used = await idbGetTotalUsed();
  if (used + file.size > MAX_TOTAL_BYTES) {
    throw new Error(`Storage limit exceeded. ${formatBytes(MAX_TOTAL_BYTES - used)} remaining.`);
  }
  const data = await file.arrayBuffer();
  const entry: StoredFile = {
    id,
    cardId,
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    url: "",
    data,
    createdAt: new Date().toISOString(),
  };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(entry);
    tx.oncomplete = () => {
      const { data: _, ...meta } = entry;
      resolve(meta);
    };
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGetFiles(cardId: string): Promise<FileAttachment[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).index("cardId").getAll(cardId);
    req.onsuccess = () => {
      resolve((req.result as StoredFile[]).map(({ data: _, ...meta }) => meta));
    };
    req.onerror = () => reject(req.error);
  });
}

async function idbDownloadFile(id: string): Promise<void> {
  const db = await openDB();
  const entry: StoredFile = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  if (!entry) return;
  const blob = new Blob([entry.data], { type: entry.type });
  triggerDownload(blob, entry.name);
}

async function idbDeleteFile(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDeleteFilesByCard(cardId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.index("cardId").getAllKeys(cardId);
    req.onsuccess = () => {
      for (const key of req.result) store.delete(key);
      tx.oncomplete = () => resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

async function idbGetTotalUsedPublic(): Promise<number> {
  return idbGetTotalUsed();
}

// --- Firebase Storage ---

async function fbSaveFile(id: string, cardId: string, file: File): Promise<FileAttachment> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const path = `${BASE_PATH}/${cardId}/${id}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || "application/octet-stream" });
  const url = await getDownloadURL(storageRef);
  return {
    id,
    cardId,
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    url,
    createdAt: new Date().toISOString(),
  };
}

async function fbDeleteFile(id: string, cardId: string, name: string): Promise<void> {
  if (!storage) return;
  const path = `${BASE_PATH}/${cardId}/${id}_${name}`;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // file may already be deleted
  }
}

async function fbDeleteFilesByCard(cardId: string): Promise<void> {
  if (!storage) return;
  const folderRef = ref(storage, `${BASE_PATH}/${cardId}`);
  try {
    const result = await listAll(folderRef);
    await Promise.all(result.items.map((item) => deleteObject(item)));
  } catch {
    // folder may not exist
  }
}

// --- Public API (auto-selects Firebase or IndexedDB) ---

export async function saveFile(id: string, cardId: string, file: File): Promise<FileAttachment> {
  if (isStorageConfigured()) {
    return fbSaveFile(id, cardId, file);
  }
  return idbSaveFile(id, cardId, file);
}

export async function getFilesByCard(cardId: string): Promise<FileAttachment[]> {
  if (isStorageConfigured()) {
    // Firebase files are tracked via card.attachments metadata, not queried from storage
    return [];
  }
  return idbGetFiles(cardId);
}

export async function handleDownload(attachment: FileAttachment): Promise<void> {
  if (isStorageConfigured() && attachment.url) {
    // Firebase: open the download URL
    triggerDownload(attachment.url, attachment.name);
    return;
  }
  return idbDownloadFile(attachment.id);
}

export async function removeFile(attachment: FileAttachment): Promise<void> {
  if (isStorageConfigured()) {
    return fbDeleteFile(attachment.id, attachment.cardId, attachment.name);
  }
  return idbDeleteFile(attachment.id);
}

export async function removeFilesByCard(cardId: string): Promise<void> {
  if (isStorageConfigured()) {
    return fbDeleteFilesByCard(cardId);
  }
  return idbDeleteFilesByCard(cardId);
}

export async function getTotalUsed(): Promise<number> {
  if (isStorageConfigured()) {
    // For Firebase, we track size via card attachment metadata, not from storage directly
    return 0;
  }
  return idbGetTotalUsedPublic();
}

function triggerDownload(urlOrBlob: string | Blob, filename: string) {
  const url = typeof urlOrBlob === "string" ? urlOrBlob : URL.createObjectURL(urlOrBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.click();
  if (typeof urlOrBlob !== "string") URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
