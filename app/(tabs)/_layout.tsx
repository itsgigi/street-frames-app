import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { sf } from '@/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focusedName, focused, color }: {
  name: IoniconsName; focusedName: IoniconsName; focused: boolean; color: string;
}) {
  return (
    <View style={focused ? {
      shadowColor: sf.orange,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    } : {}}>
      <Ionicons name={focused ? focusedName : name} size={23} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: sf.orange,
        tabBarInactiveTintColor: 'rgba(33,34,38,0.35)',
        tabBarBackground: () => (
          <View style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius: 26,
            overflow: 'hidden',
          }}>
            <BlurView
              tint="light"
              intensity={88}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 16,
          left: 24,
          right: 24,
          marginInline: 12,
          backgroundColor: 'transparent',
          borderRadius: 26,
          borderTopWidth: 0,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          elevation: 16,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" focusedName="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="images-outline" focusedName="images" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" focusedName="person" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
