import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { LoadingState } from '@/components/ui/status';
import { Screen } from '@/components/ui/screen';
import { getUserProfile, hasPin, isOnboardingSeen } from '@/services/auth-service';

type Destination = '/onboarding' | '/register' | '/pin-code' | '/login';

export default function EntryScreen() {
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function resolveDestination() {
      const [onboardingSeen, profile, pinExists] = await Promise.all([
        isOnboardingSeen(),
        getUserProfile(),
        hasPin(),
      ]);

      if (!isMounted) return;

      if (!onboardingSeen) {
        setDestination('/onboarding');
        return;
      }

      if (!profile) {
        setDestination('/register');
        return;
      }

      setDestination(pinExists ? '/login' : '/pin-code');
    }

    resolveDestination();
    return () => {
      isMounted = false;
    };
  }, []);

  if (destination) return <Redirect href={destination} />;

  return (
    <Screen scroll={false}>
      <LoadingState text="Готуємо QuestMe..." />
    </Screen>
  );
}
