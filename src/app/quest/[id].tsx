import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MOCK_QUESTS } from '@/components/home/quest.types';
import { ChaosAvatar, ChaosBadge, ChaosButton, ProgressLine, StatPill } from '@/components/ui/chaos';
import { Screen } from '@/components/ui/screen';
import { EmptyState, Notice } from '@/components/ui/status';
import { getAvatarPhotoIdForAccount, getAvatarPhotoSource } from '@/constants/avatarPhotos';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import {
  allFeedQuests,
  getQuestSocialSeed,
  leaderboardBoards,
  publicProfiles,
  questNotifications,
  type QuestTeamMember,
} from '@/data/social-features';
import { reportReasons } from '@/data/platform-features';
import { getProfileWithFollowState, useSocialStore } from '@/store/social-store';
import { usePlatformStore, type ProofSubmission } from '@/store';

type IconName = ComponentProps<typeof Feather>['name'];

function getQuestId(id: string | string[] | undefined) {
  return Array.isArray(id) ? id[0] : id;
}

export default function QuestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const questId = getQuestId(id);
  const feedQuest = allFeedQuests.find((item) => item.id === questId);
  const routeQuest = MOCK_QUESTS.find((item) => item.id === questId);
  const title = feedQuest?.title ?? routeQuest?.title ?? '';
  const seed = useMemo(() => getQuestSocialSeed(questId ?? 'unknown', title), [questId, title]);
  const questSocial = useSocialStore((state) => (questId ? state.questSocial[questId] : undefined));
  const followedProfiles = useSocialStore((state) => state.followedProfiles);
  const ensureQuestSocial = useSocialStore((state) => state.ensureQuestSocial);
  const toggleLike = useSocialStore((state) => state.toggleLike);
  const toggleSave = useSocialStore((state) => state.toggleSave);
  const addComment = useSocialStore((state) => state.addComment);
  const addTeamMessage = useSocialStore((state) => state.addTeamMessage);
  const completeCheckIn = useSocialStore((state) => state.completeCheckIn);
  const joinTeam = useSocialStore((state) => state.joinTeam);
  const toggleFollow = useSocialStore((state) => state.toggleFollow);
  const proofSubmissions = usePlatformStore((state) => state.proofSubmissions);
  const disputes = usePlatformStore((state) => state.disputes);
  const reports = usePlatformStore((state) => state.reports);
  const approveProof = usePlatformStore((state) => state.approveProof);
  const rejectProof = usePlatformStore((state) => state.rejectProof);
  const createDispute = usePlatformStore((state) => state.createDispute);
  const createReport = usePlatformStore((state) => state.createReport);
  const [commentText, setCommentText] = useState('');
  const [chatText, setChatText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (questId && title) {
      ensureQuestSocial(questId, title);
    }
  }, [ensureQuestSocial, questId, title]);

  if (!questId || (!feedQuest && !routeQuest)) {
    return (
      <Screen>
        <EmptyState
          action={<ChaosButton label="Назад" onPress={() => router.back()} variant="outline" />}
          icon="map"
          text="Поверніться до стрічки й оберіть доступний квест."
          title="Квест не знайдено"
        />
      </Screen>
    );
  }

  const profileSeed = publicProfiles[seed.authorId] ?? publicProfiles.questme;
  const profile = getProfileWithFollowState(profileSeed, followedProfiles);
  const liked = questSocial?.liked ?? false;
  const saved = questSocial?.saved ?? false;
  const comments = questSocial?.comments ?? seed.comments;
  const teamChat = questSocial?.teamChat ?? seed.teamChat;
  const checkInDone = questSocial?.checkInDone ?? false;
  const teamJoined = questSocial?.teamJoined ?? false;
  const baseLikes = feedQuest?.reactions.likes ?? questSocial?.likes ?? 0;
  const baseComments = feedQuest?.reactions.comments ?? seed.comments.length;
  const addedComments = Math.max(0, comments.length - seed.comments.length);
  const likes = baseLikes + (liked ? 1 : 0);
  const commentCount = baseComments + addedComments;
  const reward = feedQuest ? `${feedQuest.reward} грн` : `${routeQuest?.reward.xp ?? 0} XP`;
  const deadline = feedQuest?.deadline ?? routeQuest?.duration ?? 'сьогодні';
  const proofType = feedQuest?.proofType ?? seed.verificationTitle;
  const riskTone = feedQuest?.risk === 'safe' ? 'success' : feedQuest?.risk === 'wild' ? 'acid' : 'ember';
  const avatarSource = getAvatarPhotoSource(getAvatarPhotoIdForAccount(`${seed.authorId}:${profile.id}`));
  const recommendations = seed.recommendations
    .map((recommendationId) => allFeedQuests.find((quest) => quest.id === recommendationId))
    .filter(Boolean);
  const questProofs = proofSubmissions.filter((proof) => proof.questId === questId);
  const questReports = reports.filter((report) => report.targetId === questId || report.targetId === seed.authorId);
  const questDisputes = disputes.filter((dispute) => questProofs.some((proof) => proof.id === dispute.proofId));

  const submitComment = () => {
    if (!commentText.trim()) return;
    addComment(questId, commentText);
    setCommentText('');
    setMessage('Коментар додано');
    Haptics.selectionAsync().catch(() => {});
  };

  const submitTeamMessage = () => {
    if (!chatText.trim()) return;
    addTeamMessage(questId, chatText);
    setChatText('');
    setMessage('Повідомлення надіслано в командний чат');
    Haptics.selectionAsync().catch(() => {});
  };

  const handleCheckIn = () => {
    completeCheckIn(questId);
    setMessage('Check-in підтверджено');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const handleJoinTeam = () => {
    joinTeam(questId);
    setMessage('Ви в команді цього квесту');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  const reportTarget = (targetType: 'quest' | 'user' | 'proof', targetId: string, reasonId: string) => {
    createReport(targetType, targetId, reasonId);
    setMessage('Скаргу відправлено на модерацію');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.topActions}>
        <ChaosButton label="Назад" onPress={() => router.back()} variant="outline" />
        <ChaosButton label={saved ? 'Збережено' : 'Зберегти'} onPress={() => toggleSave(questId)} variant="outline" />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <ChaosAvatar label={profile.username} size={54} source={avatarSource} />
          <View style={styles.heroCopy}>
            <Text style={styles.author}>{profile.username}</Text>
            <Text style={styles.meta}>{seed.city} · {seed.locationMode === 'online' ? 'онлайн' : 'локаційний квест'}</Text>
          </View>
          <ChaosBadge tone={riskTone}>{feedQuest?.risk ?? 'safe'}</ChaosBadge>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.tagRow}>
          {seed.tags.map((tag) => (
            <Text key={tag} style={styles.tag}>#{tag}</Text>
          ))}
        </View>
        <View style={styles.statsRow}>
          <StatPill label="нагорода" value={reward} />
          <StatPill label="дедлайн" value={deadline} />
          <StatPill label="доказ" value={proofType} />
        </View>
        <View style={styles.actionRow}>
          <ChaosButton label="Взяти квест" onPress={() => setMessage('Квест додано в активні задачі')} style={styles.flexAction} />
          <Pressable
            accessibilityRole="button"
            onPress={() => toggleLike(questId, baseLikes)}
            style={({ pressed }) => [styles.iconAction, liked && styles.iconActionActive, pressed && styles.pressed]}>
            <Feather color={liked ? questColors.ember : questColors.textPrimary} name="heart" size={19} />
            <Text style={[styles.iconActionText, liked && styles.likeText]}>{likes}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.iconAction}>
            <Feather color={questColors.textPrimary} name="message-circle" size={19} />
            <Text style={styles.iconActionText}>{commentCount}</Text>
          </Pressable>
        </View>
      </View>

      {message ? <Notice tone="success">{message}</Notice> : null}

      <View style={styles.grid}>
        <FeatureCard icon="shield" title="Перевірка">
          <Text style={styles.bodyText}>{seed.verificationDescription}</Text>
          <View style={styles.inlineBadges}>
            <ChaosBadge tone="acid">{seed.verificationTitle}</ChaosBadge>
            <ChaosBadge tone="muted">{seed.moderationLabel}</ChaosBadge>
          </View>
        </FeatureCard>

        <FeatureCard icon="map-pin" title="Check-in">
          <Text style={styles.bodyText}>{seed.checkInLabel}</Text>
          <ProgressLine percent={checkInDone ? 100 : 42} tone={checkInDone ? 'success' : 'electric'} />
          <ChaosButton
            disabled={checkInDone}
            label={checkInDone ? 'Підтверджено' : 'Підтвердити'}
            onPress={handleCheckIn}
            variant={checkInDone ? 'outline' : 'electric'}
          />
        </FeatureCard>
      </View>

      <FeatureCard icon="flag" title="Скарги та модерація">
        <Text style={styles.bodyText}>
          Можна поскаржитись на квест, автора або конкретний proof. Нові скарги потрапляють у triage-чергу.
        </Text>
        <View style={styles.reportGrid}>
          {reportReasons.slice(0, 4).map((reason) => (
            <ReportButton
              key={reason.id}
              label={reason.label}
              onPress={() => reportTarget('quest', questId, reason.id)}
            />
          ))}
        </View>
        <ChaosButton
          label={`Поскаржитись на автора ${profile.username}`}
          onPress={() => reportTarget('user', seed.authorId, 'harassment')}
          variant="outline"
        />
        <Text style={styles.bodyText}>Активних скарг у цьому контексті: {questReports.length}</Text>
      </FeatureCard>

      <FeatureCard icon="check-circle" title="Proof review">
        {questProofs.length ? (
          <View style={styles.messageList}>
            {questProofs.map((proof) => (
              <ProofReviewRow
                key={proof.id}
                proof={proof}
                onApprove={() => {
                  approveProof(proof.id);
                  setMessage('Доказ підтверджено автором');
                }}
                onDispute={() => {
                  createDispute(proof.id, proof.escrowId ?? 'escrow-demo', 'Автор не приймає виконання');
                  setMessage('Escrow-диспут відкрито');
                }}
                onReject={() => {
                  rejectProof(proof.id);
                  setMessage('Доказ відхилено автором');
                }}
                onReport={() => reportTarget('proof', proof.id, 'fraud')}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.bodyText}>Доказів для цього квесту ще немає. Після upload вони зʼявляться тут з auto-score.</Text>
        )}
        {questDisputes.length ? (
          <View style={styles.disputeBox}>
            <Text style={styles.disputeTitle}>Escrow disputes: {questDisputes.length}</Text>
            {questDisputes.map((dispute) => (
              <Text key={dispute.id} style={styles.bodyText}>{dispute.status}: {dispute.reason}</Text>
            ))}
          </View>
        ) : null}
      </FeatureCard>

      <FeatureCard icon="hash" title="QR / NFC offline">
        <View style={styles.offlineRow}>
          <QrPreview />
          <View style={styles.offlineCopy}>
            <Text style={styles.offlineCode}>{seed.qrCode}</Text>
            <Text style={styles.bodyText}>NFC: {seed.nfcTag}</Text>
            <Text style={styles.bodyText}>Код використовується для офлайн-точок і швидкої перевірки на місці.</Text>
          </View>
        </View>
      </FeatureCard>

      <FeatureCard
        action={
          <ChaosButton
            label={teamJoined ? 'У команді' : 'Приєднатись'}
            onPress={handleJoinTeam}
            variant={teamJoined ? 'outline' : 'electric'}
          />
        }
        icon="users"
        title="Команда">
        <View style={styles.teamList}>
          {seed.team.map((member) => (
            <TeamRow key={member.id} member={member} />
          ))}
        </View>
      </FeatureCard>

      <FeatureCard icon="send" title="Командний чат">
        <View style={styles.messageList}>
          {teamChat.map((item) => (
            <View key={item.id} style={styles.messageBubble}>
              <Text style={styles.messageAuthor}>{item.sender} · {item.createdAt}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>
            </View>
          ))}
        </View>
        <Composer
          buttonLabel="Надіслати"
          onChangeText={setChatText}
          onSubmit={submitTeamMessage}
          placeholder="Повідомлення команді"
          value={chatText}
        />
      </FeatureCard>

      <FeatureCard icon="message-circle" title="Коментарі">
        <Composer
          buttonLabel="Додати"
          onChangeText={setCommentText}
          onSubmit={submitComment}
          placeholder="Напишіть коментар"
          value={commentText}
        />
        <View style={styles.messageList}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentRow}>
              <ChaosAvatar label={comment.userName} size={36} />
              <View style={styles.commentCopy}>
                <Text style={styles.messageAuthor}>{comment.userName} · {comment.createdAt}</Text>
                <Text style={styles.bodyText}>{comment.body}</Text>
              </View>
              <Text style={styles.commentLikes}>{comment.likes}</Text>
            </View>
          ))}
        </View>
      </FeatureCard>

      <FeatureCard
        action={
          <ChaosButton
            label={profile.following ? 'Підписані' : 'Підписатись'}
            onPress={() => toggleFollow(profile.id)}
            variant={profile.following ? 'outline' : 'ember'}
          />
        }
        icon="user-plus"
        title="Автор">
        <View style={styles.profileRow}>
          <ChaosAvatar label={profile.username} size={58} source={avatarSource} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.bodyText}>{profile.bio}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <StatPill label="створено" value={profile.created} />
          <StatPill label="виконано" value={profile.completed} />
          <StatPill label="рейтинг" value={profile.rating.toFixed(1)} />
        </View>
        <ChaosButton
          label="Публічний профіль"
          onPress={() => router.push(`/user/${profile.id}` as never)}
          variant="outline"
        />
      </FeatureCard>

      <FeatureCard icon="bell" title="Push-сповіщення">
        <View style={styles.messageList}>
          {questNotifications.map((notification) => (
            <View key={notification.id} style={styles.notificationRow}>
              <Feather color={questColors.acid} name="bell" size={18} />
              <View style={styles.notificationCopy}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.bodyText}>{notification.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </FeatureCard>

      <View style={styles.grid}>
        <FeatureCard icon="award" title="Рейтинги">
          <Text style={styles.bodyText}>{seed.leaderboardScope}</Text>
          {leaderboardBoards.city.map((item) => (
            <View key={item.id} style={styles.rankRow}>
              <Text style={styles.rank}>#{item.rank}</Text>
              <Text style={styles.rankName}>{item.name}</Text>
              <Text style={styles.rankValue}>{item.earned}</Text>
            </View>
          ))}
        </FeatureCard>

        <FeatureCard icon="zap" title="Рекомендації">
          {recommendations.map((recommendation) => (
            <Pressable
              accessibilityRole="button"
              key={recommendation!.id}
              onPress={() => router.push({ pathname: '/quest/[id]', params: { id: recommendation!.id } })}
              style={({ pressed }) => [styles.recommendation, pressed && styles.pressed]}>
              <Text numberOfLines={2} style={styles.recommendationTitle}>{recommendation!.title}</Text>
              <Text style={styles.bodyText}>{recommendation!.reward} грн · {recommendation!.deadline}</Text>
            </Pressable>
          ))}
        </FeatureCard>
      </View>
    </Screen>
  );
}

function FeatureCard({
  action,
  children,
  icon,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  icon: IconName;
  title: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.featureHeader}>
        <View style={styles.featureTitleRow}>
          <Feather color={questColors.acid} name={icon} size={17} />
          <Text style={styles.featureTitle}>{title}</Text>
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

function TeamRow({ member }: { member: QuestTeamMember }) {
  const tone = member.status === 'arrived' ? 'success' : member.status === 'walking' ? 'acid' : 'muted';
  const label = member.status === 'arrived' ? 'на точці' : member.status === 'walking' ? 'в дорозі' : 'готовий';

  return (
    <View style={styles.teamRow}>
      <ChaosAvatar label={member.name} size={38} />
      <View style={styles.teamCopy}>
        <Text style={styles.teamName}>{member.name}</Text>
        <Text style={styles.bodyText}>{member.role}</Text>
      </View>
      <ChaosBadge tone={tone}>{label}</ChaosBadge>
    </View>
  );
}

function ReportButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.reportButton, pressed && styles.pressed]}>
      <Feather color={questColors.warning} name="flag" size={16} />
      <Text style={styles.reportButtonText}>{label}</Text>
    </Pressable>
  );
}

