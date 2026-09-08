import { router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from "@/services/firebaseConfig";
import { createUserProfile } from "@/services/userService";
import { deleteAllUserData } from "@/services/accountDeletionService";

export function useAuthMethods() {

  const signUp = async (email: string, password: string, handle: string, name: string, profilePhoto = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user.uid, {
      name,
      handle,
      biography: '',
      profilePhoto,
    });
    router.replace('/');
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    router.replace('/');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Permanently deletes the current user's account: their app data first
  // (photos, walk participation, profile doc — while still authenticated so
  // Firestore rules allow the writes), then the Firebase Auth account itself.
  // Firebase requires a recent sign-in to delete an auth user, so the caller
  // must supply the current password to reauthenticate.
  const deleteAccount = async (password: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser?.email) {
      throw new Error('No authenticated user.');
    }

    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);

    await deleteAllUserData(currentUser.uid);
    await deleteUser(currentUser);

    router.replace('/login');
  };

  return { signUp, signIn, logout, resetPassword, deleteAccount };
}
