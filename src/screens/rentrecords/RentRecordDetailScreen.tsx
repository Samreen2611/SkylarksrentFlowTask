import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { showSuccess, showError } from '../../utils/toast';
import { addPayment } from '../../services/paymentService';
import StatusBadge from '../../components/StatusBadge';
import { colors } from '../../theme/colors';

export default function RentRecordDetailScreen({ route, navigation }: any) {
  const { record } = route.params;
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPayment = async () => {
  const amt = parseFloat(amount);
  if (!amt || amt <= 0) {
    showError('Enter a valid amount');
    return;
  }
  if (amt > record.remainingAmount) {
    showError(`Amount exceeds remaining balance of Rs. ${record.remainingAmount}`);
    return;
  }
  setLoading(true);
  try {
    await addPayment(record.id, amt, 'Cash');
    showSuccess('Payment recorded');
    navigation.goBack();
  } catch (error: any) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};
   

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rent Record</Text>
      <StatusBadge status={record.status} />

      <Text style={styles.meta}>Total Rent: Rs. {record.rentAmount}</Text>
      <Text style={styles.meta}>Paid: Rs. {record.paidAmount}</Text>
      <Text style={styles.meta}>Remaining: Rs. {record.remainingAmount}</Text>

      {record.status !== 'PAID' && (
        <>
          <Text style={styles.label}>Add Payment</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleAddPayment} disabled={loading}>
            <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Record Payment'}</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 12 },
  meta: { fontSize: 15, color: colors.textPrimary, marginTop: 10 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginTop: 24, marginBottom: 8 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 15 },
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  back: { textAlign: 'center', color: colors.primary, marginTop: 24 },
});