export type Quest = {
  category: string;
  accentColor: string;
  description: string;
  difficulty: 'Легко' | 'Середньо' | 'Складно';
  distance: string;
  duration: string;
  id: string;
  image: number;
  location: string;
  participants: number;
  rating: number;
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
    description: 'Маршрут історичними вулицями з короткими завданнями на уважність.',
    difficulty: 'Середньо',
    distance: '1.2 км',
    duration: '2 год',
    id: '1',
    image: require('@/assets/images/quest1.png'),
    location: 'Поділ, Київ',
    participants: 1247,
    rating: 4.8,
    title: 'Таємниці Старого Міста',
  },
  {
    accentColor: '#2F6FED',
    category: 'Природа',
    description: 'Легка прогулянка парком із фото-завданнями та простими підказками.',
    difficulty: 'Легко',
    distance: '500 м',
    duration: '1 год',
    id: '2',
    image: require('@/assets/images/quest2.png'),
    location: 'Парк Шевченка',
    participants: 892,
    rating: 4.6,
    title: 'Парковий Квест',
  },
  {
    accentColor: '#B56B10',
    category: 'Розваги',
    description: 'Міський маршрут для тих, хто любить атмосферні місця, каву та загадки.',
    difficulty: 'Легко',
    distance: '2.5 км',
    duration: '3 год',
    id: '3',
    image: require('@/assets/images/quest3.png'),
    location: 'Центр Києва',
    participants: 2104,
    rating: 4.9,
    title: "Секретні Кав'ярні",
  },
];
