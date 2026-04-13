import React, { useState } from 'react';
import {
  ScrollView, View, Text, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { mockPhotos } from '@/services/mockData';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { sf } from '@/constants/theme';

const TILE_SIZE = (Dimensions.get('window').width - 48 - 8) / 2;

const CATEGORIES = [
  { key: 'photojournalism', label: 'Street' },
  { key: 'vintage',         label: 'Vintage' },
  { key: 'stilllife',       label: 'Still Life' },
  { key: 'architecture',    label: 'Architecture' },
  { key: 'nightlife',       label: 'Night' },
];

const GALLERY_PHOTOS = [
  ...mockPhotos,
  { id: 'photo-7', imageUrl: 'https://images.unsplash.com/photo-1533158388-350df81cd1ce?w=400' },
  { id: 'photo-8', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400' },
  { id: 'photo-9', imageUrl: 'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=400' },
].map((p, i) => ({
  ...p,
  likes:   [172, 88, 45, 210, 67, 130, 55, 93, 38][i] ?? 10,
  starred: [true, false, true, false, false, true, false, true, false][i] ?? false,
}));

// ── Dial selector ────────────────────────────────────────────────────────────
function DialSelector({
  activeCategory,
  onSelect,
}: {
  activeCategory: string;
  onSelect: (key: string) => void;
}) {
  return (
    <View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}
    >
      {CATEGORIES.map((cat) => {
        const active = activeCategory === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            onPress={() => onSelect(cat.key)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 100,
              backgroundColor: active ? sf.black : 'transparent',
              borderWidth: 1.5,
              borderColor: active ? sf.black : sf.grayDark,
              height: 36,
              marginBottom: 12,
            }}
          >
            {/* aperture dot — camera reference */}
            <View style={{
              width: 7, height: 7, borderRadius: 3.5,
              backgroundColor: active ? sf.orange : sf.grayDark,
            }} />
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: active ? sf.cream : sf.black,
              letterSpacing: 0.2,
            }}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(242, 220, 194,0)','rgba(242, 220, 194,0.97)', 'rgba(242, 220, 194,1)']}
        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
        style={{ position: 'absolute', top: 0, bottom: 12, right: 0, width: 50 }}
      />
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function GalleryScreen() {
  const [activeCategory, setActiveCategory] = useState('photojournalism');
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>

      {/* ── Header ── */}
      <ScreenHeader
        title="GALLERY"
        right={
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity hitSlop={12}>
              <Ionicons name="search-outline" size={24} color={sf.black} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={12}>
              <Ionicons name="options-outline" size={24} color={sf.black} />
            </TouchableOpacity>
          </View>
        }
      />

      {/* ── Dial selector ── */}
      <DialSelector activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* ── Popular section header ── */}
      <ScreenHeader
        title="POPULAR"
        style={{ paddingVertical: 0, marginBottom: 12 }}
        right={
          <TouchableOpacity
            onPress={() => setSortOpen(!sortOpen)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          >
            <Text style={{ fontSize: 12, color: sf.grayDark }}>Sort by </Text>
            <Text style={{ fontSize: 12, color: sf.orange, fontWeight: '600' }}>Latest</Text>
            <Ionicons name="chevron-down" size={14} color={sf.orange} />
          </TouchableOpacity>
        }
      />

      {/* ── Photo Grid ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{
          flexDirection: 'row', flexWrap: 'wrap',
          paddingHorizontal: 20, gap: 8,
          margin: 2,
          shadowColor: sf.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
        }}>
          {GALLERY_PHOTOS.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              activeOpacity={0.88}
              style={{ width: TILE_SIZE, height: TILE_SIZE * 1.2, borderRadius: 28, overflow: 'hidden', borderColor: sf.grayLight, borderWidth: 6 }}
            >
              <Image
                source={{ uri: photo.imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={{
                position: 'absolute', top: 10, right: 10,
                flexDirection: 'row', alignItems: 'center', gap: 3,
                backgroundColor: 'rgba(33,34,38,0.70)',
                paddingHorizontal: 8, paddingVertical: 4,
              }}>
                <Ionicons
                  name={photo.starred ? 'star' : 'star-outline'}
                  size={11}
                  color={photo.starred ? '#D49B37' : sf.cream}
                />
                <Text style={{ fontSize: 11, fontWeight: '600', color: sf.cream }}>
                  {photo.likes}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
