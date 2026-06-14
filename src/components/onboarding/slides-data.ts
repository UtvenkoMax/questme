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
    accent: '#206C5C',
    bgFrom: '#E7F1ED',
    bgTo: '#F6F4EF',
    id: '1',
    image: require('@/assets/images/startimage.png'),
    title: 'Плануйте день як маршрут',
    subtitle: 'QuestMe поєднує особисті завдання, міські маршрути й простий прогрес в одному просторі.',
  },
  {
    accent: '#2F6FED',
    bgFrom: '#E5EEFF',
    bgTo: '#F6F4EF',
    id: '2',
    image: require('@/assets/images/onboarding2.png'),
    title: 'Бачте, що поруч',
    subtitle: 'Карта допомагає швидко знайти маршрути, оцінити відстань і вибрати квест під настрій.',
  },
  {
    accent: '#B56B10',
    bgFrom: '#FFF2D8',
    bgTo: '#F6F4EF',
    id: '3',
    image: require('@/assets/images/onboarding3.png'),
    title: 'Закривайте квести',
    subtitle: 'Виконані дії перетворюються на бали, а прогрес залишається видимим без зайвих таблиць.',
  },
];
