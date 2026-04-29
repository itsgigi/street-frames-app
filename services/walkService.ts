import {
  collection, doc, getDoc, updateDoc, onSnapshot,
  query, orderBy, limit, arrayUnion, arrayRemove, Timestamp,
} from "@firebase/firestore";
import { db } from "./firebaseConfig";
import { Walk, Stop } from "@/types";

const COLLECTION = "walks";

function parseStops(raw: any[]): Stop[] {
  return raw.map((item) => {
    if (typeof item === 'string') {
      try { return JSON.parse(item) as Stop; } catch { return null; }
    }
    return item as Stop;
  }).filter(Boolean) as Stop[];
}

function docToWalk(id: string, data: Record<string, any>): Walk {
  return {
    id,
    title: data.title ?? '',
    coverImage: data.coverImage ?? '',
    location: data.location ?? '',
    description: data.description ?? '',
    date: data.date instanceof Timestamp
      ? data.date.toDate().toISOString()
      : (data.date ?? new Date().toISOString()),
    stops: parseStops(data.stops ?? []),
    participantUids: data.participantUIDs ?? data.participantUids ?? [],
  };
}

// Real-time subscription to the single latest walk (ordered by date desc)
export function subscribeToLatestWalk(
  callback: (walk: Walk | null) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy("date", "desc"), limit(1));
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
    } else {
      const snap = snapshot.docs[0];
      callback(docToWalk(snap.id, snap.data()));
    }
  });
}

// Real-time subscription to a specific walk by ID
export function subscribeToWalkById(
  id: string,
  callback: (walk: Walk | null) => void
): () => void {
  return onSnapshot(doc(db, COLLECTION, id), (snap) => {
    callback(snap.exists() ? docToWalk(snap.id, snap.data()) : null);
  });
}

export async function getWalkById(id: string): Promise<Walk | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? docToWalk(snap.id, snap.data()) : null;
}

export async function joinWalk(walkId: string, uid: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, walkId), {
    participantUIDs: arrayUnion(uid),
  });
}

export async function leaveWalk(walkId: string, uid: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, walkId), {
    participantUIDs: arrayRemove(uid),
  });
}
