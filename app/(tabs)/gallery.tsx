import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getGalleryByTag, getGlobalGallery } from '@/services/photoService';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { GalleryPhoto } from '@/types';
import { sf } from '@/constants/theme';

const TILE_SIZE = (Dimensions.get('window').width - 48 - 8) / 2;

const CATEGORIES = [
  { key: 'all',             label: 'All' },
  { key: 'photojournalism', label: 'Street' },
  { key: 'vintage',         label: 'Vintage' },
  { key: 'stilllife',       label: 'Still Life' },
  { key: 'architecture',    label: 'Architecture' },
  { key: 'nightlife',       label: 'Night' },
];

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
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOpen, setSortOpen] = useState(false);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPhotos = async () => {
      setLoading(true);
      try {
        const data = activeCategory === 'all'
          ? await getGlobalGallery(50)
          : await getGalleryByTag(activeCategory, 50);
        if (mounted) setPhotos(data);
      } catch {
        if (mounted) setPhotos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPhotos();
    return () => {
      mounted = false;
    };
  }, [activeCategory]);

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
        {loading ? (
          <View style={{ paddingTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={sf.orange} />
          </View>
        ) : (
          <View style={{
            flexDirection: 'row', flexWrap: 'wrap',
            paddingHorizontal: 20, gap: 8,
            margin: 2,
            shadowColor: sf.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          }}>
            {photos.map((photo) => (
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
              </TouchableOpacity>
            ))}
            {photos.length === 0 && (
              <Text style={{ color: sf.grayDark, marginTop: 6 }}>No photos yet.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
