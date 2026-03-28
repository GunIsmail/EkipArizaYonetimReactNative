import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';

const getStatusColor = (status) => {
  switch (status) {
    case 'NEW': return '#455a64'; // Primary
    case 'IN_PROGRESS': return '#fbc02d'; // Warning
    case 'COMPLETED': return '#4caf50'; // Success
    default: return '#999';
  }
};

export default function WorkerTaskCard({ task, onTaskRequest, onTaskComplete }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const statusColor = getStatusColor(task.status);

  return (
    <View style={[styles.card, { borderTopColor: statusColor }]}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.address}>{task.customerAddress || 'Adres yok'}</Text>
      <Text style={[styles.status, { color: statusColor }]}>{task.statusDisplay}</Text>

      {task.status === 'NEW' && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#455a64' }]} onPress={() => onTaskRequest(task.id)}>
          <Text style={styles.btnText}>Talep Et</Text>
        </TouchableOpacity>
      )}

      {task.status === 'IN_PROGRESS' && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#fbc02d' }]} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>Tamamla</Text>
        </TouchableOpacity>
      )}

      {/* Tamamlama Modalı */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Görevi Tamamla</Text>
            <TextInput style={styles.input} placeholder="Açıklama" onChangeText={setDesc} />
            <TextInput style={styles.input} placeholder="Tutar (₺)" keyboardType="numeric" onChangeText={setAmount} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                <Text>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: '#4caf50' }]} onPress={() => {
                onTaskComplete(task.id, desc, parseFloat(amount));
                setModalVisible(false);
              }}>
                <Text style={styles.btnText}>Onayla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderTopWidth: 4, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' },
  address: { color: '#666', fontSize: 12, marginVertical: 5 },
  status: { fontWeight: 'bold', fontSize: 12, marginBottom: 10 },
  btn: { padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 }
});