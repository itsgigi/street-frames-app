import React from 'react';
import {
  Modal, View, Text, Image, FlatList, TouchableOpacity, Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UserProfile } from '@/types';
import { fonts, sf } from '@/constants/theme';

const PLACEHOLDER = 'https://i.pravatar.cc/150?img=0';

interface Props {
  visible: boolean;
  participants: UserProfile[];
  onClose: () => void;
}

export function PhotographersModal({ visible, participants, onClose }: Props) {
  const handleUserPress = (uid: string) => {
    onClose();
    // Small delay so modal closes before navigation animates
    setTimeout(() => router.push(`/user/${uid}`), 150);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        {/* Sheet — stop press propagation so tapping inside doesn't close */}
        <Pressable
          style={{
            backgroundColor: sf.cream,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            paddingBottom: Platform.OS === 'ios' ? 34 : 24,
            maxHeight: '75%',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(33,34,38,0.15)' }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            paddingHorizontal: 24, paddingVertical: 16,
          }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: sf.black, fontFamily: fonts.heading, letterSpacing: 0.8 }}>
              PHOTOGRAPHERS ({participants.length})
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={sf.grayDark} />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={participants}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 4, paddingBottom: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleUserPress(item.id)}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 14,
                  paddingVertical: 10, paddingHorizontal: 12,
                  borderRadius: 16,
                  backgroundColor: sf.white,
                }}
              >
                <View style={{
                  width: 48, height: 48, borderRadius: 24,
                  borderWidth: 2, borderColor: sf.orange, overflow: 'hidden',
                }}>
                  <Image
                    source={{ uri: item.profilePhoto || PLACEHOLDER }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: sf.black, marginBottom: 2 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: sf.grayDark }}>@{item.handle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={sf.grayMid} />
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
