import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { getUserProfile, hasPin, isOnboardingSeen } from '@/services/auth-service';

type Destination = '/onboarding' | '/register' | '/pin-code' | '/login';

// Запобігаємо автоматичному приховуванню Splash екрану
SplashScreen.preventAutoHideAsync();

export default function EntryScreen() {
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function resolveDestination() {
      try {
        const [onboardingSeen, profile, pinExists] = await Promise.all([
          isOnboardingSeen(),
          getUserProfile(),
          hasPin(),
        ]);

        if (!isMounted) return;

        if (!onboardingSeen) {
          setDestination('/onboarding');
        } else if (!profile) {
          setDestination('/register');
        } else {
          setDestination(pinExists ? '/login' : '/pin-code');
        }
      } catch {
        // У разі помилки відправляємо на онбординг як фолбек
        if (isMounted) setDestination('/onboarding');
      } finally {
        // Ховаємо Splash screen ТІЛЬКИ коли визначили куди йти
        await SplashScreen.hideAsync();
      }
    }

    resolveDestination();
    return () => {
      isMounted = false;
    };
  }, []);

  if (destination) return <Redirect href={destination} />;

  // Повертаємо null, оскільки Splash screen все ще показується
  return null; 
}
