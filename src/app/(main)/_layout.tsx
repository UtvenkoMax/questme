import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Redirect, Tabs } from 'expo-router';
import { CheckSquare, House, MapPin, PlayCircle, Plus, UserCircle } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingState } from '@/components/ui/status';
import { Screen } from '@/components/ui/screen';
import { questColors } from '@/constants/colors';
import { radii } from '@/constants/spacing';
import { getAuthSession, getUserProfile, hasPin } from '@/services/auth-service';

const TAB_ICONS = {
  map: MapPin,
  profile: UserCircle,
  publish: Plus,
  quests: House,
  tasks: CheckSquare,
  videos: PlayCircle,
} as const;

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
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync().catch(() => {});
        },
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: questColors.electric,
        tabBarBackground: () => <BlurView intensity={38} style={StyleSheet.absoluteFill} tint="dark" />,
        tabBarInactiveTintColor: questColors.textSecondary,
        tabBarIcon: ({ color, focused }) => {
          const Icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS] ?? House;
          const isFab = route.name === 'publish';

          if (isFab) {
            return (
              <View style={styles.fab}>
                <Icon color={questColors.void} size={30} weight="bold" />
              </View>
            );
          }

          return <Icon color={color} size={focused ? 25 : 22} weight={focused ? 'fill' : 'regular'} />;
        },
        tabBarLabel: route.name === 'publish' ? '' : undefined,
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 66 + Math.max(insets.bottom, 8),
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
      })}>
      <Tabs.Screen name="quests" options={{ title: 'Feed', tabBarLabel: 'Feed' }} />
      <Tabs.Screen name="videos" options={{ title: 'Shorts', tabBarLabel: 'Shorts' }} />
      <Tabs.Screen name="publish" options={{ title: 'Create' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', tabBarLabel: 'Tasks' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarLabel: 'Profile' }} />
      <Tabs.Screen name="map" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    backgroundColor: questColors.ember,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    transform: [{ translateY: -18 }],
    width: 58,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
  },
  tabBar: {
    backgroundColor: 'rgba(17,17,24,0.86)',
    borderTopColor: questColors.border,
    borderTopWidth: 1,
    paddingTop: 8,
    position: 'absolute',
  },
});
