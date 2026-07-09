import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { addProperty } from '../../services/propertyService';
import { showSuccess, showError } from '../../utils/toast';
import { colors } from '../../theme/colors';

const PROPERTY_TYPES = ['shop', 'house', 'flat', 'office', 'warehouse'];

export default function AddPropertyScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('shop');
  const [totalUnits, setTotalUnits] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !address) {
      showError('Please fill all fields');
      return;
    }
    setLoading(true);

    addProperty(name, address, type, parseInt(totalUnits, 10) || 1)
      .then(() => showSuccess('Synced with server'))
      .catch((error: any) => showError(error.message));

    showSuccess('Property saved (will sync when online)');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <Text style={styles.title}>Add Property</Text>

      <Text style={styles.label}>Property Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Green Heights" />

      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="e.g. Main Road, Attock" />

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeRow}>
        {PROPERTY_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeChip, type === t && styles.typeChipActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Total Units</Text>
      <TextInput
        style={styles.input}
        value={totalUnits}
        onChangeText={setTotalUnits}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Property'}</Text>
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
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 15 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { color: colors.textSecondary, fontSize: 13 },
  typeChipTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { textAlign: 'center', color: colors.textSecondary, marginTop: 16 },
});