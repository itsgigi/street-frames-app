import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "@firebase/firestore";
import { db } from "./firebaseConfig";
import { UserProfile } from "@/types";

const COLLECTION = "users";

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, "id">
): Promise<void> {
  await setDoc(doc(db, COLLECTION, uid), data);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, COLLECTION, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<UserProfile, "id">) };
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "id" | "handle">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, uid), data);
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void
): () => void {
  return onSnapshot(doc(db, COLLECTION, uid), (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback({ id: snap.id, ...(snap.data() as Omit<UserProfile, "id">) });
    }
  });
}
