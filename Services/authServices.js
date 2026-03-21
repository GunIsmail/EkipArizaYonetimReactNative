import axios from 'axios';
import { API_ENDPOINTS } from '../ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  login: async (username, password) => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.LOGIN,
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const data = response.data;

        const isStaff =
          data.is_staff === true || data.is_staff === 'true';

        await AsyncStorage.setItem('user_id', String(data.id));
        await AsyncStorage.setItem('username', String(data.username));
        await AsyncStorage.setItem('is_admin', JSON.stringify(isStaff));

        return {
          success: true,
          data: {
            ...data,
            is_staff: isStaff,
          },
        };
      }

      return { success: false, message: 'Giriş başarısız.' };
    } catch (error) {
      console.log('Axios Hatası:', error.message);
      const errorMsg =
        error.response?.data?.error || error.message || 'Bağlantı hatası.';
      return { success: false, message: errorMsg };
    }
  },
};

export default authService;