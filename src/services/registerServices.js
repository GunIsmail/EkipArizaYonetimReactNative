import axios from 'axios';
import { API_ENDPOINTS } from '../../ApiConfig';

const registerService = {
  /**
   * Telefonu +905xxxxxxxxx formatına getirir
   */
  formatPhoneNumber: (onlyDigits10) => {
    if (!onlyDigits10) return null;
    const d = onlyDigits10.replace(/[^0-9]/g, '');
    
    // Debug: Telefonun ne geldiğini görelim
    console.log("Formatlanan telefon ham hali:", d);
    
    if (d.length !== 10) {
      console.log("HATA: Telefon 10 hane değil, uzunluk:", d.length);
      return null;
    }
    if (!d.startsWith('5')) {
      console.log("HATA: Telefon 5 ile başlamıyor.");
      return null;
    }
    return `+90${d}`;
  },

  /**
   * Kayıt İşlemi
   */
  registerUser: async ({ username, password, phoneDigits, selectedRole }) => {
    console.log("--- Kayıt İşlemi Başladı ---");
    console.log("Gelen Bilgiler:", { username, selectedRole, phoneDigits });

    // 1. Telefon formatı kontrolü
    const e164 = registerService.formatPhoneNumber(phoneDigits);
    if (!e164) {
      return { 
        success: false, 
        message: 'Geçerli bir telefon girin (Örn: 5051234567)' 
      };
    }

    // 2. Payload hazırlama
    const isAdmin = selectedRole === 'Admin';
    const bodyData = {
      username: username.trim(),
      password: password.trim(),
      phone: e164,
      is_staff: isAdmin,
    };

    if (!isAdmin && selectedRole) {
      bodyData.role = selectedRole;
      bodyData.availability = 'available';
    }

    console.log("Hazırlanan Payload:", bodyData);
    console.log("Gidilecek URL:", API_ENDPOINTS.REGISTER);

    // 3. API İsteği
    try {
      // Zaman aşımı (timeout) ekleyelim ki istek asılı kalmasın
      const response = await axios.post(API_ENDPOINTS.REGISTER, bodyData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000 // 5 saniye içinde cevap gelmezse hata ver
      });

      console.log("API Yanıtı (Başarılı):", response.data);
      return { success: true, message: 'Kayıt başarıyla tamamlandı.' };

    } catch (error) {
      if (error.response) {
        // Sunucu bir hata kodu döndürdü (400, 401, 500 vb.)
        console.log("Backend Hata Detayı:", error.response.data);
        console.log("Status Code:", error.response.status);
        
        return {
          success: false,
          message: error.response.data?.error || error.response.data?.detail || `Sunucu hatası: ${error.response.status}`,
        };
      } else if (error.request) {
        console.log("İstek yapıldı ama yanıt alınamadı (Network Error).");
        return { success: false, message: 'Sunucuya ulaşılamıyor. İnternet bağlantınızı veya IP adresini kontrol edin.' };
      } else {
        // İstek kurulurken bir hata oluştu
        console.log("Eksik konfigürasyon hatası:", error.message);
        return { success: false, message: 'İstek oluşturulamadı.' };
      }
    }
  },
};

export default registerService;