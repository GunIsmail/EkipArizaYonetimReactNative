// src/services/budgetServices.js
// Flutter: budget_management_service.dart + admin_budget_service.dart karşılığı
// Bütçe CRUD ve geçmiş servisi

import axios from 'axios';
import { API_ENDPOINTS } from '../../ApiConfig';

const budgetService = {
  /**
   * Bütçe bilgisi dahil personel listesini getirir.
   * Flutter karşılığı: WorkerBudgetService.fetchWorkers()
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
          phone: worker.phone ?? 'Yok',
          budget: Number(worker.budget) || 0,
        }));
      }
      return [];
    } catch (e) {
      console.error('Bütçe personel listesi hatası:', e);
      return [];
    }
  },

  /**
   * Personelin bütçesini günceller.
   * Flutter karşılığı: WorkerBudgetService.updateBudget()
   * Payload: { worker_id, budget, description }
   */
  updateBudget: async ({ workerId, newBudget, description }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_BUDGET, {
        worker_id: workerId,
        budget: newBudget,
        description,
      });

      if (response.status === 200) {
        return { success: true, message: 'Bütçe başarıyla güncellendi.' };
      } else {
        const errorMsg =
          response.data?.error || 'Bilinmeyen API hatası.';
        return { success: false, message: errorMsg };
      }
    } catch (e) {
      const msg =
        e?.response?.data?.error || e?.message || 'Ağ Hatası';
      return { success: false, message: msg };
    }
  },

  /**
   * Personelin bütçe geçmişini getirir.
   * Flutter karşılığı: AdminBudgetService.fetchHistory()
   * Dönüş: [{ id, amount, signed_amount, type_display, timestamp, description, conducted_by }]
   */
  fetchBudgetHistory: async (workerId) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.GET_BUDGET_HISTORY(workerId)
      );

      return response.status === 200 ? response.data : [];
    } catch (e) {
      console.error('Bütçe geçmişi hatası:', e);
      return [];
    }
  },
};

export default budgetService;
