import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../../ApiConfig';

const loginService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });

      const data = response.data;

      const isAdmin = data?.is_staff ?? false;
      const userId = data?.id ?? null;
      const serverUsername = data?.username ?? username;

      if (!isAdmin && userId == null) {
        return {
          success: false,
          message: 'Çalışan ID bilgisi sunucudan gelmedi.',
        };
      }

      if (userId != null) {
        await AsyncStorage.setItem('user_id', String(userId));
        await AsyncStorage.setItem('username', serverUsername);
      }

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
          `Sunucuya bağlanılamadı: ${error.message}`,
      };
    }
  },
};

export default loginService;