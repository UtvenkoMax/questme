import { useRouter } from 'expo-router';
import { PencilSimple, ShieldCheck } from 'phosphor-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { AvatarPickerModal } from '@/components/profile/AvatarPickerModal';
import { StatBlock } from '@/components/profile/StatBlock';
import { TransactionItem } from '@/components/profile/TransactionItem';
import { ChaosAvatar, ChaosBadge, ChaosButton, ProgressLine, SectionKicker } from '@/components/ui/chaos';
import { LoadingState } from '@/components/ui/status';
import { Screen } from '@/components/ui/screen';
import { getAvatarPhotoIdForAccount, getAvatarPhotoSource } from '@/constants/avatarPhotos';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { creatorFunnel, creatorMetrics, keychains, paymentProviders, seasonEvents } from '@/data/platform-features';
import { useProfileDashboard } from '@/hooks/useProfile';
import { getUserProfile, type UserProfile } from '@/services/auth-service';
import {
  selectActiveEscrows,
  selectFormattedBalance,
  selectFormattedEscrowBalance,
  selectTransactions,
  selectWalletSummary,
  useWalletStore,
  usePlatformStore,
  type TransactionType,
  type WalletTransaction,
} from '@/store';

type ProfileTab = 'activity' | 'achievements' | 'wallet' | 'growth' | 'creator' | 'collection';
type WalletFilter = 'all' | 'income' | 'spend' | 'escrow' | 'promo' | 'premium' | 'fees';

const walletFilters: { id: WalletFilter; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'income', label: 'Надходження' },
  { id: 'spend', label: 'Витрати' },
  { id: 'escrow', label: 'Escrow' },
  { id: 'promo', label: 'Промо' },
  { id: 'premium', label: 'Premium' },
  { id: 'fees', label: 'Комісії' },
];

const walletFilterTypes: Record<Exclude<WalletFilter, 'all' | 'income' | 'spend'>, TransactionType[]> = {
  escrow: ['escrow_hold', 'escrow_refund', 'escrow_release'],
  fees: ['platform_fee'],
  premium: ['premium_quest'],
  promo: ['promo_bonus', 'referral_bonus'],
};

