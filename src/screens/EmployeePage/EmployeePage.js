import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert, SafeAreaView, Dimensions } from 'react-native';
import EmployeeService from '../../services/EmployeeServices';
import WorkerTaskCard from '../EmployeePage/WorkerTaskCard';
import { useColors, useThemeToggle } from '../../constants/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EmployeePage({ route, navigation }) {
  const AppColors = useColors();
  const { toggleTheme, isDark } = useThemeToggle();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const { workerId, username } = route.params;
  const [workerBudget, setWorkerBudget] = useState(0.0);
  const [currentStatus, setCurrentStatus] = useState('Müsait');
  const [activeTab, setActiveTab] = useState('POOL');
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const availabilityOptions = ['Müsait', 'Aktif Görevde', 'İzinli', 'Meşgul'];
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  useEffect(() => { loadInitialData(); }, []);
  useEffect(() => { fetchTasks(); }, [activeTab]);

  const loadInitialData = async () => {
    setLoading(true);
    const data = await EmployeeService.fetchWorkerData(workerId);
    if (data) {
      setWorkerBudget(data.budget || 0.0);
      setCurrentStatus(data.statusText || 'Bilinmiyor');
    }
    await fetchTasks();
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const data = await EmployeeService.fetchWorkerData(workerId);
    if (data) {
      setWorkerBudget(data.budget || 0.0);
      setCurrentStatus(data.statusText || 'Bilinmiyor');
    }
    await fetchTasks();
    setRefreshing(false);
  };

  const fetchTasks = async () => {
    let data = [];
    if (activeTab === 'POOL') { data = await EmployeeService.fetchPoolTasks(); }
    else { data = await EmployeeService.fetchTasks(workerId, activeTab); }
    setTasks(data);
  };

  const handleTaskRequest = async (taskId) => {
    const success = await EmployeeService.requestTask(taskId, workerId);
    if (success) { Alert.alert("Başarılı", "İş talebiniz alındı."); fetchTasks(); }
    else { Alert.alert("Hata", "İş talebi başarısız oldu."); }
  };

  const handleTaskComplete = async (taskId, desc, amount) => {
    const success = await EmployeeService.completeTaskWithBudget(taskId, workerId, desc, amount);
    if (success) { Alert.alert("Başarılı", "Onay talebi Admin'e gönderildi."); fetchTasks(); }
    else { Alert.alert("Hata", "İşlem başarısız oldu."); }
  };

  const handleStatusUpdate = async (newStatus) => {
    setShowStatusPicker(false);
    const success = await EmployeeService.updateStatus(workerId, newStatus);
    if (success) { setCurrentStatus(newStatus); Alert.alert("Başarılı", `Durum "${newStatus}" olarak güncellendi.`); }
    else { Alert.alert("Hata", "Durum güncellenemedi."); }
  };

  const openHistory = async () => {
    setShowHistory(true);
    const data = await EmployeeService.fetchBudgetHistory(workerId);
    setHistory(data);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    } catch { return dateStr; }
  };

  const renderTabItem = (id, label) => (
    <TouchableOpacity style={[styles.tabItem, activeTab === id && styles.activeTab]} onPress={() => setActiveTab(id)}>
      <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>Hoş Geldin, {username}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle} activeOpacity={0.7}>
              <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
              <Text style={styles.logoutText}>Çıkış</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetText}>
            Bakiye: {typeof workerBudget === 'number' ? workerBudget.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0.00'} ₺
          </Text>
          <TouchableOpacity style={styles.historySmallBtn} onPress={openHistory}>
            <Text style={styles.historySmallBtnText}>Bütçe Geçmişi</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.statusSelector} onPress={() => setShowStatusPicker(true)}>
          <Text style={styles.statusLabel}>Durum: </Text>
          <Text style={styles.statusValue}>{currentStatus}</Text>
          <Text style={styles.statusArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {renderTabItem('POOL', 'İş Havuzu')}
        {renderTabItem('IN_PROGRESS', 'Üzerimdekiler')}
        {renderTabItem('COMPLETED', 'Tamamlanan')}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color={AppColors.primary} />
      ) : (
        <FlatList data={tasks} keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          numColumns={2} columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <WorkerTaskCard task={item} onTaskRequest={handleTaskRequest} onTaskComplete={handleTaskComplete} cardWidth={(SCREEN_WIDTH - 30) / 2} />
          )}
          contentContainerStyle={styles.listContent} onRefresh={handleRefresh} refreshing={refreshing}
          ListEmptyComponent={<Text style={styles.emptyText}>Bu kategoride iş bulunamadı.</Text>}
        />
      )}

      {/* Bütçe Geçmişi Modalı */}
      <Modal visible={showHistory} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bütçe Geçmişi</Text>
            <FlatList data={history} keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={{ flex: 1 }}>
                    {item.timestamp && <Text style={styles.historyDate}>{formatDate(item.timestamp)}</Text>}
                    {item.conducted_by && <Text style={styles.historyConducted}>Yönetici: {item.conducted_by}</Text>}
                    <Text style={styles.historyDesc}>{item.description || 'Açıklama yok'}</Text>
                  </View>
                  <View style={styles.historyAmountContainer}>
                    <Text style={{ color: item.signed_amount?.includes('+') ? AppColors.success : AppColors.error, fontWeight: 'bold', fontSize: 16 }}>
                      {item.signed_amount} ₺
                    </Text>
                    <Text style={{ color: item.signed_amount?.includes('+') ? AppColors.success : AppColors.error, fontSize: 10 }}>
                      {item.signed_amount?.includes('+') ? 'Ekleme' : 'Çıkarma'}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Henüz işlem geçmişi yok.</Text>}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowHistory(false)}>
              <Text style={styles.closeBtnText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Müsaitlik Durumu Seçim Modalı */}
      <Modal visible={showStatusPicker} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: 'auto' }]}>
            <Text style={styles.modalTitle}>Müsaitlik Durumu</Text>
            {availabilityOptions.map((option) => (
              <TouchableOpacity key={option} style={[styles.statusOption, currentStatus === option && styles.statusOptionActive]} onPress={() => handleStatusUpdate(option)}>
                <Text style={[styles.statusOptionText, currentStatus === option && styles.statusOptionTextActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowStatusPicker(false)}>
              <Text style={styles.closeBtnText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  header: { padding: 20, backgroundColor: c.headerBackground, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  themeToggle: { width: 36, height: 36, borderRadius: 18, backgroundColor: c.whiteOverlay15, justifyContent: 'center', alignItems: 'center' },
  themeToggleText: { fontSize: 18 },
  welcomeText: { color: c.white, fontSize: 22, fontWeight: 'bold' },
  logoutText: { color: c.error, fontWeight: 'bold' },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  budgetText: { color: c.budgetPositive, fontSize: 22, fontWeight: '900' },
  historySmallBtn: { backgroundColor: c.whiteOverlay20, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 5 },
  historySmallBtnText: { color: c.white, fontSize: 12 },
  statusSelector: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: c.whiteOverlay15, padding: 10, borderRadius: 10 },
  statusLabel: { color: c.textSecondary, fontSize: 14 },
  statusValue: { color: c.white, fontSize: 14, fontWeight: 'bold', flex: 1 },
  statusArrow: { color: c.textSecondary, fontSize: 12 },
  tabBar: { flexDirection: 'row', margin: 15, backgroundColor: c.surface, borderRadius: 10, padding: 5, elevation: 2 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: c.primary },
  tabText: { color: c.primary, fontWeight: '600' },
  activeTabText: { color: c.white },
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  listContent: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: c.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: c.overlayDark, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: c.surface, height: '75%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: c.primary },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: c.divider },
  historyDate: { fontSize: 14, fontWeight: 'bold', color: c.textPrimary },
  historyConducted: { fontSize: 12, color: c.textSecondary, marginTop: 2 },
  historyDesc: { fontSize: 13, fontStyle: 'italic', color: c.secondary, marginTop: 4 },
  historyAmountContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  closeBtn: { backgroundColor: c.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  closeBtnText: { color: c.white, fontWeight: 'bold' },
  statusOption: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: c.divider, marginBottom: 8 },
  statusOptionActive: { backgroundColor: c.primary, borderColor: c.primary },
  statusOptionText: { fontSize: 16, color: c.textPrimary, textAlign: 'center' },
  statusOptionTextActive: { color: c.white, fontWeight: 'bold' },
});