import React from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {Container} from '@/components/ui/Container';
import {Section} from '@/components/ui/Section';
import {ProfileHeader} from '@/components/features/ProfileHeader';
import {ProfileEventCard} from '@/components/features/ProfileEventCard';
import {PhotoGrid} from '@/components/features/PhotoGrid';
import {mockPhotos, pastEvents} from '@/services/mockData';
import {useAuthMethods} from "@/hooks/useAuthMethods";

// Mock user data - in a real app, this would come from auth context or API
const mockUser = {
  id: 'user-1',
  name: 'Marco',
  surname: 'Rossi',
  avatar: 'https://i.pravatar.cc/150?img=1',
  email: 'marco.rossi@example.com',
};

export default function ProfileScreen() {
  const participatedEvents = pastEvents.slice(0, 3);
  const { logout } = useAuthMethods();

  return (
    <SafeAreaView className="flex-1 bg-brand-main">
      <ScrollView className="flex-1">
        <Container>
          <ProfileHeader
            name={mockUser.name}
            surname={mockUser.surname}
            avatar={mockUser.avatar}
            email={mockUser.email}
          />

          <Section title="Participated Events">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {participatedEvents.map((event) => (
                <ProfileEventCard key={event.id} event={event} />
              ))}
            </ScrollView>
          </Section>

          <PhotoGrid photos={mockPhotos} />

          <TouchableOpacity
            onPress={logout}
            className="flex-row items-center justify-center gap-2 mx-4 my-6 py-3 rounded-xl bg-brand-orange"
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-bold text-base tracking-wide">Logout</Text>
          </TouchableOpacity>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
