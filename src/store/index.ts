/**
 * Zustand Store — Barrel Exports
 *
 * All store slices are split by domain for optimized re-renders:
 * - authStore: Authentication, profile, session
 * - questStore: Personal quests, gamification, filters
 * - uiStore: Modals, toasts, UI state
 * - mapStore: Geolocation, tracking, map layers
 */

export { useAuthStore, selectIsAuthenticated, selectProfile, selectAuthStatus } from './auth-store';
export type { AuthStore } from './auth-store';

export { useQuestStore, selectFilteredQuests, selectQuestById, selectCompletionStats } from './quest-store';
export type { QuestStore } from './quest-store';

export { useUIStore, selectActiveModal, selectToasts } from './ui-store';
export type { UIStore } from './ui-store';

export {
  useMapStore,
  haversineDistance,
  isInsideGeofence,
  selectUserLocation,
  selectNearbyQuests,
  selectIsTracking,
} from './map-store';
export type { MapStore } from './map-store';

export { useWalletStore, selectBalance, selectFormattedBalance, selectTransactions } from './wallet-store';
export type { WalletStore } from './wallet-store';
