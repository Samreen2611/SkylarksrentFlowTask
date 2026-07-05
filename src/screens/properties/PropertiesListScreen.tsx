import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getProperties } from '../../services/propertyService';
import { colors } from '../../theme/colors';

export default function PropertiesListScreen({ navigation }: any) {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getProperties(setProperties);
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddProperty')}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {properties.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No properties yet. Tap "+ Add" to create one.</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('PropertyDetail', { property: item })}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.address}</Text>
              <Text style={styles.cardMeta}>{item.type.toUpperCase()} • {item.totalUnits} units</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: colors.textSecondary, textAlign: 'center' },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  cardSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  cardMeta: { fontSize: 12, color: colors.primary, marginTop: 6, fontWeight: '500' },
});