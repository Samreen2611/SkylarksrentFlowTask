import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { addTenant } from '../../services/tenantService';
import { showSuccess, showError } from '../../utils/toast';
import { colors } from '../../theme/colors';

export default function AddTenantScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !phone) {
      showError('Name and phone are required');
      return;
    }
    setLoading(true);

    addTenant(name, phone, cnic, email)
      .then(() => showSuccess('Synced with server'))
      .catch((error: any) => showError(error.message));

    showSuccess('Tenant saved (will sync when online)');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <Text style={styles.title}>Add Tenant</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Ali Raza" />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="03xx-xxxxxxx" keyboardType="phone-pad" />

      <Text style={styles.label}>CNIC (optional)</Text>
      <TextInput style={styles.input} value={cnic} onChangeText={setCnic} placeholder="xxxxx-xxxxxxx-x" />

      <Text style={styles.label}>Email (optional)</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@example.com" autoCapitalize="none" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save Tenant'}</Text>
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
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { textAlign: 'center', color: colors.textSecondary, marginTop: 16 },
});