function ProofReviewRow({
  onApprove,
  onDispute,
  onReject,
  onReport,
  proof,
}: {
  onApprove: () => void;
  onDispute: () => void;
  onReject: () => void;
  onReport: () => void;
  proof: ProofSubmission;
}) {
  const tone = proof.status === 'approved' ? 'success' : proof.status === 'rejected' || proof.status === 'disputed' ? 'ember' : 'acid';

  return (
    <View style={styles.proofRow}>
      <View style={styles.proofHeader}>
        <View style={styles.proofCopy}>
          <Text style={styles.proofTitle}>{proof.questTitle}</Text>
          <Text style={styles.bodyText}>{proof.performerName} · auto-score {proof.autoScore}/100 · {proof.mediaTypes.join(', ')}</Text>
        </View>
        <ChaosBadge tone={tone}>{proof.status}</ChaosBadge>
      </View>
      <View style={styles.signalList}>
        {proof.signals.map((signal) => (
          <Text key={signal} style={styles.signalText}>• {signal}</Text>
        ))}
      </View>
      <View style={styles.proofActions}>
        <ChaosButton label="Approve" onPress={onApprove} style={styles.smallAction} variant="outline" />
        <ChaosButton label="Reject" onPress={onReject} style={styles.smallAction} variant="ember" />
        <ChaosButton label="Dispute" onPress={onDispute} style={styles.smallAction} variant="electric" />
        <ChaosButton label="Report" onPress={onReport} style={styles.smallAction} variant="ghost" />
      </View>
    </View>
  );
}

