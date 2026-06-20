import { ArrowDownLeft, ArrowUpRight } from 'phosphor-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

type TransactionItemProps = {
  amount: string;
  status: string;
  title: string;
};

export function TransactionItem({ amount, status, title }: TransactionItemProps) {
  const positive = amount.startsWith('+');
  const Icon = positive ? ArrowDownLeft : ArrowUpRight;

  return (
    <View style={styles.row}>
      <View style={[styles.icon, positive && styles.iconPositive]}>
        <Icon color={positive ? questColors.acid : questColors.ember} size={18} weight="bold" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
      <Text style={[styles.amount, positive ? styles.amountPositive : styles.amountNegative]}>{amount}</Text>
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
});
