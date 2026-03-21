// AdminPage.js (ve aynısını EmployeePage.js için de yap)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin Paneline Hoş Geldin Kral!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});