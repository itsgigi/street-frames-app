import { GalleryPhoto } from '@/types';
import { uploadWalkImage, deleteWalkImage } from '@/services/storageService';
import { getWalkById } from '@/services/walkService';
import { normalizeTags } from '@/services/tagUtils';
import {
  createPhotoMetadata,
  deletePhotoMetadata,
  countPhotosForUserAndWalk,
  getWalkGallery,
  getGlobalGallery,
  getGalleryByTag,
  getPhotosByUser,
} from '@/services/photoMetadataService';

// Orchestrates photo upload/delete across the two backends: Supabase Storage holds
// the image bytes, Firestore (via photoMetadataService) holds the metadata that
// points to them. This is the only module allowed to import both — everywhere
// else, storage and metadata concerns stay isolated in their own service.

export const MAX_PHOTOS_PER_USER_PER_WALK = 3;

interface UploadWalkPhotoInput {
  localUri: string;
  userId: string;
  walkId: string;
  tags?: string[];
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

async function assertPhotoLimitNotExceeded(userId: string, walkId: string): Promise<void> {
  const photoCount = await countPhotosForUserAndWalk(userId, walkId);

  if (photoCount >= MAX_PHOTOS_PER_USER_PER_WALK) {
    throw new Error(`You can only upload ${MAX_PHOTOS_PER_USER_PER_WALK} photos per walk. You have already reached the limit.`);
  }
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

  let id: string;
  try {
    id = await createPhotoMetadata({ imageUrl, userId, walkId, storagePath, tags });
  } catch (err) {
    // The image already landed in storage but its metadata failed to save — clean up
    // the orphaned file so a retry doesn't leave duplicate blobs behind in Supabase.
    await deleteWalkImage(storagePath).catch((cleanupErr) => {
      console.error('Failed to clean up orphaned photo after metadata write failure:', cleanupErr);
    });
    throw err;
  }

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
  const { storagePath } = await deletePhotoMetadata(photoId, requestingUserId);

  if (storagePath) {
    // The Firestore doc — the source of truth for what the gallery shows — is
    // already gone at this point, so a storage cleanup failure here is logged
    // but not surfaced as a failed delete to the user.
    await deleteWalkImage(storagePath).catch((err) => {
      console.error('Failed to delete orphaned photo from storage:', err);
    });
  }
}

export { getWalkGallery, getGlobalGallery, getGalleryByTag, getPhotosByUser };
