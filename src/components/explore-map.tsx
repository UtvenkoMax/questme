import { StyleSheet, Text, View } from 'react-native';

const MAP_POINTS = [
  { distance: '1.2 км', title: 'Таємниці Старого Міста' },
  { distance: '500 м', title: 'Парковий Квест' },
  { distance: '2.5 км', title: "Секретні Кав'ярні" },
];

export function ExploreMap() {
  return (
    <View style={styles.container}>
      <View style={styles.mapPreview}>
        <View style={[styles.marker, styles.markerPrimary]} />
        <View style={[styles.marker, styles.markerSecondary]} />
        <View style={[styles.marker, styles.markerTertiary]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>Карта</Text>
        <Text style={styles.title}>Мапа квестів доступна в мобільному застосунку</Text>
        <Text style={styles.subtitle}>
          Web-версія не завантажує native map-модуль, але маршрути нижче доступні для перегляду в списку.
        </Text>

        <View style={styles.pointList}>
          {MAP_POINTS.map((point) => (
            <View key={point.title} style={styles.pointRow}>
              <Text numberOfLines={1} style={styles.pointTitle}>{point.title}</Text>
              <Text style={styles.pointDistance}>{point.distance}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FF',
    flex: 1,
  },
  mapPreview: {
    backgroundColor: '#E9F6F2',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    height: 250,
    overflow: 'hidden',
  },
  marker: {
    borderColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 3,
    height: 24,
    position: 'absolute',
    width: 24,
  },
  markerPrimary: {
    backgroundColor: '#A855F7',
    left: '34%',
    top: '38%',
  },
  markerSecondary: {
    backgroundColor: '#10B981',
    left: '58%',
    top: '58%',
  },
  markerTertiary: {
    backgroundColor: '#F59E0B',
    left: '72%',
    top: '28%',
  },
  content: {
    gap: 12,
    padding: 20,
  },
  eyebrow: {
    color: '#2D6A5F',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 24,
  },
  pointList: {
    gap: 10,
    paddingTop: 10,
  },
  pointRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 16,
  },
  pointTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  pointDistance: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '800',
  },
});
