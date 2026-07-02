import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChaosAvatar, ChaosBadge, ChaosButton, StatPill } from '@/components/ui/chaos';
import { Screen } from '@/components/ui/screen';
import { EmptyState } from '@/components/ui/status';
import { getAvatarPhotoIdForAccount, getAvatarPhotoSource } from '@/constants/avatarPhotos';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { allFeedQuests, publicProfiles } from '@/data/social-features';
import { getProfileWithFollowState, useSocialStore } from '@/store/social-store';

function getProfileId(id: string | string[] | undefined) {
  return Array.isArray(id) ? id[0] : id;
}

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const profileId = getProfileId(id);
  const profileSeed = profileId ? publicProfiles[profileId] : undefined;
  const followedProfiles = useSocialStore((state) => state.followedProfiles);
  const toggleFollow = useSocialStore((state) => state.toggleFollow);

  if (!profileSeed) {
    return (
      <Screen>
        <EmptyState
          action={<ChaosButton label="Назад" onPress={() => router.back()} variant="outline" />}
          icon="user"
          text="Цей автор ще не має публічного профілю в демо-даних."
          title="Профіль не знайдено"
        />
      </Screen>
    );
  }

  const profile = getProfileWithFollowState(profileSeed, followedProfiles);
  const avatarSource = getAvatarPhotoSource(getAvatarPhotoIdForAccount(`${profile.id}:${profile.username}`));
  const createdQuests = allFeedQuests.filter((quest) => quest.author === profile.id);

  return (
    <Screen contentStyle={styles.content}>
      <ChaosButton label="Назад" onPress={() => router.back()} variant="outline" />

      <View style={styles.headerCard}>
        <View style={styles.profileTop}>
          <ChaosAvatar label={profile.username} size={82} source={avatarSource} />
          <View style={styles.profileCopy}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>{profile.username}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        </View>
        <View style={styles.badges}>
          {profile.badges.map((badge) => (
            <ChaosBadge key={badge} tone="acid">{badge}</ChaosBadge>
          ))}
        </View>
        <View style={styles.stats}>
          <StatPill label="підписники" value={profile.followers.toLocaleString('uk-UA')} />
          <StatPill label="створено" value={profile.created} />
          <StatPill label="рейтинг" value={profile.rating.toFixed(1)} />
        </View>
        <ChaosButton
          label={profile.following ? 'Ви підписані' : 'Підписатись'}
          onPress={() => toggleFollow(profile.id)}
          variant={profile.following ? 'outline' : 'ember'}
        />
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Feather color={questColors.acid} name="map-pin" size={18} />
          <Text style={styles.panelTitle}>Публічні квести</Text>
        </View>
        {createdQuests.length ? (
          createdQuests.map((quest) => (
            <Pressable
              accessibilityRole="button"
              key={quest.id}
              onPress={() => router.push({ pathname: '/quest/[id]', params: { id: quest.id } })}
              style={({ pressed }) => [styles.questRow, pressed && styles.pressed]}>
              <View style={styles.questCopy}>
                <Text numberOfLines={2} style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questMeta}>{quest.reward} грн · {quest.deadline} · {quest.categoryLabel}</Text>
              </View>
              <Feather color={questColors.textSecondary} name="chevron-right" size={20} />
            </Pressable>
          ))
        ) : (
          <Text style={styles.emptyText}>Автор поки не має відкритих квестів у стрічці.</Text>
        )}
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Feather color={questColors.acid} name="award" size={18} />
          <Text style={styles.panelTitle}>Довіра автора</Text>
        </View>
        <View style={styles.trustGrid}>
          <View style={styles.trustItem}>
            <Text style={styles.trustValue}>{profile.earned}</Text>
            <Text style={styles.trustLabel}>виплачено виконавцям</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustValue}>{profile.completed}</Text>
            <Text style={styles.trustLabel}>виконаних квестів</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  bio: {
    ...typography.body,
    color: questColors.textSecondary,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  emptyText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  headerCard: {
    backgroundColor: 'rgba(124,58,255,0.16)',
    borderColor: 'rgba(196,255,0,0.24)',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  name: {
    ...typography.title,
    color: questColors.textPrimary,
  },
  panel: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  panelTitle: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  pressed: {
    opacity: 0.72,
  },
  profileCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  profileTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  questCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  questMeta: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  questRow: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  questTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  trustItem: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 150,
    padding: spacing.md,
  },
  trustLabel: {
    ...typography.eyebrow,
    color: questColors.textSecondary,
    textTransform: 'uppercase',
  },
  trustValue: {
    ...typography.subtitle,
    color: questColors.acid,
  },
  username: {
    ...typography.label,
    color: questColors.acid,
  },
});
