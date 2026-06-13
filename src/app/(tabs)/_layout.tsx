import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const TAB_ICONS = {
  index: '⌂',
  map: '⌖',
  profile: '◉',
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#A855F7',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Квести',
          tabBarLabel: 'Квести',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 20 : 18, fontWeight: '800' }}>{TAB_ICONS.index}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Карта',
          tabBarLabel: 'Карта',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 20 : 18, fontWeight: '800' }}>{TAB_ICONS.map}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профіль',
          tabBarLabel: 'Профіль',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ color, fontSize: focused ? 20 : 18, fontWeight: '800' }}>{TAB_ICONS.profile}</Text>
          ),
        }}
      />
    </Tabs>
  );
}
