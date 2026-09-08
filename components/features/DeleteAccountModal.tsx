import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fonts, sf } from '@/constants/theme';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
}

export function DeleteAccountModal({ visible, onClose, onConfirm }: DeleteAccountModalProps) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (submitting) return;
    setPassword('');
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!password) {
      setError('Enter your password to confirm.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onConfirm(password);
      // Success navigates away (this screen unmounts); no local state to reset.
    } catch (err: any) {
      setSubmitting(false);
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setError('Incorrect password.');
      } else if (err?.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment and try again.');
      } else {
        setError('Something went wrong and your account was not fully deleted. Please try again.');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose} statusBarTranslucent>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(33,34,38,0.5)', justifyContent: 'center', paddingHorizontal: 24 }}
        onPress={handleClose}
      >
        <Pressable
          style={{ backgroundColor: sf.white, borderRadius: 20, padding: 24 }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: sf.black, marginBottom: 8, fontFamily: fonts.heading }}>
            Delete account
          </Text>
          <Text style={{ fontSize: 13, color: sf.grayDark, lineHeight: 19, marginBottom: 18 }}>
            This permanently deletes your profile, photos, and walk history. This action cannot be undone.
          </Text>

          <Text style={{
            fontSize: 11, fontWeight: '700', color: sf.grayDark,
            letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8,
          }}>
            Confirm your password
          </Text>
          <TextInput
            value={password}
            onChangeText={(text) => { setPassword(text); setError(null); }}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Password"
            placeholderTextColor={sf.grayMid}
            editable={!submitting}
            style={{
              borderWidth: 1.5, borderColor: 'rgba(33,34,38,0.08)', borderRadius: 12,
              paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: sf.black,
              backgroundColor: sf.white, marginBottom: 12,
            }}
          />

          {error && (
            <Text style={{ color: sf.rust, fontSize: 12, marginBottom: 12 }}>{error}</Text>
          )}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <TouchableOpacity
              onPress={handleClose}
              disabled={submitting}
              style={{
                flex: 1, paddingVertical: 13, borderRadius: 100, alignItems: 'center',
                borderWidth: 1.5, borderColor: 'rgba(33,34,38,0.15)',
              }}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: sf.grayDark }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={submitting}
              style={{
                flex: 1, paddingVertical: 13, borderRadius: 100, alignItems: 'center',
                backgroundColor: sf.rust, opacity: submitting ? 0.7 : 1,
              }}
              activeOpacity={0.85}
            >
              {submitting
                ? <ActivityIndicator color={sf.white} size="small" />
                : <Text style={{ fontSize: 13, fontWeight: '700', color: sf.white }}>Delete</Text>
              }
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
