import { authInstance, db } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const registerUser = async (name: string, email: string, password: string) => {
  const userCredential = await authInstance.createUserWithEmailAndPassword(email, password);
  const uid = userCredential.user.uid;

  await db.collection('users').doc(uid).set({
    uid,
    name,
    email,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await authInstance.signInWithEmailAndPassword(email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await authInstance.signOut();
};