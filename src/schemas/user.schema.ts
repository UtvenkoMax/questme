import { z } from 'zod';

/** Auth provider */
export const authProviderSchema = z.enum(['backend', 'local']);
export type AuthProvider = z.infer<typeof authProviderSchema>;

/** User profile */
export const userProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  authProvider: authProviderSchema,
  avatarEmoji: z.string().optional(),
  avatarId: z.string().min(1).optional(),
  avatarKind: z.enum(['generated', 'emoji', 'custom']).default('generated'),
  avatarUri: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  xp: z.number().int().min(0).default(0),
  level: z.number().int().min(1).default(1),
  questsCompleted: z.number().int().min(0).default(0),
  badges: z.array(z.string()).default([]),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

/** Auth session */
export const authSessionSchema = z.object({
  token: z.string().optional(),
  signedInAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
});
export type AuthSession = z.infer<typeof authSessionSchema>;

/** Achievement */
export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.enum(['award', 'flag', 'map', 'users', 'zap', 'camera', 'star', 'trophy']),
  conditionType: z.enum(['quest_count', 'xp_threshold', 'distance', 'streak', 'photo_count']).optional(),
  conditionValue: z.number().int().optional(),
  unlocked: z.boolean().default(false),
  unlockedAt: z.string().datetime().optional(),
});
export type Achievement = z.infer<typeof achievementSchema>;

/** App preferences */
export const themePreferenceSchema = z.enum(['system', 'light', 'dark']);
export const languagePreferenceSchema = z.enum(['system', 'uk', 'en']);
export const interestIdSchema = z.enum(['city', 'history', 'nature', 'fitness', 'food', 'photo']);

export const appPreferencesSchema = z.object({
  interests: z.array(interestIdSchema).default(['city', 'history']),
  language: languagePreferenceSchema.default('system'),
  theme: themePreferenceSchema.default('system'),
  notificationsEnabled: z.boolean().default(true),
  hapticEnabled: z.boolean().default(true),
  offlineMode: z.boolean().default(false),
});
export type AppPreferences = z.infer<typeof appPreferencesSchema>;

/** Leaderboard entry */
export const leaderboardEntrySchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  xp: z.number().int(),
  level: z.number().int(),
  rank: z.number().int(),
  questsCompleted: z.number().int(),
});
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

/** Notification */
export const appNotificationSchema = z.object({
  id: z.string(),
  type: z.enum(['quest_nearby', 'quest_reminder', 'team_invite', 'achievement', 'system']),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
  read: z.boolean().default(false),
  createdAt: z.string().datetime(),
});
export type AppNotification = z.infer<typeof appNotificationSchema>;
