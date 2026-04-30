// src/constants/ThemeContext.js
// AppColors adaptör katmanı — Dark/Light tema geçişi
// Ekranlar: const AppColors = useColors();  ile kullanır
// Değişken adı "AppColors" kaldığı için style tanımları değişmez.

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@servispro_theme';

// ─────────────────────────────────────────────
// AYDINLIK MOD PALETİ (Mevcut AppColors.js ile birebir aynı)
// ─────────────────────────────────────────────
const LightColors = {
  // Ana Marka
  primary: '#455a64',
  secondary: '#607d8b',
  background: '#eef2f5',
  surface: '#ffffff',
  surfaceAlt: '#f5f5f5',
  textPrimary: '#263238',
  textSecondary: '#78909c',
  border: '#e0e0e0',
  borderLight: '#cfd8dc',
  divider: '#eeeeee',
  inputBackground: '#ffffff',
  placeholder: '#90a4ae',

  // Durum
  success: '#4caf50',
  error: '#d32f2f',
  warning: '#fbc02d',
  info: '#2196f3',

  // Sabit
  white: '#ffffff',
  black: '#000000',

  // Özel Kullanım
  headerBackground: '#455a64',
  headerText: '#ffffff',
  activeTabBackground: 'rgba(255,255,255,0.2)',
  inactiveTabText: 'rgba(255,255,255,0.7)',
  budgetPositive: '#81c784',
  logoutText: '#d32f2f',
  cancelBackground: '#cccccc',
  submitGreen: '#2e7d32',
  overlay: 'rgba(0,0,0,0.5)',
  overlayDark: 'rgba(0,0,0,0.6)',

  // Opasite Yardımcıları
  primaryLight: 'rgba(69,90,100,0.10)',
  primaryLight5: 'rgba(69,90,100,0.05)',
  primaryLight15: 'rgba(69,90,100,0.15)',
  primaryLight30: 'rgba(69,90,100,0.30)',
  successLight: 'rgba(76,175,80,0.10)',
  errorLight: 'rgba(211,47,47,0.10)',
  errorLight20: 'rgba(211,47,47,0.20)',
  whiteOverlay12: 'rgba(255,255,255,0.12)',
  whiteOverlay15: 'rgba(255,255,255,0.15)',
  whiteOverlay20: 'rgba(255,255,255,0.20)',
  whiteOverlay30: 'rgba(255,255,255,0.30)',
  whiteOverlay75: 'rgba(255,255,255,0.75)',
  shadowColor: '#000000',
};

// ─────────────────────────────────────────────
// KARANLIK MOD PALETİ
// ─────────────────────────────────────────────
const DarkColors = {
  // Ana Marka — dark modda daha açık tonlar
  primary: '#90a4ae',
  secondary: '#78909c',
  background: '#121212',
  surface: '#1e1e1e',
  surfaceAlt: '#2a2a2a',
  textPrimary: '#e0e0e0',
  textSecondary: '#9ca3af',
  border: '#333333',
  borderLight: '#3a3a3a',
  divider: '#2c2c2c',
  inputBackground: '#1e1e1e',
  placeholder: '#6b7280',

  // Durum — dark modda hafif parlak versiyonlar
  success: '#66bb6a',
  error: '#ef5350',
  warning: '#ffca28',
  info: '#42a5f5',

  // Sabit
  white: '#ffffff',
  black: '#000000',

  // Özel Kullanım — dark modda koyu header
  headerBackground: '#1a1a2e',
  headerText: '#e0e0e0',
  activeTabBackground: 'rgba(144,164,174,0.25)',
  inactiveTabText: 'rgba(224,224,224,0.5)',
  budgetPositive: '#81c784',
  logoutText: '#ef5350',
  cancelBackground: '#424242',
  submitGreen: '#43a047',
  overlay: 'rgba(0,0,0,0.7)',
  overlayDark: 'rgba(0,0,0,0.8)',

  // Opasite Yardımcıları — dark moda uyumlu
  primaryLight: 'rgba(144,164,174,0.12)',
  primaryLight5: 'rgba(144,164,174,0.06)',
  primaryLight15: 'rgba(144,164,174,0.18)',
  primaryLight30: 'rgba(144,164,174,0.30)',
  successLight: 'rgba(102,187,106,0.15)',
  errorLight: 'rgba(239,83,80,0.15)',
  errorLight20: 'rgba(239,83,80,0.25)',
  whiteOverlay12: 'rgba(255,255,255,0.08)',
  whiteOverlay15: 'rgba(255,255,255,0.10)',
  whiteOverlay20: 'rgba(255,255,255,0.15)',
  whiteOverlay30: 'rgba(255,255,255,0.20)',
  whiteOverlay75: 'rgba(255,255,255,0.60)',
  shadowColor: '#000000',
};

// ─────────────────────────────────────────────
// CONTEXT + PROVIDER + HOOKS
// ─────────────────────────────────────────────
const ThemeContext = createContext({
  isDark: false,
  colors: LightColors,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null
  const [themeMode, setThemeMode] = useState(null); // null = sistem temasını izle, 'dark'/'light' = manuel

  // Uygulama açılışında kayıtlı tercihi yükle
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'dark' || saved === 'light') {
        setThemeMode(saved);
      }
      // null ise sistem temasını izlemeye devam
    }).catch(() => {});
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return systemScheme === 'dark'; // Sistem temasını izle
  }, [themeMode, systemScheme]);

  const colors = useMemo(() => isDark ? DarkColors : LightColors, [isDark]);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    AsyncStorage.setItem(THEME_KEY, newMode).catch(() => {});
  }, [isDark]);

  const value = useMemo(() => ({ isDark, colors, toggleTheme }), [isDark, colors, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Adaptör hook — ekranlar bunu kullanır
// Kullanım: const AppColors = useColors();
export function useColors() {
  const { colors } = useContext(ThemeContext);
  return colors;
}

// Toggle hook — tema değiştirme butonu için
// Kullanım: const { toggleTheme, isDark } = useThemeToggle();
export function useThemeToggle() {
  const { toggleTheme, isDark } = useContext(ThemeContext);
  return { toggleTheme, isDark };
}

export default ThemeContext;
