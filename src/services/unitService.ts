import { db, authInstance } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const addUnit = async (propertyId: string, unitName: string, rentAmount: number) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  await db.collection('units').add({
    ownerId: uid,
    propertyId,
    unitName,
    rentAmount,
    status: 'VACANT',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getUnitsByProperty = (propertyId: string, callback: (units: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('units')
    .where('ownerId', '==', uid)
    .where('propertyId', '==', propertyId)
    .onSnapshot((snapshot) => {
      const units = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(units);
    });
};

export const getAllUnits = (callback: (units: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('units')
    .where('ownerId', '==', uid)
    .onSnapshot((snapshot) => {
      const units = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(units);
    });
};

export const deleteUnit = async (unitId: string) => {
  await db.collection('units').doc(unitId).delete();
};

export const updateUnitStatus = async (unitId: string, status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE') => {
  await db.collection('units').doc(unitId).update({ status });
};