import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

type TabIconName = React.ComponentProps<typeof Feather>['name'];

const TAB_ICONS: Record<string, TabIconName> = {
  map: 'map',
  profile: 'user',
  quests: 'compass',
};

export default function MainTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkSubtle,
        tabBarIcon: ({ color, focused }) => (
          <Feather color={color} name={TAB_ICONS[route.name] ?? 'circle'} size={focused ? 22 : 20} />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '400',
          letterSpacing: 0,
        },
        tabBarStyle: {
          backgroundColor: colors.surfacePearl,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 58 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 7,
        },
      })}>
      <Tabs.Screen
        name="quests"
        options={{
          tabBarLabel: 'Квести',
          title: 'Квести',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarLabel: 'Карта',
          title: 'Карта',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Профіль',
          title: 'Профіль',
        }}
      />
    </Tabs>
  );
}
