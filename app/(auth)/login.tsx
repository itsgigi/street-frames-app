import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Inserisci email e password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (e: any) {
      setError(e.message ?? 'Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-2">Street Frame</Text>
      <Text className="text-zinc-400 text-base mb-10">Accedi al tuo account</Text>

      <TextInput
        className="bg-zinc-900 text-white rounded-xl px-4 py-4 mb-4"
        placeholder="Email"
        placeholderTextColor="#71717a"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-zinc-900 text-white rounded-xl px-4 py-4 mb-4"
        placeholder="Password"
        placeholderTextColor="#71717a"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text className="text-red-400 text-sm mb-4">{error}</Text> : null}

      <TouchableOpacity
        className="bg-white rounded-xl py-4 items-center mb-6"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-black font-semibold text-base">Accedi</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-zinc-500">Non hai un account? </Text>
        <Link href="/(auth)/register">
          <Text className="text-white font-semibold">Registrati</Text>
        </Link>
      </View>
    </View>
  );
}
