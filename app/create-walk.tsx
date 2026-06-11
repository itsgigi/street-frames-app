import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createWalk } from '@/services/walkService';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { sf, fonts } from '@/constants/theme';
import { Stop } from '@/types';

interface DraftStop {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
}

function makeEmptyStop(): DraftStop {
  return { id: String(Date.now() + Math.random()), name: '', latitude: '', longitude: '' };
}

export default function CreateWalkScreen() {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [stops, setStops] = useState<DraftStop[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStop = (id: string, field: keyof DraftStop, value: string) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeStop = (id: string) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreate = async () => {
    if (!title.trim() || !location.trim() || !date.trim()) {
      setError('Title, location and date are required.');
      return;
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      setError('Date must be a valid date (e.g. 2026-07-15).');
      return;
    }

    const parsedStops: Stop[] = [];
    for (const s of stops) {
      if (!s.name.trim()) continue;
      const lat = parseFloat(s.latitude);
      const lng = parseFloat(s.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        setError(`Stop "${s.name}" needs valid latitude and longitude.`);
        return;
      }
      parsedStops.push({ id: s.id, name: s.name.trim(), latitude: lat, longitude: lng });
    }

    setError(null);
    setSaving(true);

    try {
      await createWalk({
        title: title.trim(),
        coverImage: coverImage.trim(),
        location: location.trim(),
        description: description.trim(),
        date: parsedDate.toISOString(),
        stops: parsedStops,
      });
      router.back();
    } catch (e) {
      Alert.alert('Failed to create walk', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>
      <ScreenHeader
        title="CREATE WALK"
        left={
          <Pressable onPress={() => router.back()} hitSlop={12} disabled={saving}>
            <Ionicons name="close" size={24} color={saving ? sf.grayMid : sf.black} />
          </Pressable>
        }
        right={
          <TouchableOpacity onPress={handleCreate} disabled={saving} hitSlop={12}>
            {saving
              ? <ActivityIndicator size="small" color={sf.orange} />
              : <Text style={{ fontSize: 14, fontWeight: '700', color: sf.orange }}>Create</Text>
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
          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Title</Text>
            <TextInput
              style={inputStyle}
              value={title}
              onChangeText={setTitle}
              placeholder="Walk title"
              placeholderTextColor={sf.grayMid}
              editable={!saving}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Location</Text>
            <TextInput
              style={inputStyle}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Milan"
              placeholderTextColor={sf.grayMid}
              editable={!saving}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Date</Text>
            <TextInput
              style={inputStyle}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={sf.grayMid}
              autoCapitalize="none"
              editable={!saving}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Cover Image URL</Text>
            <TextInput
              style={inputStyle}
              value={coverImage}
              onChangeText={setCoverImage}
              placeholder="https://..."
              placeholderTextColor={sf.grayMid}
              autoCapitalize="none"
              editable={!saving}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>Description</Text>
            <TextInput
              style={[inputStyle, { height: 96, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the walk..."
              placeholderTextColor={sf.grayMid}
              multiline
              numberOfLines={4}
              editable={!saving}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={labelStyle}>Stops</Text>
              <TouchableOpacity onPress={() => setStops((prev) => [...prev, makeEmptyStop()])} disabled={saving}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: sf.orange }}>+ Add stop</Text>
              </TouchableOpacity>
            </View>

            {stops.map((stop, index) => (
              <View key={stop.id} style={{
                backgroundColor: sf.white, borderRadius: 14, padding: 14,
                borderWidth: 1.5, borderColor: 'rgba(33,34,38,0.08)',
                marginBottom: 12, gap: 10,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: sf.grayDark }}>Stop {index + 1}</Text>
                  <Pressable onPress={() => removeStop(stop.id)} hitSlop={8} disabled={saving}>
                    <Ionicons name="trash-outline" size={16} color={sf.rust} />
                  </Pressable>
                </View>
                <TextInput
                  style={inputStyle}
                  value={stop.name}
                  onChangeText={(v) => updateStop(stop.id, 'name', v)}
                  placeholder="Stop name"
                  placeholderTextColor={sf.grayMid}
                  editable={!saving}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput
                    style={[inputStyle, { flex: 1 }]}
                    value={stop.latitude}
                    onChangeText={(v) => updateStop(stop.id, 'latitude', v)}
                    placeholder="Latitude"
                    placeholderTextColor={sf.grayMid}
                    keyboardType="numbers-and-punctuation"
                    editable={!saving}
                  />
                  <TextInput
                    style={[inputStyle, { flex: 1 }]}
                    value={stop.longitude}
                    onChangeText={(v) => updateStop(stop.id, 'longitude', v)}
                    placeholder="Longitude"
                    placeholderTextColor={sf.grayMid}
                    keyboardType="numbers-and-punctuation"
                    editable={!saving}
                  />
                </View>
              </View>
            ))}
          </View>

          {error && (
            <Text style={{ color: sf.rust, fontSize: 13, textAlign: 'center', marginBottom: 16 }}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleCreate}
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
                  <Text style={{ fontSize: 15, fontWeight: '700', color: sf.cream }}>Creating…</Text>
                </View>
              )
              : <Text style={{ fontSize: 15, fontWeight: '700', color: sf.cream, fontFamily: fonts.heading, letterSpacing: 0.5 }}>
                  Create Walk
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
