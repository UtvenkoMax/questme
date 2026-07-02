import { feedQuests, questOfDay } from '@/data/questme';

export type QuestFeedFilter = 'all' | 'nearby' | 'online' | 'highReward' | 'new' | 'saved';
export type MapQuestFilter = 'all' | 'nearby' | 'online' | 'highReward' | 'new';
export type QuestLocationMode = 'nearby' | 'online' | 'city';

export type QuestComment = {
  body: string;
  createdAt: string;
  id: string;
  likes: number;
  userId: string;
  userName: string;
};

export type QuestTeamMember = {
  id: string;
  name: string;
  role: string;
  status: 'ready' | 'walking' | 'arrived';
};

export type TeamChatMessage = {
  body: string;
  createdAt: string;
  id: string;
  sender: string;
};

export type PublicProfile = {
  badges: string[];
  bio: string;
  city: string;
  completed: number;
  created: number;
  earned: string;
  followers: number;
  following: boolean;
  id: string;
  name: string;
  rating: number;
  username: string;
};

export type QuestSocialSeed = {
  authorId: string;
  checkInLabel: string;
  city: string;
  comments: QuestComment[];
  distanceMeters: number | null;
  isNew: boolean;
  leaderboardScope: string;
  locationMode: QuestLocationMode;
  moderationLabel: string;
  nfcTag: string;
  qrCode: string;
  recommendations: string[];
  tags: string[];
  team: QuestTeamMember[];
  teamChat: TeamChatMessage[];
  verificationDescription: string;
  verificationTitle: string;
};

export const feedFilters: { id: QuestFeedFilter; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'nearby', label: 'Поруч' },
  { id: 'online', label: 'Онлайн' },
  { id: 'highReward', label: 'Висока нагорода' },
  { id: 'new', label: 'Нові' },
  { id: 'saved', label: 'Збережені' },
];

export const mapFilters: { id: MapQuestFilter; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'nearby', label: 'Поруч' },
  { id: 'online', label: 'Онлайн' },
  { id: 'highReward', label: 'Висока нагорода' },
  { id: 'new', label: 'Нові' },
];

export const publicProfiles: Record<string, PublicProfile> = {
  'pixel.maks': {
    badges: ['NPC voice', 'Top creator', '7 day streak'],
    bio: 'Створює короткі міські виклики, де головне - реакція людей і чесний доказ.',
    city: 'Київ',
    completed: 82,
    created: 36,
    earned: '14 850 грн',
    followers: 4280,
    following: true,
    id: 'pixel.maks',
    name: 'Макс Піксель',
    rating: 4.9,
    username: '@pixel.maks',
  },
  kava_ira: {
    badges: ['Words master', 'Safe creator'],
    bio: 'Любить квести з гумором, мемами й легкими онлайн-доказами.',
    city: 'Львів',
    completed: 55,
    created: 24,
    earned: '8 420 грн',
    followers: 2190,
    following: false,
    id: 'kava_ira',
    name: 'Іра Кава',
    rating: 4.7,
    username: '@kava_ira',
  },
  'dasha.glitch': {
    badges: ['Chaos safe', 'Team captain'],
    bio: 'Командні виклики, реакції друзів і трохи контрольованого хаосу.',
    city: 'Одеса',
    completed: 101,
    created: 41,
    earned: '17 100 грн',
    followers: 6130,
    following: false,
    id: 'dasha.glitch',
    name: 'Даша Глітч',
    rating: 4.8,
    username: '@dasha.glitch',
  },
  'retro.nazar': {
    badges: ['Meme maker', 'Photo proof'],
    bio: 'Меми, фото-квести й задачі, які легко пояснити друзям.',
    city: 'Київ',
    completed: 39,
    created: 18,
    earned: '5 960 грн',
    followers: 1280,
    following: false,
    id: 'retro.nazar',
    name: 'Назар Ретро',
    rating: 4.6,
    username: '@retro.nazar',
  },
  questme: {
    badges: ['Official', 'Daily quests'],
    bio: 'Офіційний акаунт QuestMe з щоденними місіями й сезонними подіями.',
    city: 'Україна',
    completed: 0,
    created: 128,
    earned: '0 грн',
    followers: 24100,
    following: true,
    id: 'questme',
    name: 'QuestMe',
    rating: 5,
    username: '@questme',
  },
};

