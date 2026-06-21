import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewToken,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { VideoActions } from '@/components/shorts/VideoActions';
import { VideoOverlay } from '@/components/shorts/VideoOverlay';
import { VideoPlayer } from '@/components/shorts/VideoPlayer';
import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useShorts } from '@/hooks/useShorts';
import { type YouTubeShort } from '@/services/youtube.service';

export default function ShortsScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const {
    error,
    hasMore,
    items,
    loadMore,
    loading,
    loadingMore,
    refresh,
    refreshing,
    warning,
  } = useShorts();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [listHeight, setListHeight] = useState<number>(0);

  const itemHeight = listHeight || height;
  const itemWidth = width >= 760 ? 460 : width;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 80,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken<YouTubeShort>[] }) => {
    const firstVisible = viewableItems.find((item) => item.isViewable)?.item;
    if (firstVisible) setActiveId(firstVisible.id);
  }).current;

  const renderItem = useCallback(
    ({ item }: { item: YouTubeShort }) => (
      <ShortsItem
        active={activeId ? activeId === item.id : items[0]?.id === item.id}
        height={itemHeight}
        short={item}
        width={itemWidth}
        onTryQuest={() => router.push('/publish')}
      />
    ),
    [activeId, itemHeight, itemWidth, items, router]
  );

  const footer = useMemo(() => {
    if (!loadingMore && !hasMore) {
      return (
        <View style={[styles.footer, { width: itemWidth }]}>
          <Text style={styles.footerText}>Це все, що YouTube API повернув для поточного запиту.</Text>
        </View>
      );
    }

    if (!loadingMore) return null;

    return (
      <View style={[styles.footer, { width: itemWidth }]}>
        <ActivityIndicator color={questColors.acid} />
        <Text style={styles.footerText}>Підвантажуємо ще Shorts...</Text>
      </View>
    );
  }, [hasMore, itemWidth, loadingMore]);

  if (loading) {
    return <ShortsSkeleton />;
  }

  return (
    <View
      style={styles.screen}
      onLayout={(e) => {
        const { height: layoutHeight } = e.nativeEvent.layout;
        if (layoutHeight > 0 && layoutHeight !== listHeight) {
          setListHeight(layoutHeight);
        }
      }}
    >
      {(warning || error) && (
        <View style={styles.toastNotice}>
          <Text style={styles.noticeTitle}>{error ? 'Помилка завантаження' : 'Локальна версія'}</Text>
          <Text style={styles.noticeText}>{error || warning}</Text>
        </View>
      )}
      <FlatList
        ListFooterComponent={footer}
        contentContainerStyle={styles.listContent}
        data={items}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          index,
          length: itemHeight,
          offset: itemHeight * index,
        })}
        initialNumToRender={2}
        keyExtractor={(item) => item.id}
        maxToRenderPerBatch={3}
        onEndReached={loadMore}
        onEndReachedThreshold={0.72}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled
        refreshControl={
          <RefreshControl
            colors={[questColors.acid, questColors.electric]}
            onRefresh={refresh}
            progressBackgroundColor={questColors.surface}
            refreshing={refreshing}
            tintColor={questColors.acid}
          />
        }
        removeClippedSubviews={false}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={itemHeight}
        viewabilityConfig={viewabilityConfig}
        windowSize={5}
      />
    </View>
  );
}

function ShortsItem({
  active,
  height,
  onTryQuest,
  short,
  width,
}: {
  active: boolean;
  height: number;
  onTryQuest: () => void;
  short: YouTubeShort;
  width: number;
}) {
  return (
    <View style={[styles.itemShell, { height }]}>
      <View style={[styles.item, { height, width }]}>
        <VideoPlayer active={active} short={short} />
        <VideoActions short={short} />
        <VideoOverlay short={short} onTryQuest={onTryQuest} />
      </View>
    </View>
  );
}

function ShortsSkeleton() {
  const opacity = useSharedValue(0.35);
  opacity.value = withRepeat(withTiming(1, { duration: 760 }), -1, true);
  const shimmer = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.skeletonScreen}>
      <Animated.View entering={FadeIn} style={[styles.shimmer, shimmer]} />
      <View style={styles.skeletonCopy}>
        <Text style={styles.skeletonTitle}>Завантажуємо YouTube Shorts</Text>
        <Text style={styles.skeletonText}>Шукаємо короткі embeddable відео через YouTube Data API.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignSelf: 'center',
    gap: spacing.sm,
    minHeight: 96,
    padding: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    color: questColors.textSecondary,
    textAlign: 'center',
  },
  item: {
    alignSelf: 'center',
    backgroundColor: questColors.void,
    overflow: 'hidden',
    position: 'relative',
  },
  itemShell: {
    alignItems: 'center',
    backgroundColor: questColors.void,
  },
  listContent: {
    backgroundColor: questColors.void,
  },
  toastNotice: {
    backgroundColor: 'rgba(17,17,24,0.94)',
    borderColor: 'rgba(196,255,0,0.3)',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    left: spacing.md,
    padding: spacing.md,
    position: 'absolute',
    right: spacing.md,
    top: spacing.xl + 40, // Below safe area
    zIndex: 100,
  },
  noticeText: {
    ...typography.caption,
    color: questColors.textSecondary,
  },
  noticeTitle: {
    ...typography.label,
    color: questColors.acid,
  },
  screen: {
    backgroundColor: questColors.void,
    flex: 1,
  },
  shimmer: {
    backgroundColor: 'rgba(124,58,255,0.24)',
    borderRadius: 999,
    height: 260,
    position: 'absolute',
    right: -80,
    top: 80,
    width: 260,
  },
  skeletonCopy: {
    bottom: 120,
    gap: spacing.sm,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  skeletonScreen: {
    backgroundColor: questColors.void,
    flex: 1,
  },
  skeletonText: {
    ...typography.body,
    color: questColors.textSecondary,
  },
  skeletonTitle: {
    ...typography.title,
    color: questColors.textPrimary,
  },
});
