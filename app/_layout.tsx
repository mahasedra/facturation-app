import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';

// Empêcher le splash screen de disparaître avant le chargement
SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading Fonts...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Tab Navigator contenant Home, Add et Scan */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Stack screen pour les détails de la facture */}
        <Stack.Screen name="[id]" options={{ title: 'Invoice Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
