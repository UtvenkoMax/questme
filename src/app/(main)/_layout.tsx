import { Feather } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingState } from '@/components/ui/status';
import { Screen } from '@/components/ui/screen';
import { getAuthSession, getUserProfile, hasPin } from '@/services/auth-service';
import { colors } from '@/theme';

type TabIconName = React.ComponentProps<typeof Feather>['name'];

const TAB_ICONS: Record<string, TabIconName> = {
  map: 'map',
  publish: 'send',
  profile: 'user',
  quests: 'compass',
  videos: 'play-circle',
};

export default function MainTabsLayout() {
  const insets = useSafeAreaInsets();
  const [redirectTo, setRedirectTo] = useState<'/' | '/login' | '/pin-code' | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      const [profile, session, pinExists] = await Promise.all([
        getUserProfile(),
        getAuthSession(),
        hasPin(),
      ]);

      if (!isMounted) return;

      if (!profile) {
        setRedirectTo('/');
      } else if (!pinExists) {
        setRedirectTo('/pin-code');
      } else if (!session) {
        setRedirectTo('/login');
      } else {
        setRedirectTo(null);
      }

      setIsCheckingAccess(false);
    }

    checkAccess();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingAccess) {
    return (
      <Screen scroll={false}>
        <LoadingState text="Перевіряємо сесію..." />
      </Screen>
    );
  }

  if (redirectTo) {
    return <Redirect href={redirectTo} />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkSubtle,
        tabBarIcon: ({ color, focused }) => (
          <Feather color={color} name={TAB_ICONS[route.name] ?? 'circle'} size={focused ? 21 : 19} />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
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
        name="videos"
        options={{
          tabBarLabel: 'Відео',
          title: 'Відео',
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          tabBarLabel: 'Публікації',
          title: 'Публікації',
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
