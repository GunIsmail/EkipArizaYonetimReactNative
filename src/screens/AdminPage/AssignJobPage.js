// src/screens/AdminPage/AssignJobPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import taskService from '../../services/taskServices';
import { useColors } from '../../constants/ThemeContext';

export default function AssignJobPage({ route, navigation }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);
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
    if (!selectedTask) { Alert.alert('Uyarı', 'Lütfen listeden bir iş seçiniz.'); return; }
    setSubmitting(true);
    const success = await taskService.assignTaskToWorker(selectedTask.id, worker.id, note);
    setSubmitting(false);
    if (success) { Alert.alert('Başarılı', `${worker.name} başarıyla görevlendirildi!`); navigation.goBack(); }
    else { Alert.alert('Hata', 'Atama yapılırken bir hata oluştu!'); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Geri</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>{worker.name} - İş Atama</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={[styles.workerCard, { borderLeftColor: worker.statusColor || AppColors.primary }]}>
          <View style={[styles.avatar, { backgroundColor: worker.statusColor || AppColors.primary }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.workerName}>{worker.name}</Text>
            <Text style={styles.workerRole}>{worker.role} - {worker.status}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Bekleyen İşler Listesi</Text>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={AppColors.primary} />
        ) : tasks.length === 0 ? (
          <View style={styles.emptyCard}><Text style={styles.emptyText}>Atanacak yeni iş bulunamadı.</Text></View>
        ) : (
          <View>
            {tasks.map((task) => (
              <TouchableOpacity key={task.id} style={[styles.taskOption, selectedTask?.id === task.id && styles.taskOptionSelected]} onPress={() => setSelectedTask(task)}>
                <Text style={styles.taskOptionIcon}>{selectedTask?.id === task.id ? '🔘' : '⚪'}</Text>
                <Text style={styles.taskOptionText} numberOfLines={2}>{task.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {selectedTask && (
          <View style={styles.detailBox}>
            <Text style={styles.detailText}>📍 Adres: {selectedTask.customer_address || 'Belirtilmemiş'}</Text>
            <Text style={styles.detailText}>ℹ️ Durum: {selectedTask.status_display || selectedTask.status}</Text>
          </View>
        )}
        <Text style={styles.sectionTitle}>Yönetici Notu / Açıklama</Text>
        <TextInput style={styles.noteInput} placeholder="Örn: Yedek parça almayı unutma..." placeholderTextColor={AppColors.textSecondary} value={note} onChangeText={setNote} multiline numberOfLines={4} />
        <TouchableOpacity style={[styles.submitBtn, (submitting || tasks.length === 0) && styles.disabledBtn]} onPress={handleAssign} disabled={submitting || tasks.length === 0}>
          {submitting ? <ActivityIndicator color={AppColors.white} size="small" /> : <Text style={styles.submitText}>İşi Ata</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: c.headerBackground },
  back: { color: c.headerText, fontSize: 16, fontWeight: '600' },
  headerTitle: { color: c.headerText, fontSize: 16, fontWeight: 'bold' },
  body: { flex: 1, padding: 16 },
  workerCard: { backgroundColor: c.surface, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderLeftWidth: 4, elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 20 },
  workerName: { fontSize: 16, fontWeight: 'bold', color: c.textPrimary },
  workerRole: { fontSize: 13, color: c.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: c.textPrimary, marginBottom: 10 },
  taskOption: { backgroundColor: c.surface, borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: c.border },
  taskOptionSelected: { borderColor: c.primary, backgroundColor: c.primaryLight5 },
  taskOptionIcon: { fontSize: 16, marginRight: 10 },
  taskOptionText: { flex: 1, fontSize: 14, color: c.textPrimary },
  detailBox: { backgroundColor: c.primaryLight, borderRadius: 10, padding: 12, marginTop: 6, marginBottom: 16, borderWidth: 1, borderColor: c.primaryLight15 },
  detailText: { fontSize: 14, color: c.textPrimary, marginBottom: 4 },
  noteInput: { backgroundColor: c.surface, borderRadius: 12, padding: 14, fontSize: 15, color: c.textPrimary, borderWidth: 1, borderColor: c.border, minHeight: 100, textAlignVertical: 'top', marginBottom: 24 },
  submitBtn: { backgroundColor: c.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', elevation: 3 },
  disabledBtn: { opacity: 0.5 },
  submitText: { color: c.white, fontWeight: 'bold', fontSize: 16 },
  emptyCard: { backgroundColor: c.surfaceAlt, borderRadius: 10, padding: 16, marginBottom: 16 },
  emptyText: { color: c.error, fontSize: 14 },
});
