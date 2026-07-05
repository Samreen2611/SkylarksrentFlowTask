import { db, authInstance } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const addTenant = async (name: string, phone: string, cnic: string, email: string) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  await db.collection('tenants').add({
    ownerId: uid,
    name,
    phone,
    cnic: cnic || null,
    email: email || null,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getTenants = (callback: (tenants: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('tenants')
    .where('ownerId', '==', uid)
    .onSnapshot((snapshot) => {
      const tenants = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(tenants);
    });
};

export const deleteTenant = async (tenantId: string) => {
  await db.collection('tenants').doc(tenantId).delete();
};

export const updateTenant = async (tenantId: string, data: any) => {
  await db.collection('tenants').doc(tenantId).update(data);
};