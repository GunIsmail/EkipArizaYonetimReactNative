// src/services/personelServices.js
// Flutter: personel_service.dart karşılığı
// Personel listesi ve durum bilgisi servisi

import axios from 'axios';
import { API_ENDPOINTS } from '../../ApiConfig';

/**
 * Durum metnine göre renk döndüren yardımcı fonksiyon.
 * Flutter karşılığı: Worker.fromJson → _getStatusColor()
 */
export const getStatusColor = (statusText) => {
  switch ((statusText || '').toLowerCase()) {
    case 'aktif görevde':
      return '#4caf50'; // Yeşil
    case 'müsait':
      return '#ff9800'; // Turuncu
    case 'izinli':
      return '#9e9e9e'; // Gri
    case 'meşgul':
      return '#f44336'; // Kırmızı
    default:
      return '#2196f3'; // Mavi
  }
};

const personelService = {
  /**
   * Tüm personel listesini getirir.
   * Flutter karşılığı: PersonelService.fetchWorkers()
   * Dönüş: [{ id, name, role, statusText, phone, budget }]
   */
  fetchWorkers: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.WORKERS);

      if (response.status === 200) {
        return response.data.map((worker) => ({
          id: String(worker.id ?? 'N/A'),
          name: worker.name ?? 'Bilinmiyor',
          role: worker.role ?? 'Tanımlanmadı',
          status: worker.statusText ?? 'Bilinmiyor',
          statusColor: getStatusColor(worker.statusText),
          phone: worker.phone ?? 'Yok',
          budget: Number(worker.budget) || 0,
        }));
      }
      return [];
    } catch (e) {
      console.error('Personel listesi hatası:', e);
      return [];
    }
  },
};

export default personelService;
