import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  REGISTRATION_KEY,
  SESSION_KEY,
  deleteAuthItem,
  getAuthItem,
  parseSessionRecord,
} from '@/components/auth/auth-storage';
import { StartLoginPanel, StartSessionPanel } from '@/components/auth/start-login-panel';
import { SlideToRegister } from '@/components/auth/slide-to-register';
import { startScreenStyles as styles } from '@/components/auth/start-screen.styles';

type StartEntryMode = 'login' | 'register' | 'session';

export default function StartScreen() {
  const [entryMode, setEntryMode] = useState<StartEntryMode>('register');
  const [isProfileReady, setIsProfileReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      setShowEntry(true);
    }, 2000);

    Promise.all([
      getAuthItem(REGISTRATION_KEY),
      getAuthItem(SESSION_KEY),
    ])
      .then(([registrationValue, sessionValue]) => {
        if (!isMounted) return;

        const session = parseSessionRecord(sessionValue);

        if (session) {
          setEntryMode('session');
          setSessionName(session.name);
          return;
        }

        setEntryMode(registrationValue ? 'login' : 'register');
      })
      .catch(() => {
        if (!isMounted) return;
        setEntryMode('register');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsProfileReady(true);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await deleteAuthItem(SESSION_KEY);
      setSessionName('');
      setEntryMode('login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderEntryPanel = () => {
    if (entryMode === 'session') {
      return (
        <StartSessionPanel isLoggingOut={isLoggingOut} name={sessionName} onLogout={logout} />
      );
    }

    if (entryMode === 'login') {
      return <StartLoginPanel />;
    }

    return <SlideToRegister />;
  };

  return (
    <View style={styles.screen}>
      <Image
        accessibilityLabel="Стартове зображення QuestMe"
        contentFit="cover"
        source={require('@/assets/images/startimage.png')}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {showEntry && isProfileReady && (
          <View style={styles.sliderPanel}>{renderEntryPanel()}</View>
        )}
      </SafeAreaView>
    </View>
  );
}
