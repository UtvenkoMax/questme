export type ReportTargetType = 'quest' | 'user' | 'proof';
export type ReportStatus = 'new' | 'triage' | 'resolved';
export type ProofReviewStatus = 'auto_review' | 'needs_author' | 'approved' | 'rejected' | 'disputed';
export type PaymentProviderId = 'monobank' | 'stripe' | 'applePay' | 'googlePay';
export type PaymentProviderStatus = 'connected' | 'sandbox' | 'requiresSetup';
export type KeychainRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ReportReason = {
  id: string;
  label: string;
  targetTypes: ReportTargetType[];
};

export type PaymentProvider = {
  id: PaymentProviderId;
  label: string;
  settlement: string;
  status: PaymentProviderStatus;
  subtitle: string;
};

export type DailyMissionSeed = {
  id: string;
  progress: number;
  rewardSpins: number;
  season: string;
  target: number;
  title: string;
};

export type Keychain = {
  description: string;
  id: string;
  label: string;
  rarity: KeychainRarity;
  symbol: string;
};

export type CreatorMetric = {
  label: string;
  value: string;
};

export const reportReasons: ReportReason[] = [
  { id: 'unsafe', label: 'Небезпечне завдання', targetTypes: ['quest', 'proof'] },
  { id: 'harassment', label: 'Образи або переслідування', targetTypes: ['quest', 'user', 'proof'] },
  { id: 'fraud', label: 'Шахрайство / фейковий доказ', targetTypes: ['quest', 'user', 'proof'] },
  { id: 'privacy', label: 'Приватні дані або зйомка без згоди', targetTypes: ['quest', 'user', 'proof'] },
  { id: 'spam', label: 'Спам або дубль', targetTypes: ['quest', 'user'] },
];

export const paymentProviders: PaymentProvider[] = [
  {
    id: 'monobank',
    label: 'Monobank',
    settlement: 'миттєво / web invoice',
    status: 'connected',
    subtitle: 'Поповнення, escrow hold, payout draft',
  },
  {
    id: 'stripe',
    label: 'Stripe',
    settlement: 'card / Apple Pay / Google Pay',
    status: 'sandbox',
    subtitle: 'PaymentIntent sandbox для міжнародних карток',
  },
  {
    id: 'applePay',
    label: 'Apple Pay',
    settlement: 'через Stripe merchant',
    status: 'requiresSetup',
    subtitle: 'Потребує merchant id та native payment sheet',
  },
  {
    id: 'googlePay',
    label: 'Google Pay',
    settlement: 'через Stripe gateway',
    status: 'requiresSetup',
    subtitle: 'Потребує gateway config та production profile',
  },
];

export const dailyMissionSeeds: DailyMissionSeed[] = [
  {
    id: 'daily-check-in',
    progress: 1,
    rewardSpins: 1,
    season: 'Neon July',
    target: 1,
    title: 'Підтвердити один check-in',
  },
  {
    id: 'daily-proof',
    progress: 0,
    rewardSpins: 1,
    season: 'Neon July',
    target: 1,
    title: 'Відправити фото або відеодоказ',
  },
  {
    id: 'daily-comment',
    progress: 2,
    rewardSpins: 1,
    season: 'Neon July',
    target: 3,
    title: 'Залишити 3 корисні коментарі',
  },
  {
    id: 'season-creator',
    progress: 4,
    rewardSpins: 2,
    season: 'Season event',
    target: 5,
    title: 'Опублікувати 5 квестів за сезон',
  },
];

export const keychains: Keychain[] = [
  {
    description: 'Перший брелок для щоденної серії.',
    id: 'qm-token',
    label: 'QM Token',
    rarity: 'common',
    symbol: 'QM',
  },
  {
    description: 'Для тих, хто часто закриває geo-чекіни.',
    id: 'geo-pin',
    label: 'Geo Pin',
    rarity: 'common',
    symbol: 'PIN',
  },
  {
    description: 'Випадає після proof-місій і ручних перевірок.',
    id: 'proof-cam',
    label: 'Proof Cam',
    rarity: 'rare',
    symbol: 'CAM',
  },
  {
    description: 'Сезонний брелок для авторів квестів.',
    id: 'creator-spark',
    label: 'Creator Spark',
    rarity: 'rare',
    symbol: 'SPK',
  },
  {
    description: 'Рідкісний брелок за довгі серії.',
    id: 'streak-flame',
    label: 'Streak Flame',
    rarity: 'epic',
    symbol: 'FIRE',
  },
  {
    description: 'Легендарний брелок сезону Neon July.',
    id: 'neon-crown',
    label: 'Neon Crown',
    rarity: 'legendary',
    symbol: 'KING',
  },
];

export const creatorMetrics: CreatorMetric[] = [
  { label: 'перегляди квестів', value: '48.2K' },
  { label: 'виконання', value: '1,284' },
  { label: 'витрати на винагороди', value: '32 400 грн' },
  { label: 'прибуток після комісій', value: '8 920 грн' },
];

export const creatorFunnel = [
  { label: 'відкрили деталі', value: '61%' },
  { label: 'взяли квест', value: '24%' },
  { label: 'відправили доказ', value: '16%' },
  { label: 'пройшли перевірку', value: '13%' },
];

export const seasonEvents = [
  {
    id: 'neon-july',
    progress: 68,
    reward: 'легендарний брелок Neon Crown',
    title: 'Neon July',
  },
  {
    id: 'city-sprint',
    progress: 35,
    reward: '2 roulette spins',
    title: 'City Sprint Weekend',
  },
];
