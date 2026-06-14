import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { MOCK_QUESTS } from '@/components/home/quest.types';
import { colors, radii, spacing, typography } from '@/theme';

const KYIV_REGION: Region = {
  latitude: 50.4501,
  latitudeDelta: 0.0922,
  longitude: 30.5234,
  longitudeDelta: 0.0421,
};

const QUEST_MARKERS = [
  {
    coordinate: { latitude: 50.4531, longitude: 30.5294 },
    quest: MOCK_QUESTS[0],
  },
  {
    coordinate: { latitude: 50.4442, longitude: 30.5211 },
    quest: MOCK_QUESTS[1],
  },
  {
    coordinate: { latitude: 50.4501, longitude: 30.5234 },
    quest: MOCK_QUESTS[2],
  },
];

export function ExploreMap() {
  const [region, setRegion] = useState<Region>(KYIV_REGION);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Шукаємо вашу локацію...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;

        if (status !== 'granted') {
          setErrorMessage('Доступ до геолокації відхилено. Показуємо квести в центрі Києва.');
          setStatusMessage('3 квести доступні на мапі');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;

        setHasUserLocation(true);
        setRegion({
          latitude: currentLocation.coords.latitude,
          latitudeDelta: 0.06,
          longitude: currentLocation.coords.longitude,
          longitudeDelta: 0.035,
        });
        setStatusMessage('Квести поруч із вами');
      } catch {
        if (!isMounted) return;

        setErrorMessage('Не вдалося отримати геолокацію. Показуємо стандартну карту.');
        setStatusMessage('3 квести доступні на мапі');
      }
    }

    loadLocation();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        onRegionChangeComplete={setRegion}
        provider={PROVIDER_DEFAULT}
        region={region}
        showsMyLocationButton={hasUserLocation}
        showsUserLocation={hasUserLocation}
        style={styles.map}>
        {QUEST_MARKERS.map(({ coordinate, quest }) => (
          <Marker
            coordinate={coordinate}
            description={quest.description}
            key={quest.id}
            pinColor={quest.accentColor}
            title={quest.title}
          />
        ))}
      </MapView>

      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <Feather color={colors.primary} name="map-pin" size={18} />
        </View>
        <View style={styles.statusCopy}>
          <Text style={styles.statusEyebrow}>Карта</Text>
          <Text style={styles.statusTitle}>{statusMessage}</Text>
          <Text style={styles.statusText}>Натисніть маркер, щоб побачити назву та підказку до маршруту.</Text>
        </View>
      </View>

      {errorMessage ? (
        <View accessibilityLiveRegion="polite" style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    left: spacing.lg,
    padding: spacing.md,
    position: 'absolute',
    right: spacing.lg,
    top: 54,
  },
  statusIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  statusCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  statusEyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },
  statusTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  statusText: {
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  errorContainer: {
    backgroundColor: colors.danger,
    borderRadius: radii.md,
    bottom: spacing.xl,
    left: spacing.lg,
    padding: spacing.md,
    position: 'absolute',
    right: spacing.lg,
  },
  errorText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
});
