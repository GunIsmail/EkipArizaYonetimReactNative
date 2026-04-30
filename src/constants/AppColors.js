// src/constants/AppColors.js
// Merkezi Renk Paleti Konfigürasyonu
// Tüm uygulama genelinde kullanılan renkler tek buradan yönetilir.
// Flutter: lib/constants/app_colors.dart karşılığı

const AppColors = {
  // ─────────────────────────────────────────────
  // ANA MARKA RENKLERİ (Brand Colors)
  // Moddan bağımsız, sabit marka renkleri
  // ─────────────────────────────────────────────
  _brandBlueGray: '#455a64',
  _brandBlueGrayLight: '#607d8b',
  _brandGreen: '#4caf50',
  _brandRed: '#d32f2f',
  _brandOrange: '#fbc02d',

  // ─────────────────────────────────────────────
  // AYDINLIK MOD (Light Theme) RENKLERİ
  // ─────────────────────────────────────────────
  primary: '#455a64',            // Ana renk (Blue Gray 700)
  secondary: '#607d8b',          // İkincil renk (Blue Gray 500)
  background: '#eef2f5',         // Sayfa arkaplanı
  surface: '#ffffff',            // Kart/alan arkaplanı
  surfaceAlt: '#f5f5f5',         // Alternatif yüzey (inputlar, tablo satırları)
  textPrimary: '#263238',        // Ana metin rengi (Blue Gray 900)
  textSecondary: '#78909c',      // İkincil metin rengi (Blue Gray 400)
  border: '#e0e0e0',             // Genel kenarlık rengi
  borderLight: '#cfd8dc',        // Hafif kenarlık
  divider: '#eeeeee',            // Ayırıcı çizgi
  inputBackground: '#ffffff',    // Input arkaplanı
  placeholder: '#90a4ae',        // Placeholder metin rengi

  // ─────────────────────────────────────────────
  // KARANLIK MOD (Dark Theme) RENKLERİ — Hazırlık
  // İleride Dark Mode açıldığında devreye girecek
  // ─────────────────────────────────────────────
  primaryDark: '#90a4ae',
  backgroundDark: '#121212',
  surfaceDark: '#1e1e1e',
  textPrimaryDark: '#e0e0e0',
  textSecondaryDark: '#9ca3af',

  // ─────────────────────────────────────────────
  // DURUM RENKLERİ (Status Colors)
  // ─────────────────────────────────────────────
  success: '#4caf50',            // Başarı / Onay / Yeşil
  error: '#d32f2f',              // Hata / Ret / Kırmızı
  warning: '#fbc02d',            // Uyarı / Beklemede / Sarı
  info: '#2196f3',               // Bilgi / Mavi

  // ─────────────────────────────────────────────
  // SABİT RENKLER
  // ─────────────────────────────────────────────
  white: '#ffffff',
  black: '#000000',

  // ─────────────────────────────────────────────
  // ÖZEL KULLANIM RENKLERİ
  // ─────────────────────────────────────────────
  headerBackground: '#455a64',   // Header/AppBar arkaplanı
  headerText: '#ffffff',         // Header metin
  activeTabBackground: 'rgba(255,255,255,0.2)',  // Aktif sekme arkaplanı
  inactiveTabText: 'rgba(255,255,255,0.7)',      // Pasif sekme metin
  budgetPositive: '#81c784',     // Bütçe artı değer (Light Green 300)
  logoutText: '#d32f2f',         // Çıkış butonu metin
  cancelBackground: '#cccccc',   // İptal butonu arkaplanı
  submitGreen: '#2e7d32',        // Kaydet/Gönder butonu (Green 800)
  overlay: 'rgba(0,0,0,0.5)',    // Modal overlay (standart)
  overlayDark: 'rgba(0,0,0,0.6)',// Modal overlay (koyu)

  // ─────────────────────────────────────────────
  // OPASİTE YARDIMCILARI (Opacity Helpers)
  // Tekrar eden rgba() kullanımlarını merkezileştirir
  // ─────────────────────────────────────────────
  primaryLight: 'rgba(69,90,100,0.10)',    // Primary %10 opaklık
  primaryLight5: 'rgba(69,90,100,0.05)',   // Primary %5 opaklık
  primaryLight15: 'rgba(69,90,100,0.15)',  // Primary %15 opaklık
  primaryLight30: 'rgba(69,90,100,0.30)',  // Primary %30 opaklık
  successLight: 'rgba(76,175,80,0.10)',    // Success %10 opaklık
  errorLight: 'rgba(211,47,47,0.10)',      // Error %10 opaklık
  errorLight20: 'rgba(211,47,47,0.20)',    // Error %20 opaklık
  whiteOverlay12: 'rgba(255,255,255,0.12)', // Beyaz %12
  whiteOverlay15: 'rgba(255,255,255,0.15)', // Beyaz %15
  whiteOverlay20: 'rgba(255,255,255,0.20)', // Beyaz %20
  whiteOverlay30: 'rgba(255,255,255,0.30)', // Beyaz %30
  whiteOverlay75: 'rgba(255,255,255,0.75)', // Beyaz %75
  shadowColor: '#000000',                   // Gölge rengi
};

export default AppColors;
