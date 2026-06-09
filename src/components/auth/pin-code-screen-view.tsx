import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PinEntryPanel } from './pin-entry-panel';
import { pinCodeStyles as styles } from './pin-code.styles';
import { PIN_LENGTH, type PinCodeStep } from './pin-code.types';

type PinCodeScreenViewProps = {
  isBusy: boolean;
  message: string;
  onCancel: () => void;
  onFinish: () => void;
  onPressDigit: (digit: string) => void;
  onRetryBiometric: () => void;
  pinLength: number;
  step: PinCodeStep;
  title: string;
};

export function PinCodeScreenView({
  isBusy,
  message,
  onCancel,
  onFinish,
  onPressDigit,
  onRetryBiometric,
  pinLength,
  step,
  title,
}: PinCodeScreenViewProps) {
  const isPinStep = step === 'create' || step === 'confirm';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.dots}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <View key={index} style={[styles.dot, index < pinLength && styles.dotFilled]} />
            ))}
          </View>
        </View>

        {isPinStep && (
          <PinEntryPanel onCancel={onCancel} onPressDigit={onPressDigit} />
        )}

        {step === 'biometric' && (
          <View style={styles.actions}>
            <PrimaryButton disabled={isBusy} onPress={onRetryBiometric}>
              {isBusy ? 'Очікуємо...' : 'Спробувати відбиток ще раз'}
            </PrimaryButton>
          </View>
        )}

        {step === 'done' && (
          <View style={styles.actions}>
            <PrimaryButton onPress={onFinish}>Продовжити</PrimaryButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

type PrimaryButtonProps = {
  children: string;
  disabled?: boolean;
  onPress: () => void;
};

function PrimaryButton({ children, disabled = false, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
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
