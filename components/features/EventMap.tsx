import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Stop } from '@/types';

// Conditionally import MapView only if available (requires development build)
let MapView: any = null;
let Marker: any = null;

try {
  if (Platform.OS !== 'web') {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
  }
} catch (e) {
  // react-native-maps not available (Expo Go)
  MapView = null;
  Marker = null;
}

interface EventMapProps {
  stops: Stop[];
}

export const EventMap: React.FC<EventMapProps> = ({ stops }) => {
  const [mapsAvailable, setMapsAvailable] = useState(false);

  useEffect(() => {
    setMapsAvailable(MapView !== null && Marker !== null);
  }, []);

  if (stops.length === 0) {
    return (
      <View className="bg-white p-4 mb-4 rounded-lg">
        <Text className="text-gray-500 text-center">No stops available for this event</Text>
      </View>
    );
  }

  // If maps are not available (Expo Go), show a list view
  if (!mapsAvailable) {
    return (
      <View className="bg-white mb-4 rounded-lg">
        <View className="p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold text-brand-text">Event Stops</Text>
          <Text className="text-xs text-gray-600 mt-1">
            Map view requires a development build
          </Text>
        </View>
        <View className="p-4">
          {stops.map((stop, index) => (
            <View key={stop.id} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0">
              <View className="flex-row items-center mb-1">
                <View className="w-8 h-8 rounded-full bg-brand-secondary/20 items-center justify-center mr-3">
                  <Text className="text-brand-secondary font-semibold text-sm">{index + 1}</Text>
                </View>
                <Text className="text-brand-text font-semibold text-base flex-1">
                  {stop.name}
                </Text>
              </View>
              <View className="ml-11">
                <Text className="text-gray-600 text-sm">
                  📍 {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Calculate region to show all stops
  const latitudes = stops.map(stop => stop.latitude);
  const longitudes = stops.map(stop => stop.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const region = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.01),
  };

  return (
    <View className="bg-white mb-4 rounded-lg overflow-hidden">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold text-brand-text">Event Stops</Text>
      </View>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {stops.map((stop, index) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.name}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerCircle}>
                <Text style={styles.markerText}>{index + 1}</Text>
              </View>
              <View style={styles.markerPointer} />
            </View>
          </Marker>
        ))}
      </MapView>
      <View className="p-4">
        {stops.map((stop, index) => (
          <View key={stop.id} className="mb-2">
            <Text className="text-brand-text font-medium">
              {index + 1}. {stop.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ba5624',
    borderWidth: 3,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ba5624',
    marginTop: -2,
  },
});
