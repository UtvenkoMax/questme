import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Card } from '@/components/ui/card';
import { PageHeader, Pill, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { colors, radii, shadows, spacing, typography } from '@/theme';
import { getResponsiveMetrics } from '@/utils/responsive';

type CompletedVideo = {
  author: string;
  id: string;
  image: number;
  likes: string;
  location: string;
  quest: string;
  title: string;
  views: string;
  duration: string;
};

const COMPLETED_VIDEOS: CompletedVideo[] = [
  {
    author: 'Марія',
    duration: '0:34',
    id: 'steps',
    image: require('@/assets/images/quest2.png'),
    likes: '184',
    location: 'Парк Шевченка',
    quest: '10 000 кроків',
    title: 'Фініш ранкової прогулянки',
    views: '1.2K',
  },
  {
    author: 'Олег',
    duration: '0:41',
    id: 'old-town',
    image: require('@/assets/images/quest1.png'),
    likes: '96',
    location: 'Поділ',
    quest: 'Історичний маршрут',
    title: 'Знайшов останню точку квесту',
    views: '842',
  },
  {
    author: 'Іра',
    duration: '0:28',
    id: 'coffee',
    image: require('@/assets/images/quest3.png'),
    likes: '231',
    location: 'Центр Києва',
    quest: 'Секретні кавʼярні',
    title: 'Командне завдання виконано',
    views: '2.4K',
  },
];

export default function VideosScreen() {
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const featured = COMPLETED_VIDEOS[0];

  return (
    <Screen contentStyle={styles.content} wide>
      <PageHeader
        eyebrow="QuestMe Clips"
        subtitle="Короткі відео з виконаними завданнями, фінішами маршрутів і моментами команди."
        title="Виконані завдання у відео"
      />

      <FeaturedVideo video={featured} />

      <View style={styles.feed}>
        <SectionHeader subtitle="Нові завершення від спільноти" title="Стрічка коротких відео" />
        <View style={[styles.grid, layout.listColumns > 1 && styles.gridWide]}>
          {COMPLETED_VIDEOS.map((video) => (
            <View key={video.id} style={[styles.gridItem, layout.listColumns > 1 && styles.gridItemWide]}>
              <VideoCard video={video} />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function FeaturedVideo({ video }: { video: CompletedVideo }) {
  return (
    <View style={styles.featured}>
      <Image contentFit="cover" source={video.image} style={styles.featuredImage} />
      <View style={styles.featuredShade} />
      <View style={styles.featuredTop}>
        <Pill tone="primary">Виконано</Pill>
        <Text style={styles.duration}>{video.duration}</Text>
      </View>
      <View style={styles.featuredBottom}>
        <Pressable accessibilityLabel="Переглянути коротке відео" accessibilityRole="button" style={styles.playButton}>
          <Feather color={colors.white} name="play" size={22} />
        </Pressable>
        <View style={styles.featuredCopy}>
          <Text style={styles.featuredTitle}>{video.title}</Text>
          <Text style={styles.featuredMeta}>
            {video.author} · {video.quest} · {video.location}
          </Text>
        </View>
      </View>
    </View>
  );
}

function VideoCard({ video }: { video: CompletedVideo }) {
  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.thumbnail}>
        <Image contentFit="cover" source={video.image} style={styles.thumbnailImage} />
        <View style={styles.thumbnailShade} />
        <View style={styles.thumbnailPlay}>
          <Feather color={colors.white} name="play" size={16} />
        </View>
        <Text style={styles.thumbnailDuration}>{video.duration}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text numberOfLines={2} style={styles.cardTitle}>
          {video.title}
        </Text>
        <Text numberOfLines={1} style={styles.cardMeta}>
          {video.author} · {video.quest}
        </Text>
        <View style={styles.stats}>
          <Stat icon="eye" value={video.views} />
          <Stat icon="heart" value={video.likes} />
          <Stat icon="map-pin" value={video.location} />
        </View>
      </View>
    </Card>
  );
}

function Stat({ icon, value }: { icon: React.ComponentProps<typeof Feather>['name']; value: string }) {
  return (
    <View style={styles.stat}>
      <Feather color={colors.inkSubtle} name={icon} size={14} />
      <Text numberOfLines={1} style={styles.statText}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  featured: {
    aspectRatio: 0.78,
    backgroundColor: colors.tile,
    borderRadius: radii.lg,
    maxHeight: 620,
    minHeight: 420,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.product,
  },
  featuredImage: {
    height: '100%',
    width: '100%',
  },
  featuredShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  featuredTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
  },
  duration: {
    ...typography.captionStrong,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    borderRadius: radii.pill,
    color: colors.white,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featuredBottom: {
    alignItems: 'flex-end',
    bottom: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  featuredCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  featuredTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '600',
    lineHeight: 40,
  },
  featuredMeta: {
    ...typography.body,
    color: colors.bodyMutedOnDark,
  },
  feed: {
    gap: spacing.lg,
  },
  grid: {
    gap: spacing.lg,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '100%',
  },
  gridItemWide: {
    flexBasis: '31%',
    flexGrow: 1,
  },
  card: {
    minWidth: 0,
  },
  thumbnail: {
    aspectRatio: 0.82,
    backgroundColor: colors.tileAlt,
    position: 'relative',
  },
  thumbnailImage: {
    height: '100%',
    width: '100%',
  },
  thumbnailShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
  },
  thumbnailPlay: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 38,
    justifyContent: 'center',
    left: spacing.md,
    position: 'absolute',
    top: spacing.md,
    width: 38,
  },
  thumbnailDuration: {
    ...typography.captionStrong,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    borderRadius: radii.pill,
    bottom: spacing.md,
    color: colors.white,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: 'absolute',
    right: spacing.md,
  },
  cardBody: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '600',
  },
  cardMeta: {
    ...typography.caption,
    color: colors.inkSubtle,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    alignItems: 'center',
    backgroundColor: colors.surfacePearl,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statText: {
    ...typography.caption,
    color: colors.inkMuted,
    maxWidth: 120,
  },
});
