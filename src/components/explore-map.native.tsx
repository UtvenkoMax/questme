import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { MOCK_QUESTS, type Quest, type QuestCoordinate } from '@/components/home/quest.types';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/layout';
import { getJsonItem, setJsonItem } from '@/services/app-storage';
import { colors } from '@/theme';
import { styles } from './explore-map.native.styles';

const MAP_CACHE_KEY = 'questme.map.nearbyCache';
const NEARBY_RADIUS_METERS = 5000;

const KYIV_REGION: Region = {
  latitude: 50.4501,
  latitudeDelta: 0.0922,
  longitude: 30.5234,
  longitudeDelta: 0.0421,
};

type QuestMarker = {
  distanceMeters: number | null;
  quest: Quest;
};

type CachedMapState = {
  questIds: { distanceMeters: number; id: string }[];
  savedAt: string;
  userCoordinate: QuestCoordinate;
};

function getDistanceMeters(from: QuestCoordinate, to: QuestCoordinate) {
  const earthRadiusMeters = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function formatDistance(distanceMeters: number | null) {
  if (distanceMeters == null) return 'відстань невідома';
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)} м`;
  return `${(distanceMeters / 1000).toFixed(1)} км`;
}

function createQuestMarkers(userCoordinate: QuestCoordinate) {
  return [...MOCK_QUESTS]
    .map((quest) => ({
      distanceMeters: getDistanceMeters(userCoordinate, quest.coordinate),
      quest,
    }))
    .sort((left, right) => left.distanceMeters - right.distanceMeters);
}

function createMarkersFromCache(cache: CachedMapState): QuestMarker[] {
  const markers: QuestMarker[] = [];

  cache.questIds.forEach(({ distanceMeters, id }) => {
    const quest = MOCK_QUESTS.find((item) => item.id === id);
    if (quest) markers.push({ distanceMeters, quest });
  });

  return markers;
}

export function ExploreMap() {
  const { width } = useWindowDimensions();
  const successProgress = useRef(new Animated.Value(0)).current;
  const [region, setRegion] = useState<Region>(KYIV_REGION);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [userCoordinate, setUserCoordinate] = useState<QuestCoordinate | null>(null);
  const [questMarkers, setQuestMarkers] = useState<QuestMarker[]>(
    MOCK_QUESTS.map((quest) => ({ distanceMeters: null, quest }))
  );
  const [selectedQuestId, setSelectedQuestId] = useState(MOCK_QUESTS[0]?.id ?? '');
  const [statusMessage, setStatusMessage] = useState('Шукаємо вашу локацію...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedMarker = useMemo(
    () => questMarkers.find((marker) => marker.quest.id === selectedQuestId) ?? questMarkers[0],
    [questMarkers, selectedQuestId]
  );
  const geofenceDistance = userCoordinate && selectedMarker ? getDistanceMeters(userCoordinate, selectedMarker.quest.coordinate) : null;
  const isInsideGeofence =
    selectedMarker && geofenceDistance != null && geofenceDistance <= selectedMarker.quest.geofenceRadiusMeters;
  const selectedIndex = Math.max(
    questMarkers.findIndex((marker) => marker.quest.id === selectedMarker?.quest.id),
    0
  );

  useEffect(() => {
    Animated.timing(successProgress, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
      toValue: isInsideGeofence ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isInsideGeofence, successProgress]);

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      const cachedState = await getJsonItem<CachedMapState>(MAP_CACHE_KEY);
      if (isMounted && cachedState) {
        const cachedMarkers = createMarkersFromCache(cachedState);
        if (cachedMarkers.length) {
          setQuestMarkers(cachedMarkers);
          setSelectedQuestId(cachedMarkers[0].quest.id);
          setStatusMessage('Показуємо кешовані квести поруч');
        }
      }

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
        const currentCoordinate = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        const sortedMarkers = createQuestMarkers(currentCoordinate);
        const nearbyMarkers = sortedMarkers.filter((marker) => marker.distanceMeters <= NEARBY_RADIUS_METERS);
        const markersToShow = nearbyMarkers.length ? nearbyMarkers : sortedMarkers;

        setHasUserLocation(true);
        setUserCoordinate(currentCoordinate);
        setQuestMarkers(markersToShow);
        setSelectedQuestId(markersToShow[0]?.quest.id ?? MOCK_QUESTS[0]?.id ?? '');
        setRegion({
          latitude: nearbyMarkers.length ? currentCoordinate.latitude : markersToShow[0]?.quest.coordinate.latitude ?? KYIV_REGION.latitude,
          latitudeDelta: nearbyMarkers.length ? 0.06 : 0.0922,
          longitude: nearbyMarkers.length ? currentCoordinate.longitude : markersToShow[0]?.quest.coordinate.longitude ?? KYIV_REGION.longitude,
          longitudeDelta: 0.035,
        });
        setStatusMessage(
          nearbyMarkers.length
            ? 'Квести поруч із вами'
            : 'Поруч немає квестів у радіусі 5 км'
        );
        setErrorMessage(
          nearbyMarkers.length
            ? null
            : 'Поруч із вашою реальною геолокацією квестів немає. Показуємо найближчі доступні маршрути та кешуємо їх для offline-перегляду.'
        );
        await setJsonItem(MAP_CACHE_KEY, {
          questIds: sortedMarkers.map((marker) => ({
            distanceMeters: marker.distanceMeters ?? 0,
            id: marker.quest.id,
          })),
          savedAt: new Date().toISOString(),
          userCoordinate: currentCoordinate,
        } satisfies CachedMapState);
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

  const selectSheetQuest = (index: number) => {
    const marker = questMarkers[index];
    if (!marker) return;

    setSelectedQuestId(marker.quest.id);
    Haptics.selectionAsync().catch(() => {});
  };

  const startSelectedQuest = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <MapView
        onRegionChangeComplete={setRegion}
        provider={PROVIDER_DEFAULT}
        region={region}
        showsMyLocationButton={hasUserLocation}
        showsUserLocation={hasUserLocation}
        style={styles.map}>
        {questMarkers.map(({ distanceMeters, quest }) => (
          <Marker
            coordinate={quest.coordinate}
            description={`${quest.description} · ${formatDistance(distanceMeters)}`}
            key={quest.id}
            onPress={() => setSelectedQuestId(quest.id)}
            pinColor={quest.id === selectedQuestId ? colors.primary : colors.inkSubtle}
            title={quest.title}
          />
        ))}
        {selectedMarker ? (
          <>
            <Polyline
              coordinates={selectedMarker.quest.route}
              strokeColor={selectedMarker.quest.accentColor}
              strokeWidth={4}
            />
            <Circle
              center={selectedMarker.quest.coordinate}
              fillColor={`${selectedMarker.quest.accentColor}24`}
              radius={selectedMarker.quest.geofenceRadiusMeters}
              strokeColor={selectedMarker.quest.accentColor}
              strokeWidth={2}
            />
          </>
        ) : null}
      </MapView>

      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <Feather color={colors.primary} name="map-pin" size={18} />
        </View>
        <View style={styles.statusCopy}>
          <Text style={styles.statusEyebrow}>Карта</Text>
          <Text style={styles.statusTitle}>{statusMessage}</Text>
          <Text style={styles.statusText}>
            {selectedMarker
              ? `${selectedMarker.quest.title}: ${formatDistance(selectedMarker.distanceMeters)}. Маршрут має ${selectedMarker.quest.route.length} точки.`
              : 'Квестів для показу поки немає.'}
          </Text>
          {selectedMarker ? (
            <Text style={isInsideGeofence ? styles.geofenceSuccess : styles.statusText}>
              {isInsideGeofence
                ? 'Геофенс підтверджено: ви дійшли до точки квесту.'
                : `Геофенс активний у радіусі ${selectedMarker.quest.geofenceRadiusMeters} м.`}
            </Text>
          ) : null}
        </View>
      </View>

      <BlurView intensity={70} tint="light" style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <ScrollView
          horizontal
          onMomentumScrollEnd={(event) => {
            const cardWidth = Math.max(width - 56, 280);
            selectSheetQuest(Math.round(event.nativeEvent.contentOffset.x / cardWidth));
          }}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={Math.max(width - 56, 280)}
          decelerationRate="fast">
          {questMarkers.map(({ distanceMeters, quest }, index) => {
            const selected = index === selectedIndex;
            const routePercent = selected ? 33 : 0;

            return (
              <View key={quest.id} style={[styles.sheetCard, { width: Math.max(width - 56, 280) }, selected && styles.sheetCardSelected]}>
                <View style={styles.sheetHeader}>
                  <View style={styles.sheetIcon}>
                    <Feather color={colors.primary} name="map-pin" size={18} />
                  </View>
                  <View style={styles.sheetCopy}>
                    <Text numberOfLines={1} style={styles.sheetTitle}>{quest.title}</Text>
                    <Text numberOfLines={1} style={styles.sheetMeta}>
                      {formatDistance(distanceMeters)} · {quest.duration} · {quest.route.length} точки
                    </Text>
                  </View>
                </View>
                <ProgressBar percent={routePercent} />
                <View style={styles.sheetActions}>
                  <Button fullWidth={false} icon="play" onPress={startSelectedQuest} size="sm" title="Почати" />
                  <Button fullWidth={false} icon="info" onPress={() => setSelectedQuestId(quest.id)} size="sm" title="На мапі" variant="secondary" />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </BlurView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.geofenceToast,
          {
            opacity: successProgress,
            transform: [
              {
                translateY: successProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          },
        ]}>
        <Feather color={colors.white} name="check-circle" size={18} />
        <Text style={styles.geofenceToastText}>Точку підтверджено</Text>
      </Animated.View>

      {errorMessage ? (
        <View accessibilityLiveRegion="polite" style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );
}
