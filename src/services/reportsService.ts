export function buildMonthlyRentSummary(rentRecords: any[]) {
  const map: Record<string, { month: number; year: number; expected: number; collected: number; pending: number }> = {};

  rentRecords.forEach((r) => {
    const key = `${r.year}-${r.month}`;
    if (!map[key]) {
      map[key] = { month: r.month, year: r.year, expected: 0, collected: 0, pending: 0 };
    }
    map[key].expected += r.rentAmount || 0;
    map[key].collected += r.paidAmount || 0;
    map[key].pending += r.remainingAmount || 0;
  });

  return Object.values(map).sort((a, b) => (b.year - a.year) || (b.month - a.month));
}

export function buildPropertyWiseIncome(rentRecords: any[], units: any[], properties: any[]) {
  const unitToProperty: Record<string, string> = {};
  units.forEach((u) => (unitToProperty[u.id] = u.propertyId));

  const map: Record<string, { propertyName: string; collected: number; pending: number }> = {};

  rentRecords.forEach((r) => {
    const propertyId = unitToProperty[r.unitId];
    const property = properties.find((p) => p.id === propertyId);
    const name = property ? property.name : 'Unknown';

    if (!map[name]) map[name] = { propertyName: name, collected: 0, pending: 0 };
    map[name].collected += r.paidAmount || 0;
    map[name].pending += r.remainingAmount || 0;
  });

  return Object.values(map);
}

export function buildTenantLedger(rentRecords: any[], tenants: any[]) {
  const map: Record<string, { tenantName: string; totalRent: number; totalPaid: number; totalPending: number }> = {};

  rentRecords.forEach((r) => {
    const tenant = tenants.find((t) => t.id === r.tenantId);
    const name = tenant ? tenant.name : 'Unknown';

    if (!map[name]) map[name] = { tenantName: name, totalRent: 0, totalPaid: 0, totalPending: 0 };
    map[name].totalRent += r.rentAmount || 0;
    map[name].totalPaid += r.paidAmount || 0;
    map[name].totalPending += r.remainingAmount || 0;
  });

  return Object.values(map);
}

export function buildExpenseReport(expenses: any[]) {
  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const byCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + (e.amount || 0);
  });
  return { total, byCategory, list: expenses };
}

export function buildProfitLoss(rentRecords: any[], expenses: any[]) {
  const totalIncome = rentRecords.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalIncome - totalExpense;
  return { totalIncome, totalExpense, netProfit };
}