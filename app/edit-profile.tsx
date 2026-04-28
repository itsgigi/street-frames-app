import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/authContext';
import { updateUserProfile } from '@/services/userService';
import { imageUriToBase64 } from '@/services/storageService';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { sf, fonts } from '@/constants/theme';

const PLACEHOLDER_AVATAR = 'https://i.pravatar.cc/150?img=0';

export default function EditProfileScreen() {
  const { user, userProfile } = useAuth();

  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  // localImageUri holds a picked-but-not-yet-uploaded image URI for preview
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setBiography(userProfile.biography);
    }
  }, [userProfile]);

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

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setError(null);
    setSaving(true);

    try {
      let newPhotoUrl = userProfile?.profilePhoto ?? '';

      if (localImageUri) {
        newPhotoUrl = await imageUriToBase64(localImageUri);
      }

      await updateUserProfile(user.uid, {
        name: name.trim(),
        biography: biography.trim(),
        profilePhoto: newPhotoUrl,
      });

      router.back();
    } catch (e) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show local preview while saving, otherwise show the Firestore URL
  const avatarUri = localImageUri ?? userProfile?.profilePhoto ?? PLACEHOLDER_AVATAR;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>
      <ScreenHeader
        title="EDIT PROFILE"
        left={
          <Pressable onPress={() => router.back()} hitSlop={12} disabled={saving}>
            <Ionicons name="close" size={24} color={saving ? sf.grayMid : sf.black} />
          </Pressable>
        }
        right={
          <TouchableOpacity onPress={handleSave} disabled={saving} hitSlop={12}>
            {saving
              ? <ActivityIndicator size="small" color={sf.orange} />
              : <Text style={{ fontSize: 14, fontWeight: '700', color: sf.orange }}>Save</Text>
            }
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 }}
        >
          {/* Tappable avatar */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} disabled={saving}>
              <View style={{
                width: 96, height: 96, borderRadius: 48,
                borderWidth: 3, borderColor: sf.orange,
                padding: 3,
              }}>
                <Image
                  source={{ uri: avatarUri || PLACEHOLDER_AVATAR }}
                  style={{ width: '100%', height: '100%', borderRadius: 44 }}
                />
                {/* Camera badge */}
                <View style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: sf.orange,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: sf.cream,
                }}>
                  <Ionicons name="camera" size={14} color={sf.cream} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePickImage} disabled={saving} style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 13, color: sf.orange, fontWeight: '600' }}>
                {localImageUri ? 'Change photo' : 'Upload photo'}
              </Text>
            </TouchableOpacity>

            {localImageUri && (
              <Text style={{ fontSize: 11, color: sf.grayMid, marginTop: 4 }}>
                Photo will be uploaded when you save.
              </Text>
            )}
          </View>

          {/* Handle (read-only) */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Handle</Text>
            <View style={[inputStyle, { backgroundColor: sf.grayLight, flexDirection: 'row', alignItems: 'center' }]}>
              <Text style={{ fontSize: 14, color: sf.grayDark }}>@</Text>
              <Text style={{ fontSize: 14, color: sf.grayDark, flex: 1 }}>
                {userProfile?.handle ?? ''}
              </Text>
              <Ionicons name="lock-closed" size={14} color={sf.grayMid} />
            </View>
            <Text style={{ fontSize: 11, color: sf.grayMid, marginTop: 4 }}>
              Handle cannot be changed after account creation.
            </Text>
          </View>

          {/* Name */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Name</Text>
            <TextInput
              style={inputStyle}
              value={name}
              onChangeText={setName}
              placeholder="Your display name"
              placeholderTextColor={sf.grayMid}
              autoCapitalize="words"
              editable={!saving}
            />
          </View>

          {/* Biography */}
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Biography</Text>
            <TextInput
              style={[inputStyle, { height: 96, textAlignVertical: 'top' }]}
              value={biography}
              onChangeText={setBiography}
              placeholder="Tell us about yourself..."
              placeholderTextColor={sf.grayMid}
              multiline
              numberOfLines={4}
              editable={!saving}
            />
          </View>

          {error && (
            <Text style={{ color: sf.rust, fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: saving ? sf.grayMid : sf.orange,
              paddingVertical: 14, borderRadius: 100,
              alignItems: 'center', marginTop: 8,
            }}
            activeOpacity={0.85}
          >
            {saving
              ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator color={sf.cream} size="small" />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: sf.cream }}>Saving…</Text>
                </View>
              )
              : <Text style={{ fontSize: 15, fontWeight: '700', color: sf.cream, fontFamily: fonts.heading, letterSpacing: 0.5 }}>
                  Save Changes
                </Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const labelStyle = {
  fontSize: 11,
  fontWeight: '700' as const,
  color: sf.grayDark,
  letterSpacing: 0.8,
  textTransform: 'uppercase' as const,
  marginBottom: 8,
};

const inputStyle = {
  backgroundColor: sf.white,
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 14,
  color: sf.black,
  borderWidth: 1.5,
  borderColor: 'rgba(33,34,38,0.08)',
};
