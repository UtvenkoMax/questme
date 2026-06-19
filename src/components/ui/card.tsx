import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

import { useAppTheme } from '@/components/providers/app-preferences';
import { colors, radii, shadows, spacing } from '@/theme';

type CardProps = {
  children: ReactNode;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, padded = true, style }: CardProps) {
  const theme = useAppTheme();

  return (
    <Animated.View
      entering={FadeInUp.duration(320)}
      layout={Layout.springify().damping(18).stiffness(180)}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        padded && styles.padded,
        style,
      ]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  padded: {
    padding: spacing.xl,
  },
});
