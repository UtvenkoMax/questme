import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreProfileScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Профіль</Text>
        <Text style={styles.title}>Мій профіль</Text>
        <Text style={styles.subtitle}>Статистика, нагороди та налаштування зʼявляться тут.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  container: {
    alignSelf: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    maxWidth: 560,
    padding: 24,
    width: '100%',
  },
  eyebrow: {
    color: '#2D6A5F',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
