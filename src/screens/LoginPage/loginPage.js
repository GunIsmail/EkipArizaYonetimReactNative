import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import authService from '../../../Services/authServices';

export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("1. Giriş işlemi başladı...");
    setLoading(true);

    try {
      const result = await authService.login(username, password);
      console.log("2. Servis cevabı geldi:", result);

      if (result.success) {
        console.log("3. Giriş başarılı, yönlendirme başlıyor...");

        if (!navigation) {
          Alert.alert("Sistem Hatası", "Navigasyon objesi bulunamadı!");
          return;
        }
        const isAdmin = result.data.is_staff === true || result.data.is_staff === 'true';
      
        console.log("4. Rol Kontrolü:", isAdmin ? "Admin" : "Employee");

        if (isAdmin === true) {
          navigation.replace('AdminPage');
        } else {
          navigation.replace('EmployeePage');
        }
      } else {
        Alert.alert("Giriş Başarısız", result.message);
      }
    } catch (error) {
      console.log("5. CATCH Bloğuna Düştü:", error);
      Alert.alert("Kritik Hata", error.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
      console.log("6. İşlem tamamlandı.");
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
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
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
  subHeader: { fontSize: 16, textAlign: 'center', color: '#607d8b', marginBottom: 40 },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    color: '#000'
  },
  button: {
    backgroundColor: '#455a64',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }
});