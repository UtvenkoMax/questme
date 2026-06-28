import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowSquareOut } from 'phosphor-react-native';

import { ChaosButton } from '@/components/ui/chaos';
import { gradients, questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { type YouTubeShort } from '@/services/youtube.service';

type VideoOverlayProps = {
  short: YouTubeShort;
  onTryQuest?: () => void;
};

export function VideoOverlay({ onTryQuest, short }: VideoOverlayProps) {
  return (
    <LinearGradient colors={gradients.heroShade} pointerEvents="box-none" style={styles.overlay}>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.channel}>@{short.channelTitle}</Text>
        <Text numberOfLines={2} style={styles.title}>{short.title}</Text>
        <Text numberOfLines={2} style={styles.description}>{short.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{short.viewCount ? `${short.viewCount} переглядів` : 'YouTube Shorts'}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(short.shortsUrl).catch(() => {})}
            style={styles.link}>
            <Text style={styles.linkText}>Shorts</Text>
            <ArrowSquareOut color={questColors.acid} size={14} />
          </Pressable>
        </View>
        <ChaosButton label="Спробувати квест" onPress={onTryQuest} style={styles.button} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
  },
  channel: {
    ...typography.label,
    color: questColors.acid,
  },
  copy: {
    bottom: 120, // Raised significantly to clear the Bottom Tab Bar
    gap: spacing.sm,
    left: spacing.lg,
    maxWidth: '78%',
    position: 'absolute',
    right: spacing.xl,
  },
  description: {
    ...typography.body,
    color: questColors.textPrimary,
  },
  link: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  linkText: {
    ...typography.captionStrong,
    color: questColors.acid,
  },
  metaDot: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  metaRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(17,17,24,0.72)',
    borderColor: questColors.border,
    borderRadius: radii.xs,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaText: {
    ...typography.captionStrong,
    color: questColors.textPrimary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
  title: {
    ...typography.titleCompact,
    color: questColors.textPrimary,
  },
});
