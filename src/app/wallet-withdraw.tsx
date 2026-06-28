import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CreditCard,
  Bank,
  CheckCircle,
  Lightning,
  Warning,
  Wallet,
} from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ChaosButton, ChaosBadge } from '@/components/ui/chaos';
import { Screen } from '@/components/ui/screen';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useWalletStore, selectBalance, selectFormattedBalance } from '@/store';

type WithdrawMethod = 'monobank' | 'privatbank' | 'card';

const WITHDRAW_METHODS: { id: WithdrawMethod; label: string; subtitle: string; icon: typeof CreditCard }[] = [
  { id: 'monobank', label: 'Monobank', subtitle: 'Миттєвий переказ', icon: Lightning },
  { id: 'privatbank', label: 'PrivatBank', subtitle: 'До 30 хвилин', icon: Bank },
  { id: 'card', label: 'Visa / Mastercard', subtitle: '1–3 робочих дні', icon: CreditCard },
];

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export default function WalletWithdrawScreen() {
  const router = useRouter();
  const walletBalance = useWalletStore(selectBalance);
  const formattedBalance = useWalletStore(selectFormattedBalance);
  const withdrawFn = useWalletStore((s) => s.withdraw);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod>('monobank');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const numericAmount = parseInt(amount, 10) || 0;
  const fee = Math.ceil(numericAmount * 0.015); // 1.5% fee
  const totalPayout = numericAmount - fee;
  const isAmountValid = numericAmount >= 50 && numericAmount <= walletBalance;
  const isCardValid = cardNumber.replace(/\s/g, '').length >= 16;
  const canSubmit = isAmountValid && isCardValid;

  const formatCardInput = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  };

  const handleQuickAmount = (value: number) => {
    setAmount(String(Math.min(value, walletBalance)));
  };

  const handleWithdrawAll = () => {
    setAmount(String(walletBalance));
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2200));
    // Actually deduct from wallet balance
    const methodLabel = WITHDRAW_METHODS.find((m) => m.id === selectedMethod)?.label ?? selectedMethod;
    const cardLast4 = cardNumber.replace(/\s/g, '').slice(-4);
    withdrawFn(numericAmount, fee, methodLabel, cardLast4);
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
          <Text style={styles.successTitle}>Заявку створено!</Text>
          <Text style={styles.successAmount}>{totalPayout} грн</Text>
          <Text style={styles.successSubtitle}>
            Кошти будуть зараховані на вашу картку{' '}
            {'•••• ' + cardNumber.replace(/\s/g, '').slice(-4)} через{' '}
            {WITHDRAW_METHODS.find((m) => m.id === selectedMethod)?.label}.
          </Text>
          <ChaosBadge tone="acid">
            {selectedMethod === 'monobank' ? 'Миттєво' : selectedMethod === 'privatbank' ? 'до 30 хв' : '1–3 дні'}
          </ChaosBadge>
          <Text style={styles.newBalance}>Залишок: {formattedBalance}</Text>
          <View style={styles.successActions}>
            <ChaosButton label="Повернутись" onPress={() => router.back()} variant="outline" />
          </View>
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

      {/* Hero */}
      <View style={styles.heroCard}>
        <LinearGradient
          colors={['rgba(255,77,28,0.14)', 'rgba(124,58,255,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Text style={styles.heroEyebrow}>Виведення</Text>
          <Text style={styles.heroTitle}>Вивести кошти</Text>
          <View style={styles.balanceRow}>
            <Wallet color={questColors.acid} size={20} weight="bold" />
            <Text style={styles.balanceText}>Доступно: {formattedBalance}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Amount */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Сума виведення</Text>
          <Pressable accessibilityRole="button" onPress={handleWithdrawAll}>
            <Text style={styles.withdrawAllLink}>Усе</Text>
          </Pressable>
        </View>
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
        {amount.length > 0 && numericAmount < 50 ? (
          <Text style={styles.amountError}>Мінімальна сума виведення — 50 грн</Text>
        ) : null}
        {numericAmount > walletBalance ? (
          <View style={styles.errorRow}>
            <Warning color={questColors.danger} size={16} weight="bold" />
            <Text style={styles.amountError}>Недостатньо коштів на балансі</Text>
          </View>
        ) : null}

        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.filter((qa) => qa <= walletBalance).map((qa) => {
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

      {/* Card Number */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Картка отримувача</Text>
        <View style={styles.cardInputWrap}>
          <CreditCard color={questColors.textSecondary} size={22} weight="bold" />
          <TextInput
            keyboardType="number-pad"
            maxLength={19}
            onChangeText={(text) => setCardNumber(formatCardInput(text))}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={questColors.textSecondary}
            style={styles.cardInput}
            value={cardNumber}
          />
        </View>
        {cardNumber.length > 0 && !isCardValid ? (
          <Text style={styles.amountError}>Введіть 16 цифр картки</Text>
        ) : null}
      </View>

      {/* Withdraw Method */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Спосіб виведення</Text>
        {WITHDRAW_METHODS.map((method) => {
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
                  color={active ? questColors.ember : questColors.textSecondary}
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
          <Text style={styles.summaryLabel}>Сума</Text>
          <Text style={styles.summaryValue}>{numericAmount > 0 ? `${numericAmount} грн` : '—'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Комісія (1.5%)</Text>
          <Text style={[styles.summaryValue, { color: questColors.ember }]}>
            {numericAmount > 0 ? `-${fee} грн` : '—'}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.totalLabel}>Ви отримаєте</Text>
          <Text style={styles.totalValue}>
            {numericAmount > 0 ? `${totalPayout} грн` : '—'}
          </Text>
        </View>
        <ChaosButton
          disabled={!canSubmit || isProcessing}
          label={isProcessing ? 'Обробка...' : 'Вивести'}
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
  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  balanceText: {
    ...typography.subtitle,
    color: questColors.acid,
  },
  card: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  cardInput: {
    ...typography.subtitle,
    color: questColors.textPrimary,
    flex: 1,
    letterSpacing: 2,
    padding: 0,
  },
  cardInputWrap: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  currency: {
    ...typography.subtitle,
    color: questColors.textSecondary,
  },
  errorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  heroCard: {
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroEyebrow: {
    ...typography.eyebrow,
    color: questColors.ember,
    textTransform: 'uppercase',
  },
  heroGradient: {
    gap: spacing.xs,
    padding: spacing.lg,
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
    backgroundColor: 'rgba(255,77,28,0.12)',
  },
  methodLabel: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  methodLabelActive: {
    color: questColors.ember,
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
    backgroundColor: 'rgba(255,77,28,0.04)',
    borderColor: 'rgba(255,77,28,0.4)',
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
    backgroundColor: 'rgba(255,77,28,0.14)',
    borderColor: 'rgba(255,77,28,0.5)',
  },
  quickChipText: {
    ...typography.label,
    color: questColors.textSecondary,
  },
  quickChipTextActive: {
    color: questColors.ember,
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
    borderColor: questColors.ember,
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioInner: {
    backgroundColor: questColors.ember,
    borderRadius: radii.pill,
    height: 10,
    width: 10,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    ...typography.label,
    color: questColors.ember,
    textTransform: 'uppercase',
  },
  successActions: {
    marginTop: spacing.md,
    width: '100%',
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
  withdrawAllLink: {
    ...typography.label,
    color: questColors.ember,
    textTransform: 'uppercase',
  },
});
