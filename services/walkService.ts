import {
  collection, doc, getDoc, addDoc, updateDoc, onSnapshot,
  query, orderBy, where, arrayUnion, arrayRemove, Timestamp,
} from "@firebase/firestore";
import { db } from "./firebaseConfig";
import { Walk, Stop } from "@/types";
import { normalizeTags } from "./tagUtils";

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
    participantUIDs: data.participantUIDs ?? [],
    tags: data.tags ?? [],
  };
}

// Real-time subscription to the next upcoming walk (closest future date)
export function subscribeToLatestWalk(
  callback: (walk: Walk | null) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy("date", "asc"));
  return onSnapshot(q, (snapshot) => {
    const now = new Date();
    const upcoming = snapshot.docs
      .map((d) => docToWalk(d.id, d.data()))
      .find((w) => new Date(w.date) > now);
    callback(upcoming ?? null);
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

export interface CreateWalkInput {
  title: string;
  coverImage: string;
  location: string;
  description: string;
  date: string;
  stops: Stop[];
  tags: string[];
}

export async function createWalk(input: CreateWalkInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    title: input.title,
    coverImage: input.coverImage,
    location: input.location,
    description: input.description,
    date: input.date,
    stops: input.stops,
    tags: normalizeTags(input.tags),
    participantUIDs: [],
  });
  return ref.id;
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

// Real-time subscription to all walks a specific user has joined
// Note: no orderBy here to avoid requiring a composite Firestore index;
// results are sorted client-side instead.
export function subscribeToUserWalks(
  uid: string,
  callback: (walks: Walk[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTION),
    where('participantUIDs', 'array-contains', uid)
  );
  return onSnapshot(q, (snapshot) => {
    const walks = snapshot.docs
      .map((d) => docToWalk(d.id, d.data()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    callback(walks);
  });
}

// Real-time subscription to all walks, sorted newest-first.
export function subscribeToAllWalks(
  callback: (walks: Walk[]) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => docToWalk(d.id, d.data())));
  });
}

// Real-time subscription to the set of distinct tags across all walks.
export function subscribeToAllTags(
  callback: (tags: string[]) => void
): () => void {
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const tags = new Set<string>();
    snapshot.docs.forEach((d) => {
      (d.data().tags ?? []).forEach((tag: string) => tags.add(tag));
    });
    callback([...tags].sort());
  });
}

// Real-time subscription to all past walks (date < now), sorted newest-first.
// Uses only orderBy (no where) to avoid requiring a composite index.
export function subscribeToPastWalks(
  callback: (walks: Walk[]) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const now = new Date();
    callback(
      snapshot.docs
        .map((d) => docToWalk(d.id, d.data()))
        .filter((w) => new Date(w.date) < now)
    );
  });
}
