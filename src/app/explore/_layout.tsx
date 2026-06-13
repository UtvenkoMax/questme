import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const TAB_ICONS = {
  index: '⌂',
  map: '⌖',
  profile: '◉',
} as const;

export default function ExploreTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A855F7',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 20 : 18, fontWeight: '800' }}>{TAB_ICONS.index}</Text>
          ),
          tabBarLabel: 'Квести',
          title: 'Квести',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 20 : 18, fontWeight: '800' }}>{TAB_ICONS.map}</Text>
          ),
          tabBarLabel: 'Карта',
          title: 'Карта',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 20 : 18, fontWeight: '800' }}>{TAB_ICONS.profile}</Text>
          ),
          tabBarLabel: 'Профіль',
          title: 'Профіль',
        }}
      />
    </Tabs>
  );
}
