// src/screens/AdminPage/AssignJobPage.js
// Flutter: assign_job_page.dart karşılığı

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import taskService from '../../services/taskServices';

const COLORS = { primary: '#455a64', background: '#eef2f5', surface: '#f5f5f5', textPrimary: '#263238', textSecondary: '#78909c', success: '#4caf50', error: '#d32f2f' };

export default function AssignJobPage({ route, navigation }) {
  const { worker } = route.params;

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadPendingTasks(); }, []);

  const loadPendingTasks = async () => {
    setLoading(true);
    const data = await taskService.fetchTasksByStatus('NEW');
    setTasks(data);
    setLoading(false);
  };

  const handleAssign = async () => {
    if (!selectedTask) {
      Alert.alert('Uyarı', 'Lütfen listeden bir iş seçiniz.');
      return;
    }

    setSubmitting(true);
    const success = await taskService.assignTaskToWorker(selectedTask.id, worker.id, note);
    setSubmitting(false);

    if (success) {
      Alert.alert('Başarılı', `${worker.name} başarıyla görevlendirildi!`);
      navigation.goBack();
    } else {
      Alert.alert('Hata', 'Atama yapılırken bir hata oluştu!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{worker.name} - İş Atama</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Personel Bilgi Kartı */}
        <View style={[styles.workerCard, { borderLeftColor: worker.statusColor || COLORS.primary }]}>
          <View style={[styles.avatar, { backgroundColor: worker.statusColor || COLORS.primary }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerRole}>{worker.role} - {worker.status}</Text>
          </View>
        </View>

        {/* İş Seçimi */}
        <Text style={styles.sectionTitle}>Bekleyen İşler Listesi</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.primary} />
        ) : tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Atanacak yeni iş bulunamadı.</Text>
          </View>
        ) : (
          <View>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskOption, selectedTask?.id === task.id && styles.taskOptionSelected]}
                onPress={() => setSelectedTask(task)}
              >
                <Text style={styles.taskOptionIcon}>{selectedTask?.id === task.id ? '🔘' : '⚪'}</Text>
                <Text style={styles.taskOptionText} numberOfLines={2}>{task.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Seçilen iş detayı */}
        {selectedTask && (
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>📍 Adres: {selectedTask.customer_address || 'Belirtilmemiş'}</Text>
            <Text style={styles.detailText}>ℹ️ Durum: {selectedTask.status_display || selectedTask.status}</Text>
          </View>
        )}

        {/* Yönetici Notu */}
        <Text style={styles.sectionTitle}>Yönetici Notu / Açıklama</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Örn: Yedek parça almayı unutma..."
          placeholderTextColor={COLORS.textSecondary}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
        />

        {/* Atama Butonu */}
        <TouchableOpacity
          style={[styles.submitBtn, (submitting || tasks.length === 0) && styles.disabledBtn]}
          onPress={handleAssign}
          disabled={submitting || tasks.length === 0}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitText}>İşi Ata</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#455a64' },
  back: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  body: { flex: 1, padding: 16 },
  workerCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderLeftWidth: 4, elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 20 },
  workerName: { fontSize: 16, fontWeight: 'bold', color: '#263238' },
  workerRole: { fontSize: 13, color: '#78909c', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#263238', marginBottom: 10 },
  taskOption: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  taskOptionSelected: { borderColor: '#455a64', backgroundColor: 'rgba(69,90,100,0.05)' },
  taskOptionIcon: { fontSize: 16, marginRight: 10 },
  taskOptionText: { flex: 1, fontSize: 14, color: '#263238' },
  detailBox: { backgroundColor: 'rgba(69,90,100,0.08)', borderRadius: 10, padding: 12, marginTop: 6, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(69,90,100,0.15)' },
  detailText: { fontSize: 14, color: '#263238', marginBottom: 4 },
  noteInput: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#263238', borderWidth: 1, borderColor: '#e0e0e0', minHeight: 100, textAlignVertical: 'top', marginBottom: 24 },
  submitBtn: { backgroundColor: '#455a64', borderRadius: 12, paddingVertical: 16, alignItems: 'center', elevation: 3 },
  disabledBtn: { opacity: 0.5 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyCard: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 16, marginBottom: 16 },
  emptyText: { color: '#d32f2f', fontSize: 14 },
});
