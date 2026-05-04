import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface PhotoLightboxProps {
  photos: { id: string; imageUrl: string }[];
  selectedIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PhotoLightbox({ photos, selectedIndex, onClose, onPrev, onNext }: PhotoLightboxProps) {
  const canPrev = selectedIndex !== null && selectedIndex > 0;
  const canNext = selectedIndex !== null && selectedIndex < photos.length - 1;

  return (
    <Modal visible={selectedIndex !== null} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.93)', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={onClose}
          style={{ position: 'absolute', top: 56, right: 20, zIndex: 10, padding: 8 }}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>

        {selectedIndex !== null && photos[selectedIndex] && (
          <Image
            source={{ uri: photos[selectedIndex].imageUrl }}
            style={{ width: SCREEN_WIDTH - 32, height: SCREEN_WIDTH - 32, borderRadius: 12 }}
            resizeMode="contain"
          />
        )}

        <View style={{ flexDirection: 'row', gap: 40, marginTop: 28, alignItems: 'center' }}>
          <TouchableOpacity onPress={onPrev} disabled={!canPrev} style={{ padding: 12, opacity: canPrev ? 1 : 0.25 }}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>

          {selectedIndex !== null && (
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              {selectedIndex + 1} / {photos.length}
            </Text>
          )}

          <TouchableOpacity onPress={onNext} disabled={!canNext} style={{ padding: 12, opacity: canNext ? 1 : 0.25 }}>
            <Ionicons name="chevron-forward" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
