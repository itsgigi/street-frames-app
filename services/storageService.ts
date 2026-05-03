import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { getSupabaseClient } from '@/services/supabaseConfig';

const MAX_DIMENSION = 400;
const PHOTOS_BUCKET = 'photos';

interface UploadWalkImageInput {
  localUri: string;
  walkId: string;
  userId: string;
  timestamp?: number;
}

export interface UploadWalkImageResult {
  storagePath: string;
  imageUrl: string;
}

export async function imageUriToBase64(uri: string): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ compress: 0.75, format: SaveFormat.JPEG, base64: true });

  if (!result.base64) throw new Error('Failed to encode image.');
  return `data:image/jpeg;base64,${result.base64}`;
}

function buildWalkImagePath(walkId: string, userId: string, timestamp: number): string {
  return `walks/${walkId}/${userId}_${timestamp}.jpg`;
}

function inferMimeTypeFromUri(uri: string): string {
  const normalized = uri.split('?')[0].toLowerCase();
  if (normalized.endsWith('.png')) return 'image/png';
  if (normalized.endsWith('.webp')) return 'image/webp';
  if (normalized.endsWith('.heic') || normalized.endsWith('.heif')) return 'image/heic';
  if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

export async function uploadWalkImage({
  localUri,
  walkId,
  userId,
  timestamp = Date.now(),
}: UploadWalkImageInput): Promise<UploadWalkImageResult> {
  const supabase = getSupabaseClient();
  const imagePath = buildWalkImagePath(walkId, userId, timestamp);

  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imageBytes = decode(base64);
  if (!imageBytes || imageBytes.byteLength === 0) {
    throw new Error('Selected image is empty or unreadable.');
  }

  const contentType = inferMimeTypeFromUri(localUri);

  const { error: uploadError } = await supabase.storage.from(PHOTOS_BUCKET).upload(imagePath, imageBytes, {
    contentType,
    upsert: false,
  });

  if (uploadError) {
    console.error('Photo upload failed:', uploadError);
    throw new Error(`Photo upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(imagePath);
  if (!data?.publicUrl) {
    console.error('Public URL not found for uploaded photo.');
    throw new Error('Unable to resolve public URL for uploaded photo.');
  }

  return {
    storagePath: imagePath,
    imageUrl: data.publicUrl,
  };
}

