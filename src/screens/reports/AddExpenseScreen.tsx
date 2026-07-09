import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { addExpense } from '../../services/expenseService';
import { getProperties } from '../../services/propertyService';
import { showSuccess, showError } from '../../utils/toast';
import { colors } from '../../theme/colors';

const CATEGORIES = ['Maintenance', 'Repair', 'Utility', 'Tax', 'Insurance', 'Other'];

export default function AddExpenseScreen({ navigation }: any) {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [category, setCategory] = useState('Maintenance');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = getProperties(setProperties);
    return unsub;
  }, []);

  const handleSave = async () => {
    if (!amount) {
      showError('Please enter amount');
      return;
    }
    setLoading(true);

    addExpense(selectedProperty?.id, category, parseFloat(amount), description)
      .then(() => showSuccess('Synced with server'))
      .catch((error: any) => showError(error.message));

    showSuccess('Expense saved (will sync when online)');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <Text style={styles.title}>Add Expense</Text>

      <Text style={styles.label}>Property (optional)</Text>
      <View style={styles.chipRow}>
        {properties.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.chip, selectedProperty?.id === p.id && styles.chipActive]}
            onPress={() => setSelectedProperty(selectedProperty?.id === p.id ? null : p)}
          >
            <Text style={[styles.chipText, selectedProperty?.id === p.id && styles.chipTextActive]}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="e.g. 2000" />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="e.g. Plumbing repair" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Expense'}</Text>
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
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 15 },
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { textAlign: 'center', color: colors.textSecondary, marginTop: 16 },
});