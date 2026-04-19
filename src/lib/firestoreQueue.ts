import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { QueueItem } from "../store/usePlayerStore";

export const loadQueueFromFirestore = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().queue as QueueItem[];
    }
    return [];
  } catch (error) {
    console.error("Error loading queue from Firestore", error);
    return [];
  }
};

export const saveQueueToFirestore = async (uid: string, queue: QueueItem[]) => {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, { queue }, { merge: true });
  } catch (error) {
    console.error("Error saving queue to Firestore", error);
  }
};
