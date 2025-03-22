import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Prevent back button during loading
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );

    // Ensure we stay on this screen for exactly 5 seconds
    const timer = setTimeout(() => {
      // Navigate to the main app after loading
      router.replace('/(tabs)');
    }, 5000); // 5 seconds loading time

    return () => {
      clearTimeout(timer);
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
});