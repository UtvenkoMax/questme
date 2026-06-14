import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type TextFieldProps = TextInputProps & {
  error?: string;
  hint?: string;
  label: string;
  rightAction?: ReactNode;
};

export function TextField({ error, hint, label, rightAction, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {rightAction}
      </View>
      <TextInput
        placeholderTextColor={colors.inkSubtle}
        style={[styles.input, inputProps.multiline && styles.multiline, Boolean(error) && styles.inputError, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.label,
    color: colors.ink,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  multiline: {
    minHeight: 92,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  hint: {
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
