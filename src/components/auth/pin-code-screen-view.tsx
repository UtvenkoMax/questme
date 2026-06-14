import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getResponsiveMetrics } from '@/utils/responsive';

import { PinEntryPanel } from './pin-entry-panel';
import { pinCodeStyles as styles } from './pin-code.styles';
import { PIN_LENGTH, type PinCodeStep } from './pin-code.types';

type PinCodeScreenViewProps = {
  biometricRetryLabel?: string;
  cancelLabel?: string;
  isBusy: boolean;
  message: string;
  onCancel: () => void;
  onFinish: () => void;
  onPressDigit: (digit: string) => void;
  onRetryBiometric: () => void;
  onSkipBiometric?: () => void;
  pinLength: number;
  step: PinCodeStep;
  title: string;
};

export function PinCodeScreenView({
  biometricRetryLabel = 'Спробувати біометрію ще раз',
  cancelLabel,
  isBusy,
  message,
  onCancel,
  onFinish,
  onPressDigit,
  onRetryBiometric,
  onSkipBiometric,
  pinLength,
  step,
  title,
}: PinCodeScreenViewProps) {
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const isPinStep = step === 'verify' || step === 'create' || step === 'confirm';
  const compact = layout.isCompactHeight || layout.isCompactWidth;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: layout.gutter },
          layout.isWide && styles.contentWide,
          compact && styles.contentCompact,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.header, compact && styles.headerCompact]}>
          <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
          <Text accessibilityLiveRegion="polite" style={[styles.message, compact && styles.messageCompact]}>
            {message}
          </Text>
          <View style={[styles.dots, compact && styles.dotsCompact]}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <View
                key={index}
                style={[styles.dot, compact && styles.dotCompact, index < pinLength && styles.dotFilled]}
              />
            ))}
          </View>
        </View>

        {isPinStep ? (
          <PinEntryPanel
            cancelLabel={cancelLabel}
            compact={compact}
            onCancel={onCancel}
            onPressDigit={onPressDigit}
          />
        ) : null}

        {step === 'biometric' ? (
          <View style={styles.actions}>
            <PrimaryButton disabled={isBusy} onPress={onRetryBiometric}>
              {isBusy ? 'Очікуємо...' : biometricRetryLabel}
            </PrimaryButton>
            {onSkipBiometric ? (
              <SecondaryButton disabled={isBusy} onPress={onSkipBiometric}>
                Пропустити
              </SecondaryButton>
            ) : null}
          </View>
        ) : null}

        {step === 'done' ? (
          <View style={styles.actions}>
            <PrimaryButton onPress={onFinish}>Продовжити</PrimaryButton>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

type PrimaryButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
};

function PrimaryButton({ children, disabled = false, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      <Text style={styles.primaryButtonText}>{children}</Text>
    </Pressable>
  );
}

function SecondaryButton({ children, disabled = false, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        disabled && styles.secondaryButtonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}>
      <Text style={styles.secondaryButtonText}>{children}</Text>
    </Pressable>
  );
}
