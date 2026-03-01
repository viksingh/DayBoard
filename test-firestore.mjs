import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkWaoMiZFdnF-5VCO44GSzkuFZQ-TXxeM",
  authDomain: "cpi-extractor.firebaseapp.com",
  projectId: "cpi-extractor",
  storageBucket: "cpi-extractor.firebasestorage.app",
  messagingSenderId: "43171770078",
  appId: "1:43171770078:web:8b26e3b9b63d6c64ab5c4f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  console.log("Testing Firestore connection...");
  console.log("Project:", firebaseConfig.projectId);

  try {
    console.log("\n1. Trying to read dayboard/boards...");
    const snap = await getDoc(doc(db, "dayboard", "boards"));
    console.log("   Read success! Exists:", snap.exists());
    if (snap.exists()) console.log("   Data:", JSON.stringify(snap.data()).slice(0, 200));
  } catch (e) {
    console.error("   Read FAILED:", e.code, e.message);
  }

  try {
    console.log("\n2. Trying to write dayboard/test-doc...");
    await setDoc(doc(db, "dayboard", "test-doc"), { test: true, ts: new Date().toISOString() });
    console.log("   Write success!");
  } catch (e) {
    console.error("   Write FAILED:", e.code, e.message);
  }
}

test().then(() => {
  console.log("\nDone.");
  process.exit(0);
}).catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
