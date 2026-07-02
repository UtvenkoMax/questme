import * as Haptics from 'expo-haptics';
import {
  BookmarkSimple,
  ChatCircle,
  ClockCountdown,
  CurrencyCircleDollar,
  Heart,
  ShareFat,
  ShieldCheck,
  XCircle,
} from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ChaosAvatar, ChaosBadge, ChaosButton } from '@/components/ui/chaos';
import { getAvatarPhotoIdForAccount, getAvatarPhotoSource } from '@/constants/avatarPhotos';
import { questColors } from '@/constants/colors';
import { SPRING_CONFIG } from '@/constants/animations';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { type FeedQuest } from '@/data/questme';
import { getQuestSocialSeed } from '@/data/social-features';
import { useSocialStore } from '@/store/social-store';

type QuestCardProps = {
  index: number;
  quest: FeedQuest;
  onOpen?: (quest: FeedQuest) => void;
  onTake?: (quest: FeedQuest) => void;
};

export function QuestCard({ index, onOpen, onTake, quest }: QuestCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const translateX = useSharedValue(0);
  const ensureQuestSocial = useSocialStore((state) => state.ensureQuestSocial);
  const questSocial = useSocialStore((state) => state.questSocial[quest.id]);
  const toggleLike = useSocialStore((state) => state.toggleLike);
  const toggleSave = useSocialStore((state) => state.toggleSave);
  const socialSeed = getQuestSocialSeed(quest.id, quest.title);
  const liked = questSocial?.liked ?? false;
  const saved = questSocial?.saved ?? false;
  const addedComments = Math.max(0, (questSocial?.comments.length ?? socialSeed.comments.length) - socialSeed.comments.length);
  const likes = quest.reactions.likes + (liked ? 1 : 0);
  const comments = quest.reactions.comments + addedComments;

  useEffect(() => {
    ensureQuestSocial(quest.id, quest.title);
  }, [ensureQuestSocial, quest.id, quest.title]);

  const commitSwipe = (direction: 'save' | 'skip') => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setPreviewOpen(direction === 'save');
    if (direction === 'save' && !saved) {
      toggleSave(quest.id);
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-14, 14])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 96) {
        runOnJS(commitSwipe)('save');
      }
      if (event.translationX < -96) {
        runOnJS(commitSwipe)('skip');
      }
      translateX.value = withSpring(0, SPRING_CONFIG);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${interpolate(translateX.value, [-180, 0, 180], [-5, 0, 5])}deg` },
      { scale: interpolate(Math.abs(translateX.value), [0, 180], [1, 0.97]) },
    ],
  }));

  const saveOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 110], [0, 1]),
  }));

  const skipOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-110, 0], [1, 0]),
  }));

  const riskTone = quest.risk === 'safe' ? 'success' : quest.risk === 'spicy' ? 'ember' : 'acid';
  const avatarSource = getAvatarPhotoSource(getAvatarPhotoIdForAccount(`${quest.id}:${quest.author}`));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View entering={FadeInDown.delay(index * 80).springify()} style={[styles.wrap, animatedStyle]}>
        <Animated.View pointerEvents="none" style={[styles.swipeHint, styles.saveHint, saveOverlayStyle]}>
          <BookmarkSimple color={questColors.acid} size={20} weight="fill" />
          <Text style={styles.hintText}>Зберегти</Text>
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.swipeHint, styles.skipHint, skipOverlayStyle]}>
          <XCircle color={questColors.ember} size={20} weight="fill" />
          <Text style={styles.hintText}>Пропустити</Text>
        </Animated.View>

        <Pressable
          accessibilityRole="button"
          onPress={() => onOpen?.(quest)}
          onLongPress={() => setPreviewOpen((value) => !value)}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
          <View style={styles.header}>
            <ChaosAvatar label={quest.avatar} source={avatarSource} />
            <View style={styles.authorBlock}>
              <Text style={styles.author}>@{quest.author}</Text>
              <Text style={styles.metaMuted}>● {quest.timeAgo} · {quest.distance}</Text>
            </View>
            <ChaosBadge tone={riskTone}>{quest.risk}</ChaosBadge>
          </View>

          <Text style={styles.title}>{quest.title}</Text>

          <View style={styles.tagRow}>
            {socialSeed.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>#{tag}</Text>
            ))}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <CurrencyCircleDollar color={questColors.ember} size={20} weight="fill" />
              <Text style={styles.money}>{quest.reward} грн</Text>
            </View>
            <View style={styles.meta}>
              <ClockCountdown color={questColors.acid} size={20} />
              <Text style={styles.metaText}>{quest.deadline}</Text>
            </View>
            <ChaosBadge tone="muted">{quest.proofType}</ChaosBadge>
          </View>

          <ChaosButton label="Взяти квест" onPress={() => onTake?.(quest)} />

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={() => toggleLike(quest.id, quest.reactions.likes)}
              style={styles.reactions}>
              <Heart color={liked ? questColors.ember : questColors.textSecondary} size={18} weight={liked ? 'fill' : 'regular'} />
              <Text style={[styles.footerText, liked && styles.footerTextActive]}>{likes}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => onOpen?.(quest)} style={styles.reactions}>
              <ChatCircle color={questColors.textSecondary} size={18} />
              <Text style={styles.footerText}>{comments}</Text>
            </Pressable>
            <View style={styles.reactions}>
              <ShareFat color={questColors.textSecondary} size={18} />
              <Text style={styles.footerText}>share</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={() => toggleSave(quest.id)} style={styles.reactions}>
              <BookmarkSimple color={saved ? questColors.acid : questColors.textSecondary} size={18} weight={saved ? 'fill' : 'regular'} />
              <Text style={[styles.footerText, saved && styles.footerTextSaved]}>{saved ? 'saved' : 'save'}</Text>
            </Pressable>
            <View style={styles.bubbles}>
              {quest.reactions.mood.map((reaction) => (
                <Text key={reaction} style={styles.bubble}>{reaction}</Text>
              ))}
            </View>
          </View>

          {previewOpen ? (
            <View style={styles.preview}>
              <ShieldCheck color={questColors.acid} size={19} weight="fill" />
              <Text style={styles.previewText}>
                Автор зарезервував оплату. Доказ: {quest.proofType}. Після підтвердження гроші йдуть виконавцю.
              </Text>
            </View>
          ) : null}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  author: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  authorBlock: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
  bubble: {
    fontSize: 16,
    marginLeft: -4,
  },
  bubbles: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  footerText: {
    ...typography.captionStrong,
    color: questColors.textSecondary,
  },
  footerTextActive: {
    color: questColors.ember,
  },
  footerTextSaved: {
    color: questColors.acid,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  hintText: {
    ...typography.label,
    color: questColors.textPrimary,
    textTransform: 'uppercase',
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metaMuted: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metaText: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  money: {
    ...typography.subtitle,
    color: questColors.ember,
  },
  pressed: {
    opacity: 0.92,
  },
  preview: {
    alignItems: 'flex-start',
    backgroundColor: questColors.surfaceUp,
    borderColor: questColors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  previewText: {
    ...typography.caption,
    color: questColors.textSecondary,
    flex: 1,
  },
  reactions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  saveHint: {
    backgroundColor: 'rgba(196, 255, 0, 0.14)',
    left: spacing.sm,
  },
  skipHint: {
    backgroundColor: 'rgba(255, 77, 28, 0.14)',
    right: spacing.sm,
  },
  swipeHint: {
    alignItems: 'center',
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.sm,
    position: 'absolute',
    top: spacing.md,
    zIndex: 2,
  },
  title: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
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
  wrap: {
    position: 'relative',
  },
});
