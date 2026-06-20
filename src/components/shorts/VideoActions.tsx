import * as Haptics from 'expo-haptics';
import { ChatCircle, Eye, Heart, ShareFat } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { type YouTubeShort } from '@/services/youtube.service';

type VideoActionsProps = {
  short: YouTubeShort;
};

export function VideoActions({ short }: VideoActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(short.likeCount ?? 'Like');

  const toggleLike = () => {
    setLiked(!liked);
    // In a real app we'd update the backend. Here we just visually toggle.
  };

  const shareShort = async () => {
    try {
      await Share.share({
        message: `Заціни цей квест у QuestMe: ${short.title} \n${short.shortsUrl}`,
        url: short.shortsUrl, // Helps native share sheets on iOS
        title: short.title,
      });
    } catch {
      Linking.openURL(short.shortsUrl).catch(() => {});
    }
  };

  return (
    <View style={styles.actions}>
      <Action 
        icon={<Heart color={liked ? questColors.ember : questColors.textPrimary} size={26} weight={liked ? "fill" : "regular"} />} 
        label={likesCount} 
        onPress={toggleLike}
      />
      <Action icon={<ChatCircle color={questColors.textPrimary} size={26} />} label={short.commentCount ?? 'Ком.'} />
      <Action icon={<Eye color={questColors.textPrimary} size={26} />} label={short.viewCount ?? 'Views'} />
      <Action icon={<ShareFat color={questColors.textPrimary} size={26} />} label="Share" onPress={shareShort} />
    </View>
  );
}

function Action({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      {icon}
      <Text numberOfLines={1} style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 17, 24, 0.72)',
    borderColor: 'rgba(240, 238, 255, 0.12)',
    borderRadius: radii.pill,
    borderWidth: 1,
    gap: spacing.xxs,
    minHeight: 58,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    width: 62,
  },
  actionText: {
    ...typography.eyebrow,
    color: questColors.textPrimary,
    maxWidth: 54,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
    position: 'absolute',
    right: spacing.md,
    top: '30%',
    zIndex: 5,
  },
  pressed: {
    opacity: 0.74,
    transform: [{ scale: 0.96 }],
  },
});
