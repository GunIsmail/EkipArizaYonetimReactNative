import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import registerService from '../../services/registerServices';
import { useColors } from '../../constants/ThemeContext';

export default function UserRegistrationPage({ navigation }) {
  const AppColors = useColors();
  const styles = useMemo(() => createStyles(AppColors), [AppColors]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !phone) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    const result = await registerService.registerUser({ username, password, phoneDigits: phone, selectedRole });
    setLoading(false);
    if (result.success) {
      Alert.alert('Başarılı', result.message, [{ text: 'Tamam', onPress: () => navigation.goBack() }]);
    } else {
      Alert.alert('Hata', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Yeni Kullanıcı Kaydı</Text>
        <TextInput style={styles.input} placeholder="Kullanıcı Adı" placeholderTextColor={AppColors.placeholder} value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Şifre" placeholderTextColor={AppColors.placeholder} secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Telefon (Örn: 5051234567)" placeholderTextColor={AppColors.placeholder} keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
        <Text style={styles.label}>Kullanıcı Rolü:</Text>
        <View style={styles.roleContainer}>
          {['Admin', 'Elektrikçi', 'Tesisatçı', 'Boyacı'].map((role) => (
            <TouchableOpacity key={role} style={[styles.roleButton, selectedRole === role && styles.roleButtonActive]} onPress={() => setSelectedRole(role)}>
              <Text style={[styles.roleText, selectedRole === role && styles.roleTextActive]}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.submitButton, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color={AppColors.white} /> : <Text style={styles.submitText}>Kaydı Tamamla</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: c.primary, marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: c.inputBackground, padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: c.border, color: c.textPrimary },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: c.secondary },
  roleContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  roleButton: { padding: 10, borderWidth: 1, borderColor: c.primary, borderRadius: 8, marginRight: 10, marginBottom: 10 },
  roleButtonActive: { backgroundColor: c.primary },
  roleText: { color: c.primary },
  roleTextActive: { color: c.white },
  submitButton: { backgroundColor: c.submitGreen, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  submitText: { color: c.white, fontWeight: 'bold', fontSize: 16 },
});