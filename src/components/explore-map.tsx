import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MOCK_QUESTS } from '@/components/home/quest.types';
import { Card } from '@/components/ui/card';
import { PageHeader, ProgressBar } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { EmptyState, Notice } from '@/components/ui/status';
import { mapFilters, type MapQuestFilter } from '@/data/social-features';
import { colors, radii, spacing, typography } from '@/theme';

const MARKERS = [
  { left: '34%', top: '42%' },
  { left: '58%', top: '60%' },
  { left: '72%', top: '30%' },
] as const;

export function ExploreMap() {
  const [selectedFilter, setSelectedFilter] = useState<MapQuestFilter>('all');
  const [checkedInIds, setCheckedInIds] = useState<Record<string, boolean>>({});
  const visibleQuests = useMemo(
    () => MOCK_QUESTS.filter((quest) => matchesMapFilter(quest, selectedFilter)),
    [selectedFilter]
  );

  return (
    <Screen contentStyle={styles.content} wide>
      <PageHeader
        eyebrow="Карта"
        subtitle="Web-версія показує безпечний preview без native map-модуля. На iOS/Android тут відкривається інтерактивна карта."
        title="Маршрути поруч"
      />

      <View style={styles.filterRow}>
        {mapFilters.map((filter) => {
          const active = filter.id === selectedFilter;
          return (
            <Pressable
              accessibilityRole="button"
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={({ pressed }) => [styles.filterChip, active && styles.filterChipActive, pressed && styles.pressed]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.mapPreview}>
        <View style={styles.gridLineOne} />
        <View style={styles.gridLineTwo} />
        <View style={styles.routePreview} />
        {MARKERS.slice(0, visibleQuests.length).map((marker) => (
          <View key={`${marker.left}-${marker.top}`} style={[styles.marker, marker]}>
            <Feather color={colors.white} name="map-pin" size={15} />
          </View>
        ))}
      </View>

      <Card style={styles.mapSheet}>
        <View style={styles.sheetHeader}>
          <View style={styles.pointIcon}>
            <Feather color={colors.primary} name="map-pin" size={18} />
          </View>
          <View style={styles.pointCopy}>
            <Text style={styles.pointTitle}>{visibleQuests[0]?.title ?? 'Квест поруч'}</Text>
            <Text style={styles.pointMeta}>Фільтр: {mapFilters.find((filter) => filter.id === selectedFilter)?.label}</Text>
          </View>
        </View>
        <ProgressBar percent={visibleQuests.length ? 33 : 0} />
      </Card>

      <Notice tone="info">
        На web показано preview. На iOS/Android карта бере реальну геолокацію, будує маршрут, перевіряє geofence і кешує найближчі квести.
      </Notice>

      <View style={styles.pointList}>
        {visibleQuests.length ? (
          visibleQuests.map((quest) => (
            <Card key={quest.id} style={styles.pointRow}>
              <View style={styles.pointIcon}>
                <Feather color={colors.primary} name="compass" size={18} />
              </View>
              <View style={styles.pointCopy}>
                <Text numberOfLines={1} style={styles.pointTitle}>
                  {quest.title}
                </Text>
                <Text numberOfLines={1} style={styles.pointMeta}>
                  {quest.location} · {quest.distance} · {quest.route.length} точки
                </Text>
              </View>
              <View style={styles.pointActions}>
                <Text style={styles.pointDuration}>{quest.duration}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setCheckedInIds((state) => ({ ...state, [quest.id]: true }))}
                  style={[styles.checkInButton, checkedInIds[quest.id] && styles.checkInButtonDone]}>
                  <Text style={[styles.checkInText, checkedInIds[quest.id] && styles.checkInTextDone]}>
                    {checkedInIds[quest.id] ? 'check-in' : 'старт'}
                  </Text>
                </Pressable>
              </View>
            </Card>
          ))
        ) : (
          <EmptyState
            icon="map-pin"
            text="Коли зʼявляться маршрути поблизу, вони будуть доступні на карті та в offline-кеші."
            title="Квестів на карті поки немає"
          />
        )}
      </View>
    </Screen>
  );
}

function matchesMapFilter(quest: (typeof MOCK_QUESTS)[number], filter: MapQuestFilter) {
  if (filter === 'all') return true;
  if (filter === 'nearby') return true;
  if (filter === 'online') return false;
  if (filter === 'highReward') return quest.reward.xp >= 150;
  if (filter === 'new') return quest.isNew;
  return true;
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
  },
  checkInButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  checkInButtonDone: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  checkInText: {
    ...typography.eyebrow,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  checkInTextDone: {
    color: colors.success,
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterText: {
    ...typography.captionStrong,
    color: colors.inkMuted,
  },
  filterTextActive: {
    color: colors.accent,
  },
  mapPreview: {
    backgroundColor: colors.canvasParchment,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 310,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLineOne: {
    backgroundColor: colors.surface,
    height: 90,
    left: -20,
    position: 'absolute',
    right: -20,
    top: 120,
    transform: [{ rotate: '-12deg' }],
  },
  gridLineTwo: {
    backgroundColor: colors.surfacePearl,
    bottom: 34,
    left: -30,
    position: 'absolute',
    right: -30,
    top: 84,
    transform: [{ rotate: '20deg' }],
  },
  marker: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderRadius: radii.pill,
    borderWidth: 3,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    width: 36,
  },
  mapSheet: {
    gap: spacing.md,
    marginTop: -spacing.lg,
  },
  routePreview: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: 5,
    left: '33%',
    opacity: 0.7,
    position: 'absolute',
    top: '48%',
    transform: [{ rotate: '28deg' }],
    width: '44%',
  },
  pointList: {
    gap: spacing.md,
  },
  pointRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  pointIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  pointCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  pointTitle: {
    ...typography.captionStrong,
    color: colors.ink,
  },
  pointMeta: {
    ...typography.body,
    color: colors.inkMuted,
  },
  pointDuration: {
    ...typography.captionStrong,
    color: colors.primary,
  },
  pointActions: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.72,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
});
