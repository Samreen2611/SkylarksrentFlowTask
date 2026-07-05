import { db, authInstance } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const createAgreement = async (
  propertyId: string,
  unitId: string,
  tenantId: string,
  rentAmount: number,
  startDate: Date
) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  await db.runTransaction(async (transaction) => {
    const unitRef = db.collection('units').doc(unitId);
    const unitDoc = await transaction.get(unitRef);

    if (!unitDoc.exists()) throw new Error('Unit not found');
    if (unitDoc.data()?.status === 'OCCUPIED') {
      throw new Error('This unit is already occupied');
    }

    const agreementRef = db.collection('agreements').doc();
    transaction.set(agreementRef, {
      ownerId: uid,
      propertyId,
      unitId,
      tenantId,
      rentAmount,
      startDate,
      endDate: null,
      status: 'ACTIVE',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    transaction.update(unitRef, { status: 'OCCUPIED' });
  });
};

export const endAgreement = async (agreementId: string, unitId: string) => {
  await db.runTransaction(async (transaction) => {
    const agreementRef = db.collection('agreements').doc(agreementId);
    const unitRef = db.collection('units').doc(unitId);

    transaction.update(agreementRef, {
      status: 'ENDED',
      endDate: firestore.FieldValue.serverTimestamp(),
    });
    transaction.update(unitRef, { status: 'VACANT' });
  });
};

export const getAgreements = (callback: (agreements: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('agreements')
    .where('ownerId', '==', uid)
    .onSnapshot((snapshot) => {
      const agreements = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(agreements);
    });
};

export const getVacantUnits = (callback: (units: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('units')
    .where('ownerId', '==', uid)
    .where('status', '==', 'VACANT')
    .onSnapshot((snapshot) => {
      const units = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(units);
    });
};