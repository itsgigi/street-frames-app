import { router } from 'expo-router';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "@/services/firebaseConfig";
import { createUserProfile } from "@/services/userService";

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

  return { signUp, signIn, logout, resetPassword };
}
