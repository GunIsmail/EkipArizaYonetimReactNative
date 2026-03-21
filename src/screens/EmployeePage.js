import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmployeePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>worker Paneline Hoş Geldin Kral!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});