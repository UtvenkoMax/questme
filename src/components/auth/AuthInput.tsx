import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

type AuthInputProps = TextInputProps & {
  label: string;
  helper?: string;
};

export function AuthInput({ helper, label, style, ...props }: AuthInputProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={questColors.textSecondary}
        selectionColor={questColors.acid}
        style={[styles.input, style]}
        {...props}
      />
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  input: {
    ...typography.subtitle,
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: questColors.textPrimary,
    minHeight: 58,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.eyebrow,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  wrap: {
    gap: spacing.xs,
  },
});
