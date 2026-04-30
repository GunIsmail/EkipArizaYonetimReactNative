// src/screens/AdminPage/BudgetManagementPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import budgetService from '../../services/budgetServices';
import BudgetHistoryModal from './BudgetHistoryModal';
import { useColors } from '../../constants/ThemeContext';

export default function BudgetManagementPage({ navigation }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ visible: false, worker: null });
  const [transModal, setTransModal] = useState({ visible: false, worker: null, isAddition: true });
  const [historyModal, setHistoryModal] = useState({ visible: false, workerId: null, workerName: '' });
  const [budgetValue, setBudgetValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [amountValue, setAmountValue] = useState('');

  useEffect(() => { loadWorkers(); }, []);

  const loadWorkers = async () => {
    setLoading(true);
    const data = await budgetService.fetchWorkers();
    setWorkers(data);
    setLoading(false);
  };

  const handleBudgetUpdate = async (workerId, newBudget, description) => {
    const result = await budgetService.updateBudget({ workerId, newBudget, description });
    if (result.success) { Alert.alert('Başarılı', 'İşlem tamamlandı.'); loadWorkers(); }
    else { Alert.alert('Hata', result.message); }
  };

  const openEditModal = (worker) => {
    setBudgetValue(worker.budget.toFixed(2));
    setDescValue('');
    setEditModal({ visible: true, worker });
  };

  const submitEdit = () => {
    const val = parseFloat(budgetValue.replace(',', '.'));
    const desc = descValue.trim();
    if (isNaN(val) || val < 0 || !desc) { Alert.alert('Uyarı', 'Geçerli değer ve açıklama giriniz.'); return; }
    setEditModal({ visible: false, worker: null });
    handleBudgetUpdate(editModal.worker.id, val, `Mutlak Değer: ${desc}`);
  };

  const openTransModal = (worker, isAddition) => {
    setAmountValue('');
    setDescValue('');
    setTransModal({ visible: true, worker, isAddition });
  };

  const submitTrans = () => {
    const amount = parseFloat(amountValue.replace(',', '.'));
    const desc = descValue.trim();
    if (isNaN(amount) || amount <= 0 || !desc) { Alert.alert('Uyarı', 'Geçerli tutar ve açıklama giriniz.'); return; }
    const w = transModal.worker;
    const newBudget = transModal.isAddition ? w.budget + amount : w.budget - amount;
    setTransModal({ visible: false, worker: null, isAddition: true });
    handleBudgetUpdate(w.id, newBudget, desc);
  };

  const renderWorkerCard = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => setHistoryModal({ visible: true, workerId: Number(item.id), workerName: item.name })}>
      <View style={styles.cardTop}>
        <View style={styles.cardIconWrap}><Text style={styles.cardIcon}>💰</Text></View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardRole}>{item.role}</Text>
        </View>
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.budgetLabel}>Mevcut Bütçe</Text>
          <Text style={[styles.budgetValue, { color: item.budget < 0 ? AppColors.error : AppColors.primary }]}>
            {item.budget.toFixed(2)} ₺
          </Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.miniBtn, { backgroundColor: AppColors.errorLight }]} onPress={() => openTransModal(item, false)}>
            <Text style={{ color: AppColors.error, fontWeight: 'bold', fontSize: 18 }}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.miniBtn, { backgroundColor: AppColors.successLight }]} onPress={() => openTransModal(item, true)}>
            <Text style={{ color: AppColors.success, fontWeight: 'bold', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.miniBtn, { borderWidth: 1, borderColor: AppColors.primaryLight30 }]} onPress={() => openEditModal(item)}>
            <Text style={{ color: AppColors.primary, fontSize: 14 }}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Geri</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Bütçe Yönetimi</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={styles.body}>
        <Text style={styles.subtitle}>Personel Listesi</Text>
        {loading ? <ActivityIndicator style={{ marginTop: 50 }} size="large" color={AppColors.primary} /> : (
          <FlatList data={workers} keyExtractor={(item) => item.id} renderItem={renderWorkerCard}
            contentContainerStyle={{ paddingBottom: 20 }} onRefresh={loadWorkers} refreshing={false}
            ListEmptyComponent={<Text style={styles.empty}>Kayıtlı personel yok.</Text>} />
        )}
      </View>

      {/* Mutlak Düzenleme Modalı */}
      <Modal visible={editModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editModal.worker?.name} - Mutlak Düzenleme</Text>
            <TextInput style={styles.modalInput} placeholder="Yeni Bütçe (₺)" keyboardType="numeric" value={budgetValue} onChangeText={setBudgetValue} placeholderTextColor={AppColors.placeholder} />
            <TextInput style={styles.modalInput} placeholder="Açıklama (Zorunlu)" value={descValue} onChangeText={setDescValue} placeholderTextColor={AppColors.placeholder} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditModal({ visible: false, worker: null })}><Text style={styles.cancelText}>İptal</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={submitEdit}><Text style={styles.saveBtnText}>Kaydet</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ekleme/Çıkarma Modalı */}
      <Modal visible={transModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: transModal.isAddition ? AppColors.success : AppColors.error }]}>
              {transModal.worker?.name} - Bütçe {transModal.isAddition ? 'Ekleme' : 'Çıkarma'}
            </Text>
            <TextInput style={styles.modalInput} placeholder="Tutar (₺)" keyboardType="numeric" value={amountValue} onChangeText={setAmountValue} placeholderTextColor={AppColors.placeholder} />
            <TextInput style={styles.modalInput} placeholder="Açıklama (Zorunlu)" value={descValue} onChangeText={setDescValue} placeholderTextColor={AppColors.placeholder} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setTransModal({ visible: false, worker: null, isAddition: true })}><Text style={styles.cancelText}>İptal</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: transModal.isAddition ? AppColors.success : AppColors.error }]} onPress={submitTrans}>
                <Text style={styles.saveBtnText}>{transModal.isAddition ? 'Ekle' : 'Çıkar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BudgetHistoryModal visible={historyModal.visible} onClose={() => setHistoryModal({ visible: false, workerId: null, workerName: '' })} workerId={historyModal.workerId} workerName={historyModal.workerName} />
    </SafeAreaView>
  );
}

const createStyles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'transparent' },
  back: { color: c.textPrimary, fontSize: 16, fontWeight: '600' },
  headerTitle: { color: c.textPrimary, fontSize: 20, fontWeight: 'bold' },
  body: { flex: 1, paddingHorizontal: 20 },
  subtitle: { fontSize: 16, color: c.textSecondary, fontWeight: '500', marginBottom: 10 },
  card: { backgroundColor: c.surface, borderRadius: 20, padding: 20, marginBottom: 16, elevation: 3, shadowColor: c.shadowColor, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  cardIconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: c.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardIcon: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: c.textPrimary },
  cardRole: { fontSize: 13, color: c.textSecondary, marginTop: 4 },
  cardDivider: { height: 1, backgroundColor: c.divider, marginVertical: 16 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  budgetLabel: { fontSize: 12, color: c.textSecondary },
  budgetValue: { fontSize: 20, fontWeight: '900', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10 },
  miniBtn: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 50, color: c.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: c.surface, borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: c.primary, marginBottom: 20, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12, color: c.textPrimary },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 },
  cancelText: { color: c.textSecondary, fontWeight: '600', fontSize: 15, paddingVertical: 10, paddingHorizontal: 16 },
  saveBtn: { backgroundColor: c.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  saveBtnText: { color: c.white, fontWeight: 'bold', fontSize: 15 },
});
