import { useEffect, useRef, type ReactNode } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputChangeEventData,
  type TextInputProps,
} from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type TextFieldProps = TextInputProps & {
  error?: string;
  hint?: string;
  label: string;
  rightAction?: ReactNode;
};

type WebTextInputChangeEvent = TextInputChangeEventData & {
  isComposing?: boolean;
};

export function TextField({
  error,
  hint,
  inputMode,
  keyboardType,
  label,
  defaultValue,
  onChange,
  onChangeText,
  rightAction,
  secureTextEntry,
  style,
  value,
  ...inputProps
}: TextFieldProps) {
  const usesDefaultTextKeyboard = !secureTextEntry && inputMode == null && keyboardType == null;
  const usesUncontrolledWebTextInput = Platform.OS === 'web' && usesDefaultTextKeyboard;
  const inputRef = useRef<(TextInput & { value?: string }) | null>(null);
  const handleChange =
    onChange || onChangeText
      ? (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
          onChange?.(event);

          const nativeEvent = event.nativeEvent as WebTextInputChangeEvent;
          if (Platform.OS === 'web' && nativeEvent.isComposing) return;

          onChangeText?.(nativeEvent.text);
        }
      : undefined;

  useEffect(() => {
    if (!usesUncontrolledWebTextInput || typeof value !== 'string') return;

    const input = inputRef.current;
    if (input && input.value !== value) {
      input.value = value;
    }
  }, [usesUncontrolledWebTextInput, value]);

  return (
    <View style={styles.field}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {rightAction}
      </View>
      <TextInput
        inputMode={usesDefaultTextKeyboard ? 'text' : inputMode}
        keyboardType={usesDefaultTextKeyboard ? 'default' : keyboardType}
        defaultValue={usesUncontrolledWebTextInput ? value ?? defaultValue : defaultValue}
        onChange={handleChange}
        placeholderTextColor={colors.inkSubtle}
        ref={inputRef}
        secureTextEntry={secureTextEntry}
        style={[styles.input, inputProps.multiline && styles.multiline, Boolean(error) && styles.inputError, style]}
        value={usesUncontrolledWebTextInput ? undefined : value}
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
