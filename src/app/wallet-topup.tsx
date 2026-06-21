import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CreditCard, Bank, CheckCircle, Lightning } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ChaosButton, ChaosBadge } from '@/components/ui/chaos';
import { Screen } from '@/components/ui/screen';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useWalletStore, selectFormattedBalance } from '@/store';

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

type PaymentMethod = 'monobank' | 'privatbank' | 'card';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; subtitle: string; icon: typeof CreditCard }[] = [
  { id: 'monobank', label: 'Monobank', subtitle: 'Миттєве поповнення', icon: Lightning },
  { id: 'privatbank', label: 'PrivatBank', subtitle: 'Переказ через API', icon: Bank },
  { id: 'card', label: 'Visa / Mastercard', subtitle: 'Будь-яка картка', icon: CreditCard },
];

export default function WalletTopUpScreen() {
  const router = useRouter();
  const topUp = useWalletStore((s) => s.topUp);
  const formattedBalance = useWalletStore(selectFormattedBalance);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('monobank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const numericAmount = parseInt(amount, 10) || 0;
  const isValid = numericAmount >= 10 && numericAmount <= 50000;

  const handleQuickAmount = (value: number) => {
    setAmount(String(value));
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1800));
    // Actually add to wallet balance
    const methodLabel = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label ?? selectedMethod;
    topUp(numericAmount, methodLabel);
    setIsProcessing(false);
    setIsDone(true);
  };

  if (isDone) {
    return (
      <Screen scroll={false}>
        <View style={styles.successScreen}>
          <View style={styles.successIconWrap}>
            <CheckCircle color={questColors.acid} size={72} weight="fill" />
          </View>
          <Text style={styles.successTitle}>Поповнено!</Text>
          <Text style={styles.successAmount}>+{numericAmount} грн</Text>
          <Text style={styles.successSubtitle}>
            Кошти зараховано на ваш баланс QuestMe через{' '}
            {PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}
          </Text>
          <Text style={styles.newBalance}>Новий баланс: {formattedBalance}</Text>
          <ChaosButton label="Повернутись" onPress={() => router.back()} variant="outline" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen keyboard contentStyle={styles.content}>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft color={questColors.textPrimary} size={22} weight="bold" />
        <Text style={styles.backLabel}>Гаманець</Text>
      </Pressable>

      {/* Header */}
      <View style={styles.heroCard}>
        <LinearGradient
          colors={['rgba(196,255,0,0.12)', 'rgba(124,58,255,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Text style={styles.heroEyebrow}>Поповнення</Text>
          <Text style={styles.heroTitle}>Поповніть баланс</Text>
          <Text style={styles.heroSubtitle}>
            Поточний баланс: {formattedBalance}
          </Text>
        </LinearGradient>
      </View>

      {/* Amount Input */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Сума</Text>
        <View style={styles.amountInputWrap}>
          <TextInput
            keyboardType="number-pad"
            onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
            placeholder="0"
            placeholderTextColor={questColors.textSecondary}
            style={styles.amountInput}
            value={amount}
          />
          <Text style={styles.currency}>грн</Text>
        </View>
        {amount.length > 0 && !isValid ? (
          <Text style={styles.amountError}>Мін. 10 грн, макс. 50 000 грн</Text>
        ) : null}

        {/* Quick amounts */}
        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map((qa) => {
            const active = String(qa) === amount;
            return (
              <Pressable
                accessibilityRole="button"
                key={qa}
                onPress={() => handleQuickAmount(qa)}
                style={[styles.quickChip, active && styles.quickChipActive]}
              >
                <Text style={[styles.quickChipText, active && styles.quickChipTextActive]}>
                  {qa} грн
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Спосіб оплати</Text>
        {PAYMENT_METHODS.map((method) => {
          const active = method.id === selectedMethod;
          const Icon = method.icon;
          return (
            <Pressable
              accessibilityRole="button"
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={[styles.methodRow, active && styles.methodRowActive]}
            >
              <View style={[styles.methodIcon, active && styles.methodIconActive]}>
                <Icon
                  color={active ? questColors.acid : questColors.textSecondary}
                  size={22}
                  weight="bold"
                />
              </View>
              <View style={styles.methodCopy}>
                <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>
                  {method.label}
                </Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              {active ? (
                <View style={styles.radioActive}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radio} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Summary & Confirm */}
      <View style={styles.card}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Поповнення</Text>
          <Text style={styles.summaryValue}>{numericAmount > 0 ? `${numericAmount} грн` : '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Комісія</Text>
          <ChaosBadge tone="success">0 грн</ChaosBadge>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Всього</Text>
          <Text style={styles.totalValue}>{numericAmount > 0 ? `${numericAmount} грн` : '—'}</Text>
        </View>
        <ChaosButton
          disabled={!isValid || isProcessing}
          label={isProcessing ? 'Обробка...' : 'Поповнити'}
          onPress={handleConfirm}
          variant="ember"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  amountError: {
    ...typography.caption,
    color: questColors.danger,
    marginTop: spacing.xxs,
  },
  amountInput: {
    ...typography.display,
    color: questColors.textPrimary,
    flex: 1,
    minHeight: 56,
    padding: 0,
  },
  amountInputWrap: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  backLabel: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  card: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  currency: {
    ...typography.subtitle,
    color: questColors.textSecondary,
  },
  heroCard: {
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroEyebrow: {
    ...typography.eyebrow,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  heroGradient: {
    gap: spacing.xs,
    padding: spacing.lg,
  },
  heroSubtitle: {
    ...typography.body,
    color: questColors.textSecondary,
  },
  heroTitle: {
    ...typography.title,
    color: questColors.textPrimary,
  },
  methodCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  methodIcon: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderRadius: radii.sm,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  methodIconActive: {
    backgroundColor: 'rgba(196,255,0,0.12)',
  },
  methodLabel: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  methodLabelActive: {
    color: questColors.acid,
  },
  methodRow: {
    alignItems: 'center',
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  methodRowActive: {
    borderColor: 'rgba(196,255,0,0.4)',
    backgroundColor: 'rgba(196,255,0,0.04)',
  },
  methodSubtitle: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  newBalance: {
    ...typography.subtitle,
    color: questColors.acid,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  quickChip: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  quickChipActive: {
    backgroundColor: 'rgba(196,255,0,0.14)',
    borderColor: 'rgba(196,255,0,0.5)',
  },
  quickChipText: {
    ...typography.label,
    color: questColors.textSecondary,
  },
  quickChipTextActive: {
    color: questColors.acid,
  },
  radio: {
    borderColor: questColors.border,
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 22,
    width: 22,
  },
  radioActive: {
    alignItems: 'center',
    borderColor: questColors.acid,
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioInner: {
    backgroundColor: questColors.acid,
    borderRadius: radii.pill,
    height: 10,
    width: 10,
  },
  sectionLabel: {
    ...typography.label,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  successAmount: {
    ...typography.display,
    color: questColors.acid,
  },
  successIconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(196,255,0,0.08)',
    borderRadius: radii.pill,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  successScreen: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successSubtitle: {
    ...typography.body,
    color: questColors.textSecondary,
    textAlign: 'center',
  },
  successTitle: {
    ...typography.title,
    color: questColors.textPrimary,
  },
  summaryLabel: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotal: {
    borderTopColor: questColors.border,
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  summaryValue: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  totalLabel: {
    ...typography.subtitle,
    color: questColors.textPrimary,
  },
  totalValue: {
    ...typography.subtitle,
    color: questColors.acid,
  },
});
