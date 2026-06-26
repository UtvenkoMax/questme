export type QuestCategory =
  | "performance"
  | "creative"
  | "photo"
  | "words"
  | "chaos";
export type MediaProofType = "Відео" | "Фото";

export type FeedQuest = {
  id: string;
  author: string;
  avatar: string;
  category: QuestCategory;
  categoryLabel: string;
  deadline: string;
  distance: string;
  proofType: MediaProofType;
  reactions: {
    comments: number;
    likes: number;
    mood: string[];
  };
  reward: number;
  risk: "safe" | "spicy" | "wild";
  timeAgo: string;
  title: string;
};

export type QuestShort = {
  id: string;
  author: string;
  description: string;
  likes: string;
  comments: string;
  reward: number;
  questTitle: string;
  videoUrl: string;
};

export type TrackerQuest = {
  id: string;
  title: string;
  reward: number;
  deadline: string;
  proofType: MediaProofType;
  progress: number;
  status: "active" | "review" | "done";
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export const categories = [
  { id: "all", label: "Усі", icon: "✦" },
  { id: "performance", label: "Перформанс", icon: "🎭" },
  { id: "creative", label: "Творчість", icon: "🎨" },
  { id: "photo", label: "Фото", icon: "📸" },
  { id: "words", label: "Слова", icon: "🗣" },
  { id: "chaos", label: "Хаос", icon: "🤪" },
] as const;

export const feedQuests: FeedQuest[] = [
  {
    id: "npc-voice",
    author: "pixel.maks",
    avatar: "PM",
    category: "performance",
    categoryLabel: "Перформанс",
    deadline: "24 год",
    distance: "1.4 км",
    proofType: "Відео",
    reactions: { comments: 18, likes: 234, mood: ["🤣", "🔥", "😱"] },
    reward: 75,
    risk: "spicy",
    timeAgo: "2 хв",
    title: "Зніми відео, як 30 секунд говориш голосом NPC у черзі за кавою.",
  },
  {
    id: "poster-slogan",
    author: "kava_ira",
    avatar: "KI",
    category: "words",
    categoryLabel: "Слова",
    deadline: "8 год",
    distance: "онлайн",
    proofType: "Фото",
    reactions: { comments: 42, likes: 531, mood: ["💀", "🤣", "🔥"] },
    reward: 30,
    risk: "safe",
    timeAgo: "7 хв",
    title: "Придумай найсмішніший слоган для фото мого кота в окулярах.",
  },
  {
    id: "friend-compliment",
    author: "dasha.glitch",
    avatar: "DG",
    category: "chaos",
    categoryLabel: "Хаос",
    deadline: "36 год",
    distance: "3.2 км",
    proofType: "Відео",
    reactions: { comments: 31, likes: 408, mood: ["😱", "🤣", "💀"] },
    reward: 100,
    risk: "wild",
    timeAgo: "16 хв",
    title:
      'Зніми реакцію друга на комплімент: "ти виглядаєш як Wi-Fi з повним сигналом".',
  },
  {
    id: "meme-frame",
    author: "retro.nazar",
    avatar: "RN",
    category: "creative",
    categoryLabel: "Творчість",
    deadline: "12 год",
    distance: "онлайн",
    proofType: "Фото",
    reactions: { comments: 11, likes: 166, mood: ["🔥", "🤣"] },
    reward: 45,
    risk: "safe",
    timeAgo: "23 хв",
    title: "Зроби мем з кадру, де я дивлюсь на рахунок після доставки.",
  },
];

export const questOfDay: FeedQuest = {
  id: "quest-of-day",
  author: "questme",
  avatar: "",
  category: "photo",
  categoryLabel: "Фото",
  deadline: "05:43:12",
  distance: "будь-де",
  proofType: "Фото",
  reactions: { comments: 89, likes: 1204, mood: ["🔥", "😱", "🤣"] },
  reward: 250,
  risk: "spicy",
  timeAgo: "сьогодні",
  title:
    "Рандомний квест дня: сфоткай найепічнішу тінь у місті та дай їй назву.",
};

export const shorts: QuestShort[] = [
  {
    id: "user-short-1",
    author: "@quest.master",
    comments: "342",
    description:
      "Коли квест зайшов надто далеко, а ти вже не можеш зупинитись.",
    likes: "24.8K",
    questTitle: "Квест без меж",
    reward: 150,
    videoUrl: "https://www.youtube.com/shorts/t4JE17_HwhQ",
  },
  {
    id: "challenge-run",
    author: "@pixel.maks",
    comments: "89",
    description: "Швидкий челендж на вулиці — хто встигне перший?",
    likes: "15.2K",
    questTitle: "Вуличний челендж",
    reward: 75,
    videoUrl: "https://www.youtube.com/shorts/pVRefGmQDJM",
  },
  {
    id: "dance-move",
    author: "@dasha.glitch",
    comments: "215",
    description: "Танцювальний квест, який зламав інтернет.",
    likes: "31.6K",
    questTitle: "Танцювальний батл",
    reward: 100,
    videoUrl: "https://www.youtube.com/shorts/gQlMMD0e5Q0",
  },
  {
    id: "food-quest",
    author: "@kava_ira",
    comments: "176",
    description: "Готуєш страву за 60 секунд — чи встигнеш?",
    likes: "18.9K",
    questTitle: "Кулінарний спринт",
    reward: 80,
    videoUrl: "https://www.youtube.com/shorts/ENrzD9HAZK4",
  },
  {
    id: "pet-reaction",
    author: "@retro.nazar",
    comments: "423",
    description: "Реакція кота, коли ти повертаєшся з роботи о 3 ночі.",
    likes: "42.1K",
    questTitle: "Реакція улюбленця",
    reward: 60,
    videoUrl: "https://www.youtube.com/shorts/SXHMnicI6Pg",
  },
  {
    id: "magic-trick",
    author: "@mari_glitch",
    comments: "198",
    description: "Магія на вулиці — перехожі в шоці.",
    likes: "27.3K",
    questTitle: "Вулична магія",
    reward: 120,
    videoUrl: "https://www.youtube.com/shorts/bG6hPJkLDcQ",
  },
  {
    id: "extreme-sport",
    author: "@sport.chaos",
    comments: "312",
    description: "Екстремальний трюк, який ніхто не очікував.",
    likes: "56.4K",
    questTitle: "Екстрим-квест",
    reward: 200,
    videoUrl: "https://www.youtube.com/shorts/qRGuf81DAXg",
  },
  {
    id: "art-speed",
    author: "@nina.pixel",
    comments: "67",
    description: "Малюнок за 30 секунд — результат вражає.",
    likes: "11.8K",
    questTitle: "Арт за секунди",
    reward: 90,
    videoUrl: "https://www.youtube.com/shorts/jfKfPfyJRdk",
  },
  {
    id: "prank-friend",
    author: "@oleh.mem",
    comments: "534",
    description: "Пранк над другом пішов не за планом.",
    likes: "38.7K",
    questTitle: "Пранк-квест",
    reward: 85,
    videoUrl: "https://www.youtube.com/shorts/2jqJ0bYXkWo",
  },
  {
    id: "travel-spot",
    author: "@travel.ua",
    comments: "145",
    description: "Найгарніше місце, яке ти ніколи не бачив.",
    likes: "22.5K",
    questTitle: "Тревел-відкриття",
    reward: 110,
    videoUrl: "https://www.youtube.com/shorts/Y8mRnMBpUaw",
  },
  {
    id: "fitness-dare",
    author: "@fit.quest",
    comments: "92",
    description: "Фітнес-челендж на 100 повторів.",
    likes: "14.3K",
    questTitle: "Фітнес-виклик",
    reward: 70,
    videoUrl: "https://www.youtube.com/shorts/Pt5_GSKIWQM",
  },
  {
    id: "comedy-skit",
    author: "@laugh.daily",
    comments: "678",
    description: "Скетч, від якого неможливо не сміятися.",
    likes: "67.2K",
    questTitle: "Комедійний квест",
    reward: 55,
    videoUrl: "https://www.youtube.com/shorts/f2iBsXMwNMQ",
  },
  {
    id: "science-exp",
    author: "@science.wow",
    comments: "234",
    description: "Науковий експеримент на кухні — WOW ефект!",
    likes: "19.6K",
    questTitle: "Наука за 30 сек",
    reward: 95,
    videoUrl: "https://www.youtube.com/shorts/rR4gFEcOFEg",
  },
  {
    id: "music-cover",
    author: "@sound.quest",
    comments: "156",
    description: "Кавер на хіт, записаний на вулиці з рандомними людьми.",
    likes: "25.1K",
    questTitle: "Музичний флешмоб",
    reward: 130,
    videoUrl: "https://www.youtube.com/shorts/6JYIGclVQdw",
  },
  {
    id: "life-hack",
    author: "@hack.master",
    comments: "287",
    description: "Лайфхак, який зекономить тобі 2 години на день.",
    likes: "33.9K",
    questTitle: "Лайфхак дня",
    reward: 65,
    videoUrl: "https://www.youtube.com/shorts/oHg5SJYRHA0",
  },
];

export const trackerColumns = [
  {
    id: "active",
    title: "Активні квести",
    subtitle: "3 квести",
    quests: [
      {
        id: "active-1",
        title: 'Скажи "я тут головний NPC" біля автомата з кавою',
        reward: 50,
        deadline: "2 год 18 хв",
        proofType: "Відео",
        progress: 72,
        status: "active",
      },
      {
        id: "active-2",
        title: "Знайди вивіску, яка звучить як назва гурту",
        reward: 40,
        deadline: "5 год 04 хв",
        proofType: "Фото",
        progress: 44,
        status: "active",
      },
      {
        id: "active-3",
        title: "Напиши слоган для фото з ліфтом",
        reward: 25,
        deadline: "21 год",
        proofType: "Фото",
        progress: 19,
        status: "active",
      },
    ],
  },
  {
    id: "review",
    title: "На перевірці",
    subtitle: "1 квест",
    quests: [
      {
        id: "review-1",
        title: "Мем про чек доставки",
        reward: 45,
        deadline: "автор перевіряє",
        proofType: "Фото",
        progress: 100,
        status: "review",
      },
    ],
  },
  {
    id: "done",
    title: "Виконано",
    subtitle: "12 квестів",
    quests: [
      {
        id: "done-1",
        title: "Селфі за секунду до падіння реквізиту",
        reward: 75,
        deadline: "оплачено",
        proofType: "Відео",
        progress: 100,
        status: "done",
      },
      {
        id: "done-2",
        title: "Підпис для фото з голубим неоном",
        reward: 30,
        deadline: "оплачено",
        proofType: "Фото",
        progress: 100,
        status: "done",
      },
    ],
  },
] satisfies {
  id: string;
  title: string;
  subtitle: string;
  quests: TrackerQuest[];
}[];

export const achievements: Achievement[] = [
  {
    id: "first-proof",
    title: "Перший доказ",
    description: "Завантажено перше виконання",
    icon: "play",
    unlocked: true,
  },
  {
    id: "streak-7",
    title: "7 днів хаосу",
    description: "Серія виконань цілий тиждень",
    icon: "fire",
    unlocked: true,
  },
  {
    id: "creator",
    title: "Автор",
    description: "Створено 18 квестів",
    icon: "sparkle",
    unlocked: true,
  },
  {
    id: "nfc",
    title: "NFC дуель",
    description: "Майбутня офлайн-функція",
    icon: "contactless",
    unlocked: false,
  },
  {
    id: "top10",
    title: "Топ тижня",
    description: "Увійти в leaderboard",
    icon: "trophy",
    unlocked: false,
  },
  {
    id: "wallet",
    title: "Перший вивід",
    description: "Виведи зароблені кошти",
    icon: "wallet",
    unlocked: false,
  },
];

export const walletTransactions = [
  {
    id: "t1",
    title: "NPC голос у кавʼярні",
    amount: "+75 грн",
    status: "Виплачено",
  },
  {
    id: "t2",
    title: "Мем про доставку",
    amount: "+45 грн",
    status: "Очікує автора",
  },
  {
    id: "t3",
    title: "Поповнення балансу",
    amount: "-250 грн",
    status: "Monobank draft",
  },
];

export const leaderboard = [
  { id: "l1", name: "mari_glitch", earned: "1,920 грн", rank: 1 },
  { id: "l2", name: "pixel.maks", earned: "1,480 грн", rank: 2 },
  { id: "l3", name: "dasha.glitch", earned: "1,170 грн", rank: 3 },
  { id: "l4", name: "nina.pixel", earned: "960 грн", rank: 4 },
];
