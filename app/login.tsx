import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import { FirebaseError } from 'firebase/app';
import * as ImagePicker from 'expo-image-picker';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { imageUriToBase64 } from '@/services/storageService';
import { sf } from '@/constants/theme';

const PLACEHOLDER_AVATAR = 'https://i.pravatar.cc/150?img=0';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuthMethods();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (!handle.trim()) {
        setError('Please enter a handle.');
        return;
      }
      if (!/^[a-z0-9._]+$/.test(handle.trim())) {
        setError('Handle can only contain lowercase letters, numbers, dots, and underscores.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        let profilePhoto = '';
        if (localImageUri) {
          profilePhoto = await imageUriToBase64(localImageUri);
        }
        await signUp(email, password, handle.trim().toLowerCase(), name.trim(), profilePhoto);
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Email o password errati. Riprova.');
            break;
          case 'auth/invalid-email':
            setError('Indirizzo email non valido.');
            break;
          case 'auth/email-already-in-use':
            setError('Questo indirizzo email è già registrato.');
            break;
          case 'auth/too-many-requests':
            setError('Troppi tentativi. Attendi qualche minuto e riprova.');
            break;
          default:
            setError('Si è verificato un errore. Riprova.');
        }
      } else {
        setError('Si è verificato un errore. Riprova.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setName('');
    setHandle('');
    setLocalImageUri(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>

      {/* Avatar picker — sign-up only */}
      {!isLogin && (
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
            <View style={{
              width: 88, height: 88, borderRadius: 44,
              borderWidth: 2.5, borderColor: sf.orange,
              padding: 3, marginBottom: 8,
            }}>
              <Image
                source={{ uri: localImageUri ?? PLACEHOLDER_AVATAR }}
                style={{ width: '100%', height: '100%', borderRadius: 40 }}
              />
              <View style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: 13,
                backgroundColor: sf.orange, alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: '#fff',
              }}>
                <Text style={{ color: '#fff', fontSize: 13, lineHeight: 15 }}>+</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 12, color: '#888' }}>
            {localImageUri ? 'Tap to change photo' : 'Add profile photo (optional)'}
          </Text>
        </View>
      )}

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Handle (e.g. marco.frames)"
          value={handle}
          onChangeText={setHandle}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={[styles.button, submitting && { opacity: 0.7 }]} onPress={handleSubmit} disabled={submitting}>
        {submitting
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={handleToggle}>
        <Text style={styles.link}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});
