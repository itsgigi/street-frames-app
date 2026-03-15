import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Container } from '@/components/ui/Container';
import { nextEvent, pastEvents } from '@/services/mockData';

export default function HomeScreen() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-main">
      {/* Header */}
      <View className="bg-brand-main px-4 py-3 flex-row items-center justify-between">
        <Pressable>
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
            <Ionicons name="menu" size={24} color="#231a13" />
          </View>
        </Pressable>
        <Text className="text-lg font-bold text-brand-text">STREET FRAMES MILAN</Text>
        <Pressable onPress={() => router.push('/profile')}>
          <View className="w-10 h-10 rounded-full bg-brand-secondary items-center justify-center">
            <Ionicons name="person" size={20} color="#231a13" />
          </View>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Container>
          {/* Next Meetup Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-semibold text-brand-secondary">NEXT MEETUP</Text>
              <Pressable>
                <Text className="text-sm text-blue-500">View All</Text>
              </Pressable>
            </View>
            
            <TouchableOpacity
              onPress={() => router.push(`/event/${nextEvent.id}`)}
              className="rounded-[50px] overflow-hidden mb-4"
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: nextEvent.coverImage }}
                className="w-full h-96"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/30" />
              <View className="absolute inset-0 p-4 justify-between">
                <View className="flex-row items-start justify-between">
                  <View className="bg-brand-secondary px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">UPCOMING</Text>
                  </View>
                  <Text className="text-white text-sm font-medium">{formatDate(nextEvent.date)}</Text>
                </View>
                <View>
                  <Text className="text-white text-2xl font-bold mb-2">{nextEvent.title}</Text>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location" size={16} color="#ffffff" />
                    <Text className="text-white text-sm ml-1">{nextEvent.location}</Text>
                  </View>
                  <Text className="text-brand-secondary text-sm font-medium mb-3">
                    {nextEvent.participantsCount} photographers attending
                  </Text>
                  <View className="flex-row justify-end">
                    <TouchableOpacity
                      className="bg-white px-6 py-2 rounded-lg border border-gray-300"
                      activeOpacity={0.8}
                    >
                      <Text className="text-brand-text font-semibold">Join</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Past Captures Section */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-blue-400 mb-4">PAST CAPTURES</Text>
            {pastEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => router.push(`/event/${event.id}`)}
                className="flex-row items-center mb-4 bg-white rounded-xl p-3"
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: event.coverImage }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-bold text-brand-text mb-1">{event.title}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={14} color="#9d917c" />
                    <Text className="text-sm text-gray-600 ml-1">{formatDate(event.date)}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9d917c" />
              </TouchableOpacity>
            ))}
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
