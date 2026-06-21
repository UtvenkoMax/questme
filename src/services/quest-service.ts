import { getJsonItem, setJsonItem } from './app-storage';
import { STORAGE_KEYS } from './auth-service';

export const QUEST_TEXT_WORD_LIMIT = 180;

export type Quest = {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
};

const DEFAULT_QUESTS: Quest[] = [
  {
    completed: false,
    createdAt: new Date(2026, 0, 1).toISOString(),
    description: 'Позначте перший квест виконаним, щоб побачити прогрес і нагороди.',
    id: 'welcome-quest',
    points: 25,
    title: 'Перший квест',
  },
  {
    completed: false,
    createdAt: new Date(2026, 0, 2).toISOString(),
    description: 'Створіть власне завдання для себе або друга.',
    id: 'create-custom-quest',
    points: 40,
    title: 'Створити власний квест',
  },
];

function createQuestId() {
  return `quest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getQuestTextWordCount(text: string) {
  return text.match(/\S+/g)?.length ?? 0;
}

export function limitQuestTextWords(text: string) {
  let wordCount = 0;
  let limitEnd = text.length;

  for (const match of text.matchAll(/\S+/g)) {
    wordCount += 1;

    if (wordCount === QUEST_TEXT_WORD_LIMIT) {
      limitEnd = (match.index ?? 0) + match[0].length;
    }

    if (wordCount > QUEST_TEXT_WORD_LIMIT) {
      return text.slice(0, limitEnd);
    }
  }

  return wordCount === QUEST_TEXT_WORD_LIMIT ? text.slice(0, limitEnd) : text;
}

export async function getQuests() {
  const quests = await getJsonItem<Quest[]>(STORAGE_KEYS.quests);
  if (quests?.length) return quests;

  await setJsonItem(STORAGE_KEYS.quests, DEFAULT_QUESTS);
  return DEFAULT_QUESTS;
}

export async function createQuest(title: string, description: string) {
  const quests = await getQuests();
  const questTitle = limitQuestTextWords(title).trim();
  const quest: Quest = {
    completed: false,
    createdAt: new Date().toISOString(),
    description: description.trim() || 'Короткий квест без опису.',
    id: createQuestId(),
    points: 50,
    title: questTitle,
  };
  const nextQuests = [quest, ...quests];

  await setJsonItem(STORAGE_KEYS.quests, nextQuests);
  return nextQuests;
}

export async function toggleQuest(id: string) {
  const quests = await getQuests();
  const nextQuests = quests.map((quest) => {
    if (quest.id !== id) return quest;

    const completed = !quest.completed;
    return {
      ...quest,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    };
  });

  await setJsonItem(STORAGE_KEYS.quests, nextQuests);
  return nextQuests;
}

export function getQuestProgress(quests: Quest[]) {
  const completedCount = quests.filter((quest) => quest.completed).length;
  const totalPoints = quests.reduce((total, quest) => total + (quest.completed ? quest.points : 0), 0);

  // Gamification: Level formula (100 XP per level)
  const level = Math.floor(totalPoints / 100) + 1;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = totalPoints % 100;
  const levelProgressPercent = Math.round((xpInCurrentLevel / 100) * 100);

  return {
    completedCount,
    completionPercent: quests.length ? Math.round((completedCount / quests.length) * 100) : 0,
    totalCount: quests.length,
    totalPoints,
    level,
    xpForNextLevel,
    xpInCurrentLevel,
    levelProgressPercent,
  };
}
