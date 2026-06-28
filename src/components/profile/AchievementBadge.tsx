import {
  ContactlessPayment,
  Fire,
  Play,
  Sparkle,
  Trophy,
  Wallet,
} from 'phosphor-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { type Achievement } from '@/data/questme';

const iconMap = {
  contactless: ContactlessPayment,
  fire: Fire,
  play: Play,
  sparkle: Sparkle,
  trophy: Trophy,
  wallet: Wallet,
} as const;

export function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const Icon = iconMap[achievement.icon as keyof typeof iconMap] ?? Sparkle;
  return (
    <View style={[styles.card, !achievement.unlocked && styles.locked]}>
      <View style={[styles.icon, achievement.unlocked && styles.iconUnlocked]}>
        <Icon
          color={achievement.unlocked ? questColors.void : questColors.textSecondary}
          size={22}
          weight={achievement.unlocked ? 'fill' : 'regular'}
        />
      </View>
      <Text numberOfLines={1} style={styles.title}>{achievement.title}</Text>
      <Text numberOfLines={2} style={styles.description}>{achievement.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 96,
    padding: spacing.md,
  },
  description: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: '#29293A',
    borderRadius: radii.xs,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  iconUnlocked: {
    backgroundColor: questColors.acid,
  },
  locked: {
    opacity: 0.54,
  },
  title: {
    ...typography.label,
    color: questColors.textPrimary,
  },
});
