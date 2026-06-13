import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

const KYIV_REGION: Region = {
  latitude: 50.4501,
  latitudeDelta: 0.0922,
  longitude: 30.5234,
  longitudeDelta: 0.0421,
};

const QUEST_MARKERS = [
  {
    coordinate: { latitude: 50.4531, longitude: 30.5294 },
    description: 'Квест вулицями Подолу',
    pinColor: '#A855F7',
    title: 'Таємниці Старого Міста',
  },
  {
    coordinate: { latitude: 50.4442, longitude: 30.5211 },
    description: 'Легка прогулянка парком',
    pinColor: '#10B981',
    title: 'Парковий Квест',
  },
  {
    coordinate: { latitude: 50.4501, longitude: 30.5234 },
    description: 'Знайди приховані заклади міста',
    pinColor: '#F59E0B',
    title: "Секретні Кав'ярні",
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
        {QUEST_MARKERS.map((marker) => (
          <Marker
            coordinate={marker.coordinate}
            description={marker.description}
            key={marker.title}
            pinColor={marker.pinColor}
            title={marker.title}
          />
        ))}
      </MapView>

      <View style={styles.statusCard}>
        <Text style={styles.statusEyebrow}>Карта</Text>
        <Text style={styles.statusTitle}>{statusMessage}</Text>
        <Text style={styles.statusText}>Натисніть маркер, щоб побачити назву та підказку до маршруту.</Text>
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
    backgroundColor: '#E9F6F2',
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    left: 16,
    padding: 14,
    position: 'absolute',
    right: 16,
    top: 54,
  },
  statusEyebrow: {
    color: '#2D6A5F',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  statusText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 19,
  },
  errorContainer: {
    backgroundColor: 'rgba(179, 58, 58, 0.94)',
    borderRadius: 14,
    bottom: 22,
    left: 16,
    padding: 12,
    position: 'absolute',
    right: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
});
