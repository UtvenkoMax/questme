export type Slide = {
  id: string;
  image: number; // require() return type
  title: string;
  subtitle: string;
  accent: string;
  bgFrom: string;
  bgTo: string;
};

export const SLIDES: Slide[] = [
  {
    id: '1',
    image: require('@/assets/images/startimage.png'),
    title: 'Відкривай Пригоди',
    subtitle: 'Знаходь захопливі квести у своєму місті та за його межами. Кожен день — нова пригода!',
    accent: '#A855F7',
    bgFrom: '#F5F0FF',
    bgTo: '#EDE0FF',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding2.png'),
    title: 'Досліджуй Карту',
    subtitle: 'Використовуй інтерактивну карту для пошуку квестів поблизу та прокладання маршруту.',
    accent: '#06B6D4',
    bgFrom: '#F0FFFE',
    bgTo: '#CFFAFE',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding3.png'),
    title: 'Збирай Нагороди',
    subtitle: 'Виконуй завдання, здобувай бали, відкривай унікальні бейджі та піднімайся у рейтингу!',
    accent: '#F59E0B',
    bgFrom: '#FFFBF0',
    bgTo: '#FEF3C7',
  },
];
