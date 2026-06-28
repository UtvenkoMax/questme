import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { categories } from '@/data/questme';

type CategoryId = (typeof categories)[number]['id'];

export function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((category) => {
        const active = category.id === selected;
        return (
          <Pressable
            accessibilityRole="button"
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}>
            <Text style={styles.icon}>{category.icon}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{category.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    backgroundColor: 'rgba(124, 58, 255, 0.24)',
    borderColor: questColors.electric,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    ...typography.label,
    color: questColors.textSecondary,
  },
  labelActive: {
    color: questColors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
});
