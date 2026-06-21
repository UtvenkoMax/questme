export type QuestCoordinate = {
  latitude: number;
  longitude: number;
};

export type Quest = {
  category: string;
  accentColor: string;
  coordinate: QuestCoordinate;
  description: string;
  difficulty: 'Легко' | 'Середньо' | 'Складно';
  distance: string;
  duration: string;
  geofenceRadiusMeters: number;
  id: string;
  image: number;
  isNew: boolean;
  isTeamQuest: boolean;
  location: string;
  participants: number;
  rating: number;
  recommendedGear: string[];
  reward: {
    badge: string;
    xp: number;
  };
  route: QuestCoordinate[];
  steps: {
    description: string;
    title: string;
  }[];
  team: {
    name: string;
    status: 'ready' | 'walking' | 'arrived';
  }[];
  title: string;
};

export const DIFFICULTY_COLORS: Record<Quest['difficulty'], string> = {
  'Легко': '#227A55',
  'Середньо': '#B56B10',
  'Складно': '#BD3D3D',
};

export const MOCK_QUESTS: Quest[] = [
  {
    accentColor: '#206C5C',
    category: 'Історія',
    coordinate: { latitude: 50.4592, longitude: 30.5179 },
    description: 'Маршрут історичними вулицями з короткими завданнями на уважність.',
    difficulty: 'Середньо',
    distance: '1.2 км',
    duration: '2 год',
    geofenceRadiusMeters: 90,
    id: '1',
    image: require('@/assets/images/quest1.png'),
    isNew: true,
    isTeamQuest: true,
    location: 'Поділ, Київ',
    participants: 1247,
    rating: 4.8,
    recommendedGear: ['Зручне взуття', 'Навушники', 'Заряд телефону'],
    reward: { badge: 'Міський детектив', xp: 180 },
    route: [
      { latitude: 50.4592, longitude: 30.5179 },
      { latitude: 50.4612, longitude: 30.5167 },
      { latitude: 50.4636, longitude: 30.5151 },
    ],
    steps: [
      { title: 'Старт біля Контрактової', description: 'Знайдіть першу підказку біля історичного фасаду.' },
      { title: 'Старі вулиці', description: 'Пройдіть до другої точки та зіставте символи на дверях.' },
      { title: 'Фінальна загадка', description: 'Підтвердьте геофенс і відкрийте фінальний код.' },
    ],
    team: [
      { name: 'Марія', status: 'arrived' },
      { name: 'Олег', status: 'walking' },
      { name: 'Ви', status: 'ready' },
    ],
    title: 'Таємниці Старого Міста',
  },
  {
    accentColor: '#2F6FED',
    category: 'Природа',
    coordinate: { latitude: 50.4418, longitude: 30.5169 },
    description: 'Легка прогулянка парком із фото-завданнями та простими підказками.',
    difficulty: 'Легко',
    distance: '500 м',
    duration: '1 год',
    geofenceRadiusMeters: 75,
    id: '2',
    image: require('@/assets/images/quest2.png'),
    isNew: false,
    isTeamQuest: false,
    location: 'Парк Шевченка',
    participants: 892,
    rating: 4.6,
    recommendedGear: ['Вода', 'Кросівки', 'Камера'],
    reward: { badge: 'Парк-скаут', xp: 90 },
    route: [
      { latitude: 50.4418, longitude: 30.5169 },
      { latitude: 50.4429, longitude: 30.5155 },
      { latitude: 50.4441, longitude: 30.5144 },
    ],
    steps: [
      { title: 'Вхід у парк', description: 'Зробіть check-in і оберіть темп прогулянки.' },
      { title: 'Фото-маркер', description: 'Знайдіть точку для фото-завдання.' },
      { title: 'Фініш алеєю', description: 'Дійдіть до фінальної точки в межах геофенсу.' },
    ],
    team: [
      { name: 'Ви', status: 'walking' },
      { name: 'Іра', status: 'arrived' },
    ],
    title: 'Парковий Квест',
  },
  {
    accentColor: '#B56B10',
    category: 'Розваги',
    coordinate: { latitude: 50.4501, longitude: 30.5234 },
    description: 'Міський маршрут для тих, хто любить атмосферні місця, каву та загадки.',
    difficulty: 'Легко',
    distance: '2.5 км',
    duration: '3 год',
    geofenceRadiusMeters: 100,
    id: '3',
    image: require('@/assets/images/quest3.png'),
    isNew: true,
    isTeamQuest: true,
    location: 'Центр Києва',
    participants: 2104,
    rating: 4.9,
    recommendedGear: ['Павербанк', 'Готівка/картка', 'Друзі для команди'],
    reward: { badge: 'Кавовий навігатор', xp: 150 },
    route: [
      { latitude: 50.4501, longitude: 30.5234 },
      { latitude: 50.4478, longitude: 30.522 },
      { latitude: 50.4452, longitude: 30.5204 },
    ],
    steps: [
      { title: 'Початок у центрі', description: 'Відкрийте першу кавову підказку.' },
      { title: 'Смакова точка', description: 'Знайдіть локальну кавʼярню та зробіть check-in.' },
      { title: 'Командний фініш', description: 'Підтвердьте точку разом із командою.' },
    ],
    team: [
      { name: 'Софія', status: 'arrived' },
      { name: 'Дмитро', status: 'arrived' },
      { name: 'Ви', status: 'walking' },
    ],
    title: "Секретні Кав'ярні",
  },
];
