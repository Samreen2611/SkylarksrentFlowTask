import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logoutUser } from '../../services/authService';
import { colors } from '../../theme/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 30 },
  logoutBtn: { backgroundColor: colors.danger, padding: 15, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '600' },
});