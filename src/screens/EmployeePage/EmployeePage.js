import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert, SafeAreaView, Dimensions } from 'react-native';
import EmployeeService from '../../services/EmployeeServices'; 
import WorkerTaskCard from '../EmployeePage/WorkerTaskCard'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EmployeePage({ route, navigation }) {
  // Params: Flutter'daki widget.workerId ve widget.username
  const { workerId, username } = route.params; 

  // --- State Yönetimi ---
  const [workerBudget, setWorkerBudget] = useState(0.0);
  const [currentStatus, setCurrentStatus] = useState('Müsait');
  const [activeTab, setActiveTab] = useState('POOL'); // POOL, IN_PROGRESS, COMPLETED
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Müsaitlik Durumu Seçenekleri (Flutter ile aynı)
  const availabilityOptions = ['Müsait', 'Aktif Görevde', 'İzinli', 'Meşgul'];
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

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

  // Pull-to-refresh handler (loading state'inden ayrı)
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
    if (activeTab === 'POOL') {
      data = await EmployeeService.fetchPoolTasks();
    } else {
      data = await EmployeeService.fetchTasks(workerId, activeTab);
    }
    setTasks(data);
  };

  const handleTaskRequest = async (taskId) => {
    const success = await EmployeeService.requestTask(taskId, workerId);
    if (success) {
      Alert.alert("Başarılı", "İş talebiniz alındı.");
      fetchTasks();
    } else {
      Alert.alert("Hata", "İş talebi başarısız oldu.");
    }
  };

  const handleTaskComplete = async (taskId, desc, amount) => {
    const success = await EmployeeService.completeTaskWithBudget(taskId, workerId, desc, amount);
    if (success) {
      Alert.alert("Başarılı", "Onay talebi Admin'e gönderildi.");
      fetchTasks();
    } else {
      Alert.alert("Hata", "İşlem başarısız oldu.");
    }
  };

  // Müsaitlik durumunu güncelle
  const handleStatusUpdate = async (newStatus) => {
    setShowStatusPicker(false);
    const success = await EmployeeService.updateStatus(workerId, newStatus);
    if (success) {
      setCurrentStatus(newStatus);
      Alert.alert("Başarılı", `Durum "${newStatus}" olarak güncellendi.`);
    } else {
      Alert.alert("Hata", "Durum güncellenemedi.");
    }
  };

  const openHistory = async () => {
    setShowHistory(true);
    const data = await EmployeeService.fetchBudgetHistory(workerId);
    setHistory(data);
  };

  const renderTabItem = (id, label) => (
    <TouchableOpacity 
      style={[styles.tabItem, activeTab === id && styles.activeTab]} 
      onPress={() => setActiveTab(id)}
    >
      <Text style={[styles.tabText, activeTab === id && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Alanı */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>Hoş Geldin, {username}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: '#ff5252', fontWeight: 'bold'}}>Çıkış</Text>
          </TouchableOpacity>
        </View>

        {/* Bütçe ve Geçmiş Butonu */}
        <View style={styles.budgetRow}>
          <Text style={styles.budgetText}>
            Bakiye: {typeof workerBudget === 'number' ? workerBudget.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0.00'} ₺
          </Text>
          <TouchableOpacity style={styles.historySmallBtn} onPress={openHistory}>
            <Text style={{color: '#fff', fontSize: 12}}>Bütçe Geçmişi</Text>
          </TouchableOpacity>
        </View>

        {/* Müsaitlik Durumu Seçici (Flutter'daki DropdownButtonFormField karşılığı) */}
        <TouchableOpacity style={styles.statusSelector} onPress={() => setShowStatusPicker(true)}>
          <Text style={styles.statusLabel}>Durum: </Text>
          <Text style={styles.statusValue}>{currentStatus}</Text>
          <Text style={styles.statusArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Tab Bar */}
      <View style={styles.tabBar}>
        {renderTabItem('POOL', 'İş Havuzu')}
        {renderTabItem('IN_PROGRESS', 'Üzerimdekiler')}
        {renderTabItem('COMPLETED', 'Tamamlanan')}
      </View>

      {/* 3. Görev Listesi */}
      {loading ? (
        <ActivityIndicator style={{marginTop: 50}} size="large" color="#455a64" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <WorkerTaskCard 
              task={item} 
              onTaskRequest={handleTaskRequest} 
              onTaskComplete={handleTaskComplete}
              cardWidth={(SCREEN_WIDTH - 30) / 2}
            />
          )}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={<Text style={styles.emptyText}>Bu kategoride iş bulunamadı.</Text>}
        />
      )}

      {/* 4. Bütçe Geçmişi Modalı */}
      <Modal visible={showHistory} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bütçe Geçmişi</Text>
            <FlatList
              data={history}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={{flex: 1}}>
                    {item.timestamp && (
                      <Text style={styles.historyDate}>{item.timestamp}</Text>
                    )}
                    {item.conductedBy && (
                      <Text style={styles.historyConducted}>Yönetici: {item.conductedBy}</Text>
                    )}
                    <Text style={styles.historyDesc}>{item.description || 'Açıklama yok'}</Text>
                  </View>
                  <View style={styles.historyAmountContainer}>
                    <Text style={{ 
                      color: item.signedAmount?.includes('+') ? '#4caf50' : '#f44336', 
                      fontWeight: 'bold',
                      fontSize: 16
                    }}>
                      {item.signedAmount} ₺
                    </Text>
                    <Text style={{ 
                      color: item.signedAmount?.includes('+') ? '#4caf50' : '#f44336', 
                      fontSize: 10 
                    }}>
                      {item.signedAmount?.includes('+') ? 'Ekleme' : 'Çıkarma'}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Henüz işlem geçmişi yok.</Text>
              }
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowHistory(false)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. Müsaitlik Durumu Seçim Modalı */}
      <Modal visible={showStatusPicker} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: 'auto' }]}>
            <Text style={styles.modalTitle}>Müsaitlik Durumu</Text>
            {availabilityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.statusOption,
                  currentStatus === option && styles.statusOptionActive
                ]}
                onPress={() => handleStatusUpdate(option)}
              >
                <Text style={[
                  styles.statusOptionText,
                  currentStatus === option && styles.statusOptionTextActive
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowStatusPicker(false)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { padding: 20, backgroundColor: '#455a64', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  budgetText: { color: '#81c784', fontSize: 22, fontWeight: '900' },
  historySmallBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 5 },
  
  // Müsaitlik Durumu Seçici
  statusSelector: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 12, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    padding: 10, 
    borderRadius: 10 
  },
  statusLabel: { color: '#ccc', fontSize: 14 },
  statusValue: { color: '#fff', fontSize: 14, fontWeight: 'bold', flex: 1 },
  statusArrow: { color: '#ccc', fontSize: 12 },
  
  tabBar: { flexDirection: 'row', margin: 15, backgroundColor: '#fff', borderRadius: 10, padding: 5, elevation: 2 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#455a64' },
  tabText: { color: '#455a64', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  row: { justifyContent: 'space-between', paddingHorizontal: 10 },
  listContent: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', height: '75%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#455a64' },
  
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  historyDate: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  historyConducted: { fontSize: 12, color: '#888', marginTop: 2 },
  historyDesc: { fontSize: 13, fontStyle: 'italic', color: '#555', marginTop: 4 },
  historyAmountContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  
  closeBtn: { backgroundColor: '#455a64', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  
  // Müsaitlik Modalı
  statusOption: { 
    padding: 15, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#eee', 
    marginBottom: 8 
  },
  statusOptionActive: { 
    backgroundColor: '#455a64', 
    borderColor: '#455a64' 
  },
  statusOptionText: { 
    fontSize: 16, 
    color: '#333', 
    textAlign: 'center' 
  },
  statusOptionTextActive: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});