import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container } from '@/components/ui/Container';

export default function SpotsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-main">
      <ScrollView className="flex-1">
        <Container>
          <View className="py-8">
            <Text className="text-2xl font-bold text-brand-text">Spots</Text>
            <Text className="text-gray-600 mt-2">Coming soon...</Text>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
