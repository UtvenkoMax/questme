import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { Quest } from '@/services/quest-service';

type QuestFilter = 'all' | 'active' | 'completed';
type QuestSortBy = 'newest' | 'oldest' | 'points' | 'title';

interface QuestState {
  quests: Quest[];
  filter: QuestFilter;
  sortBy: QuestSortBy;
  searchQuery: string;
  selectedQuestId: string | null;
  isCreating: boolean;
  lastSyncedAt: string | null;

  // Gamification
  totalXp: number;
  level: number;
  streak: number;
  lastCompletedAt: string | null;
}

interface QuestActions {
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  removeQuest: (id: string) => void;
  toggleQuest: (id: string) => void;
  setFilter: (filter: QuestFilter) => void;
  setSortBy: (sortBy: QuestSortBy) => void;
  setSearchQuery: (query: string) => void;
  setSelectedQuestId: (id: string | null) => void;
  setIsCreating: (creating: boolean) => void;
  syncFromStorage: (quests: Quest[]) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

export type QuestStore = QuestState & QuestActions;

function calculateXp(quests: Quest[]) {
  return quests.reduce((sum, q) => sum + (q.completed ? q.points : 0), 0);
}

function calculateLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

function applyFilter(quests: Quest[], filter: QuestFilter) {
  switch (filter) {
    case 'active':
      return quests.filter((q) => !q.completed);
    case 'completed':
      return quests.filter((q) => q.completed);
    default:
      return quests;
  }
}

function applySort(quests: Quest[], sortBy: QuestSortBy) {
  const sorted = [...quests];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'points':
      return sorted.sort((a, b) => b.points - a.points);
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'uk'));
    default:
      return sorted;
  }
}

function applySearch(quests: Quest[], query: string) {
  if (!query.trim()) return quests;
  const lower = query.toLowerCase();
  return quests.filter(
    (q) => q.title.toLowerCase().includes(lower) || q.description.toLowerCase().includes(lower)
  );
}

export const useQuestStore = create<QuestStore>()(
  immer((set) => ({
    quests: [],
    filter: 'all',
    sortBy: 'newest',
    searchQuery: '',
    selectedQuestId: null,
    isCreating: false,
    lastSyncedAt: null,
    totalXp: 0,
    level: 1,
    streak: 0,
    lastCompletedAt: null,

    setQuests: (quests) =>
      set((state) => {
        state.quests = quests;
        state.totalXp = calculateXp(quests);
        state.level = calculateLevel(state.totalXp);
        state.lastSyncedAt = new Date().toISOString();
      }),

    addQuest: (quest) =>
      set((state) => {
        state.quests.unshift(quest);
      }),

    removeQuest: (id) =>
      set((state) => {
        state.quests = state.quests.filter((q) => q.id !== id);
        state.totalXp = calculateXp(state.quests);
        state.level = calculateLevel(state.totalXp);
      }),

    toggleQuest: (id) =>
      set((state) => {
        const quest = state.quests.find((q) => q.id === id);
        if (!quest) return;

        quest.completed = !quest.completed;
        quest.completedAt = quest.completed ? new Date().toISOString() : undefined;

        state.totalXp = calculateXp(state.quests);
        state.level = calculateLevel(state.totalXp);

        if (quest.completed) {
          state.lastCompletedAt = new Date().toISOString();
        }
      }),

    setFilter: (filter) =>
      set((state) => {
        state.filter = filter;
      }),

    setSortBy: (sortBy) =>
      set((state) => {
        state.sortBy = sortBy;
      }),

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),

    setSelectedQuestId: (id) =>
      set((state) => {
        state.selectedQuestId = id;
      }),

    setIsCreating: (creating) =>
      set((state) => {
        state.isCreating = creating;
      }),

    syncFromStorage: (quests) =>
      set((state) => {
        state.quests = quests;
        state.totalXp = calculateXp(quests);
        state.level = calculateLevel(state.totalXp);
        state.lastSyncedAt = new Date().toISOString();
      }),

    incrementStreak: () =>
      set((state) => {
        state.streak += 1;
      }),

    resetStreak: () =>
      set((state) => {
        state.streak = 0;
      }),
  }))
);

/** Derived selectors */
export const selectFilteredQuests = (state: QuestStore) => {
  let result = applyFilter(state.quests, state.filter);
  result = applySearch(result, state.searchQuery);
  result = applySort(result, state.sortBy);
  return result;
};

export const selectQuestById = (id: string) => (state: QuestStore) =>
  state.quests.find((q) => q.id === id) ?? null;

export const selectCompletionStats = (state: QuestStore) => {
  const completed = state.quests.filter((q) => q.completed).length;
  const total = state.quests.length;
  return {
    completed,
    total,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    xp: state.totalXp,
    level: state.level,
    streak: state.streak,
  };
};
