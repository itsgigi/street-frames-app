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
import {uploadWalkImage, deleteWalkImage} from '@/services/storageService';
import {getWalkById} from '@/services/walkService';
import {normalizeTags} from '@/services/tagUtils';

const COLLECTION = 'photos';
export const MAX_PHOTOS_PER_USER_PER_WALK = 3;

interface FirestorePhotoDoc {
  imageUrl: string;
  userId: string;
  walkId: string;
  storagePath?: string;
  createdAt?: Timestamp;
  tags: string[];
}

interface CreatePhotoMetadataInput {
  imageUrl: string;
  userId: string;
  walkId: string;
  storagePath?: string;
  tags?: string[];
}

interface UploadWalkPhotoInput {
  localUri: string;
  userId: string;
  walkId: string;
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

async function assertWalkParticipant(userId: string, walkId: string): Promise<void> {
  const walk = await getWalkById(walkId);

  if (!walk) {
    throw new Error('Walk not found');
  }

  if (!walk.participantUids.includes(userId)) {
    throw new Error('Only participants can upload photos for this walk');
  }
}

async function getUserPhotoCountForWalk(userId: string, walkId: string): Promise<number> {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    where('walkId', '==', walkId),
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

async function assertPhotoLimitNotExceeded(userId: string, walkId: string): Promise<void> {
  const photoCount = await getUserPhotoCountForWalk(userId, walkId);

  if (photoCount >= MAX_PHOTOS_PER_USER_PER_WALK) {
    throw new Error(`You can only upload ${MAX_PHOTOS_PER_USER_PER_WALK} photos per walk. You have already reached the limit.`);
  }
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

export async function uploadWalkPhoto({
  localUri,
  userId,
  walkId,
  tags = [],
}: UploadWalkPhotoInput): Promise<GalleryPhoto> {
  await assertWalkParticipant(userId, walkId);
  await assertPhotoLimitNotExceeded(userId, walkId);

  const { imageUrl, storagePath } = await uploadWalkImage({ localUri, userId, walkId });

  const id = await createPhotoMetadata({ imageUrl, userId, walkId, storagePath, tags });

  return {
    id,
    imageUrl,
    userId,
    walkId,
    storagePath,
    tags: normalizeTags(tags),
    createdAt: new Date().toISOString(),
  };
}

export async function deletePhoto(photoId: string, requestingUserId: string): Promise<void> {
  const photoRef = doc(db, COLLECTION, photoId);
  const snapshot = await getDoc(photoRef);

  if (!snapshot.exists()) {
    throw new Error('Photo not found');
  }

  const data = snapshot.data() as FirestorePhotoDoc;
  if (data.userId !== requestingUserId) {
    throw new Error('You can only delete your own photos');
  }

  if (data.storagePath) {
    await deleteWalkImage(data.storagePath);
  }

  await deleteDoc(photoRef);
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