const socialSeedList: QuestSocialSeed[] = [
  {
    authorId: 'pixel.maks',
    checkInLabel: 'Кавова точка на Подолі',
    city: 'Київ',
    comments: [
      {
        body: 'Виконував учора, головне не сміятися в перші 5 секунд.',
        createdAt: '2 хв тому',
        id: 'npc-c1',
        likes: 18,
        userId: 'mari_glitch',
        userName: 'Марі',
      },
      {
        body: 'Доказ краще знімати вертикально, автор швидше приймає.',
        createdAt: '11 хв тому',
        id: 'npc-c2',
        likes: 7,
        userId: 'nina.pixel',
        userName: 'Ніна',
      },
    ],
    distanceMeters: 1400,
    isNew: true,
    leaderboardScope: 'Київ / перформанс',
    locationMode: 'nearby',
    moderationLabel: 'Safe public behavior',
    nfcTag: 'QM-NFC-NPC-01',
    qrCode: 'QM-NPC-VOICE-75',
    recommendations: ['friend-compliment', 'quest-of-day'],
    tags: ['відео', 'перформанс', 'місто'],
    team: [
      { id: 'you', name: 'Ви', role: 'виконавець', status: 'ready' },
      { id: 'mari', name: 'Марі', role: 'камера', status: 'walking' },
      { id: 'oleh', name: 'Олег', role: 'свідок', status: 'arrived' },
    ],
    teamChat: [
      { body: 'Я біля входу, можу зняти перший дубль.', createdAt: '09:41', id: 'npc-m1', sender: 'Марі' },
      { body: 'Не забудьте показати чекін точки в кадрі.', createdAt: '09:43', id: 'npc-m2', sender: 'Олег' },
    ],
    verificationDescription: 'Потрібне коротке вертикальне відео з гео-чекіном біля кавової точки.',
    verificationTitle: 'Відео + geofence',
  },
  {
    authorId: 'kava_ira',
    checkInLabel: 'Онлайн виконання',
    city: 'Онлайн',
    comments: [
      {
        body: 'Слогани в коментарях теж приймаються, але фото має бути прикріплене.',
        createdAt: '7 хв тому',
        id: 'poster-c1',
        likes: 12,
        userId: 'retro.nazar',
        userName: 'Назар',
      },
    ],
    distanceMeters: null,
    isNew: true,
    leaderboardScope: 'Онлайн / слова',
    locationMode: 'online',
    moderationLabel: 'No personal data',
    nfcTag: 'QM-NFC-ONLINE-POSTER',
    qrCode: 'QM-POSTER-SLOGAN-30',
    recommendations: ['meme-frame', 'quest-of-day'],
    tags: ['фото', 'слова', 'онлайн'],
    team: [
      { id: 'you', name: 'Ви', role: 'автор ідеї', status: 'ready' },
      { id: 'ira', name: 'Іра', role: 'перевірка', status: 'arrived' },
    ],
    teamChat: [
      { body: 'Кидайте 2 варіанти, виберу найсмішніший.', createdAt: '14:02', id: 'poster-m1', sender: 'Іра' },
    ],
    verificationDescription: 'Фото або скрин з фінальним слоганом, без приватних даних третіх осіб.',
    verificationTitle: 'Фото-доказ',
  },
  {
    authorId: 'dasha.glitch',
    checkInLabel: 'Місце зустрічі з другом',
    city: 'Одеса',
    comments: [
      {
        body: 'Працює найкраще, якщо друг не читав опис квесту.',
        createdAt: '16 хв тому',
        id: 'friend-c1',
        likes: 28,
        userId: 'fit.quest',
        userName: 'Fit Quest',
      },
    ],
    distanceMeters: 3200,
    isNew: false,
    leaderboardScope: 'Одеса / chaos',
    locationMode: 'city',
    moderationLabel: 'Consent required',
    nfcTag: 'QM-NFC-FRIEND-100',
    qrCode: 'QM-FRIEND-REACTION-100',
    recommendations: ['npc-voice', 'quest-of-day'],
    tags: ['відео', 'команда', 'реакція'],
    team: [
      { id: 'you', name: 'Ви', role: 'виконавець', status: 'walking' },
      { id: 'dasha', name: 'Даша', role: 'автор', status: 'arrived' },
      { id: 'friend', name: 'Друг', role: 'реакція', status: 'ready' },
    ],
    teamChat: [
      { body: 'Памʼятайте: реакція друга має бути добровільною.', createdAt: '18:22', id: 'friend-m1', sender: 'Даша' },
    ],
    verificationDescription: 'Відео з реакцією друга. Потрібна згода учасника на публікацію.',
    verificationTitle: 'Відео + згода',
  },
  {
    authorId: 'retro.nazar',
    checkInLabel: 'Онлайн виконання',
    city: 'Онлайн',
    comments: [
      {
        body: 'Можна робити в будь-якому редакторі, головне - один фінальний кадр.',
        createdAt: '23 хв тому',
        id: 'meme-c1',
        likes: 9,
        userId: 'kava_ira',
        userName: 'Іра',
      },
    ],
    distanceMeters: null,
    isNew: false,
    leaderboardScope: 'Онлайн / меми',
    locationMode: 'online',
    moderationLabel: 'Copyright safe',
    nfcTag: 'QM-NFC-MEME-45',
    qrCode: 'QM-MEME-FRAME-45',
    recommendations: ['poster-slogan', 'npc-voice'],
    tags: ['мем', 'фото', 'онлайн'],
    team: [
      { id: 'you', name: 'Ви', role: 'дизайн', status: 'ready' },
      { id: 'nazar', name: 'Назар', role: 'автор', status: 'arrived' },
    ],
    teamChat: [
      { body: 'Формат 9:16 або квадрат, без водяних знаків.', createdAt: '12:11', id: 'meme-m1', sender: 'Назар' },
    ],
    verificationDescription: 'Завантажте фінальне фото або мем-кадр для ручної перевірки автором.',
    verificationTitle: 'Фото + ручна перевірка',
  },
  {
    authorId: 'questme',
    checkInLabel: 'Будь-яка міська локація',
    city: 'Україна',
    comments: [
      {
        body: 'Цей квест класно заходить на заході сонця.',
        createdAt: 'сьогодні',
        id: 'day-c1',
        likes: 44,
        userId: 'travel.ua',
        userName: 'Travel UA',
      },
    ],
    distanceMeters: 900,
    isNew: true,
    leaderboardScope: 'Україна / quest of day',
    locationMode: 'nearby',
    moderationLabel: 'Public space only',
    nfcTag: 'QM-NFC-DAILY',
    qrCode: 'QM-DAILY-SHADOW-250',
    recommendations: ['npc-voice', 'meme-frame'],
    tags: ['день', 'фото', 'місто'],
    team: [
      { id: 'you', name: 'Ви', role: 'виконавець', status: 'ready' },
      { id: 'questme', name: 'QuestMe', role: 'модератор', status: 'arrived' },
    ],
    teamChat: [
      { body: 'Фінальні фото потраплять у добірку дня.', createdAt: '10:00', id: 'day-m1', sender: 'QuestMe' },
    ],
    verificationDescription: 'Фото тіні з назвою, гео-чекіном і публічним місцем без приватних адрес.',
    verificationTitle: 'Фото + geofence',
  },
];

