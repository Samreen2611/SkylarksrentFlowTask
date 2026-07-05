import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { showSuccess, showError } from '../../utils/toast';
import { getProperties } from '../../services/propertyService';
import { getUnitsByProperty } from '../../services/unitService';
import { getTenants } from '../../services/tenantService';
import { createAgreement } from '../../services/agreementService';
import { colors } from '../../theme/colors';

export default function CreateAgreementScreen({ navigation }: any) {
  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);

  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [rentAmount, setRentAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub1 = getProperties(setProperties);
    const unsub2 = getTenants(setTenants);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  useEffect(() => {
    if (!selectedProperty) {
      setUnits([]);
      return;
    }
    const unsub = getUnitsByProperty(selectedProperty.id, (allUnits) => {
      setUnits(allUnits.filter((u) => u.status === 'VACANT'));
    });
    return unsub;
  }, [selectedProperty]);

  const handleCreate = async () => {
  if (!selectedProperty || !selectedUnit || !selectedTenant || !rentAmount) {
    showError('Please select property, unit, tenant and enter rent amount');
    return;
  }
  setLoading(true);
  try {
    await createAgreement(
      selectedProperty.id,
      selectedUnit.id,
      selectedTenant.id,
      parseFloat(rentAmount),
      new Date()
    );
    showSuccess('Agreement created. Unit is now OCCUPIED.');
    navigation.goBack();
  } catch (error: any) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};
   

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <Text style={styles.title}>Create Agreement</Text>

      <Text style={styles.label}>Select Property</Text>
      <View style={styles.chipRow}>
        {properties.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.chip, selectedProperty?.id === p.id && styles.chipActive]}
            onPress={() => {
              setSelectedProperty(p);
              setSelectedUnit(null);
            }}
          >
            <Text style={[styles.chipText, selectedProperty?.id === p.id && styles.chipTextActive]}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedProperty && (
        <>
          <Text style={styles.label}>Select Vacant Unit</Text>
          {units.length === 0 ? (
            <Text style={styles.emptyText}>No vacant units in this property</Text>
          ) : (
            <View style={styles.chipRow}>
              {units.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  style={[styles.chip, selectedUnit?.id === u.id && styles.chipActive]}
                  onPress={() => {
                    setSelectedUnit(u);
                    setRentAmount(String(u.rentAmount));
                  }}
                >
                  <Text style={[styles.chipText, selectedUnit?.id === u.id && styles.chipTextActive]}>{u.unitName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      <Text style={styles.label}>Select Tenant</Text>
      <View style={styles.chipRow}>
        {tenants.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.chip, selectedTenant?.id === t.id && styles.chipActive]}
            onPress={() => setSelectedTenant(t)}
          >
            <Text style={[styles.chipText, selectedTenant?.id === t.id && styles.chipTextActive]}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Rent Amount</Text>
      <TextInput style={styles.input} value={rentAmount} onChangeText={setRentAmount} keyboardType="numeric" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleCreate} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Creating...' : 'Create Agreement'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8, marginTop: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: '#fff' },
  emptyText: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic' },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 15 },
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { textAlign: 'center', color: colors.textSecondary, marginTop: 16 },
});