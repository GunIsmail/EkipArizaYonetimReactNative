// src/screens/AdminPage/ShowPersonelListPage.js
// Flutter: show_personel_list_page.dart karşılığı

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import personelService from '../../services/personelServices';

const COLORS = { primary: '#455a64', background: '#eef2f5', surface: '#ffffff', textPrimary: '#263238', textSecondary: '#78909c' };

// Flutter'daki sıralama: Müsait > Aktif Görevde > Meşgul > İzinli > Bilinmiyor
const STATUS_ORDER = ['Müsait', 'Aktif Görevde', 'Meşgul', 'İzinli', 'Bilinmiyor'];

export default function ShowPersonelListPage({ navigation }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWorkers(); }, []);

  const loadWorkers = async () => {
    setLoading(true);
    const workers = await personelService.fetchWorkers();

    // Duruma göre gruplandır
    const grouped = {};
    workers.forEach((w) => {
      const key = w.status || 'Bilinmiyor';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(w);
    });

    // Sıralı section listesi oluştur
    const orderedSections = [];
    STATUS_ORDER.forEach((status) => {
      if (grouped[status]) {
        orderedSections.push({ title: status, color: grouped[status][0]?.statusColor || '#999', data: grouped[status] });
        delete grouped[status];
      }
    });
    // Kalan bilinmeyen durumlar
    Object.keys(grouped).forEach((key) => {
      orderedSections.push({ title: key, color: grouped[key][0]?.statusColor || '#999', data: grouped[key] });
    });

    setSections(orderedSections);
    setLoading(false);
  };

  const renderWorker = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('AssignJobPage', { worker: item })}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.statusColor }]}>
        <Text style={styles.iconText}>👤</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardRole}>Rol: {item.role} | Tel: {item.phone}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${item.statusColor}20` }]}>
        <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: section.color }]}>
        {section.title} ({section.data.length})
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personel Durum Listesi</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.subtitle}>Personel Durumuna Göre Gruplandırılmış Liste</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 50 }} size="large" color={COLORS.primary} />
        ) : sections.length === 0 ? (
          <Text style={styles.empty}>Personel bulunamadı.</Text>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderWorker}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={{ paddingBottom: 20 }}
            stickySectionHeadersEnabled={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#455a64' },
  back: { color: '#fff', fontSize: 16, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  body: { flex: 1, padding: 16 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#263238', marginBottom: 12 },
  sectionHeader: { paddingVertical: 10, paddingHorizontal: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 18 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#263238' },
  cardRole: { fontSize: 13, color: '#78909c', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  statusText: { fontWeight: 'bold', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 50, color: '#78909c', fontSize: 15 },
});
