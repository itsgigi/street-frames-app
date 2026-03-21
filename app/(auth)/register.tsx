import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/auth-context';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      setError('Compila tutti i campi');
      return;
    }
    if (password !== confirm) {
      setError('Le password non coincidono');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
    } catch (e: any) {
      setError(e.message ?? 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-2">Street Frame</Text>
      <Text className="text-zinc-400 text-base mb-10">Crea un nuovo account</Text>

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
      <TextInput
        className="bg-zinc-900 text-white rounded-xl px-4 py-4 mb-4"
        placeholder="Conferma password"
        placeholderTextColor="#71717a"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      {error ? <Text className="text-red-400 text-sm mb-4">{error}</Text> : null}

      <TouchableOpacity
        className="bg-white rounded-xl py-4 items-center mb-6"
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-black font-semibold text-base">Registrati</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-zinc-500">Hai già un account? </Text>
        <Link href="/(auth)/login">
          <Text className="text-white font-semibold">Accedi</Text>
        </Link>
      </View>
    </View>
  );
}