function Composer({
  buttonLabel,
  onChangeText,
  onSubmit,
  placeholder,
  value,
}: {
  buttonLabel: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View style={styles.composer}>
      <TextInput
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={questColors.textSecondary}
        selectionColor={questColors.acid}
        style={styles.input}
        value={value}
      />
      <ChaosButton disabled={!value.trim()} label={buttonLabel} onPress={onSubmit} style={styles.composerButton} variant="electric" />
    </View>
  );
}

function QrPreview() {
  return (
    <View style={styles.qr}>
      {Array.from({ length: 25 }, (_, index) => (
        <View key={index} style={[styles.qrCell, (index + Math.floor(index / 5)) % 3 === 0 && styles.qrCellActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  author: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  bodyText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  card: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: 300,
    flexGrow: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  commentCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  commentLikes: {
    ...typography.captionStrong,
    color: questColors.ember,
  },
  commentRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  composer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  composerButton: {
    minWidth: 132,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: 120,
  },
  flexAction: {
    flex: 1,
    minWidth: 180,
  },
  featureHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  featureTitle: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
  featureTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.sm,
    minWidth: 180,
  },
  disputeBox: {
    backgroundColor: 'rgba(255, 77, 28, 0.1)',
    borderColor: 'rgba(255, 77, 28, 0.32)',
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  disputeTitle: {
    ...typography.captionStrong,
    color: questColors.ember,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  hero: {
    backgroundColor: 'rgba(124,58,255,0.16)',
    borderColor: 'rgba(196,255,0,0.24)',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconAction: {
    alignItems: 'center',
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 50,
    paddingHorizontal: spacing.md,
  },
  iconActionActive: {
    backgroundColor: 'rgba(255,77,28,0.12)',
    borderColor: 'rgba(255,77,28,0.42)',
  },
  iconActionText: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  inlineBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    color: questColors.textPrimary,
    flex: 1,
    minHeight: 50,
    minWidth: 180,
    paddingHorizontal: spacing.md,
  },
  likeText: {
    color: questColors.ember,
  },
  messageAuthor: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  messageBubble: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.xxs,
    padding: spacing.md,
  },
  messageList: {
    gap: spacing.sm,
  },
  meta: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  notificationCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  notificationRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  notificationTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  offlineCode: {
    ...typography.label,
    color: questColors.acid,
  },
  offlineCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  offlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.72,
  },
  proofActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  proofCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  proofHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  proofRow: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  proofTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  profileCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  profileName: {
    ...typography.subtitle,
    color: questColors.textPrimary,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  qr: {
    backgroundColor: questColors.void,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 104,
    padding: spacing.xs,
    width: 104,
  },
  qrCell: {
    backgroundColor: questColors.surfaceUp,
    height: 16,
    margin: 1,
    width: 16,
  },
  qrCellActive: {
    backgroundColor: questColors.acid,
  },
  rank: {
    ...typography.label,
    color: questColors.acid,
    width: 34,
  },
  rankName: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
    flex: 1,
  },
  rankRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rankValue: {
    ...typography.captionStrong,
    color: questColors.ember,
  },
  recommendation: {
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    gap: spacing.xxs,
    padding: spacing.md,
  },
  recommendationTitle: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  reportButton: {
    alignItems: 'center',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  reportButtonText: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  signalList: {
    gap: spacing.xxs,
  },
  signalText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  smallAction: {
    flexGrow: 1,
    minWidth: 104,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    ...typography.eyebrow,
    color: questColors.acid,
    textTransform: 'uppercase',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  teamCopy: {
    flex: 1,
    minWidth: 0,
  },
  teamList: {
    gap: spacing.sm,
  },
  teamName: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  teamRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: questColors.textPrimary,
  },
  topActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
});
