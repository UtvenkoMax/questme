export type Quest = {
  id: string;
  title: string;
  category: string;
  duration: string;
  distance: string;
  rating: number;
  difficulty: 'Легко' | 'Середньо' | 'Складно';
  participants: number;
  image: number; // require() return type
  accentColor: string;
};

export const DIFFICULTY_COLORS: Record<Quest['difficulty'], string> = {
  'Легко': '#10B981',
  'Середньо': '#F59E0B',
  'Складно': '#EF4444',
};

export const MOCK_QUESTS: Quest[] = [
  {
    id: '1',
    title: 'Таємниці Старого Міста',
    category: 'Історія',
    duration: '2 год',
    distance: '1.2 км',
    rating: 4.8,
    difficulty: 'Середньо',
    participants: 1247,
    image: require('@/assets/images/quest1.png'),
    accentColor: '#A855F7',
  },
  {
    id: '2',
    title: 'Парковий Квест',
    category: 'Природа',
    duration: '1 год',
    distance: '500 м',
    rating: 4.6,
    difficulty: 'Легко',
    participants: 892,
    image: require('@/assets/images/quest2.png'),
    accentColor: '#10B981',
  },
  {
    id: '3',
    title: "Секретні Кав'ярні",
    category: 'Розваги',
    duration: '3 год',
    distance: '2.5 км',
    rating: 4.9,
    difficulty: 'Легко',
    participants: 2104,
    image: require('@/assets/images/quest3.png'),
    accentColor: '#F59E0B',
  },
];
