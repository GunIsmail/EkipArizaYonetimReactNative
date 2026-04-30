// src/screens/AdminPage/TaskCreationModal.js
// Yeni arıza kaydı oluşturma modal bileşeni

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import taskService from '../../services/taskServices';
import { useColors } from '../../constants/ThemeContext';

export default function TaskCreationModal({ visible, onClose, onTaskCreated }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => { setTitle(''); setDescription(''); setAddress(''); setPhone(''); };

  const handleCreate = async () => {
    if (!title.trim()) { alert('Başlık zorunludur.'); return; }
    if (!description.trim()) { alert('Açıklama zorunludur.'); return; }
    if (!address.trim()) { alert('Adres zorunludur.'); return; }
    setLoading(true);
    const result = await taskService.createTask({ title: title.trim(), description: description.trim(), address: address.trim(), phone: phone.trim() });
    setLoading(false);
    if (result.success) { alert(result.message); resetForm(); onClose(); if (onTaskCreated) onTaskCreated(); }
    else { alert(`Kayıt Başarısız: ${result.message}`); }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Yeni Arıza Kaydı Oluştur</Text>
            <Text style={styles.label}>Başlık / Özet</Text>
            <TextInput style={styles.input} placeholder="Başlık giriniz..." placeholderTextColor={AppColors.textSecondary} value={title} onChangeText={setTitle} />
            <Text style={styles.label}>Arıza Detayı / Tanım</Text>
            <TextInput style={[styles.input, styles.multiline]} placeholder="Arıza detayını giriniz..." placeholderTextColor={AppColors.textSecondary} value={description} onChangeText={setDescription} multiline numberOfLines={3} />
            <Text style={styles.label}>Müşteri Adresi</Text>
            <TextInput style={styles.input} placeholder="Adres giriniz..." placeholderTextColor={AppColors.textSecondary} value={address} onChangeText={setAddress} />
            <Text style={styles.label}>Müşteri Telefonu</Text>
            <TextInput style={styles.input} placeholder="Telefon numarası..." placeholderTextColor={AppColors.textSecondary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </ScrollView>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { resetForm(); onClose(); }}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handleCreate} disabled={loading}>
              {loading ? <ActivityIndicator color={AppColors.white} size="small" /> : <Text style={styles.submitText}>Kaydet</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (c) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: 20 },
  container: { backgroundColor: c.surface, borderRadius: 20, padding: 24, maxHeight: '85%' },
  title: { fontSize: 20, fontWeight: 'bold', color: c.primary, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: c.textPrimary, marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: c.surfaceAlt, borderRadius: 12, padding: 14, fontSize: 15, color: c.textPrimary, borderWidth: 1, borderColor: c.border, marginBottom: 4 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 12 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  cancelText: { color: c.textSecondary, fontWeight: '600', fontSize: 15 },
  submitBtn: { backgroundColor: c.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  disabledBtn: { opacity: 0.6 },
  submitText: { color: c.white, fontWeight: 'bold', fontSize: 15 },
});
