import { db, authInstance } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const addPayment = async (rentRecordId: string, amount: number, method: string) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  await db.runTransaction(async (transaction) => {
    const rentRef = db.collection('rent_records').doc(rentRecordId);
    const rentDoc = await transaction.get(rentRef);

    if (!rentDoc.exists()) throw new Error('Rent record not found');

    const data = rentDoc.data()!;
    const newPaidAmount = (data.paidAmount || 0) + amount;
    const remainingAmount = data.rentAmount - newPaidAmount;

    let status: string;
    if (remainingAmount <= 0) {
      status = 'PAID';
    } else if (newPaidAmount > 0) {
      status = 'PARTIAL';
    } else {
      status = 'UNPAID';
    }

    transaction.update(rentRef, {
      paidAmount: newPaidAmount,
      remainingAmount: Math.max(remainingAmount, 0),
      status,
    });

    const paymentRef = db.collection('rent_payments').doc();
    transaction.set(paymentRef, {
      ownerId: uid,
      rentRecordId,
      amount,
      method: method || 'Cash',
      paymentDate: firestore.FieldValue.serverTimestamp(),
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  });
};

export const getPaymentsForRecord = (rentRecordId: string, callback: (payments: any[]) => void) => {
  return db
    .collection('rent_payments')
    .where('rentRecordId', '==', rentRecordId)
    .onSnapshot((snapshot) => {
      const payments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(payments);
    });
};