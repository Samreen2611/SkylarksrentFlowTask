import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getTenants } from '../../services/tenantService';
import { colors } from '../../theme/colors';

export default function TenantsListScreen({ navigation }: any) {
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getTenants(setTenants);
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tenants</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddTenant')}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No tenants yet. Tap "+ Add" to create one.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TenantDetail', { tenant: item })}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.phone}</Text>
            {item.cnic ? <Text style={styles.cardMeta}>CNIC: {item.cnic}</Text> : null}
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
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  cardSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  cardMeta: { fontSize: 12, color: colors.primary, marginTop: 6 },
});