const directSeedEntries: [string, QuestSocialSeed][] = [
  ['npc-voice', socialSeedList[0]],
  ['poster-slogan', socialSeedList[1]],
  ['friend-compliment', socialSeedList[2]],
  ['meme-frame', socialSeedList[3]],
  ['quest-of-day', socialSeedList[4]],
];

export const questSocialSeeds = Object.fromEntries(directSeedEntries) as Record<string, QuestSocialSeed>;

export const leaderboardBoards = {
  city: [
    { earned: '1 920 грн', id: 'mari_glitch', name: 'mari_glitch', rank: 1 },
    { earned: '1 480 грн', id: 'pixel.maks', name: 'pixel.maks', rank: 2 },
    { earned: '1 170 грн', id: 'dasha.glitch', name: 'dasha.glitch', rank: 3 },
  ],
  weekly: [
    { earned: '34 виконання', id: 'questme', name: 'questme', rank: 1 },
    { earned: '29 виконань', id: 'kava_ira', name: 'kava_ira', rank: 2 },
    { earned: '21 виконання', id: 'retro.nazar', name: 'retro.nazar', rank: 3 },
  ],
};

export const questNotifications = [
  {
    id: 'deadline',
    text: 'Нагадати за 30 хвилин до дедлайну активного квесту.',
    title: 'Дедлайни',
  },
  {
    id: 'review',
    text: 'Повідомляти, коли автор прийняв або відхилив доказ.',
    title: 'Статус перевірки',
  },
  {
    id: 'new-nearby',
    text: 'Показувати нові квести поруч і нові онлайн-квести від підписок.',
    title: 'Нові квести',
  },
];

export const allFeedQuests = [...feedQuests, questOfDay];

export function createFallbackSocialSeed(questId: string, title = 'Квест'): QuestSocialSeed {
  return {
    authorId: 'questme',
    checkInLabel: title,
    city: 'Київ',
    comments: [],
    distanceMeters: null,
    isNew: false,
    leaderboardScope: 'QuestMe',
    locationMode: 'nearby',
    moderationLabel: 'Manual review',
    nfcTag: `QM-NFC-${questId.toUpperCase()}`,
    qrCode: `QM-${questId.toUpperCase()}`,
    recommendations: ['npc-voice', 'quest-of-day'],
    tags: ['квест'],
    team: [{ id: 'you', name: 'Ви', role: 'виконавець', status: 'ready' }],
    teamChat: [],
    verificationDescription: 'Автор перевіряє виконання вручну після завантаження доказу.',
    verificationTitle: 'Ручна перевірка',
  };
}

export function getQuestSocialSeed(questId: string, title?: string) {
  return questSocialSeeds[questId] ?? createFallbackSocialSeed(questId, title);
}

export function getQuestById(questId: string) {
  return allFeedQuests.find((quest) => quest.id === questId) ?? null;
}
