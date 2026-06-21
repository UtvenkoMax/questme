import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Gift,
  LockKey,
  Percent,
  Star,
  Tag,
} from 'phosphor-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { TransactionType } from '@/store';

type TransactionItemProps = {
  amount: string;
  createdAt?: string;
  status: string;
  title: string;
  type?: TransactionType;
};

const typeLabels: Partial<Record<TransactionType, string>> = {
  escrow_hold: 'Escrow',
  escrow_refund: 'Refund',
  escrow_release: 'Payout',
  platform_fee: 'Fee',
  premium_quest: 'Premium',
  promo_bonus: 'Promo',
  referral_bonus: 'Invite',
};

function getTransactionIcon(type: TransactionType | undefined, positive: boolean) {
  switch (type) {
    case 'escrow_hold':
      return LockKey;
    case 'escrow_release':
      return CheckCircle;
    case 'escrow_refund':
      return ArrowDownLeft;
    case 'platform_fee':
      return Percent;
    case 'premium_quest':
      return Star;
    case 'promo_bonus':
      return Tag;
    case 'referral_bonus':
      return Gift;
    default:
      return positive ? ArrowDownLeft : ArrowUpRight;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

export function TransactionItem({ amount, createdAt, status, title, type }: TransactionItemProps) {
  const positive = amount.startsWith('+');
  const negative = amount.startsWith('-');
  const Icon = getTransactionIcon(type, positive);
  const iconColor = positive ? questColors.acid : negative ? questColors.ember : questColors.electric;
  const typeLabel = type ? typeLabels[type] : undefined;

  return (
    <View style={styles.row}>
      <View style={[styles.icon, positive && styles.iconPositive, !positive && !negative && styles.iconNeutral]}>
        <Icon color={iconColor} size={18} weight="bold" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.status}>
          {status}
          {createdAt ? ` · ${formatDate(createdAt)}` : ''}
        </Text>
        {typeLabel ? (
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{typeLabel}</Text>
          </View>
        ) : null}
      </View>
      <Text
        style={[
          styles.amount,
          positive ? styles.amountPositive : negative ? styles.amountNegative : styles.amountNeutral,
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    ...typography.label,
  },
  amountNegative: {
    color: questColors.ember,
  },
  amountPositive: {
    color: questColors.acid,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,77,28,0.14)',
    borderRadius: radii.xs,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  iconPositive: {
    backgroundColor: 'rgba(196,255,0,0.12)',
  },
  iconNeutral: {
    backgroundColor: 'rgba(124,58,255,0.14)',
  },
  row: {
    alignItems: 'center',
    borderColor: questColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  status: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  title: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  typePill: {
    alignSelf: 'flex-start',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  typePillText: {
    ...typography.eyebrow,
    color: questColors.textSecondary,
    textTransform: 'uppercase',
  },
  amountNeutral: {
    color: questColors.electric,
  },
});
