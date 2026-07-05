import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getActiveAgreements, generateMonthlyRent } from '../../services/rentRecordService';
import { colors } from '../../theme/colors';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function GenerateRentScreen({ navigation }: any) {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = getActiveAgreements(setAgreements);
    return unsub;
  }, []);

  const handleGenerate = async () => {
    if (!selectedAgreement) {
      Alert.alert('Error', 'Please select an agreement');
      return;
    }
    setLoading(true);
    try {
      await generateMonthlyRent(
        selectedAgreement.id,
        selectedAgreement.unitId,
        selectedAgreement.tenantId,
        selectedAgreement.rentAmount,
        month,
        year
      );
      Alert.alert('Success', 'Rent record generated');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <Text style={styles.title}>Generate Monthly Rent</Text>

      <Text style={styles.label}>Select Agreement</Text>
      {agreements.length === 0 ? (
        <Text style={styles.emptyText}>No active agreements found</Text>
      ) : (
        <View style={styles.chipRow}>
          {agreements.map((a) => (
            <TouchableOpacity
              key={a.id}
              style={[styles.chip, selectedAgreement?.id === a.id && styles.chipActive]}
              onPress={() => setSelectedAgreement(a)}
            >
              <Text style={[styles.chipText, selectedAgreement?.id === a.id && styles.chipTextActive]}>
                Rs. {a.rentAmount} agreement
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Month</Text>
      <View style={styles.chipRow}>
        {MONTH_NAMES.map((m, i) => (
          <TouchableOpacity
            key={m}
            style={[styles.chip, month === i + 1 && styles.chipActive]}
            onPress={() => setMonth(i + 1)}
          >
            <Text style={[styles.chipText, month === i + 1 && styles.chipTextActive]}>{m.slice(0, 3)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Year: {year}</Text>
      <View style={styles.chipRow}>
        <TouchableOpacity style={styles.chip} onPress={() => setYear(year - 1)}>
          <Text style={styles.chipText}>- {year - 1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip} onPress={() => setYear(year + 1)}>
          <Text style={styles.chipText}>+ {year + 1}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleGenerate} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? 'Generating...' : 'Generate Rent Record'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8, marginTop: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: '#fff' },
  emptyText: { color: colors.textSecondary, fontSize: 13, fontStyle: 'italic' },
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { textAlign: 'center', color: colors.textSecondary, marginTop: 16 },
});