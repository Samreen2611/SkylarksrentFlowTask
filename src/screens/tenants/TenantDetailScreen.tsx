import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { deleteTenant } from '../../services/tenantService';
import { colors } from '../../theme/colors';

export default function TenantDetailScreen({ route, navigation }: any) {
  const { tenant } = route.params;

  const handleDelete = () => {
    Alert.alert('Delete Tenant', `Delete "${tenant.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTenant(tenant.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tenant.name}</Text>
      <Text style={styles.meta}>Phone: {tenant.phone}</Text>
      {tenant.cnic ? <Text style={styles.meta}>CNIC: {tenant.cnic}</Text> : null}
      {tenant.email ? <Text style={styles.meta}>Email: {tenant.email}</Text> : null}

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Delete Tenant</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary },
  meta: { fontSize: 15, color: colors.textPrimary, marginTop: 12 },
  deleteBtn: { backgroundColor: colors.danger, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  deleteBtnText: { color: '#fff', fontWeight: '600' },
  back: { textAlign: 'center', color: colors.primary, marginTop: 16 },
});