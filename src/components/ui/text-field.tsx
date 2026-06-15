import { useEffect, useRef, useState, type ReactNode } from 'react';
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

import { colors, radii, spacing, typography, shadows } from '@/theme';

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
  const [isFocused, setIsFocused] = useState(false);

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

  const handleFocus = (e: any) => {
    setIsFocused(true);
    inputProps.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    inputProps.onBlur?.(e);
  };

  const isError = Boolean(error);

  return (
    <View style={styles.field}>
      <View style={styles.header}>
        <Text style={[styles.label, isFocused && styles.labelFocused, isError && styles.labelError]}>{label}</Text>
        {rightAction}
      </View>
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused,
        isError && styles.inputWrapperError,
        inputProps.multiline && styles.inputWrapperMultiline
      ]}>
        <TextInput
          inputMode={usesDefaultTextKeyboard ? 'text' : inputMode}
          keyboardType={usesDefaultTextKeyboard ? 'default' : keyboardType}
          defaultValue={usesUncontrolledWebTextInput ? value ?? defaultValue : defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.inkSubtle}
          ref={inputRef}
          secureTextEntry={secureTextEntry}
          style={[styles.input, inputProps.multiline && styles.multiline, style]}
          value={usesUncontrolledWebTextInput ? undefined : value}
          {...inputProps}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

import { styles } from './text-field.styles';
