import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { MOCK_QUESTS } from '@/components/home/quest.types';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
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
        {MARKERS.map((marker, index) => (
          <View key={`${marker.left}-${marker.top}`} style={[styles.marker, marker, { backgroundColor: MOCK_QUESTS[index].accentColor }]}>
            <Feather color={colors.white} name="map-pin" size={15} />
          </View>
        ))}
      </View>

      <View style={styles.pointList}>
        {MOCK_QUESTS.map((quest) => (
          <Card key={quest.id} style={styles.pointRow}>
            <View style={styles.pointIcon}>
              <Feather color={quest.accentColor} name="compass" size={18} />
            </View>
            <View style={styles.pointCopy}>
              <Text numberOfLines={1} style={styles.pointTitle}>
                {quest.title}
              </Text>
              <Text numberOfLines={1} style={styles.pointMeta}>
                {quest.location} · {quest.distance}
              </Text>
            </View>
            <Text style={styles.pointDuration}>{quest.duration}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
  },
  mapPreview: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    height: 310,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLineOne: {
    backgroundColor: 'rgba(32, 108, 92, 0.13)',
    height: 90,
    left: -20,
    position: 'absolute',
    right: -20,
    top: 120,
    transform: [{ rotate: '-12deg' }],
  },
  gridLineTwo: {
    backgroundColor: 'rgba(47, 111, 237, 0.11)',
    bottom: 34,
    left: -30,
    position: 'absolute',
    right: -30,
    top: 84,
    transform: [{ rotate: '20deg' }],
  },
  marker: {
    alignItems: 'center',
    borderColor: colors.white,
    borderRadius: radii.pill,
    borderWidth: 3,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    width: 36,
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
    backgroundColor: colors.surfaceMuted,
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
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  pointMeta: {
    ...typography.body,
    color: colors.inkMuted,
  },
  pointDuration: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
});
