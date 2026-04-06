import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS }  from '../../ApiConfig';

const adminService = {
  async logout() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.log('Logout Hatası:', error);
      throw error;
    }
  },

  async fetchDashboardStats() {
    try {
      const currentAdminIdString = await AsyncStorage.getItem('user_id');

      if (!currentAdminIdString) {
        console.log("HATA: Giriş yapmış kullanıcı ID'si bulunamadı.");
        return null;
      }

      const currentAdminId = Number(currentAdminIdString);

      const response = await fetch(API_ENDPOINTS.WORKERS, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log(`API Hatası: ${response.status}`);
        return null;
      }

      const users = await response.json();

      const adminUser = users.find(
        (user) => Number(user.id) === currentAdminId
      );

      if (adminUser) {
        return {
          budget: Number(adminUser.budget) || 0,
          name: adminUser.name || adminUser.username || 'İsimsiz Admin',
          system_status: 'Aktif',
          worker_count: users.length,
        };
      } else {
        console.log("HATA: Bu ID'ye sahip kullanıcı veritabanında bulunamadı.");
      }
    } catch (e) {
      console.log('Bağlantı Hatası:', e);
    }

    return null;
  },
};

export default adminService;