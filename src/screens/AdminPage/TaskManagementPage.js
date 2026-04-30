// src/screens/AdminPage/TaskManagementPage.js
// Flutter: task_management.dart karşılığı
// İş emri yönetimi: Sekmeli listeleme + oluşturma + silme

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import taskService from '../../services/taskServices';
import TaskCreationModal from './TaskCreationModal';

const COLORS = {
  primary: '#455a64',
  secondary: '#607d8b',
  background: '#eef2f5',
  surface: '#ffffff',
  textPrimary: '#263238',
  textSecondary: '#78909c',
  success: '#4caf50',
  error: '#d32f2f',
  warning: '#fbc02d',
};

const STATUS_FILTERS = ['NEW', 'IN_PROGRESS', 'COMPLETED'];
const TAB_TITLES = ['Yeni (Aktif)', 'Süreçte', 'Tamamlandı'];

const getStatusColor = (status) => {
  switch (status) {
    case 'NEW':
      return COLORS.error;
    case 'IN_PROGRESS':
      return COLORS.warning;
    case 'COMPLETED':
      return COLORS.success;
    default:
      return COLORS.textSecondary;
  }
};

export default function TaskManagementPage({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    const data = await taskService.fetchTasksByStatus(STATUS_FILTERS[activeTab]);
    setTasks(data);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDelete = (taskId, taskTitle) => {
    Alert.alert(
      'İş Emrini Sil',
      `"${taskTitle}" başlıklı iş emrini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            const success = await taskService.deleteTask(taskId);
            if (success) {
              Alert.alert('Başarılı', 'İş emri silindi.');
              loadTasks();
            } else {
              Alert.alert('Hata', 'Silme işlemi başarısız.');
            }
          },
        },
      ]
    );
  };

  const renderTaskCard = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <View style={[styles.taskCard, { borderLeftColor: statusColor }]}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskIcon}>🔧</Text>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskStatus}>
              Durum: {item.status_display || item.status}
            </Text>
            {item.assigned_worker_name && (
              <Text style={styles.taskDetail}>
                Atanan: {item.assigned_worker_name}
              </Text>
            )}
            <Text style={styles.taskDetail}>
              Adres: {item.customer_address || 'Belirtilmemiş'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item.id, item.title)}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Başlık */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İş Emri Yönetimi</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Sekmeler */}
      <View style={styles.tabBar}>
        {TAB_TITLES.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabItem, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Görev Listesi */}
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 50 }}
          size="large"
          color={COLORS.primary}
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTaskCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {TAB_TITLES[activeTab]} iş emri bulunamadı.
            </Text>
          }
          onRefresh={loadTasks}
          refreshing={false}
        />
      )}

      {/* FAB - Yeni İş Emri */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.fabText}>+ Yeni İş Emri</Text>
      </TouchableOpacity>

      {/* Oluşturma Modalı */}
      <TaskCreationModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={loadTasks}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  backBtn: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  taskDetail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
