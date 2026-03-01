import { doc, setDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "dayboard";

export type SyncStatus = "connecting" | "connected" | "error" | "offline";

type StatusListener = (status: SyncStatus, error?: string) => void;
const statusListeners = new Set<StatusListener>();
let currentStatus: SyncStatus = "connecting";
let currentError: string | undefined;

function setStatus(status: SyncStatus, error?: string) {
  currentStatus = status;
  currentError = error;
  statusListeners.forEach((fn) => fn(status, error));
}

export function onSyncStatus(listener: StatusListener): () => void {
  listener(currentStatus, currentError);
  statusListeners.add(listener);
  return () => { statusListeners.delete(listener); };
}

export function subscribeToDoc<T>(
  docId: string,
  onData: (data: T | null) => void
): Unsubscribe {
  const ref = doc(db, COLLECTION, docId);
  return onSnapshot(
    ref,
    (snapshot) => {
      setStatus("connected");
      if (snapshot.exists()) {
        onData(snapshot.data().data as T);
      } else {
        onData(null);
      }
    },
    (error) => {
      console.error(`Firestore subscribe error (${docId}):`, error);
      setStatus("error", error.message || "Firestore subscription failed");
    }
  );
}

export async function writeDoc<T>(docId: string, data: T): Promise<void> {
  const ref = doc(db, COLLECTION, docId);
  try {
    await setDoc(ref, { data, updatedAt: new Date().toISOString() });
    setStatus("connected");
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Firestore write failed";
    console.error(`Firestore write error (${docId}):`, msg);
    setStatus("error", msg);
  }
}

export function isFirestoreConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}
