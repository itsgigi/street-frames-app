import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from '@firebase/firestore';
import {db} from '@/services/firebaseConfig';
import {GalleryPhoto} from '@/types';
import {normalizeTags} from '@/services/tagUtils';

// Firestore-only access to the `photos` collection. This module has no knowledge
// of where the actual image bytes live (Supabase Storage) — it only stores and
// queries the metadata that points to them. Storage-specific code belongs in
// storageService.ts; the two are wired together only in photoService.ts.

const COLLECTION = 'photos';

interface FirestorePhotoDoc {
  imageUrl: string;
  userId: string;
  walkId: string;
  storagePath?: string;
  createdAt?: Timestamp;
  tags: string[];
}

export interface CreatePhotoMetadataInput {
  imageUrl: string;
  userId: string;
  walkId: string;
  storagePath?: string;
  tags?: string[];
}

function docToPhoto(id: string, data: FirestorePhotoDoc): GalleryPhoto {
  return {
    id,
    imageUrl: data.imageUrl,
    userId: data.userId,
    walkId: data.walkId,
    storagePath: data.storagePath,
    tags: data.tags ?? [],
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : undefined,
  };
}

export async function createPhotoMetadata({
  imageUrl,
  userId,
  walkId,
  storagePath,
  tags = [],
}: CreatePhotoMetadataInput): Promise<string> {
  const payload: Omit<FirestorePhotoDoc, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    imageUrl,
    userId,
    walkId,
    storagePath,
    tags: normalizeTags(tags),
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

/**
 * Deletes a photo's Firestore metadata after verifying ownership, and returns
 * its storagePath so the caller can clean up the underlying file in storage.
 */
export async function deletePhotoMetadata(
  photoId: string,
  requestingUserId: string
): Promise<{ storagePath?: string }> {
  const photoRef = doc(db, COLLECTION, photoId);
  const snapshot = await getDoc(photoRef);

  if (!snapshot.exists()) {
    throw new Error('Photo not found');
  }

  const data = snapshot.data() as FirestorePhotoDoc;
  if (data.userId !== requestingUserId) {
    throw new Error('You can only delete your own photos');
  }

  await deleteDoc(photoRef);

  return { storagePath: data.storagePath };
}

export async function countPhotosForUserAndWalk(userId: string, walkId: string): Promise<number> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    where('walkId', '==', walkId),
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function getWalkGallery(walkId: string): Promise<GalleryPhoto[]> {
  const q = query(
    collection(db, COLLECTION),
    where('walkId', '==', walkId),
  );

  const snapshot = await getDocs(q);
  const photos = snapshot.docs.map((doc) => docToPhoto(doc.id, doc.data() as FirestorePhotoDoc));
  return photos.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function getGlobalGallery(maxItems = 50): Promise<GalleryPhoto[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => docToPhoto(doc.id, doc.data() as FirestorePhotoDoc));
}

export async function getGalleryByTag(tag: string, maxItems = 50): Promise<GalleryPhoto[]> {
  const normalizedTag = tag.trim().toLowerCase();
  if (!normalizedTag) return [];

  const q = query(
    collection(db, COLLECTION),
    where('tags', 'array-contains', normalizedTag),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => docToPhoto(doc.id, doc.data() as FirestorePhotoDoc));
}

export async function getPhotosByUser(userId: string, maxItems = 6): Promise<GalleryPhoto[]> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    limit(maxItems)
  );

  const snapshot = await getDocs(q);
  const photos = snapshot.docs.map((doc) => docToPhoto(doc.id, doc.data() as FirestorePhotoDoc));
  return photos
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, maxItems);
}
