import { db, authInstance } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const generateMonthlyRent = async (
  agreementId: string,
  unitId: string,
  tenantId: string,
  rentAmount: number,
  month: number,
  year: number
) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  const existing = await db
    .collection('rent_records')
    .where('agreementId', '==', agreementId)
    .where('month', '==', month)
    .where('year', '==', year)
    .get();

  if (!existing.empty) {
    throw new Error('Rent record for this month already exists');
  }

  const dueDate = new Date(year, month - 1, 5);

  await db.collection('rent_records').add({
    ownerId: uid,
    agreementId,
    unitId,
    tenantId,
    month,
    year,
    rentAmount,
    paidAmount: 0,
    remainingAmount: rentAmount,
    status: 'UNPAID',
    dueDate,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getRentRecords = (callback: (records: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('rent_records')
    .where('ownerId', '==', uid)
    .onSnapshot(
      (snapshot) => {
        const records = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        records.sort((a: any, b: any) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.month - a.month;
        });

        const today = new Date();
        const updated = records.map((r: any) => {
          if ((r.status === 'UNPAID' || r.status === 'PARTIAL') && r.dueDate?.toDate) {
            if (r.dueDate.toDate() < today) {
              return { ...r, status: 'OVERDUE' };
            }
          }
          return r;
        });

        callback(updated);
      },
      (error) => {
        console.log('Rent records error:', error);
        callback([]);
      }
    );
};

export const getActiveAgreements = (callback: (agreements: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('agreements')
    .where('ownerId', '==', uid)
    .where('status', '==', 'ACTIVE')
    .onSnapshot((snapshot) => {
      const agreements = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(agreements);
    });
};