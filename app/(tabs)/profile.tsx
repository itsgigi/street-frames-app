import React from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
      <TouchableOpacity onPress={logout} className="relative float-end m-2 w-20 z-10 px-3 py-2 rounded bg-gray-200">
        <Text className="text-blue-500 font-bold">Logout</Text>
      </TouchableOpacity>
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
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
