import { Pressable, Text, View } from 'react-native';

import { PIN_DIGIT_ROWS } from './pin-code.types';
import { pinCodeStyles as styles } from './pin-code.styles';

type PinEntryPanelProps = {
  cancelLabel?: string;
  onCancel: () => void;
  onPressDigit: (digit: string) => void;
};

export function PinEntryPanel({ cancelLabel = 'Очистити', onCancel, onPressDigit }: PinEntryPanelProps) {
  return (
    <View style={styles.pinPanel}>
      <View style={styles.keypad}>
        {PIN_DIGIT_ROWS.map((row) => (
          <View key={row.join('')} style={styles.keypadRow}>
            {row.map((digit) => (
              <DigitKey digit={digit} key={digit} onPress={onPressDigit} />
            ))}
          </View>
        ))}

        <View style={styles.keypadBottomRow}>
          <View style={styles.bottomSpacer} />
          <DigitKey digit="0" onPress={onPressDigit} />
          <Pressable
            accessibilityLabel={cancelLabel}
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}>
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type DigitKeyProps = {
  digit: string;
  onPress: (digit: string) => void;
};

function DigitKey({ digit, onPress }: DigitKeyProps) {
  return (
    <Pressable
      accessibilityLabel={`Цифра ${digit}`}
      accessibilityRole="button"
      onPress={() => onPress(digit)}
      style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}>
      <Text style={styles.keyText}>{digit}</Text>
    </Pressable>
  );
}
