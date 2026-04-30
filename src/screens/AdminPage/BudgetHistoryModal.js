// src/screens/AdminPage/BudgetHistoryModal.js

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import budgetService from '../../services/budgetServices';
import { useColors } from '../../constants/ThemeContext';

export default function BudgetHistoryModal({ visible, onClose, workerId, workerName }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible && workerId) { loadHistory(); }
  }, [visible, workerId]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await budgetService.fetchBudgetHistory(workerId);
    setHistory(data);
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    } catch { return dateStr; }
  };

  const renderItem = ({ item, index }) => {
    const isPositive = item.signed_amount?.startsWith('+');
    const color = isPositive ? AppColors.success : AppColors.error;
    return (
      <View style={[styles.row, { backgroundColor: index % 2 === 0 ? AppColors.surface : AppColors.surfaceAlt }]}>
        <View style={styles.rowLeft}>
          <Text style={styles.rowDate}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.rowAdmin}>Yönetici: {item.conducted_by || 'Sistem'}</Text>
          {item.description ? <Text style={styles.rowDesc}>{item.description}</Text> : null}
        </View>
        <View style={styles.rowRight}>
          <Text style={[styles.rowAmount, { color }]}>{item.signed_amount} ₺</Text>
          <Text style={[styles.rowType, { color }]}>{isPositive ? 'Ekleme' : 'Çıkarma'}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{workerName}</Text>
              <Text style={styles.subtitle}>Bütçe Geçmişi (ID: {workerId})</Text>
            </View>
          </View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Tarih / İşlemi Yapan</Text>
            <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'right' }]}>Tutar</Text>
          </View>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} size="large" color={AppColors.primary} />
          ) : history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📜</Text>
              <Text style={styles.emptyText}>Kayıt bulunamadı.</Text>
            </View>
          ) : (
            <FlatList data={history} keyExtractor={(item, i) => (item.id || i).toString()} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 10 }} />
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (c) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: 16 },
  container: { backgroundColor: c.surface, borderRadius: 20, maxHeight: '80%', overflow: 'hidden' },
  header: { padding: 16, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: c.textPrimary },
  subtitle: { fontSize: 14, color: c.textSecondary, marginTop: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: c.surfaceAlt, paddingHorizontal: 16, paddingVertical: 12 },
  tableHeaderText: { fontWeight: 'bold', color: c.textPrimary, fontSize: 13 },
  row: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 },
  rowLeft: { flex: 3 },
  rowDate: { fontWeight: '600', fontSize: 14, color: c.textPrimary },
  rowAdmin: { fontSize: 12, color: c.textSecondary, marginTop: 4 },
  rowDesc: { fontSize: 13, color: c.textPrimary, fontStyle: 'italic', marginTop: 4 },
  rowRight: { flex: 2, alignItems: 'flex-end' },
  rowAmount: { fontWeight: 'bold', fontSize: 16 },
  rowType: { fontSize: 10, marginTop: 2 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, opacity: 0.5 },
  emptyText: { color: c.textSecondary, marginTop: 10 },
  closeBtn: { backgroundColor: c.primary, margin: 16, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  closeBtnText: { color: c.white, fontWeight: 'bold', fontSize: 16 },
});
