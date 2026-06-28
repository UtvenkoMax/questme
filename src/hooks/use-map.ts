import { useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';

import { useMapStore, haversineDistance } from '@/store/map-store';
import { MOCK_QUESTS } from '@/components/home/quest.types';

const NEARBY_RADIUS_METERS = 5000;
const LOCATION_UPDATE_INTERVAL_MS = 10000;

/** Request location permission and start watching */
export function useLocationTracking() {
  const setUserLocation = useMapStore((s) => s.setUserLocation);
  const setLocationPermission = useMapStore((s) => s.setLocationPermission);
  const addTrackingPoint = useMapStore((s) => s.addTrackingPoint);
  const isTracking = useMapStore((s) => s.isTracking);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationPermission(granted);

      if (granted) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }

      return granted;
    } catch {
      setLocationPermission(false);
      return false;
    }
  }, [setUserLocation, setLocationPermission]);

  useEffect(() => {
    if (!isTracking) return;

    let subscription: Location.LocationSubscription | null = null;

    async function startWatch() {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: LOCATION_UPDATE_INTERVAL_MS,
        },
        (location) => {
          const point = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(point);
          addTrackingPoint(point);
        }
      );
      watchRef.current = subscription;
    }

    startWatch();

    return () => {
      subscription?.remove();
      watchRef.current = null;
    };
  }, [isTracking, setUserLocation, addTrackingPoint]);

  return { requestPermission };
}

/** Calculate nearby quests from mock data based on user location */
export function useNearbyQuests() {
  const userLocation = useMapStore((s) => s.userLocation);
  const setNearbyQuests = useMapStore((s) => s.setNearbyQuests);

  useEffect(() => {
    if (!userLocation) return;

    const nearby = MOCK_QUESTS
      .map((quest) => ({
        id: quest.id,
        title: quest.title,
        coordinate: quest.coordinate,
        distance: haversineDistance(userLocation, quest.coordinate),
        category: quest.category,
      }))
      .filter((q) => q.distance <= NEARBY_RADIUS_METERS)
      .sort((a, b) => a.distance - b.distance);

    setNearbyQuests(nearby);
  }, [userLocation, setNearbyQuests]);
}

/** Format distance for display */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} м`;
  return `${(meters / 1000).toFixed(1)} км`;
}
