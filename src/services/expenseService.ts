import { db, authInstance } from './firebase';
import firestore from '@react-native-firebase/firestore';

export const addExpense = async (propertyId: string, category: string, amount: number, description: string) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) throw new Error('User not logged in');

  await db.collection('expenses').add({
    ownerId: uid,
    propertyId: propertyId || null,
    category,
    amount,
    description: description || '',
    date: firestore.FieldValue.serverTimestamp(),
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getExpenses = (callback: (expenses: any[]) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  return db
    .collection('expenses')
    .where('ownerId', '==', uid)
    .onSnapshot(
      (snapshot) => {
        const expenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(expenses);
      },
      (error) => {
        console.log('Expenses error:', error);
        callback([]);
      }
    );
};

export const deleteExpense = async (expenseId: string) => {
  await db.collection('expenses').doc(expenseId).delete();
};