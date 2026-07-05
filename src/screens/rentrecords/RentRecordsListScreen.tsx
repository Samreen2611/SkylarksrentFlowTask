import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getRentRecords } from '../../services/rentRecordService';
import StatusBadge from '../../components/StatusBadge';
import { colors } from '../../theme/colors';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STATUS_OPTIONS = ['ALL', 'UNPAID', 'PARTIAL', 'PAID', 'OVERDUE'];

export default function RentRecordsListScreen({ navigation }: any) {
  const [records, setRecords] = useState<any[]>([]);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const unsubscribe = getRentRecords(setRecords);
    return unsubscribe;
  }, []);

  // Build list of years present in data (for filter chips)
  const availableYears = Array.from(new Set(records.map((r) => r.year))).sort((a, b) => b - a);

  const filteredRecords = records.filter((r) => {
    if (monthFilter !== null && r.month !== monthFilter) return false;
    if (yearFilter !== null && r.year !== yearFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setMonthFilter(null);
    setYearFilter(null);
    setStatusFilter('ALL');
  };

  const hasActiveFilters = monthFilter !== null || yearFilter !== null || statusFilter !== 'ALL';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rent Records</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('GenerateRent')}>
          <Text style={styles.addBtnText}>+ Generate</Text>
        </TouchableOpacity>
      </View>

      {/* Status Filter Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {STATUS_OPTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.filterChip, statusFilter === s && styles.filterChipActive]}
            onPress={() => setStatusFilter(s)}
          >
            <Text style={[styles.filterChipText, statusFilter === s && styles.filterChipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Year Filter Row */}
      {availableYears.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {availableYears.map((y) => (
            <TouchableOpacity
              key={y}
              style={[styles.filterChip, yearFilter === y && styles.filterChipActive]}
              onPress={() => setYearFilter(yearFilter === y ? null : y)}
            >
              <Text style={[styles.filterChipText, yearFilter === y && styles.filterChipTextActive]}>{y}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Month Filter Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {MONTH_NAMES.map((m, i) => (
          <TouchableOpacity
            key={m}
            style={[styles.filterChip, monthFilter === i + 1 && styles.filterChipActive]}
            onPress={() => setMonthFilter(monthFilter === i + 1 ? null : i + 1)}
          >
            <Text style={[styles.filterChipText, monthFilter === i + 1 && styles.filterChipTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {hasActiveFilters && (
        <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>✕ Clear Filters</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No rent records match this filter.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RentRecordDetail', { record: item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{MONTH_NAMES[item.month - 1]} {item.year}</Text>
              <Text style={styles.cardSubtitle}>Rent: Rs. {item.rentAmount} • Paid: Rs. {item.paidAmount}</Text>
              <Text style={styles.cardMeta}>Remaining: Rs. {item.remainingAmount}</Text>
            </View>
            <StatusBadge status={item.status} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  filterRow: { flexGrow: 0, marginBottom: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.card },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { color: colors.textSecondary, fontSize: 12 },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  clearBtn: { alignSelf: 'flex-end', marginRight: 16, marginBottom: 8 },
  clearBtnText: { color: colors.danger, fontSize: 12, fontWeight: '600' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 30 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  cardMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});