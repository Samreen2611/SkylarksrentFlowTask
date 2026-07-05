import { db, authInstance } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const addProperty = async (name: string, address: string, type: string, totalUnits: number) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  await db.collection('properties').add({
    ownerId: uid,
    name,
    address,
    type,
    totalUnits,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getProperties = (callback: (properties: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('properties')
    .where('ownerId', '==', uid)
    .onSnapshot((snapshot) => {
      const properties = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(properties);
    });
};

export const deleteProperty = async (propertyId: string) => {
  await db.collection('properties').doc(propertyId).delete();
};

export const updateProperty = async (propertyId: string, data: any) => {
  await db.collection('properties').doc(propertyId).update(data);
};