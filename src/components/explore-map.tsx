import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { MOCK_QUESTS } from '@/components/home/quest.types';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { EmptyState, Notice } from '@/components/ui/status';
import { colors, radii, spacing, typography } from '@/theme';

const MARKERS = [
  { left: '34%', top: '42%' },
  { left: '58%', top: '60%' },
  { left: '72%', top: '30%' },
] as const;

export function ExploreMap() {
  return (
    <Screen contentStyle={styles.content} wide>
      <PageHeader
        eyebrow="Карта"
        subtitle="Web-версія показує безпечний preview без native map-модуля. На iOS/Android тут відкривається інтерактивна карта."
        title="Маршрути поруч"
      />

      <View style={styles.mapPreview}>
        <View style={styles.gridLineOne} />
        <View style={styles.gridLineTwo} />
        <View style={styles.routePreview} />
        {MARKERS.map((marker) => (
          <View key={`${marker.left}-${marker.top}`} style={[styles.marker, marker]}>
            <Feather color={colors.white} name="map-pin" size={15} />
          </View>
        ))}
      </View>

      <Notice tone="info">
        На web показано preview. На iOS/Android карта бере реальну геолокацію, будує маршрут, перевіряє geofence і кешує найближчі квести.
      </Notice>

      <View style={styles.pointList}>
        {MOCK_QUESTS.length ? (
          MOCK_QUESTS.map((quest) => (
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
              <Text style={styles.pointDuration}>{quest.duration}</Text>
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

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
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
});
