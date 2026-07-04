import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  createFallbackSocialSeed,
  publicProfiles,
  questSocialSeeds,
  type PublicProfile,
  type QuestComment,
  type QuestSocialSeed,
  type TeamChatMessage,
} from '@/data/social-features';

type QuestSocialRuntime = {
  checkInDone: boolean;
  comments: QuestComment[];
  liked: boolean;
  likes: number;
  saved: boolean;
  teamChat: TeamChatMessage[];
  teamJoined: boolean;
};

interface SocialState {
  followedProfiles: Record<string, boolean>;
  questSocial: Record<string, QuestSocialRuntime>;
}

interface SocialActions {
  addComment: (questId: string, body: string) => void;
  addTeamMessage: (questId: string, body: string) => void;
  completeCheckIn: (questId: string) => void;
  ensureQuestSocial: (questId: string, title?: string) => void;
  joinTeam: (questId: string) => void;
  toggleFollow: (profileId: string) => void;
  toggleLike: (questId: string, fallbackLikes?: number) => void;
  toggleSave: (questId: string) => void;
}

export type SocialStore = SocialState & SocialActions;

function getSeedLikeCount(seed: QuestSocialSeed) {
  return seed.comments.reduce((sum, comment) => sum + comment.likes, 0) + seed.team.length * 12;
}

function createRuntimeFromSeed(seed: QuestSocialSeed): QuestSocialRuntime {
  return {
    checkInDone: false,
    comments: seed.comments,
    liked: false,
    likes: getSeedLikeCount(seed),
    saved: false,
    teamChat: seed.teamChat,
    teamJoined: false,
  };
}

function createInitialQuestSocial() {
  return Object.fromEntries(
    Object.entries(questSocialSeeds).map(([questId, seed]) => [questId, createRuntimeFromSeed(seed)])
  ) as Record<string, QuestSocialRuntime>;
}

function createInitialFollows() {
  return Object.fromEntries(
    Object.entries(publicProfiles).map(([profileId, profile]) => [profileId, profile.following])
  ) as Record<string, boolean>;
}

function getRuntime(state: SocialState, questId: string, title?: string) {
  if (!state.questSocial[questId]) {
    state.questSocial[questId] = createRuntimeFromSeed(createFallbackSocialSeed(questId, title));
  }

  return state.questSocial[questId];
}

function createComment(body: string): QuestComment {
  return {
    body,
    createdAt: 'щойно',
    id: `comment-${Date.now().toString(36)}`,
    likes: 0,
    userId: 'you',
    userName: 'Ви',
  };
}

function createTeamMessage(body: string): TeamChatMessage {
  return {
    body,
    createdAt: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    id: `team-message-${Date.now().toString(36)}`,
    sender: 'Ви',
  };
}

export const useSocialStore = create<SocialStore>()(
  immer((set) => ({
    followedProfiles: createInitialFollows(),
    questSocial: createInitialQuestSocial(),

    addComment: (questId, body) =>
      set((state) => {
        const text = body.trim();
        if (!text) return;
        getRuntime(state, questId).comments.unshift(createComment(text));
      }),

    addTeamMessage: (questId, body) =>
      set((state) => {
        const text = body.trim();
        if (!text) return;
        getRuntime(state, questId).teamChat.push(createTeamMessage(text));
      }),

    completeCheckIn: (questId) =>
      set((state) => {
        getRuntime(state, questId).checkInDone = true;
      }),

    ensureQuestSocial: (questId, title) =>
      set((state) => {
        getRuntime(state, questId, title);
      }),

    joinTeam: (questId) =>
      set((state) => {
        getRuntime(state, questId).teamJoined = true;
      }),

    toggleFollow: (profileId) =>
      set((state) => {
        state.followedProfiles[profileId] = !state.followedProfiles[profileId];
      }),

    toggleLike: (questId, fallbackLikes = 0) =>
      set((state) => {
        const runtime = getRuntime(state, questId);
        if (runtime.likes === 0 && fallbackLikes > 0) {
          runtime.likes = fallbackLikes;
        }
        runtime.liked = !runtime.liked;
        runtime.likes += runtime.liked ? 1 : -1;
      }),

    toggleSave: (questId) =>
      set((state) => {
        const runtime = getRuntime(state, questId);
        runtime.saved = !runtime.saved;
      }),
  }))
);

export function getProfileWithFollowState(profile: PublicProfile, followedProfiles: Record<string, boolean>) {
  return {
    ...profile,
    following: followedProfiles[profile.id] ?? profile.following,
  };
}
