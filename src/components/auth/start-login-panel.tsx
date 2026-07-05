import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { startScreenStyles as styles } from './start-screen.styles';

type StartSessionPanelProps = {
  isLoggingOut: boolean;
  name: string;
  onLogout: () => void;
};

export function StartLoginPanel() {
  const router = useRouter();

  return (
    <View style={styles.loginPanel}>
      <Pressable
        onPress={() => router.push('/login')}
        style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}>
        <Text style={styles.loginButtonText}>Увійти</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/register')}
        style={({ pressed }) => [styles.createProfileButton, pressed && styles.loginButtonPressed]}>
        <Text style={styles.createProfileText}>Створити новий профіль</Text>
      </Pressable>
    </View>
  );
}

export function StartSessionPanel({ isLoggingOut, name, onLogout }: StartSessionPanelProps) {
  return (
    <View style={styles.loginPanel}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionEyebrow}>QuestMe</Text>
        <Text numberOfLines={1} style={styles.sessionName}>
          {name}
        </Text>
      </View>
      <Pressable
        disabled={isLoggingOut}
        onPress={onLogout}
        style={({ pressed }) => [
          styles.createProfileButton,
          pressed && !isLoggingOut && styles.loginButtonPressed,
        ]}>
        <Text style={styles.createProfileText}>{isLoggingOut ? 'Виходимо...' : 'Вийти'}</Text>
      </Pressable>
    </View>
  );
}
