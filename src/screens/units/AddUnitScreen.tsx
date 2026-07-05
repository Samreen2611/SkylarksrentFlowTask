import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { showSuccess, showError } from '../../utils/toast';
import { addUnit } from '../../services/unitService';
import { colors } from '../../theme/colors';

export default function AddUnitScreen({ route, navigation }: any) {
  const { propertyId } = route.params;
  const [unitName, setUnitName] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [loading, setLoading] = useState(false);

 
 const handleSave = async () => {
  if (!unitName || !rentAmount) {
    showError('Please fill all fields');
    return;
  }
  setLoading(true);
  try {
    await addUnit(propertyId, unitName, parseFloat(rentAmount));
    showSuccess('Unit added successfully');
    navigation.goBack();
  } catch (error: any) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Unit</Text>

      <Text style={styles.label}>Unit Name / Number</Text>
      <TextInput
        style={styles.input}
        value={unitName}
        onChangeText={setUnitName}
        placeholder="e.g. Shop 1, Flat 2A"
      />

      <Text style={styles.label}>Monthly Rent Amount</Text>
      <TextInput
        style={styles.input}
        value={rentAmount}
        onChangeText={setRentAmount}
        placeholder="e.g. 15000"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Unit'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 15 },
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { textAlign: 'center', color: colors.textSecondary, marginTop: 16 },
});