import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import loginService from '../../services/loginServices';

export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen kullanıcı adı ve şifre giriniz.');
      return;
    }

    setLoading(true);

    try {
      const result = await loginService.login(username.trim(), password);

      if (result.success) {
        // Admin mi yoksa Personel mi kontrolü yapıp yönlendiriyoruz
        if (result.is_admin) {
          navigation.replace('AdminPage', {
            userId: result.user_id,
            username: result.username,
          });
        } else {
          navigation.replace('EmployeePage', {
            workerId: result.user_id,
            username: result.username,
          });
        }
      } else {
        Alert.alert('Giriş Başarısız', result.message);
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>ServisPro</Text>
        <Text style={styles.subHeader}>İş Takip Sistemi</Text>

        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          placeholderTextColor="#90a4ae"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#90a4ae"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eceff1' },
  content: { flex: 1, justifyContent: 'center', padding: 25 },
  header: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: '#455a64' },
  subHeader: { fontSize: 16, textAlign: 'center', color: '#607d8b', marginBottom: 40, marginTop: 8 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#cfd8dc', color: '#000' },
  button: { backgroundColor: '#455a64', padding: 18, borderRadius: 12, marginTop: 10, elevation: 3 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 },
});