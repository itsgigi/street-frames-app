import {
  addDoc,
  collection,
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
import {uploadWalkImage} from '@/services/storageService';
import {getWalkById} from '@/services/walkService';

const COLLECTION = 'photos';

interface FirestorePhotoDoc {
  imageUrl: string;
  userId: string;
  walkId: string;
  createdAt?: Timestamp;
  tags: string[];
}

interface CreatePhotoMetadataInput {
  imageUrl: string;
  userId: string;
  walkId: string;
  tags?: string[];
}

interface UploadWalkPhotoInput {
  localUri: string;
  userId: string;
  walkId: string;
  tags?: string[];
}

export function normalizeTags(tags: string[] = []): string[] {
  return [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

function docToPhoto(id: string, data: FirestorePhotoDoc): GalleryPhoto {
  return {
    id,
    imageUrl: data.imageUrl,
    userId: data.userId,
    walkId: data.walkId,
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

export async function createPhotoMetadata({
  imageUrl,
  userId,
  walkId,
  tags = [],
}: CreatePhotoMetadataInput): Promise<string> {
  const payload: Omit<FirestorePhotoDoc, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    imageUrl,
    userId,
    walkId,
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

  const { imageUrl } = await uploadWalkImage({ localUri, userId, walkId });

  const id = await createPhotoMetadata({ imageUrl, userId, walkId, tags });

  return {
    id,
    imageUrl,
    userId,
    walkId,
    tags: normalizeTags(tags),
    createdAt: new Date().toISOString(),
  };
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

