import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAgreements } from '../../services/agreementService';
import StatusBadge from '../../components/StatusBadge';
import { colors } from '../../theme/colors';

export default function AgreementsListScreen({ navigation }: any) {
  const [agreements, setAgreements] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getAgreements(setAgreements);
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agreements</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateAgreement')}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={agreements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No agreements yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AgreementDetail', { agreement: item })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Rent: Rs. {item.rentAmount}</Text>
              <Text style={styles.cardSubtitle}>Started: {item.startDate?.toDate ? item.startDate.toDate().toDateString() : ''}</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 30 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});