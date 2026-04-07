import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import registerService from '../../services/registerServices';

export default function UserRegistrationPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin'); // Varsayılan Admin
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !phone) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    const result = await registerService.registerUser({
      username,
      password,
      phoneDigits: phone,
      selectedRole,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Başarılı', result.message, [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Hata', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Yeni Kullanıcı Kaydı</Text>

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

        <TextInput
          style={styles.input}
          placeholder="Telefon (Örn: 5051234567)"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Kullanıcı Rolü:</Text>
        <View style={styles.roleContainer}>
          {['Admin', 'Elektrikçi', 'Tesisatçı', 'Boyacı'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.roleButton, selectedRole === role && styles.roleButtonActive]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[styles.roleText, selectedRole === role && styles.roleTextActive]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Kaydı Tamamla</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#455a64', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#607d8b' },
  roleContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  roleButton: { padding: 10, borderWidth: 1, borderColor: '#455a64', borderRadius: 8, marginRight: 10, marginBottom: 10 },
  roleButtonActive: { backgroundColor: '#455a64' },
  roleText: { color: '#455a64' },
  roleTextActive: { color: '#fff' },
  submitButton: { backgroundColor: '#2e7d32', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});