import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { setOnboardingSeen } from '@/services/auth-service';

const STEPS = [
  {
    description: 'Створюйте короткі квести для себе або друзів і відстежуйте виконання.',
    title: 'Квести замість списків',
  },
  {
    description: 'PIN і біометрія допомагають швидко повертатися до свого простору.',
    title: 'Безпечний вхід',
  },
  {
    description: 'Виконані квести дають бали, прогрес і відчутний результат.',
    title: 'Прогрес і нагороди',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const finishOnboarding = async () => {
    await setOnboardingSeen();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>QuestMe</Text>
          <Text style={styles.title}>Перетворюйте справи на квести</Text>
          <Text style={styles.subtitle}>Короткий старт перед створенням профілю.</Text>
        </View>

        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={step.title} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={finishOnboarding}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
          <Text style={styles.primaryButtonText}>Почати</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'space-between',
    maxWidth: 620,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
  },
  header: {
    gap: 12,
    paddingTop: 24,
  },
  eyebrow: {
    color: '#2D6A5F',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#171B22',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: '#59616F',
    fontSize: 17,
    lineHeight: 24,
  },
  steps: {
    gap: 18,
  },
  step: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
  },
  stepNumber: {
    alignItems: 'center',
    backgroundColor: '#2D6A5F',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    gap: 5,
  },
  stepTitle: {
    color: '#171B22',
    fontSize: 18,
    fontWeight: '800',
  },
  stepDescription: {
    color: '#59616F',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2D6A5F',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 58,
  },
  buttonPressed: {
    opacity: 0.86,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
