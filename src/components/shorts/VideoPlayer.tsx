import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { PlayCircle } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { type YouTubeShort } from '@/services/youtube.service';

type VideoPlayerProps = {
  active: boolean;
  short: YouTubeShort;
};

export function VideoPlayer({ active, short }: VideoPlayerProps) {
  if (!active) {
    return (
      <View style={styles.frame}>
        <Image contentFit="cover" source={{ uri: short.thumbnailUrl }} style={StyleSheet.absoluteFill} />
        <View style={styles.thumbnailShade} />
        <View style={styles.previewBadge}>
          <PlayCircle color={questColors.textPrimary} size={24} weight="fill" />
          <Text style={styles.previewText}>Quest Shorts</Text>
        </View>
      </View>
    );
  }

  // Web: Use standard HTML5 <video> tag for robust compatibility and native web autoplay support
  if (Platform.OS === 'web') {
    return (
      <View style={styles.frame}>
        <video
          src={short.streamUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            border: 'none',
          }}
        />
      </View>
    );
  }

  return <NativeStreamPlayer key={short.id} short={short} />;
}

function NativeStreamPlayer({ short }: { short: YouTubeShort }) {
  const player = useVideoPlayer(short.streamUrl!, (p) => {
    p.loop = true;
    p.muted = false; // Play with sound as requested by the user
    p.play();
  });

  useEffect(() => {
    player.play();
  }, [player]);

  return (
    <View style={styles.frame}>
      {/* Show high quality thumbnail under the player while loading */}
      <Image contentFit="cover" source={{ uri: short.thumbnailUrl }} style={StyleSheet.absoluteFill} />
      <View style={styles.thumbnailShade} />
      
      <VideoView
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
        nativeControls={false}
        player={player}
        style={styles.nativeVideo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: questColors.surface,
    overflow: 'hidden',
  },
  nativeVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  previewBadge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(10,10,15,0.62)',
    borderColor: 'rgba(240,238,255,0.18)',
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'absolute',
    top: '44%',
  },
  previewText: {
    ...typography.label,
    color: questColors.textPrimary,
  },
  thumbnailShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,15,0.28)',
  },
});
