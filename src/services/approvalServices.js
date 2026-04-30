// src/services/approvalServices.js
// Flutter: admin_approval_page.dart içindeki API çağrılarının karşılığı
// Onay merkezi servisi (iş atama + bütçe onayı)

import axios from 'axios';
import { API_ENDPOINTS } from '../../ApiConfig';

const approvalService = {
  /**
   * Bekleyen talepleri listeler.
   * Flutter karşılığı: AdminApprovalPage._fetchRequests()
   * @param {string} requestType - 'task_assignment' veya 'budget_approval'
   */
  fetchPendingRequests: async (requestType) => {
    try {
      const response = await axios.get(API_ENDPOINTS.APPROVALS(requestType));

      if (response.status === 200) {
        return response.data;
      }
      console.log(`Talep Listesi API Hatası: ${response.status}`);
      return [];
    } catch (e) {
      console.error(`Ağ Hatası (${requestType} Talep Çekme):`, e);
      return [];
    }
  },

  /**
   * Talebi onaylar veya reddeder.
   * Flutter karşılığı: AdminApprovalPage._processApproval()
   * @param {number} requestId - Talep ID
   * @param {string} requestType - 'task_assignment' veya 'budget_approval'
   * @param {string} action - 'approve' veya 'reject'
   */
  processApproval: async (requestId, requestType, action) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.PROCESS_APPROVAL(requestType, requestId),
        { action }
      );

      if (response.status === 200) {
        return {
          success: true,
          message: response.data?.success || 'İşlem Başarılı!',
        };
      } else {
        const errorMsg =
          response.data?.error || `İşlem Başarısız (${response.status})`;
        return { success: false, message: errorMsg };
      }
    } catch (e) {
      const msg =
        e?.response?.data?.error || e?.message || 'Ağ Hatası';
      return { success: false, message: `Hata: ${msg}` };
    }
  },
};

export default approvalService;
