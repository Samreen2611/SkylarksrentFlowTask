import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getRentRecords } from '../../services/rentRecordService';
import StatusBadge from '../../components/StatusBadge';
import { colors } from '../../theme/colors';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function RentRecordsListScreen({ navigation }: any) {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getRentRecords(setRecords);
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rent Records</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('GenerateRent')}>
          <Text style={styles.addBtnText}>+ Generate</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No rent records yet.</Text>}
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
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 30 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  cardMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});