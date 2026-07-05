import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getRentRecords } from '../../services/rentRecordService';
import { getProperties } from '../../services/propertyService';
import { getTenants } from '../../services/tenantService';
import { getExpenses } from '../../services/expenseService';
import { getAllUnits } from '../../services/unitService';
import {
  buildMonthlyRentSummary,
  buildPropertyWiseIncome,
  buildTenantLedger,
  buildExpenseReport,
  buildProfitLoss,
} from '../../services/reportsService';
import { colors } from '../../theme/colors';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const TABS = ['Summary', 'Property', 'Tenant', 'Expense', 'Profit/Loss'];

export default function ReportsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('Summary');
  const [rentRecords, setRentRecords] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    const unsub1 = getRentRecords(setRentRecords);
    const unsub2 = getProperties(setProperties);
    const unsub3 = getTenants(setTenants);
    const unsub4 = getExpenses(setExpenses);
    const unsub5 = getAllUnits(setUnits);
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
    };
  }, []);

  const monthlySummary = buildMonthlyRentSummary(rentRecords);
  const propertyIncome = buildPropertyWiseIncome(rentRecords, units, properties);
  const tenantLedger = buildTenantLedger(rentRecords, tenants);
  const expenseReport = buildExpenseReport(expenses);
  const profitLoss = buildProfitLoss(rentRecords, expenses);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.addBtnText}>+ Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {activeTab === 'Summary' && (
          <>
            {monthlySummary.length === 0 ? (
              <Text style={styles.emptyText}>No rent data yet.</Text>
            ) : (
              monthlySummary.map((m, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{MONTH_NAMES[m.month - 1]} {m.year}</Text>
                  <Text style={styles.cardLine}>Expected: Rs. {m.expected}</Text>
                  <Text style={styles.cardLine}>Collected: Rs. {m.collected}</Text>
                  <Text style={styles.cardLine}>Pending: Rs. {m.pending}</Text>
                </View>
              ))
            )}
          </>
        )}

        {activeTab === 'Property' && (
          <>
            {propertyIncome.length === 0 ? (
              <Text style={styles.emptyText}>No data yet.</Text>
            ) : (
              propertyIncome.map((p: any, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{p.propertyName}</Text>
                  <Text style={styles.cardLine}>Collected: Rs. {p.collected}</Text>
                  <Text style={styles.cardLine}>Pending: Rs. {p.pending}</Text>
                </View>
              ))
            )}
          </>
        )}

        {activeTab === 'Tenant' && (
          <>
            {tenantLedger.length === 0 ? (
              <Text style={styles.emptyText}>No data yet.</Text>
            ) : (
              tenantLedger.map((t: any, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{t.tenantName}</Text>
                  <Text style={styles.cardLine}>Total Rent: Rs. {t.totalRent}</Text>
                  <Text style={styles.cardLine}>Paid: Rs. {t.totalPaid}</Text>
                  <Text style={styles.cardLine}>Pending: Rs. {t.totalPending}</Text>
                </View>
              ))
            )}
          </>
        )}

        {activeTab === 'Expense' && (
          <>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total Expenses</Text>
              <Text style={styles.totalValue}>Rs. {expenseReport.total}</Text>
            </View>
            {Object.entries(expenseReport.byCategory).map(([cat, amt]: any) => (
              <View key={cat} style={styles.card}>
                <Text style={styles.cardTitle}>{cat}</Text>
                <Text style={styles.cardLine}>Rs. {amt}</Text>
              </View>
            ))}
          </>
        )}

        {activeTab === 'Profit/Loss' && (
          <View style={styles.card}>
            <Text style={styles.cardLine}>Total Income: Rs. {profitLoss.totalIncome}</Text>
            <Text style={styles.cardLine}>Total Expense: Rs. {profitLoss.totalExpense}</Text>
            <Text style={[styles.cardTitle, { color: profitLoss.netProfit >= 0 ? colors.success : colors.danger, marginTop: 10 }]}>
              Net {profitLoss.netProfit >= 0 ? 'Profit' : 'Loss'}: Rs. {Math.abs(profitLoss.netProfit)}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  tabRow: { flexGrow: 0, marginBottom: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textSecondary, fontSize: 13 },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 30 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  cardLine: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  totalCard: { backgroundColor: colors.primary, padding: 18, borderRadius: 12, marginBottom: 14, alignItems: 'center' },
  totalLabel: { color: '#fff', fontSize: 13 },
  totalValue: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginTop: 4 },
});