import { useRouter } from 'expo-router';
import { PencilSimple, SignOut, ShieldCheck } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { AvatarPickerModal } from '@/components/profile/AvatarPickerModal';
import { StatBlock } from '@/components/profile/StatBlock';
import { TransactionItem } from '@/components/profile/TransactionItem';
import { ChaosAvatar, ChaosBadge, ChaosButton, SectionKicker } from '@/components/ui/chaos';
import { LoadingState } from '@/components/ui/status';
import { Screen } from '@/components/ui/screen';
import { getAvatarPhotoIdForAccount, getAvatarPhotoSource } from '@/constants/avatarPhotos';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useProfileDashboard } from '@/hooks/useProfile';
import { getUserProfile, logout, type UserProfile } from '@/services/auth-service';
import { useWalletStore, selectFormattedBalance, selectTransactions } from '@/store';

type ProfileTab = 'activity' | 'achievements' | 'wallet';

export default function ProfileScreen() {
  const router = useRouter();
  const dashboard = useProfileDashboard();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('activity');
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getUserProfile().then((storedProfile) => {
      if (!mounted) return;
      if (!storedProfile) {
        router.replace('/');
        return;
      }
      setProfile(storedProfile);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <Screen scroll={false}>
        <LoadingState text="Завантажуємо профіль..." />
      </Screen>
    );
  }

  const initials = (profile?.name ?? 'QM')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
  const avatarSource =
    profile?.avatarKind === 'custom' && profile.avatarUri
      ? { uri: profile.avatarUri }
      : getAvatarPhotoSource(profile?.avatarId) ??
      getAvatarPhotoSource(getAvatarPhotoIdForAccount(profile?.email ?? profile?.id ?? initials));
  const avatarEmoji = profile?.avatarKind === 'emoji' ? profile.avatarEmoji : undefined;

  const signOut = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <ChaosAvatar emoji={avatarEmoji} label={initials} size={86} source={avatarEmoji ? undefined : avatarSource} />
          <View style={styles.headerCopy}>
            <Text style={styles.name}>{profile?.name ?? 'QuestMe'}</Text>
            <Text style={styles.level}>{dashboard.stats.level} «{dashboard.stats.title}»</Text>
            <ChaosBadge tone="acid">streak 7 днів</ChaosBadge>
          </View>
        </View>
        <ChaosButton
          icon={<PencilSimple color={questColors.textPrimary} size={18} weight="bold" />}
          label="Змінити аватар"
          onPress={() => setAvatarPickerOpen(true)}
          variant="outline"
        />
        <View style={styles.stats}>
          <StatBlock label="виконано" value={dashboard.stats.completed} />
          <StatBlock label="створено" value={dashboard.stats.created} />
          <StatBlock label="зароблено" value={dashboard.stats.earned} />
        </View>
        <View style={styles.actions}>
          <ChaosButton
            icon={<ShieldCheck color={questColors.void} size={18} weight="bold" />}
            label="Безпека"
            onPress={() => router.push('/security')}
            style={styles.action}
            variant="electric"
          />

        </View>
      </View>

      <View style={styles.tabs}>
        <TabButton active={activeTab === 'activity'} label="Активність" onPress={() => setActiveTab('activity')} />
        <TabButton active={activeTab === 'achievements'} label="Досягнення" onPress={() => setActiveTab('achievements')} />
        <TabButton active={activeTab === 'wallet'} label="Гаманець" onPress={() => setActiveTab('wallet')} />
      </View>

      {activeTab === 'activity' ? <ActivityTab /> : null}
      {activeTab === 'achievements' ? <AchievementsTab /> : null}
      {activeTab === 'wallet' ? <WalletTab /> : null}
      <AvatarPickerModal
        onClose={() => setAvatarPickerOpen(false)}
        onProfileChange={setProfile}
        profile={profile}
        visible={avatarPickerOpen}
      />
    </Screen>
  );
}

function TabButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ActivityTab() {
  const dashboard = useProfileDashboard();
  return (
    <View style={styles.panel}>
      <SectionKicker eyebrow="Live feed" title="Остання активність" />
      {dashboard.leaderboard.map((item) => (
        <View key={item.id} style={styles.activityRow}>
          <ChaosAvatar
            label={item.name.slice(0, 2)}
            size={42}
            source={getAvatarPhotoSource(getAvatarPhotoIdForAccount(`${item.id}:${item.name}`))}
          />
          <View style={styles.activityCopy}>
            <Text style={styles.activityTitle}>#{item.rank} {item.name}</Text>
            <Text style={styles.activityText}>заробив {item.earned} цього тижня</Text>
          </View>
          <ChaosBadge tone={item.rank <= 3 ? 'acid' : 'muted'}>top</ChaosBadge>
        </View>
      ))}
    </View>
  );
}

function AchievementsTab() {
  const dashboard = useProfileDashboard();
  return (
    <View style={styles.panel}>
      <SectionKicker eyebrow="Badges" title="Досягнення" />
      <View style={styles.badgeGrid}>
        {dashboard.achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </View>
    </View>
  );
}

function WalletTab() {
  const router = useRouter();
  const formattedBalance = useWalletStore(selectFormattedBalance);
  const transactions = useWalletStore(selectTransactions);
  return (
    <View style={styles.panel}>
      <View style={styles.walletHero}>
        <Text style={styles.walletLabel}>Баланс</Text>
        <Text style={styles.walletValue}>{formattedBalance}</Text>
        <View style={styles.actions}>
          <ChaosButton label="Поповнити" onPress={() => router.push('/wallet-topup')} style={styles.action} variant="ember" />
          <ChaosButton label="Вивести" onPress={() => router.push('/wallet-withdraw')} style={styles.action} variant="outline" />
        </View>
      </View>
      <SectionKicker eyebrow="Transactions" title="Історія" />
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} amount={transaction.amount} status={transaction.status} title={transaction.title} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  activityCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  activityRow: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  activityText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  activityTitle: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  headerCard: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  level: {
    ...typography.body,
    color: questColors.textSecondary,
  },
  name: {
    ...typography.title,
    color: questColors.textPrimary,
  },
  panel: {
    gap: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    borderBottomColor: questColors.acid,
  },
  tabText: {
    ...typography.label,
    color: questColors.textSecondary,
  },
  tabTextActive: {
    color: questColors.textPrimary,
  },
  tabs: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.xs,
  },
  walletHero: {
    backgroundColor: 'rgba(124,58,255,0.16)',
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  walletLabel: {
    ...typography.label,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  walletValue: {
    ...typography.display,
    color: questColors.textPrimary,
  },
});
