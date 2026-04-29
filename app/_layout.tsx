import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {AuthProvider, useAuth} from '@/contexts/authContext';
import { useFonts, ChauPhilomeneOne_400Regular } from '@expo-google-fonts/chau-philomene-one';
import { sf } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({ ChauPhilomeneOne_400Regular });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <InternalLayout />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const InternalLayout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/login');
    }
  }, [user, loading]);

  // Show a spinner while Firebase resolves the persisted session
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={sf.orange} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="user/[uid]" options={{ headerShown: false }} />
    </Stack>
  );
};