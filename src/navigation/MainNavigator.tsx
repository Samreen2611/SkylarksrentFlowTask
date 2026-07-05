import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import PropertiesListScreen from '../screens/properties/PropertiesListScreen';
import AddPropertyScreen from '../screens/properties/AddPropertyScreen';
import PropertyDetailScreen from '../screens/properties/PropertyDetailScreen';
import AddUnitScreen from '../screens/units/AddUnitScreen';
import TenantsListScreen from '../screens/tenants/TenantsListScreen';
import AddTenantScreen from '../screens/tenants/AddTenantScreen';
import TenantDetailScreen from '../screens/tenants/TenantDetailScreen';
import AgreementsListScreen from '../screens/agreements/AgreementsListScreen';
import CreateAgreementScreen from '../screens/agreements/CreateAgreementScreen';
import AgreementDetailScreen from '../screens/agreements/AgreementDetailScreen';
import RentRecordsListScreen from '../screens/rentrecords/RentRecordsListScreen';
import GenerateRentScreen from '../screens/rentrecords/GenerateRentScreen';
import RentRecordDetailScreen from '../screens/rentrecords/RentRecordDetailScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import AddExpenseScreen from '../screens/reports/AddExpenseScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const PropertiesStack = createNativeStackNavigator();
const TenantsStack = createNativeStackNavigator();
const AgreementsStack = createNativeStackNavigator();
const RentRecordsStack = createNativeStackNavigator();
const ReportsStack = createNativeStackNavigator();

function PropertiesStackNavigator() {
  return (
    <PropertiesStack.Navigator screenOptions={{ headerShown: false }}>
      <PropertiesStack.Screen name="PropertiesList" component={PropertiesListScreen} />
      <PropertiesStack.Screen name="AddProperty" component={AddPropertyScreen} />
      <PropertiesStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <PropertiesStack.Screen name="AddUnit" component={AddUnitScreen} />
    </PropertiesStack.Navigator>
  );
}

function TenantsStackNavigator() {
  return (
    <TenantsStack.Navigator screenOptions={{ headerShown: false }}>
      <TenantsStack.Screen name="TenantsList" component={TenantsListScreen} />
      <TenantsStack.Screen name="AddTenant" component={AddTenantScreen} />
      <TenantsStack.Screen name="TenantDetail" component={TenantDetailScreen} />
    </TenantsStack.Navigator>
  );
}

function AgreementsStackNavigator() {
  return (
    <AgreementsStack.Navigator screenOptions={{ headerShown: false }}>
      <AgreementsStack.Screen name="AgreementsList" component={AgreementsListScreen} />
      <AgreementsStack.Screen name="CreateAgreement" component={CreateAgreementScreen} />
      <AgreementsStack.Screen name="AgreementDetail" component={AgreementDetailScreen} />
    </AgreementsStack.Navigator>
  );
}

function RentRecordsStackNavigator() {
  return (
    <RentRecordsStack.Navigator screenOptions={{ headerShown: false }}>
      <RentRecordsStack.Screen name="RentRecordsList" component={RentRecordsListScreen} />
      <RentRecordsStack.Screen name="GenerateRent" component={GenerateRentScreen} />
      <RentRecordsStack.Screen name="RentRecordDetail" component={RentRecordDetailScreen} />
    </RentRecordsStack.Navigator>
  );
}

function ReportsStackNavigator() {
  return (
    <ReportsStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportsStack.Screen name="ReportsMain" component={ReportsScreen} />
      <ReportsStack.Screen name="AddExpense" component={AddExpenseScreen} />
    </ReportsStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Properties" component={PropertiesStackNavigator} />
      <Tab.Screen name="Tenants" component={TenantsStackNavigator} />
      <Tab.Screen name="Agreements" component={AgreementsStackNavigator} />
      <Tab.Screen name="Rent" component={RentRecordsStackNavigator} />
      <Tab.Screen name="Reports" component={ReportsStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}