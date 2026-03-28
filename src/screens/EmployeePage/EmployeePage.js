import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import EmployeeService from '../../services/EmployeeServices'; 
import WorkerTaskCard from '../EmployeePage/WorkerTaskCard'; 

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
    }
  };

  const handleTaskComplete = async (taskId, desc, amount) => {
    const success = await EmployeeService.completeTaskWithBudget(taskId, workerId, desc, amount);
    if (success) {
      Alert.alert("Başarılı", "Onay talebi Admin'e gönderildi.");
      fetchTasks();
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
      {/* 1. Header Alanı (Flutter'daki Gradyan yerine şık bir Flat Renk) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>Hoş Geldin, {username}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: '#ff5252', fontWeight: 'bold'}}>Çıkış</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.budgetText}>Bakiye: {workerBudget.toLocaleString('tr-TR')} ₺</Text>
        
        <TouchableOpacity style={styles.historySmallBtn} onPress={openHistory}>
          <Text style={{color: '#fff', fontSize: 12}}>Bütçe Geçmişini Gör</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Tab Bar */}
      <View style={styles.tabBar}>
        {renderTabItem('POOL', 'İş Havuzu')}
        {renderTabItem('IN_PROGRESS', 'Üzerimdekiler')}
        {renderTabItem('COMPLETED', 'Tamamlanan')}
      </View>

      {/* 3. Görev Listesi (GridView yerine React Native'de sütun sayısını ayarlıyoruz) */}
      {loading ? (
        <ActivityIndicator style={{marginTop: 50}} size="large" color="#455a64" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} // Flutter'daki GridView.builder(crossAxisCount: 2) karşılığı
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <WorkerTaskCard 
              task={item} 
              onTaskRequest={handleTaskRequest} 
              onTaskComplete={handleTaskComplete}
            />
          )}
          contentContainerStyle={styles.listContent}
          onRefresh={loadInitialData}
          refreshing={refreshing}
          ListEmptyComponent={<Text style={styles.emptyText}>Bu kategoride iş bulunamadı.</Text>}
        />
      )}

      {/* 4. Bütçe Geçmişi Modalı (Aynı kalabilir) */}
      <Modal visible={showHistory} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bütçe Geçmişi</Text>
            <FlatList
              data={history}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <Text style={{flex: 1}}>{item.description || 'Açıklama yok'}</Text>
                  <Text style={{ color: item.signedAmount?.includes('+') ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                    {item.signedAmount} ₺
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowHistory(false)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Kapat</Text>
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
  budgetText: { color: '#81c784', fontSize: 26, fontWeight: '900', marginTop: 10 },
  historySmallBtn: { marginTop: 15, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 5 },
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
  closeBtn: { backgroundColor: '#455a64', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 }
});