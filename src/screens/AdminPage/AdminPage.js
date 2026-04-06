// src/screens/AdminPage/AdminPage.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import adminService from '../../services/adminServices';

export default function AdminPage({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showBudget, setShowBudget] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const result = await adminService.fetchDashboardStats();
      setStats(result);
    } catch (error) {
      console.log('Dashboard stats error:', error);
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminService.logout();
      navigation.replace('LoginPage');
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    }
  };

  const menuItems = [
    {
      title: 'Yeni Arıza Kaydı',
      icon: '🛠️',
      screen: 'TaskManagement',
    },
    {
      title: 'İş & Bütçe Onay Merkezi',
      icon: '✅',
      screen: 'AdminApprovalPage',
    },
    {
      title: 'Yeni Kullanıcı Kaydı',
      icon: '👤',
      screen: 'UserRegistrationPage',
    },
    {
      title: 'İş Ata / Personel Durumu',
      icon: '📋',
      screen: 'ShowPersonelListPage',
    },
    {
      title: 'Bütçe Yönetimi',
      icon: '💰',
      screen: 'BudgetManagement',
    },
  ];

  const handleMenuPress = (screen) => {
    try {
      navigation.navigate(screen);
    } catch (error) {
      console.log('Navigation error:', error);
      Alert.alert('Uyarı', `${screen} sayfası henüz eklenmemiş olabilir.`);
    }
  };

  const rawBudget =
    stats?.budget != null ? `${Number(stats.budget).toFixed(2)} ₺` : '--- ₺';

  const budgetText = showBudget ? rawBudget : '•••••• ₺';

  const statusText = stats?.system_status
    ? `Sistem ${stats.system_status}`
    : loadingStats
    ? 'Yükleniyor...'
    : 'Hata';

  const nameText = stats?.name || 'Admin';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Admin Paneli</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoTopRow}>
            <View style={styles.adminIconWrapper}>
              <Text style={styles.adminIcon}>🛡️</Text>
            </View>

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
                  <TouchableOpacity
                    onPress={() => setShowBudget(!showBudget)}
                    style={styles.eyeButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.eyeButtonText}>
                      {showBudget ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {loadingStats ? (
                <ActivityIndicator color="#ffffff" style={styles.loader} />
              ) : (
                <Text style={styles.balanceValue}>{budgetText}</Text>
              )}
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.menuWrapper}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuButton}
              activeOpacity={0.85}
              onPress={() => handleMenuPress(item.screen)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrapper}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>

                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Oturumu Kapat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#455a64',
  secondary: '#607d8b',
  background: '#eef2f5',
  surface: '#ffffff',
  textPrimary: '#263238',
  textSecondary: '#78909c',
  error: '#d32f2f',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 14,
  },
  infoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  infoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  adminIcon: {
    fontSize: 26,
  },
  welcomeLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  adminName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    marginVertical: 24,
  },
  infoBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceContainer: {
    flex: 1,
    marginRight: 12,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  eyeButton: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  eyeButtonText: {
    fontSize: 16,
  },
  balanceValue: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 26,
  },
  loader: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    maxWidth: '42%',
  },
  statusText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  menuWrapper: {
    flex: 1,
  },
  menuList: {
    paddingBottom: 20,
  },
  menuButton: {
    height: 70,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(69,90,100,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'rgba(211,47,47,0.10)',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(211,47,47,0.20)',
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: 'bold',
    fontSize: 16,
  },
});