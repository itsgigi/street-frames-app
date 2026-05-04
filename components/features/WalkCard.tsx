import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Event } from '@/types';
import { fonts, sf } from '@/constants/theme';

let MapView: any = null;
let Marker: any = null;
try {
  if (Platform.OS !== 'web') {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
  }
} catch { /* not available in Expo Go */ }

const CARD_PAD = 18;
const CARD_H = 160;

export function WalkCard({ event, isUpcoming, onPress }: {
  event: Event; isUpcoming: boolean; onPress: () => void;
}) {
  const hasMap = event.centerLatitude != null && event.centerLongitude != null;

  return (
    <View style={{
      backgroundColor: sf.black,
      borderRadius: 35,
      borderColor: sf.white,
      borderWidth: 5,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>

        <View style={{
          flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
          paddingHorizontal: CARD_PAD, paddingTop: CARD_PAD, paddingBottom: 14,
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <Ionicons name="location" size={12} color={sf.orange} />
              <Text style={{ fontSize: 11, color: sf.orange, fontWeight: '700', letterSpacing: 0.5 }}>
                {event.location.toUpperCase()}
              </Text>
            </View>
            <Text style={{ fontSize: 17, fontWeight: '700', color: sf.white, marginBottom: 4, fontFamily: fonts.heading }}>
              {event.title}
            </Text>
            <Text style={{ fontSize: 12, color: sf.grayDark }}>
              {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}{event.participantsCount} photographers
            </Text>
          </View>
          {isUpcoming && (
            <View style={{
              backgroundColor: sf.orange + '22',
              paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100,
              borderWidth: 1, borderColor: sf.orange, marginLeft: 10,
            }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: sf.orange, letterSpacing: 0.5 }}>UPCOMING</Text>
            </View>
          )}
        </View>

        <View style={{
          flexDirection: 'row',
          gap: 10,
          height: CARD_H,
          paddingLeft: CARD_PAD,
          paddingBottom: CARD_PAD,
        }}>
          <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
            {hasMap && MapView ? (
              <MapView
                style={{ flex: 1 }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                mapType="mutedStandard"
                initialRegion={{
                  latitude: event.centerLatitude!,
                  longitude: event.centerLongitude!,
                  latitudeDelta: 0.04,
                  longitudeDelta: 0.04,
                }}
              >
                <Marker coordinate={{ latitude: event.centerLatitude!, longitude: event.centerLongitude! }}>
                  <View style={{
                    width: 10, height: 10, borderRadius: 5,
                    backgroundColor: sf.orange, borderWidth: 2, borderColor: '#fff',
                  }} />
                </Marker>
              </MapView>
            ) : (
              <View style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="map-outline" size={28} color={sf.grayDark} />
              </View>
            )}
          </View>

          <View style={{
            flex: 1, borderRadius: 12,
            shadowColor: sf.grayDark, shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
          }}>
            <Image source={{ uri: event.coverImage }} style={{ flex: 1, borderRadius: 12 }} resizeMode="cover" />
          </View>

          <View style={{ flex: 1, gap: 10 }}>
            {(event.photos ?? []).slice(0, 2).map((photo) => (
              <View key={photo.id} style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
                <Image source={{ uri: photo.imageUrl }} style={{ flex: 1 }} resizeMode="cover" />
              </View>
            ))}
          </View>

          <LinearGradient
            colors={['rgba(33, 34, 38,0)', 'rgba(33, 34, 38,0.2)', sf.black]}
            locations={[0, 0.1, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 0 }}
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0,
              width: 60, pointerEvents: 'none', borderBottomRightRadius: 20,
            }}
          />
        </View>

      </TouchableOpacity>
    </View>
  );
}
