import { BookmarkSimple, Camera, Clock, MapPin, PlayCircle } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton, Avatar, Badge } from '@/components/ui/app';
import { colors, opacity, radii, spacing, typography } from '@/theme';
import type { FeedQuest } from '@/data/questme';
import { useSocialStore } from '@/store/social-store';

type QuestCardProps = {
  index: number;
  quest: FeedQuest;
  onOpen: (quest: FeedQuest) => void;
  onTake: (quest: FeedQuest) => void;
};

export function QuestCard({ onOpen, onTake, quest }: QuestCardProps) {
  const saved = useSocialStore((state) => state.questSocial[quest.id]?.saved ?? false);
  const toggleSave = useSocialStore((state) => state.toggleSave);
  const proofIcon = quest.proofType === 'Відео' ? PlayCircle : Camera;
  const ProofIcon = proofIcon;

  return (
    <Pressable
      accessibilityHint="Opens quest details"
      accessibilityLabel={`Quest: ${quest.title}`}
      accessibilityRole="button"
      onPress={() => onOpen(quest)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <LinearGradient colors={['rgba(124,58,255,0.26)', 'rgba(17,17,24,0.1)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cover}>
        <View style={styles.coverTop}>
          <Badge label={quest.categoryLabel} />
          <Pressable
            accessibilityLabel={saved ? 'Remove from saved quests' : 'Save quest'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={(event) => { event.stopPropagation(); toggleSave(quest.id); }}
            style={({ pressed }) => [styles.save, pressed && styles.pressed]}>
            <BookmarkSimple color={saved ? colors.accent : colors.ink} size={21} weight={saved ? 'fill' : 'regular'} />
          </Pressable>
        </View>
        <View style={styles.rewardWrap}><Text style={styles.reward}>{quest.reward} грн</Text><Text style={styles.rewardCaption}>reward</Text></View>
      </LinearGradient>

      <View style={styles.content}>
        <Text numberOfLines={3} style={styles.title}>{quest.title}</Text>
        <View style={styles.metaRow}>
          <Clock color={colors.inkSubtle} size={17} /><Text style={styles.meta}>{quest.deadline}</Text>
          <MapPin color={colors.inkSubtle} size={17} /><Text style={styles.meta}>{quest.distance}</Text>
          <View style={styles.proof}><ProofIcon color={colors.primaryOnDark} size={15} /><Text style={styles.proofText}>{quest.proofType}</Text></View>
        </View>
        <View style={styles.footer}>
          <View style={styles.author}><Avatar label={quest.avatar} size={32} /><View><Text style={styles.authorName}>@{quest.author}</Text><Text style={styles.time}>{quest.timeAgo}</Text></View></View>
          <AppButton label="Взяти" onPress={() => onTake(quest)} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  author: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: spacing.sm, minWidth: 0 }, authorName: { ...typography.captionStrong, color: colors.ink },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, overflow: 'hidden' },
  content: { gap: spacing.md, padding: spacing.lg }, cover: { height: 136, justifyContent: 'space-between', padding: spacing.md }, coverTop: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  footer: { alignItems: 'center', flexDirection: 'row', gap: spacing.md }, meta: { ...typography.caption, color: colors.inkMuted }, metaRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  pressed: { opacity: opacity.pressed }, proof: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radii.pill, flexDirection: 'row', gap: spacing.xxs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs }, proofText: { ...typography.eyebrow, color: colors.primaryOnDark },
  reward: { ...typography.titleCompact, color: colors.accent }, rewardCaption: { ...typography.eyebrow, color: colors.inkMuted, textTransform: 'uppercase' }, rewardWrap: { alignSelf: 'flex-start', gap: spacing.xxs },
  save: { alignItems: 'center', backgroundColor: 'rgba(10,10,15,0.42)', borderRadius: radii.pill, height: 40, justifyContent: 'center', width: 40 }, time: { ...typography.caption, color: colors.inkSubtle }, title: { ...typography.subtitle, color: colors.ink },
});
