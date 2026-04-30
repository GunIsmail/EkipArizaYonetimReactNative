import axios from 'axios';
import { API_ENDPOINTS } from '../../ApiConfig';

const EmployeeService = {
  //Çalışan verisi ve bütçesi
  fetchWorkerData: async (workerId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.WORKERS);

      const workerData = response.data.find(
        (worker) => worker.id.toString() === workerId.toString()
      );

      return workerData || null;
    } catch (e) {
      console.error('Veri çekme hatası:', e);
      return null;
    }
  },

  //  Müsaitlik durumunu güncelle
  updateStatus: async (workerId, newStatus) => {
    try {
      const response = await axios.post(API_ENDPOINTS.UPDATE_STATUS, {
        worker_id: workerId,
        status: newStatus,
      });

      return response.status === 200;
    } catch (e) {
      console.error('Durum güncelleme hatası:', e);
      return false;
    }
  },

  //  Görevleri getir
  fetchTasks: async (workerId, statusFilter) => {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS, {
        params: {
          status: statusFilter,
          worker_id: workerId,
        },
      });

      return response.status === 200 ? response.data : [];
    } catch (e) {
      console.error('Görev yükleme hatası:', e);
      return [];
    }
  },

  //  İş talep et
  requestTask: async (taskId, workerId) => {
    try {
      const response = await axios.post(API_ENDPOINTS.REQUEST_ASSIGNMENT, {
        task_id: taskId,
        worker_id: workerId,
      });

      return response.status === 200 || response.status === 201;
    } catch (e) {
      console.error('İş talep hatası:', e);
      return false;
    }
  },

  //  Bütçe geçmişi
  fetchBudgetHistory: async (workerId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.WORKER_BUDGET_HISTORY_ALT(workerId));
      return response.status === 200 ? response.data : [];
    } catch (e) {
      console.error('Bütçe geçmişi hatası:', e);
      return [];
    }
  },

  //  İş gridleri
  fetchPoolTasks: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS, {
        params: {
          status: 'NEW',
          unassigned: 'true',
        },
      });

      return response.status === 200 ? response.data : [];
    } catch (e) {
      console.error('Havuz görevleri hatası:', e);
      return [];
    }
  },

  //  İşi tamamla ve bütçe onayı iste
  completeTaskWithBudget: async (taskId, workerId, description, amount) => {
    try {
      const response = await axios.post(API_ENDPOINTS.REQUEST_BUDGET_APPROVAL, {
        work_order_id: taskId,
        worker_id: workerId,
        description,
        amount,
        status: 'PENDING',
      });

      return response.status === 200 || response.status === 201;
    } catch (e) {
      console.error('Bütçe onay talebi hatası:', e);
      return false;
    }
  },
};

export default EmployeeService;