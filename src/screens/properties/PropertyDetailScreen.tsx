import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { deleteProperty } from '../../services/propertyService';
import { getUnitsByProperty, deleteUnit } from '../../services/unitService';
import StatusBadge from '../../components/StatusBadge';
import { colors } from '../../theme/colors';

export default function PropertyDetailScreen({ route, navigation }: any) {
  const { property } = route.params;
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = getUnitsByProperty(property.id, setUnits);
    return unsubscribe;
  }, [property.id]);

  const handleDeleteProperty = () => {
    Alert.alert('Delete Property', `Delete "${property.name}"? This won't delete its units.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteProperty(property.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleDeleteUnit = (unitId: string) => {
    Alert.alert('Delete Unit', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteUnit(unitId) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>{property.name}</Text>
        <Text style={styles.subtitle}>{property.address}</Text>
        <Text style={styles.meta}>{property.type.toUpperCase()} • {property.totalUnits} units planned</Text>
      </View>

      <View style={styles.unitsHeader}>
        <Text style={styles.unitsTitle}>Units</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddUnit', { propertyId: property.id })}
        >
          <Text style={styles.addBtnText}>+ Add Unit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={units}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No units added yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.unitCard} onLongPress={() => handleDeleteUnit(item.id)}>
            <View>
              <Text style={styles.unitName}>{item.unitName}</Text>
              <Text style={styles.unitRent}>Rs. {item.rentAmount} / month</Text>
            </View>
            <StatusBadge status={item.status} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteProperty}>
        <Text style={styles.deleteBtnText}>Delete Property</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBox: { padding: 20, paddingTop: 50, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  meta: { fontSize: 12, color: colors.primary, marginTop: 6, fontWeight: '500' },
  unitsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 },
  unitsTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 30 },
  unitCard: { backgroundColor: colors.card, padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unitName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  unitRent: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  deleteBtn: { backgroundColor: colors.danger, padding: 14, borderRadius: 8, alignItems: 'center', margin: 16 },
  deleteBtnText: { color: '#fff', fontWeight: '600' },
});