function filterWalletTransaction(transaction: WalletTransaction, filter: WalletFilter) {
  if (filter === 'all') return true;
  if (filter === 'income') return transaction.numericAmount > 0;
  if (filter === 'spend') return transaction.numericAmount < 0;
  return walletFilterTypes[filter].includes(transaction.type);
}

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
        <TabButton active={activeTab === 'growth'} label="Місії" onPress={() => setActiveTab('growth')} />
        <TabButton active={activeTab === 'creator'} label="Creator" onPress={() => setActiveTab('creator')} />
        <TabButton active={activeTab === 'collection'} label="Брелки" onPress={() => setActiveTab('collection')} />
      </View>

      {activeTab === 'activity' ? <ActivityTab /> : null}
      {activeTab === 'achievements' ? <AchievementsTab /> : null}
      {activeTab === 'wallet' ? <WalletTab /> : null}
      {activeTab === 'growth' ? <GrowthTab /> : null}
      {activeTab === 'creator' ? <CreatorDashboardTab /> : null}
      {activeTab === 'collection' ? <KeychainCollectionTab /> : null}
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
  const [filter, setFilter] = useState<WalletFilter>('all');
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const paymentRuntime = usePlatformStore((state) => state.paymentRuntime);
  const connectPaymentProvider = usePlatformStore((state) => state.connectPaymentProvider);
  const formattedBalance = useWalletStore(selectFormattedBalance);
  const formattedEscrowBalance = useWalletStore(selectFormattedEscrowBalance);
  const transactions = useWalletStore(selectTransactions);
  const summary = useWalletStore(selectWalletSummary);
  const activeEscrows = useWalletStore(selectActiveEscrows);
  const applyPromoCode = useWalletStore((state) => state.applyPromoCode);
  const releaseEscrow = useWalletStore((state) => state.releaseEscrow);
  const refundEscrow = useWalletStore((state) => state.refundEscrow);
  const filteredTransactions = useMemo(
    () => transactions.filter((transaction) => filterWalletTransaction(transaction, filter)),
    [filter, transactions]
  );

  const submitPromo = () => {
    const result = applyPromoCode(promoCode);
    setPromoMessage(result.message);
    if (result.ok) {
      setPromoCode('');
    }
  };

  return (
    <View style={styles.panel}>
      <View style={styles.walletHero}>
        <Text style={styles.walletLabel}>Баланс</Text>
        <Text style={styles.walletValue}>{formattedBalance}</Text>
        <Text style={styles.walletSubtle}>В escrow заблоковано: {formattedEscrowBalance}</Text>
        <View style={styles.walletStats}>
          <WalletMetric label="бонуси" value={`${summary.bonuses} грн`} tone="success" />
          <WalletMetric label="комісії" value={`${summary.fees} грн`} tone="ember" />
          <WalletMetric label="premium" value={`${summary.premium} грн`} tone="electric" />
        </View>
        <View style={styles.actions}>
          <ChaosButton label="Поповнити" onPress={() => router.push('/wallet-topup')} style={styles.action} variant="ember" />
          <ChaosButton label="Вивести" onPress={() => router.push('/wallet-withdraw')} style={styles.action} variant="outline" />
        </View>
      </View>

      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Promos" title="Промокод або інвайт" />
        <View style={styles.promoRow}>
          <TextInput
            autoCapitalize="characters"
            onChangeText={(value) => {
              setPromoCode(value.toUpperCase());
              if (promoMessage) setPromoMessage('');
            }}
            placeholder="QUESTME100"
            placeholderTextColor={questColors.textSecondary}
            style={styles.promoInput}
            value={promoCode}
          />
          <ChaosButton
            disabled={!promoCode.trim()}
            label="Активувати"
            onPress={submitPromo}
            style={styles.promoButton}
            variant="electric"
          />
        </View>
        <Text style={promoMessage.includes('додано') ? styles.promoSuccess : styles.promoHint}>
          {promoMessage || 'Демо-коди: QUESTME100, CREATOR20. Інвайт-код INVITE50 уже активовано.'}
        </Text>
      </View>

      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Payments" title="Реальні платіжні провайдери" />
        {paymentProviders.map((provider) => {
          const status = paymentRuntime[provider.id];
          return (
            <View key={provider.id} style={styles.providerRow}>
              <View style={styles.providerCopy}>
                <Text style={styles.providerTitle}>{provider.label}</Text>
                <Text style={styles.providerText}>{provider.subtitle}</Text>
                <Text style={styles.providerText}>{provider.settlement}</Text>
              </View>
              <ChaosButton
                label={status === 'connected' ? 'Connected' : status === 'sandbox' ? 'Sandbox' : 'Connect'}
                onPress={() => connectPaymentProvider(provider.id)}
                style={styles.providerAction}
                variant={status === 'connected' ? 'outline' : 'electric'}
              />
            </View>
          );
        })}
      </View>

      {activeEscrows.length ? (
        <View style={styles.walletCard}>
          <SectionKicker eyebrow="Escrow" title="Очікують підтвердження" />
          {activeEscrows.map((escrow) => (
            <View key={escrow.id} style={styles.escrowRow}>
              <View style={styles.escrowCopy}>
                <Text style={styles.escrowTitle}>{escrow.questTitle}</Text>
                <Text style={styles.escrowText}>
                  {escrow.amount} грн заблоковано · комісія {escrow.fee} грн
                  {escrow.premiumFee ? ` · premium ${escrow.premiumFee} грн` : ''}
                </Text>
              </View>
              <View style={styles.escrowActions}>
                <ChaosButton
                  label="Підтвердити"
                  onPress={() => releaseEscrow(escrow.id)}
                  style={styles.escrowAction}
                  variant="outline"
                />
                <ChaosButton
                  label="Повернути"
                  onPress={() => refundEscrow(escrow.id)}
                  style={styles.escrowAction}
                  variant="ember"
                />
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <SectionKicker eyebrow="Transactions" title="Історія" />
      <View style={styles.filterRow}>
        {walletFilters.map((item) => (
          <WalletFilterChip
            active={filter === item.id}
            key={item.id}
            label={item.label}
            onPress={() => setFilter(item.id)}
          />
        ))}
      </View>
      {filteredTransactions.map((transaction) => (
        <TransactionItem
          amount={transaction.amount}
          createdAt={transaction.createdAt}
          key={transaction.id}
          status={transaction.status}
          title={transaction.title}
          type={transaction.type}
        />
      ))}
      {!filteredTransactions.length ? (
        <Text style={styles.emptyText}>За цим фільтром транзакцій поки немає.</Text>
      ) : null}
    </View>
  );
}

function WalletFilterChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function WalletMetric({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'electric' | 'ember' | 'success';
  value: string;
}) {
  return (
    <View style={styles.walletMetric}>
      <Text
        style={[
          styles.walletMetricValue,
          tone === 'ember' ? styles.walletMetricEmber : tone === 'success' ? styles.walletMetricSuccess : null,
        ]}
      >
        {value}
      </Text>
      <Text style={styles.walletMetricLabel}>{label}</Text>
    </View>
  );
}

function GrowthTab() {
  const missions = usePlatformStore((state) => state.missions);
  const spinTokens = usePlatformStore((state) => state.spinTokens);
  const claimMission = usePlatformStore((state) => state.claimMission);
  const [message, setMessage] = useState('');
  const inviteCode = 'QUESTME-HALEN-50';
  const invited = 7;
  const converted = 4;

  return (
    <View style={styles.panel}>
      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Referrals" title="Інвайти та бонуси" />
        <Text style={styles.referralCode}>{inviteCode}</Text>
        <Text style={styles.promoHint}>
          За друга, який виконав перший квест, нараховується 50 грн бонусу та 1 roulette spin.
        </Text>
        <View style={styles.walletStats}>
          <WalletMetric label="запрошено" value={`${invited}`} tone="electric" />
          <WalletMetric label="активовані" value={`${converted}`} tone="success" />
          <WalletMetric label="spin-токени" value={`${spinTokens}`} tone="ember" />
        </View>
      </View>

      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Daily" title="Щоденні місії" />
        {missions.map((mission) => {
          const percent = Math.round((mission.progress / mission.target) * 100);
          const ready = mission.progress >= mission.target;
          return (
            <View key={mission.id} style={styles.missionRow}>
              <View style={styles.missionCopy}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.promoHint}>{mission.season} · +{mission.rewardSpins} roulette spin</Text>
                <ProgressLine percent={percent} tone={ready ? 'success' : 'electric'} />
              </View>
              <ChaosButton
                disabled={!ready || mission.claimed}
                label={mission.claimed ? 'Claimed' : 'Claim'}
                onPress={() => {
                  const ok = claimMission(mission.id);
                  setMessage(ok ? 'Нагороду місії додано.' : 'Місію ще не завершено.');
                }}
                style={styles.missionAction}
                variant={ready ? 'electric' : 'outline'}
              />
            </View>
          );
        })}
        {message ? <Text style={styles.promoSuccess}>{message}</Text> : null}
      </View>

      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Season" title="Сезонні івенти" />
        {seasonEvents.map((event) => (
          <View key={event.id} style={styles.eventRow}>
            <View style={styles.missionCopy}>
              <Text style={styles.missionTitle}>{event.title}</Text>
              <Text style={styles.promoHint}>Нагорода: {event.reward}</Text>
              <ProgressLine percent={event.progress} tone="acid" />
            </View>
            <ChaosBadge tone="acid">{event.progress}%</ChaosBadge>
          </View>
        ))}
      </View>
    </View>
  );
}

function CreatorDashboardTab() {
  return (
    <View style={styles.panel}>
      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Creator" title="Статистика автора" />
        <View style={styles.creatorGrid}>
          {creatorMetrics.map((metric) => (
            <View key={metric.label} style={styles.creatorMetric}>
              <Text style={styles.creatorMetricValue}>{metric.value}</Text>
              <Text style={styles.creatorMetricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Funnel" title="Перегляди → виконання" />
        {creatorFunnel.map((item) => (
          <View key={item.label} style={styles.funnelRow}>
            <Text style={styles.funnelLabel}>{item.label}</Text>
            <Text style={styles.funnelValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.walletCard}>
        <SectionKicker eyebrow="Risk" title="Операційний стан" />
        <Text style={styles.promoHint}>4 proofs очікують автора, 1 escrow dispute відкритий, 1 скарга у triage.</Text>
      </View>
    </View>
  );
}

function KeychainCollectionTab() {
  const dailySpinDate = usePlatformStore((state) => state.dailySpinDate);
  const inventory = usePlatformStore((state) => state.keychainInventory);
  const lastSpinRewardId = usePlatformStore((state) => state.lastSpinRewardId);
  const spinTokens = usePlatformStore((state) => state.spinTokens);
  const spinKeychainRoulette = usePlatformStore((state) => state.spinKeychainRoulette);
  const [message, setMessage] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const dailyAvailable = dailySpinDate !== today;
  const lastReward = lastSpinRewardId ? keychains.find((keychain) => keychain.id === lastSpinRewardId) : null;

  const spin = (source: 'daily' | 'mission') => {
    const result = spinKeychainRoulette(source);
    setMessage(result.message);
  };

  return (
    <View style={styles.panel}>
      <View style={styles.walletHero}>
        <Text style={styles.walletLabel}>Keychain roulette</Text>
        <Text style={styles.walletValue}>{Object.values(inventory).reduce((sum, count) => sum + count, 0)}</Text>
        <Text style={styles.walletSubtle}>
          Без платних spinів: 1 daily-крутіння або токени за місії. Шанси відкриті: common 68%, rare 22%, epic 8.5%, legendary 1.5%.
        </Text>
        <View style={styles.actions}>
          <ChaosButton
            disabled={!dailyAvailable}
            label={dailyAvailable ? 'Daily spin' : 'Завтра'}
            onPress={() => spin('daily')}
            style={styles.action}
            variant="ember"
          />
          <ChaosButton
            disabled={spinTokens <= 0}
            label={`Mission spin (${spinTokens})`}
            onPress={() => spin('mission')}
            style={styles.action}
            variant="electric"
          />
        </View>
        {message ? <Text style={styles.promoSuccess}>{message}</Text> : null}
        {lastReward ? <ChaosBadge tone="acid">last: {lastReward.label}</ChaosBadge> : null}
      </View>

      <View style={styles.keychainGrid}>
        {keychains.map((keychain) => {
          const count = inventory[keychain.id] ?? 0;
          return (
            <View key={keychain.id} style={[styles.keychainCard, count > 0 && styles.keychainCardUnlocked]}>
              <View style={styles.keychainToken}>
                <Text style={styles.keychainSymbol}>{keychain.symbol}</Text>
              </View>
              <Text style={styles.keychainTitle}>{keychain.label}</Text>
              <Text style={styles.keychainRarity}>{keychain.rarity}</Text>
              <Text style={styles.promoHint}>{keychain.description}</Text>
              <ChaosBadge tone={count > 0 ? 'success' : 'muted'}>{count > 0 ? `x${count}` : 'locked'}</ChaosBadge>
            </View>
          );
        })}
      </View>
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
  emptyText: {
    ...typography.caption,
    color: questColors.textSecondary,
    textAlign: 'center',
  },
  creatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  creatorMetric: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 138,
    padding: spacing.md,
  },
  creatorMetricLabel: {
    ...typography.eyebrow,
    color: questColors.textSecondary,
    textTransform: 'uppercase',
  },
  creatorMetricValue: {
    ...typography.subtitle,
    color: questColors.acid,
  },
  escrowAction: {
    flex: 1,
    minWidth: 130,
  },
  escrowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  escrowCopy: {
    gap: spacing.xxs,
  },
  escrowRow: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  escrowText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  escrowTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  filterChip: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: 'rgba(196,255,0,0.14)',
    borderColor: 'rgba(196,255,0,0.44)',
  },
  filterChipText: {
    ...typography.label,
    color: questColors.textSecondary,
  },
  filterChipTextActive: {
    color: questColors.acid,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  eventRow: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  funnelLabel: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  funnelRow: {
    alignItems: 'center',
    borderBottomColor: questColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  funnelValue: {
    ...typography.captionStrong,
    color: questColors.acid,
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
  keychainCard: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexGrow: 1,
    flexBasis: 150,
    gap: spacing.sm,
    padding: spacing.md,
  },
  keychainCardUnlocked: {
    backgroundColor: 'rgba(196,255,0,0.08)',
    borderColor: 'rgba(196,255,0,0.36)',
  },
  keychainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  keychainRarity: {
    ...typography.eyebrow,
    color: questColors.ember,
    textTransform: 'uppercase',
  },
  keychainSymbol: {
    ...typography.label,
    color: questColors.void,
  },
  keychainTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  keychainToken: {
    alignItems: 'center',
    backgroundColor: questColors.acid,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  missionAction: {
    minWidth: 116,
  },
  missionCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  missionRow: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.md,
  },
  missionTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  providerAction: {
    minWidth: 118,
  },
  providerCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  providerRow: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.md,
  },
  providerText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  providerTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  promoButton: {
    minWidth: 150,
  },
  promoHint: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  promoInput: {
    ...typography.subtitle,
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: questColors.textPrimary,
    flex: 1,
    minHeight: 52,
    minWidth: 160,
    paddingHorizontal: spacing.md,
  },
  promoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  promoSuccess: {
    ...typography.captionStrong,
    color: questColors.success,
  },
  referralCode: {
    ...typography.titleCompact,
    color: questColors.acid,
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
    minWidth: 96,
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
    flexWrap: 'wrap',
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
  walletCard: {
    backgroundColor: questColors.surface,
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
  walletMetric: {
    backgroundColor: 'rgba(10,10,18,0.42)',
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xxs,
    minWidth: 96,
    padding: spacing.md,
  },
  walletMetricEmber: {
    color: questColors.ember,
  },
  walletMetricLabel: {
    ...typography.eyebrow,
    color: questColors.textSecondary,
    textTransform: 'uppercase',
  },
  walletMetricSuccess: {
    color: questColors.success,
  },
  walletMetricValue: {
    ...typography.subtitle,
    color: questColors.electric,
  },
  walletStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  walletSubtle: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  walletValue: {
    ...typography.display,
    color: questColors.textPrimary,
  },
});
