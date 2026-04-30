// src/screens/AdminPage/AdminApprovalPage.js
// Flutter: admin_approval_page.dart karşılığı

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import approvalService from '../../services/approvalServices';
import { useColors } from '../../constants/ThemeContext';

const REQUEST_TYPES = ['task_assignment', 'budget_approval'];
const TAB_TITLES = ['İş Atama Talepleri', 'Bütçe Harcama Talepleri'];

export default function AdminApprovalPage({ navigation }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const [activeTab, setActiveTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const data = await approvalService.fetchPendingRequests(REQUEST_TYPES[activeTab]);
    setRequests(data);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const handleProcess = (requestId, action) => {
    const label = action === 'approve' ? 'onaylamak' : 'reddetmek';
    Alert.alert('Onay İşlemi', `Bu talebi ${label} istediğinizden emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      { text: action === 'approve' ? 'Onayla' : 'Reddet', style: action === 'reject' ? 'destructive' : 'default',
        onPress: async () => {
          const result = await approvalService.processApproval(requestId, REQUEST_TYPES[activeTab], action);
          Alert.alert(result.success ? 'Başarılı' : 'Hata', result.message);
          if (result.success) loadRequests();
        },
      },
    ]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih Yok';
    try { const d = new Date(dateStr); return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`; }
    catch { return dateStr; }
  };

  const renderCard = ({ item }) => {
    const isTask = activeTab === 0;
    return (
      <View style={styles.card}>
        <Text style={styles.cardIcon}>{isTask ? '📋' : '💰'}</Text>
        <View style={styles.cardContent}>
          {isTask ? (
            <>
              <Text style={styles.cardTitle}>İş: {item.task_title || 'N/A'}</Text>
              <Text style={styles.cardSub}>Talep Eden: {item.worker_name || 'Bilinmiyor'}</Text>
            </>
          ) : (
            <>
              <Text style={[styles.cardTitle, { color: AppColors.primary }]}>Miktar: {item.amount || 0} ₺</Text>
              <Text style={styles.cardSub}>Talep Eden: {item.worker_name || 'Bilinmiyor'}</Text>
              <Text style={styles.cardDesc}>Gerekçe: {item.description || 'Açıklama Yok'}</Text>
            </>
          )}
          <Text style={styles.cardDate}>Tarih: {formatDate(item.request_date)}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => handleProcess(item.id, 'reject')}>
            <Text style={{ color: AppColors.error, fontWeight: 'bold', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn} onPress={() => handleProcess(item.id, 'approve')}>
            <Text style={{ color: AppColors.white, fontWeight: 'bold', fontSize: 12 }}>Onayla</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Geri</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Yönetici Onay Merkezi</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={styles.tabBar}>
        {TAB_TITLES.map((t, i) => (
          <TouchableOpacity key={i} style={[styles.tab, activeTab === i && styles.activeTab]} onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabText, activeTab === i && styles.activeTabText]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? <ActivityIndicator style={{ marginTop: 50 }} size="large" color={AppColors.primary} /> : (
        <FlatList data={requests} keyExtractor={(item) => item.id.toString()} renderItem={renderCard}
          contentContainerStyle={{ padding: 12 }} onRefresh={loadRequests} refreshing={false}
          ListEmptyComponent={<Text style={styles.empty}>Bekleyen talep bulunmamaktadır.</Text>} />
      )}
    </SafeAreaView>
  );
}

const createStyles = (AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: AppColors.headerBackground },
  back: { color: AppColors.headerText, fontSize: 16, fontWeight: '600' },
  headerTitle: { color: AppColors.headerText, fontSize: 18, fontWeight: 'bold' },
  tabBar: { flexDirection: 'row', backgroundColor: AppColors.headerBackground, paddingHorizontal: 8, paddingBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, marginHorizontal: 4 },
  activeTab: { backgroundColor: AppColors.activeTabBackground },
  tabText: { color: AppColors.inactiveTabText, fontWeight: '600', fontSize: 13 },
  activeTabText: { color: AppColors.white },
  card: { backgroundColor: AppColors.surface, borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  cardIcon: { fontSize: 28, marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: AppColors.textPrimary, marginBottom: 2 },
  cardSub: { fontSize: 13, color: AppColors.textPrimary },
  cardDesc: { fontSize: 12, color: AppColors.textSecondary, marginTop: 2 },
  cardDate: { fontSize: 11, color: AppColors.textSecondary, marginTop: 4 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rejectBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: AppColors.errorLight, justifyContent: 'center', alignItems: 'center' },
  approveBtn: { backgroundColor: AppColors.success, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  empty: { textAlign: 'center', marginTop: 50, color: AppColors.textSecondary, fontSize: 15 },
});
