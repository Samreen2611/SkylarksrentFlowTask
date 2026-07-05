import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getDashboardStats } from '../../services/dashboardService';
import { colors } from '../../theme/colors';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DashboardScreen() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const unsub = getDashboardStats(setStats);
    return unsub;
  }, []);

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingTop: 50 }}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Overview of your properties and rent</Text>

      {/* Row 1: Properties / Units */}
      <View style={styles.row}>
        <StatCard label="Properties" value={stats.totalProperties} color={colors.primary} />
        <StatCard label="Total Units" value={stats.totalUnits} color={colors.primary} />
      </View>

      <View style={styles.row}>
        <StatCard label="Occupied Units" value={stats.occupiedUnits} color={colors.occupied} />
        <StatCard label="Vacant Units" value={stats.vacantUnits} color={colors.vacant} />
      </View>

      {/* Financial Summary */}
      <Text style={styles.sectionTitle}>This Month ({MONTH_NAMES[new Date().getMonth()]})</Text>

      <View style={styles.financeCard}>
        <FinanceRow label="Expected Rent" value={stats.monthlyExpected} color={colors.textPrimary} />
        <FinanceRow label="Collected" value={stats.monthlyCollected} color={colors.success} />
        <FinanceRow label="Pending" value={stats.monthlyPending} color={colors.warning} />
      </View>

      <View style={styles.overdueCard}>
        <Text style={styles.overdueLabel}>⚠️ Total Overdue Rent</Text>
        <Text style={styles.overdueValue}>Rs. {stats.overdueRent}</Text>
      </View>

      {/* Recent Payments */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {stats.recentPayments.length === 0 ? (
        <Text style={styles.emptyText}>No payments recorded yet.</Text>
      ) : (
        stats.recentPayments.map((r: any) => (
          <View key={r.id} style={styles.activityCard}>
            <Text style={styles.activityText}>
              {MONTH_NAMES[r.month - 1]} {r.year} — Rs. {r.paidAmount} paid
            </Text>
            <Text style={styles.activityStatus}>{r.status}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FinanceRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.financeRow}>
      <Text style={styles.financeLabel}>{label}</Text>
      <Text style={[styles.financeValue, { color }]}>Rs. {value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { color: colors.textSecondary },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 20, marginBottom: 10 },
  financeCard: { backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  financeLabel: { fontSize: 14, color: colors.textSecondary },
  financeValue: { fontSize: 15, fontWeight: '700' },
  overdueCard: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 16, marginTop: 12, borderWidth: 1, borderColor: colors.danger },
  overdueLabel: { fontSize: 13, color: colors.danger, fontWeight: '600' },
  overdueValue: { fontSize: 22, fontWeight: 'bold', color: colors.danger, marginTop: 6 },
  emptyText: { color: colors.textSecondary, fontStyle: 'italic' },
  activityCard: { backgroundColor: colors.card, borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityText: { fontSize: 14, color: colors.textPrimary },
  activityStatus: { fontSize: 12, color: colors.primary, fontWeight: '600' },
});