import { doc, setDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "dayboard";

export function subscribeToDoc<T>(
  docId: string,
  onData: (data: T | null) => void
): Unsubscribe {
  const ref = doc(db, COLLECTION, docId);
  return onSnapshot(
    ref,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data().data as T);
      } else {
        onData(null);
      }
    },
    (error) => {
      console.error(`Firestore subscribe error (${docId}):`, error);
    }
  );
}

export async function writeDoc<T>(docId: string, data: T): Promise<void> {
  const ref = doc(db, COLLECTION, docId);
  try {
    await setDoc(ref, { data, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error(`Firestore write error (${docId}):`, error);
  }
}

export function isFirestoreConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}
