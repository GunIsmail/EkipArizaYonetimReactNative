import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../ApiConfig';

const loginService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        username: username.trim(),
        password: password,
      });

      const data = response.data;

      // API'den gelen verileri parçalayalım
      const isAdmin = data?.is_staff === true; 
      const userId = data?.id;
      const serverUsername = data?.username || username;

      // Güvenlik Kontrolü: id gelmiyorsa hata döndür
      if (userId === undefined || userId === null) {
        return {
          success: false,
          message: 'Kullanıcı ID bilgisi sunucudan alınamadı.',
        };
      }

      // Verileri cihaz hafızasına kaydet 
      await AsyncStorage.setItem('user_id', String(userId));
      await AsyncStorage.setItem('username', serverUsername);
      await AsyncStorage.setItem('is_admin', String(isAdmin));

      return {
        success: true,
        is_admin: isAdmin,
        user_id: userId,
        username: serverUsername,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          `Sunucu hatası: ${error.message}`,
      };
    }
  },
};

export default loginService;