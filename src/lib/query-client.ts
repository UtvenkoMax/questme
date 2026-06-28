import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client configured for mobile:
 * - Conservative stale time (30s) to reduce network calls
 * - Retry with exponential backoff
 * - GC after 5 minutes
 * - No refetch on window focus for mobile (battery saving)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

/** Query keys factory — ensures consistent, type-safe cache keys */
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
    pin: () => [...queryKeys.auth.all, 'pin'] as const,
  },

  // Quests
  quests: {
    all: ['quests'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.quests.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.quests.all, 'detail', id] as const,
    nearby: (lat: number, lng: number, radius: number) =>
      [...queryKeys.quests.all, 'nearby', { lat, lng, radius }] as const,
    progress: () => [...queryKeys.quests.all, 'progress'] as const,
    recommended: () => [...queryKeys.quests.all, 'recommended'] as const,
  },

  // Achievements
  achievements: {
    all: ['achievements'] as const,
    list: () => [...queryKeys.achievements.all, 'list'] as const,
  },

  // Map
  map: {
    all: ['map'] as const,
    markers: (region: { lat: number; lng: number; delta: number }) =>
      [...queryKeys.map.all, 'markers', region] as const,
    route: (questId: string) => [...queryKeys.map.all, 'route', questId] as const,
  },

  // Leaderboard
  leaderboard: {
    all: ['leaderboard'] as const,
    global: (page: number) => [...queryKeys.leaderboard.all, 'global', page] as const,
    friends: () => [...queryKeys.leaderboard.all, 'friends'] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
  },
} as const;
