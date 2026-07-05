import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const STATUS_COLORS: Record<string, string> = {
  VACANT: colors.vacant,
  OCCUPIED: colors.occupied,
  MAINTENANCE: colors.maintenance,
  PAID: colors.paid,
  UNPAID: colors.unpaid,
  PARTIAL: colors.partial,
  OVERDUE: colors.overdue,
};

export default function StatusBadge({ status }: { status: string }) {
  const bgColor = STATUS_COLORS[status] || colors.textSecondary;
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 11, fontWeight: '700' },
});