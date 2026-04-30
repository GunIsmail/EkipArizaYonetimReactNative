// src/screens/AdminPage/TaskCreationModal.js
// Flutter: task_creation_modal.dart karşılığı
// Yeni arıza kaydı oluşturma modal bileşeni

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import taskService from '../../services/taskServices';

const COLORS = {
  primary: '#455a64',
  secondary: '#607d8b',
  background: '#ffffff',
  surface: '#f5f5f5',
  textPrimary: '#263238',
  textSecondary: '#78909c',
  success: '#4caf50',
  error: '#d32f2f',
};

export default function TaskCreationModal({ visible, onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAddress('');
    setPhone('');
  };

  const handleCreate = async () => {
    // Validasyon
    if (!title.trim()) {
      alert('Başlık zorunludur.');
      return;
    }
    if (!description.trim()) {
      alert('Açıklama zorunludur.');
      return;
    }
    if (!address.trim()) {
      alert('Adres zorunludur.');
      return;
    }

    setLoading(true);

    const result = await taskService.createTask({
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      phone: phone.trim(),
    });

    setLoading(false);

    if (result.success) {
      alert(result.message);
      resetForm();
      onClose();
      if (onTaskCreated) onTaskCreated();
    } else {
      alert(`Kayıt Başarısız: ${result.message}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Yeni Arıza Kaydı Oluştur</Text>

            <Text style={styles.label}>Başlık / Özet</Text>
            <TextInput
              style={styles.input}
              placeholder="Başlık giriniz..."
              placeholderTextColor={COLORS.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Arıza Detayı / Tanım</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Arıza detayını giriniz..."
              placeholderTextColor={COLORS.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Müşteri Adresi</Text>
            <TextInput
              style={styles.input}
              placeholder="Adres giriniz..."
              placeholderTextColor={COLORS.textSecondary}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Müşteri Telefonu</Text>
            <TextInput
              style={styles.input}
              placeholder="Telefon numarası..."
              placeholderTextColor={COLORS.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                resetForm();
                onClose();
              }}
            >
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.disabledBtn]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    maxHeight: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 4,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
