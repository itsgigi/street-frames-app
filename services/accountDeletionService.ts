import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from '@firebase/firestore';
import { db } from '@/services/firebaseConfig';
import { deleteWalkImage } from '@/services/storageService';

const PHOTOS_COLLECTION = 'photos';
const WALKS_COLLECTION = 'walks';
const USERS_COLLECTION = 'users';

// Deletes every photo the user uploaded: the Firestore metadata doc and the
// backing file in Supabase Storage. Re-running this for a uid with nothing
// left is a no-op, which makes account deletion safely retryable.
async function deleteUserPhotos(uid: string): Promise<void> {
  const snapshot = await getDocs(
    query(collection(db, PHOTOS_COLLECTION), where('userId', '==', uid))
  );

  await Promise.all(
    snapshot.docs.map(async (photoDoc) => {
      const { storagePath } = photoDoc.data() as { storagePath?: string };
      await deleteDoc(photoDoc.ref);
      if (storagePath) {
        // Metadata is already gone, which is what the gallery reads from —
        // log but don't fail the whole deletion over an orphaned storage file.
        await deleteWalkImage(storagePath).catch((err) => {
          console.error('Failed to delete photo from storage during account deletion:', err);
        });
      }
    })
  );
}

// Removes the uid from participantUIDs on every walk the user joined.
async function removeUserFromWalks(uid: string): Promise<void> {
  const snapshot = await getDocs(
    query(collection(db, WALKS_COLLECTION), where('participantUIDs', 'array-contains', uid))
  );

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((walkDoc) => {
    batch.update(walkDoc.ref, { participantUIDs: arrayRemove(uid) });
  });
  await batch.commit();
}

/**
 * Deletes all app data owned by uid: uploaded photos (Supabase Storage +
 * Firestore metadata), walk participation, and the user profile doc.
 * Must run while the user is still authenticated as uid (Firestore rules
 * gate these writes on auth.uid), and before the Firebase Auth account
 * itself is deleted.
 */
export async function deleteAllUserData(uid: string): Promise<void> {
  await deleteUserPhotos(uid);
  await removeUserFromWalks(uid);
  await deleteDoc(doc(db, USERS_COLLECTION, uid));
}
