/**
 * Zod Schemas — Barrel Exports
 *
 * Runtime validation schemas for all data flowing through the app.
 * Replaces manual validation with type-safe, composable schemas.
 */

export {
  emailSchema,
  passwordSchema,
  nameSchema,
  pinSchema,
  recoveryCodeSchema,
  registrationSchema,
  loginSchema,
  profileUpdateSchema,
  getPasswordStrengthFromSchema,
} from './auth.schema';
export type { RegistrationForm, LoginForm, ProfileUpdateForm } from './auth.schema';

export {
  coordinateSchema,
  difficultySchema,
  questStepSchema,
  questRewardSchema,
  teamMemberSchema,
  personalQuestSchema,
  createQuestSchema,
  fullQuestSchema,
  questFilterSchema,
  questApiResponseSchema,
} from './quest.schema';
export type {
  Coordinate,
  Difficulty,
  QuestStep,
  QuestReward,
  PersonalQuest,
  CreateQuestForm,
  FullQuest,
  QuestFilter,
} from './quest.schema';

export {
  authProviderSchema,
  userProfileSchema,
  authSessionSchema,
  achievementSchema,
  themePreferenceSchema,
  languagePreferenceSchema,
  interestIdSchema,
  appPreferencesSchema,
  leaderboardEntrySchema,
  appNotificationSchema,
} from './user.schema';
export type {
  AuthProvider,
  UserProfile as UserProfileSchema,
  AuthSession as AuthSessionSchema,
  Achievement as AchievementSchema,
  AppPreferences as AppPreferencesSchema,
  LeaderboardEntry,
  AppNotification,
} from './user.schema';
