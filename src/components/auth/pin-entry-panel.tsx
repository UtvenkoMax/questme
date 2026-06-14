import { Pressable, Text, View } from 'react-native';

import { PIN_DIGIT_ROWS } from './pin-code.types';
import { pinCodeStyles as styles } from './pin-code.styles';

type PinEntryPanelProps = {
  cancelLabel?: string;
  compact?: boolean;
  onCancel: () => void;
  onPressDigit: (digit: string) => void;
};

export function PinEntryPanel({
  cancelLabel = 'Очистити',
  compact = false,
  onCancel,
  onPressDigit,
}: PinEntryPanelProps) {
  return (
    <View style={styles.pinPanel}>
      <View style={[styles.keypad, compact && styles.keypadCompact]}>
        {PIN_DIGIT_ROWS.map((row) => (
          <View key={row.join('')} style={[styles.keypadRow, compact && styles.keypadRowCompact]}>
            {row.map((digit) => (
              <DigitKey compact={compact} digit={digit} key={digit} onPress={onPressDigit} />
            ))}
          </View>
        ))}

        <View style={[styles.keypadBottomRow, compact && styles.keypadBottomRowCompact]}>
          <View style={[styles.bottomSpacer, compact && styles.bottomSpacerCompact]} />
          <DigitKey compact={compact} digit="0" onPress={onPressDigit} />
          <Pressable
            accessibilityLabel={cancelLabel}
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => [
              styles.cancelButton,
              compact && styles.cancelButtonCompact,
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type DigitKeyProps = {
  compact: boolean;
  digit: string;
  onPress: (digit: string) => void;
};

function DigitKey({ compact, digit, onPress }: DigitKeyProps) {
  return (
    <Pressable
      accessibilityLabel={`Цифра ${digit}`}
      accessibilityRole="button"
      onPress={() => onPress(digit)}
      style={({ pressed }) => [styles.key, compact && styles.keyCompact, pressed && styles.keyPressed]}
    >
      <Text style={[styles.keyText, compact && styles.keyTextCompact]}>{digit}</Text>
    </Pressable>
  );
}
