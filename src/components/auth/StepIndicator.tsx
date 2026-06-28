import { StyleSheet, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';

export function StepIndicator({ count = 3, index }: { count?: number; index: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, itemIndex) => (
        <View key={itemIndex} style={[styles.dot, itemIndex === index && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    backgroundColor: questColors.border,
    borderRadius: radii.pill,
    height: 7,
    width: 7,
  },
  dotActive: {
    backgroundColor: questColors.acid,
    shadowColor: questColors.acid,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    width: 26,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
});
