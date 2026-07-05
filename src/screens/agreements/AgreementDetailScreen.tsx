import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { endAgreement } from '../../services/agreementService';
import StatusBadge from '../../components/StatusBadge';
import { colors } from '../../theme/colors';

export default function AgreementDetailScreen({ route, navigation }: any) {
  const { agreement } = route.params;

  const handleEnd = () => {
    Alert.alert('End Agreement', 'This will mark the unit as VACANT. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Agreement',
        style: 'destructive',
        onPress: async () => {
          await endAgreement(agreement.id, agreement.unitId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agreement Details</Text>
      <StatusBadge status={agreement.status} />
      <Text style={styles.meta}>Rent Amount: Rs. {agreement.rentAmount}</Text>
      <Text style={styles.meta}>
        Start Date: {agreement.startDate?.toDate ? agreement.startDate.toDate().toDateString() : ''}
      </Text>

      {agreement.status === 'ACTIVE' && (
        <TouchableOpacity style={styles.endBtn} onPress={handleEnd}>
          <Text style={styles.endBtnText}>End Agreement</Text>
        </TouchableOpacity>
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
  meta: { fontSize: 15, color: colors.textPrimary, marginTop: 14 },
  endBtn: { backgroundColor: colors.danger, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  endBtnText: { color: '#fff', fontWeight: '600' },
  back: { textAlign: 'center', color: colors.primary, marginTop: 16 },
});