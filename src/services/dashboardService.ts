import { db, authInstance } from './firebase';

export const getDashboardStats = (callback: (stats: any) => void) => {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return () => {};

  let properties: any[] = [];
  let units: any[] = [];
  let rentRecords: any[] = [];

  const computeAndSend = () => {
    const totalProperties = properties.length;
    const totalUnits = units.length;
    const occupiedUnits = units.filter((u) => u.status === 'OCCUPIED').length;
    const vacantUnits = units.filter((u) => u.status === 'VACANT').length;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const currentMonthRecords = rentRecords.filter(
      (r) => r.month === currentMonth && r.year === currentYear
    );

    const monthlyExpected = currentMonthRecords.reduce((sum, r) => sum + (r.rentAmount || 0), 0);
    const monthlyCollected = currentMonthRecords.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    const monthlyPending = currentMonthRecords.reduce((sum, r) => sum + (r.remainingAmount || 0), 0);

    const overdueRent = rentRecords
      .filter((r) => r.status === 'OVERDUE')
      .reduce((sum, r) => sum + (r.remainingAmount || 0), 0);

    const recentPayments = rentRecords
      .filter((r) => r.paidAmount > 0)
      .sort((a, b) => (b.year - a.year) || (b.month - a.month))
      .slice(0, 5);

    callback({
      totalProperties,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      monthlyExpected,
      monthlyCollected,
      monthlyPending,
      overdueRent,
      recentPayments,
    });
  };

  const unsub1 = db.collection('properties').where('ownerId', '==', uid).onSnapshot((snap) => {
    properties = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    computeAndSend();
  });

  const unsub2 = db.collection('units').where('ownerId', '==', uid).onSnapshot((snap) => {
    units = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    computeAndSend();
  });

  const unsub3 = db.collection('rent_records').where('ownerId', '==', uid).onSnapshot((snap) => {
    rentRecords = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    computeAndSend();
  });

  return () => {
    unsub1();
    unsub2();
    unsub3();
  };
};