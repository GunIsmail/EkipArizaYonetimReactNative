// src/screens/AdminPage/AdminPage.js

import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import adminService from '../../services/adminServices';
import { useColors, useThemeToggle } from '../../constants/ThemeContext';

export default function AdminPage({ navigation }) {
  const AppColors = useColors();
  const { toggleTheme, isDark } = useThemeToggle();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showBudget, setShowBudget] = useState(true);

  useEffect(() => { loadDashboardStats(); }, []);

  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const result = await adminService.fetchDashboardStats();
      setStats(result);
    } catch (error) {
      console.log('Dashboard stats error:', error);
      setStats(null);
    } finally { setLoadingStats(false); }
  };

  const handleLogout = async () => {
    try {
      await adminService.logout();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.log('Logout error details:', error);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  const menuItems = [
    { title: 'Yeni Arıza Kaydı', icon: '🛠️', screen: 'TaskManagement' },
    { title: 'İş & Bütçe Onay Merkezi', icon: '✅', screen: 'AdminApprovalPage' },
    { title: 'Yeni Kullanıcı Kaydı', icon: '👤', screen: 'UserRegistrationPage' },
    { title: 'İş Ata / Personel Durumu', icon: '📋', screen: 'ShowPersonelListPage' },
    { title: 'Bütçe Yönetimi', icon: '💰', screen: 'BudgetManagement' },
  ];

  const handleMenuPress = (screen) => {
    try { navigation.navigate(screen); }
    catch (error) { Alert.alert('Uyarı', `${screen} sayfası henüz eklenmemiş olabilir.`); }
  };

  const rawBudget = stats?.budget != null ? `${Number(stats.budget).toFixed(2)} ₺` : '--- ₺';
  const budgetText = showBudget ? rawBudget : '•••••• ₺';
  const statusText = stats?.system_status ? `Sistem ${stats.system_status}` : loadingStats ? 'Yükleniyor...' : 'Hata';
  const nameText = stats?.name || 'Admin';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Admin Paneli</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle} activeOpacity={0.7}>
            <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoTopRow}>
            <View style={styles.adminIconWrapper}><Text style={styles.adminIcon}>🛡️</Text></View>
            <View>
              <Text style={styles.welcomeLabel}>Hoş Geldiniz,</Text>
              <Text style={styles.adminName}>{nameText}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoBottomRow}>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceHeaderRow}>
                <Text style={styles.balanceLabel}>Kasa Bakiyesi</Text>
                {!loadingStats && (
                  <TouchableOpacity onPress={() => setShowBudget(!showBudget)} style={styles.eyeButton} activeOpacity={0.8}>
                    <Text style={styles.eyeButtonText}>{showBudget ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                )}
              </View>
              {loadingStats ? (
                <ActivityIndicator color={AppColors.white} style={styles.loader} />
              ) : (
                <Text style={styles.balanceValue}>{budgetText}</Text>
              )}
            </View>
            <View style={styles.statusBadge}><Text style={styles.statusText}>{statusText}</Text></View>
          </View>
        </View>

        <ScrollView style={styles.menuWrapper} contentContainerStyle={styles.menuList} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuButton} activeOpacity={0.85} onPress={() => handleMenuPress(item.screen)}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrapper}><Text style={styles.menuIcon}>{item.icon}</Text></View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={handleLogout}>
          <Text style={styles.logoutText}>Oturumu Kapat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 14 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: AppColors.textPrimary, letterSpacing: 1.2 },
  themeToggle: { width: 44, height: 44, borderRadius: 22, backgroundColor: AppColors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  themeToggleText: { fontSize: 22 },
  infoCard: { backgroundColor: AppColors.primary, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: AppColors.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  infoTopRow: { flexDirection: 'row', alignItems: 'center' },
  adminIconWrapper: { width: 54, height: 54, borderRadius: 27, backgroundColor: AppColors.whiteOverlay20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  adminIcon: { fontSize: 26 },
  welcomeLabel: { color: AppColors.whiteOverlay75, fontSize: 14 },
  adminName: { color: AppColors.white, fontWeight: 'bold', fontSize: 18, marginTop: 2 },
  divider: { height: 1, backgroundColor: AppColors.whiteOverlay20, marginVertical: 24 },
  infoBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceContainer: { flex: 1, marginRight: 12 },
  balanceHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  balanceLabel: { color: AppColors.whiteOverlay75, fontSize: 14 },
  eyeButton: { marginLeft: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: AppColors.whiteOverlay12 },
  eyeButtonText: { fontSize: 16 },
  balanceValue: { color: AppColors.white, fontWeight: '900', fontSize: 26 },
  loader: { alignSelf: 'flex-start', marginTop: 4 },
  statusBadge: { backgroundColor: AppColors.whiteOverlay15, borderRadius: 30, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: AppColors.whiteOverlay30, maxWidth: '42%' },
  statusText: { color: AppColors.white, fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  menuWrapper: { flex: 1 },
  menuList: { paddingBottom: 20 },
  menuButton: { height: 70, backgroundColor: AppColors.surface, borderRadius: 20, paddingHorizontal: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: AppColors.shadowColor, shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIconWrapper: { width: 46, height: 46, borderRadius: 23, backgroundColor: AppColors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuIcon: { fontSize: 22 },
  menuTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: AppColors.textPrimary },
  arrow: { fontSize: 24, color: AppColors.textSecondary, marginLeft: 12 },
  logoutButton: { width: '100%', backgroundColor: AppColors.errorLight, borderRadius: 16, paddingVertical: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: AppColors.errorLight20 },
  logoutText: { color: AppColors.error, fontWeight: 'bold', fontSize: 16 },
});