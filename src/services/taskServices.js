// src/services/taskServices.js
// Flutter: task_service.dart karşılığı
// Görev CRUD işlemleri ve atama servisi

import axios from 'axios';
import { API_ENDPOINTS } from '../../ApiConfig';

const taskService = {
  /**
   * Duruma göre görev listesi getirir.
   * Flutter karşılığı: TaskService.fetchTasksByStatus()
   */
  fetchTasksByStatus: async (statusFilter) => {
    try {
      const response = await axios.get(API_ENDPOINTS.TASKS, {
        params: { status: statusFilter },
      });

      return response.status === 200 ? response.data : [];
    } catch (e) {
      console.error('TaskService Fetch Hatası:', e);
      return [];
    }
  },

  /**
   * Yeni görev (iş emri) oluşturur.
   * Flutter karşılığı: TaskService.createTask()
   * Payload: { title, description, customer_address, customer_phone, status: 'NEW' }
   */
  createTask: async ({ title, description, address, phone }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS_CREATE, {
        title,
        description,
        customer_address: address,
        customer_phone: phone,
        status: 'NEW',
      });

      if (response.status === 201 || response.status === 200) {
        return { success: true, message: 'Arıza kaydı başarıyla oluşturuldu.' };
      } else {
        return {
          success: false,
          message: `Sunucu Hatası (${response.status})`,
        };
      }
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error?.message ||
        'Bilinmeyen hata';
      return { success: false, message: `Hata: ${msg}` };
    }
  },

  /**
   * Görev siler.
   * Flutter karşılığı: TaskManagementPage._deleteWorkOrder()
   */
  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(API_ENDPOINTS.TASKS_DETAIL(taskId));
      return response.status === 204 || response.status === 200;
    } catch (e) {
      console.error('Görev silme hatası:', e);
      return false;
    }
  },

  /**
   * Görevi doğrudan bir personele atar (Admin).
   * Flutter karşılığı: TaskService.assignTaskToWorker()
   * Payload: { worker_id, admin_note }
   */
  assignTaskToWorker: async (taskId, workerId, note) => {
    try {
      const response = await axios.post(API_ENDPOINTS.TASKS_ASSIGN(taskId), {
        worker_id: workerId,
        admin_note: note,
      });

      return response.status === 200 || response.status === 204;
    } catch (e) {
      console.error('TaskService Assign Hatası:', e);
      return false;
    }
  },
};

export default taskService;
