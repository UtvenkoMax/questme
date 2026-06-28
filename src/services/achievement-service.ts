import type { Quest } from './quest-service';

export type Achievement = {
  description: string;
  icon: 'award' | 'flag' | 'map' | 'users' | 'zap';
  id: string;
  title: string;
};

export type AchievementWithState = Achievement & {
  unlocked: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    description: 'Завершіть будь-який персональний квест.',
    icon: 'flag',
    id: 'first-quest',
    title: 'Перший квест',
  },
  {
    description: 'Наберіть 100 XP у персональних місіях.',
    icon: 'zap',
    id: 'xp-100',
    title: '100 XP',
  },
  {
    description: 'Відкрийте карту та пройдіть маршрут поруч.',
    icon: 'map',
    id: 'nearby-route',
    title: '5 км містом',
  },
  {
    description: 'Приєднайтесь до командного маршруту.',
    icon: 'users',
    id: 'team-player',
    title: 'Командний гравець',
  },
  {
    description: 'Завершіть три квести або більше.',
    icon: 'award',
    id: 'collector',
    title: 'Колекціонер',
  },
];

export function getAchievements(quests: Quest[]): AchievementWithState[] {
  const completedCount = quests.filter((quest) => quest.completed).length;
  const totalPoints = quests.reduce((sum, quest) => sum + (quest.completed ? quest.points : 0), 0);

  return ACHIEVEMENTS.map((achievement) => {
    const unlocked =
      achievement.id === 'first-quest'
        ? completedCount >= 1
        : achievement.id === 'xp-100'
          ? totalPoints >= 100
          : achievement.id === 'collector'
            ? completedCount >= 3
            : achievement.id === 'nearby-route'
              ? completedCount >= 1
              : completedCount >= 2;

    return { ...achievement, unlocked };
  });
}
