import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stop } from '@/types';
import { fonts, sf } from '@/constants/theme';

let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;

try {
  if (Platform.OS !== 'web') {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    Polyline = maps.Polyline;
  }
} catch (e) {
  MapView = null;
  Marker = null;
  Polyline = null;
}

const SCREEN_W = Dimensions.get('window').width;
const H_PAD = 20;
const CARD_GAP = 10;
const CARD_W = 180;

interface EventMapProps {
  stops: Stop[];
}

function overviewRegion(stops: Stop[]) {
  const lats = stops.map(s => s.latitude);
  const lngs = stops.map(s => s.longitude);
  return {
    latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
    longitude: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    latitudeDelta: Math.max((Math.max(...lats) - Math.min(...lats)) * 1.8, 0.015),
    longitudeDelta: Math.max((Math.max(...lngs) - Math.min(...lngs)) * 1.8, 0.015),
  };
}

export const EventMap: React.FC<EventMapProps> = ({ stops }) => {
  const [mapsAvailable, setMapsAvailable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const mapRef = useRef<any>(null);
  const stopsRef = useRef(stops);
  stopsRef.current = stops;

  useEffect(() => {
    setMapsAvailable(MapView !== null && Marker !== null);
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (!viewableItems.length || viewableItems[0].index == null) return;
    const idx = viewableItems[0].index;
    setActiveIndex(idx);
    const stop = stopsRef.current[idx];
    if (mapRef.current && stop) {
      mapRef.current.animateToRegion({
        latitude: stop.latitude,
        longitude: stop.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 450);
    }
  }).current;

  if (stops.length === 0) return null;

  return (
    <View style={{ height: 340, borderRadius: 20, overflow: 'hidden' }}>

      {/* ── Map fills everything ── */}
      {mapsAvailable ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={overviewRegion(stops)}
          mapType="mutedStandard"
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          {Polyline && (
            <Polyline
              coordinates={stops.map(s => ({ latitude: s.latitude, longitude: s.longitude }))}
              strokeColor={sf.orange}
              strokeWidth={2.5}
              lineDashPattern={[6, 4]}
            />
          )}
          {stops.map((stop, index) => (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View style={[
                styles.marker,
                index === activeIndex ? styles.markerActive : styles.markerInactive,
              ]}>
                <Text style={[
                  styles.markerLabel,
                  { color: index === activeIndex ? '#fff' : sf.orange },
                ]}>
                  {index + 1}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: sf.surface, alignItems: 'center', justifyContent: 'center', gap: 8 }]}>
          <Ionicons name="map-outline" size={40} color={sf.grayDark} />
          <Text style={{ color: sf.grayDark, fontSize: 12 }}>Map requires a development build</Text>
        </View>
      )}

      {/* ── Stop count pill ── */}
      <View style={{
        position: 'absolute', top: 12, left: 12,
        backgroundColor: 'rgba(33,34,38,0.72)',
        borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
      }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: sf.cream, letterSpacing: 0.5 }}>
          {stops.length} STOPS
        </Text>
      </View>

      {/* ── Floating cards at the bottom ── */}
      <FlatList
        horizontal
        data={stops}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ position: 'absolute', bottom: 12, left: 0, right: 0 }}
        contentContainerStyle={{ paddingHorizontal: H_PAD, gap: CARD_GAP }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <StopCard stop={item} index={index} isActive={index === activeIndex} total={stops.length} />
        )}
      />
    </View>
  );
};

/* ─── Stop Card ─── */

function StopCard({ stop, index, isActive, total }: {
  stop: Stop; index: number; isActive: boolean; total: number;
}) {
  return (
    <View style={{
      width: CARD_W,
      backgroundColor: isActive ? 'rgba(33,34,38,0.92)' : 'rgba(46,47,52,0.82)',
      borderRadius: 14,
      padding: 11,
      borderWidth: 1,
      borderColor: isActive ? sf.orange : 'rgba(255,255,255,0.08)',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <View style={{
          width: 24, height: 24, borderRadius: 12,
          backgroundColor: isActive ? sf.orange : 'rgba(255,255,255,0.1)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: isActive ? '#fff' : sf.grayDark, fontWeight: '700', fontSize: 11 }}>
            {index + 1}
          </Text>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: sf.cream, flex: 1, fontFamily: fonts.heading }} numberOfLines={1}>
          {stop.name}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name="location-outline" size={11} color={isActive ? sf.orange : sf.grayDark} />
        <Text style={{ fontSize: 10, color: isActive ? sf.orange : sf.grayDark }}>
          {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2,
  },
  markerActive: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: sf.orange, borderColor: '#ffffff',
  },
  markerInactive: {
    backgroundColor: sf.surface, borderColor: sf.orange,
  },
  markerLabel: {
    fontWeight: '700', fontSize: 12
  },
});
