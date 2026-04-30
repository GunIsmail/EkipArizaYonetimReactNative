import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useColors } from '../../constants/ThemeContext';

export default function WorkerTaskCard({ task, onTaskRequest, onTaskComplete, cardWidth }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);

  const [modalVisible, setModalVisible] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return AppColors.primary;
      case 'IN_PROGRESS': return AppColors.warning;
      case 'COMPLETED': return AppColors.success;
      default: return AppColors.textSecondary;
    }
  };

  const statusColor = getStatusColor(task.status);
  const statusDisplay = task.statusDisplay || task.status_display || task.status || '';

  return (
    <View style={[styles.card, { borderTopColor: statusColor, width: cardWidth }]}>
      <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
      <Text style={styles.address} numberOfLines={2}>{task.customerAddress || task.customer_address || 'Adres yok'}</Text>
      <Text style={[styles.status, { color: statusColor }]}>{statusDisplay}</Text>

      {task.status === 'NEW' && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: AppColors.primary }]} onPress={() => onTaskRequest(task.id)}>
          <Text style={styles.btnText}>Talep Et</Text>
        </TouchableOpacity>
      )}

      {task.status === 'IN_PROGRESS' && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: AppColors.warning }]} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>Tamamla</Text>
        </TouchableOpacity>
      )}

      {/* Tamamlama Modalı */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Görevi Tamamla</Text>
            <TextInput style={styles.input} placeholder="Açıklama" placeholderTextColor={AppColors.placeholder} value={desc} onChangeText={setDesc} />
            <TextInput style={styles.input} placeholder="Tutar (₺)" placeholderTextColor={AppColors.placeholder} keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                style={[styles.btn, { flex: 1, backgroundColor: AppColors.cancelBackground }]} 
                onPress={() => { setModalVisible(false); setDesc(''); setAmount(''); }}
              >
                <Text>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, { flex: 1, backgroundColor: AppColors.success }]} 
                onPress={() => { onTaskComplete(task.id, desc, parseFloat(amount) || 0); setModalVisible(false); setDesc(''); setAmount(''); }}
              >
                <Text style={styles.btnText}>Onayla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (c) => StyleSheet.create({
  card: { backgroundColor: c.surface, padding: 15, borderRadius: 12, marginBottom: 10, borderTopWidth: 4, elevation: 2, minHeight: 180, justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: 'bold', color: c.textPrimary },
  address: { color: c.textSecondary, fontSize: 12, marginVertical: 5 },
  status: { fontWeight: 'bold', fontSize: 12, marginBottom: 10 },
  btn: { padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: c.white, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: c.surface, padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: c.textPrimary },
  input: { borderWidth: 1, borderColor: c.border, borderRadius: 8, padding: 10, marginBottom: 10, color: c.textPrimary }
});