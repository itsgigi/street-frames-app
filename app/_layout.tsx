import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {AuthProvider, useAuth} from '@/contexts/authContext';
import { useFonts, ChauPhilomeneOne_400Regular } from '@expo-google-fonts/chau-philomene-one';

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

  if (loading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="login" options={{ title: 'Login' }} />
      )}
    </Stack>
  );
};