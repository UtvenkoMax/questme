import { z } from 'zod';

/** Coordinate */
export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
export type Coordinate = z.infer<typeof coordinateSchema>;

/** Quest difficulty */
export const difficultySchema = z.enum(['Легко', 'Середньо', 'Складно']);
export type Difficulty = z.infer<typeof difficultySchema>;

/** Quest step */
export const questStepSchema = z.object({
  title: z.string().min(1, 'Назва кроку обовʼязкова.'),
  description: z.string().default(''),
  checkpoint: coordinateSchema.optional(),
  verificationType: z.enum(['geofence', 'photo', 'qr', 'manual']).default('geofence'),
});
export type QuestStep = z.infer<typeof questStepSchema>;

/** Quest reward */
export const questRewardSchema = z.object({
  xp: z.number().int().positive('XP має бути позитивним.'),
  badge: z.string().min(1).optional(),
});
export type QuestReward = z.infer<typeof questRewardSchema>;

/** Team member */
export const teamMemberSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['ready', 'walking', 'arrived']),
});

/** Personal quest (local, simplified) */
export const personalQuestSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, 'Назва квесту обовʼязкова.'),
  description: z.string().default(''),
  points: z.number().int().min(0).default(50),
  completed: z.boolean().default(false),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});
export type PersonalQuest = z.infer<typeof personalQuestSchema>;

/** Create personal quest form */
export const createQuestSchema = z.object({
  title: z.string().trim().min(2, 'Мінімум 2 символи для назви.').max(100, 'Максимум 100 символів.'),
  description: z
    .string()
    .trim()
    .max(500, 'Максимум 500 символів.')
    .default(''),
  points: z.number().int().min(10).max(500).default(50),
  difficulty: difficultySchema.optional(),
});
export type CreateQuestForm = z.infer<typeof createQuestSchema>;

/** Full quest (map quest with route) */
export const fullQuestSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string(),
  difficulty: difficultySchema,
  distance: z.string(),
  duration: z.string(),
  location: z.string(),
  coordinate: coordinateSchema,
  route: z.array(coordinateSchema).min(2),
  steps: z.array(questStepSchema).min(1),
  reward: questRewardSchema,
  accentColor: z.string(),
  geofenceRadiusMeters: z.number().int().positive().default(100),
  isNew: z.boolean().default(false),
  isTeamQuest: z.boolean().default(false),
  participants: z.number().int().min(0).default(0),
  rating: z.number().min(0).max(5).default(0),
  recommendedGear: z.array(z.string()).default([]),
  team: z.array(teamMemberSchema).default([]),
  image: z.unknown().optional(),
});
export type FullQuest = z.infer<typeof fullQuestSchema>;

/** Quest filter params */
export const questFilterSchema = z.object({
  category: z.string().optional(),
  difficulty: difficultySchema.optional(),
  maxDistance: z.number().positive().optional(),
  isTeamQuest: z.boolean().optional(),
  sortBy: z.enum(['rating', 'distance', 'newest', 'participants']).default('rating'),
});
export type QuestFilter = z.infer<typeof questFilterSchema>;

/** API response wrapper */
export const questApiResponseSchema = z.object({
  data: z.array(fullQuestSchema),
  total: z.number().int(),
  page: z.number().int(),
  hasMore: z.boolean(),
});
