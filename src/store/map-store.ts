import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapRegion extends Coordinate {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface NearbyQuest {
  id: string;
  title: string;
  coordinate: Coordinate;
  distance: number; // meters
  category: string;
}

type MapLayer = 'all' | 'nearby' | 'active' | 'completed';

interface MapState {
  userLocation: Coordinate | null;
  region: MapRegion;
  selectedMarkerId: string | null;
  nearbyQuests: NearbyQuest[];
  activeLayer: MapLayer;
  isTracking: boolean;
  trackingRoute: Coordinate[];
  geofenceRadius: number;
  isInsideGeofence: boolean;
  lastLocationUpdate: string | null;
  locationPermissionGranted: boolean;
  clusteringEnabled: boolean;
  mapReady: boolean;
}

interface MapActions {
  setUserLocation: (location: Coordinate) => void;
  setRegion: (region: MapRegion) => void;
  setSelectedMarkerId: (id: string | null) => void;
  setNearbyQuests: (quests: NearbyQuest[]) => void;
  setActiveLayer: (layer: MapLayer) => void;
  startTracking: () => void;
  stopTracking: () => void;
  addTrackingPoint: (point: Coordinate) => void;
  clearTrackingRoute: () => void;
  setGeofenceRadius: (radius: number) => void;
  setInsideGeofence: (inside: boolean) => void;
  setLocationPermission: (granted: boolean) => void;
  setClusteringEnabled: (enabled: boolean) => void;
  setMapReady: (ready: boolean) => void;
  centerOnUser: () => void;
}

export type MapStore = MapState & MapActions;

// Default to Kyiv center
const DEFAULT_REGION: MapRegion = {
  latitude: 50.4501,
  longitude: 30.5234,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export const useMapStore = create<MapStore>()(
  immer((set, get) => ({
    userLocation: null,
    region: DEFAULT_REGION,
    selectedMarkerId: null,
    nearbyQuests: [],
    activeLayer: 'all',
    isTracking: false,
    trackingRoute: [],
    geofenceRadius: 100,
    isInsideGeofence: false,
    lastLocationUpdate: null,
    locationPermissionGranted: false,
    clusteringEnabled: true,
    mapReady: false,

    setUserLocation: (location) =>
      set((state) => {
        state.userLocation = location;
        state.lastLocationUpdate = new Date().toISOString();
      }),

    setRegion: (region) =>
      set((state) => {
        state.region = region;
      }),

    setSelectedMarkerId: (id) =>
      set((state) => {
        state.selectedMarkerId = id;
      }),

    setNearbyQuests: (quests) =>
      set((state) => {
        state.nearbyQuests = quests;
      }),

    setActiveLayer: (layer) =>
      set((state) => {
        state.activeLayer = layer;
      }),

    startTracking: () =>
      set((state) => {
        state.isTracking = true;
        state.trackingRoute = [];
      }),

    stopTracking: () =>
      set((state) => {
        state.isTracking = false;
      }),

    addTrackingPoint: (point) =>
      set((state) => {
        state.trackingRoute.push(point);
      }),

    clearTrackingRoute: () =>
      set((state) => {
        state.trackingRoute = [];
      }),

    setGeofenceRadius: (radius) =>
      set((state) => {
        state.geofenceRadius = radius;
      }),

    setInsideGeofence: (inside) =>
      set((state) => {
        state.isInsideGeofence = inside;
      }),

    setLocationPermission: (granted) =>
      set((state) => {
        state.locationPermissionGranted = granted;
      }),

    setClusteringEnabled: (enabled) =>
      set((state) => {
        state.clusteringEnabled = enabled;
      }),

    setMapReady: (ready) =>
      set((state) => {
        state.mapReady = ready;
      }),

    centerOnUser: () =>
      set((state) => {
        if (state.userLocation) {
          state.region = {
            ...state.userLocation,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          };
        }
      }),
  }))
);

/** Geo utility — haversine distance in meters */
export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const aLat = (a.latitude * Math.PI) / 180;
  const bLat = (b.latitude * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(aLat) * Math.cos(bLat) * sinDLng * sinDLng;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Check if point is inside geofence */
export function isInsideGeofence(point: Coordinate, center: Coordinate, radiusMeters: number): boolean {
  return haversineDistance(point, center) <= radiusMeters;
}

export const selectUserLocation = (state: MapStore) => state.userLocation;
export const selectNearbyQuests = (state: MapStore) => state.nearbyQuests;
export const selectIsTracking = (state: MapStore) => state.isTracking;
