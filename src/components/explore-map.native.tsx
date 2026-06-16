import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { MOCK_QUESTS } from '@/components/home/quest.types';
import { colors } from '@/theme';
import { styles } from './explore-map.native.styles';

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
            pinColor={colors.primary}
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
