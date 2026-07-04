import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  dailyMissionSeeds,
  keychains,
  paymentProviders,
  reportReasons,
  type DailyMissionSeed,
  type Keychain,
  type PaymentProviderId,
  type PaymentProviderStatus,
  type ProofReviewStatus,
  type ReportStatus,
  type ReportTargetType,
} from '@/data/platform-features';

export type ReportTicket = {
  createdAt: string;
  details: string;
  id: string;
  reasonId: string;
  status: ReportStatus;
  targetId: string;
  targetType: ReportTargetType;
};

export type ProofSubmission = {
  autoScore: number;
  escrowId?: string;
  id: string;
  mediaTypes: string[];
  performerName: string;
  questId: string;
  questTitle: string;
  signals: string[];
  status: ProofReviewStatus;
  submittedAt: string;
};

export type EscrowDispute = {
  createdAt: string;
  escrowId: string;
  id: string;
  messages: string[];
  proofId: string;
  reason: string;
  status: 'open' | 'under_review' | 'resolved';
};

type DailyMission = DailyMissionSeed & {
  claimed: boolean;
};

type ProviderRuntime = Record<PaymentProviderId, PaymentProviderStatus>;

interface PlatformState {
  dailySpinDate: string | null;
  disputes: EscrowDispute[];
  keychainInventory: Record<string, number>;
  lastSpinRewardId: string | null;
  missions: DailyMission[];
  paymentRuntime: ProviderRuntime;
  proofSubmissions: ProofSubmission[];
  reports: ReportTicket[];
  spinTokens: number;
}

interface PlatformActions {
  approveProof: (proofId: string) => void;
  claimMission: (missionId: string) => boolean;
  connectPaymentProvider: (providerId: PaymentProviderId) => void;
  createDispute: (proofId: string, escrowId: string, reason: string) => void;
  createReport: (targetType: ReportTargetType, targetId: string, reasonId: string, details?: string) => void;
  rejectProof: (proofId: string) => void;
  resolveDispute: (disputeId: string) => void;
  spinKeychainRoulette: (source: 'daily' | 'mission') => { message: string; ok: boolean; reward?: Keychain };
  submitProofForReview: (input: {
    escrowId?: string;
    mediaTypes: string[];
    questId: string;
    questTitle: string;
  }) => ProofSubmission;
}

export type PlatformStore = PlatformState & PlatformActions;

const todayKey = () => new Date().toISOString().slice(0, 10);

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function createInitialPaymentRuntime(): ProviderRuntime {
  return Object.fromEntries(paymentProviders.map((provider) => [provider.id, provider.status])) as ProviderRuntime;
}

function createInitialProofs(): ProofSubmission[] {
  return [
    {
      autoScore: 92,
      escrowId: 'escrow-active-1',
      id: 'proof-npc-1',
      mediaTypes: ['video'],
      performerName: 'mari_glitch',
      questId: 'npc-voice',
      questTitle: 'NPC голос у кавʼярні',
      signals: ['відео до 90 сек', 'гео-чекін збігається', 'обличчя не приховано'],
      status: 'needs_author',
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      autoScore: 63,
      id: 'proof-meme-1',
      mediaTypes: ['image'],
      performerName: 'retro.nazar',
      questId: 'meme-frame',
      questTitle: 'Мем про доставку',
      signals: ['фото прийнято', 'потрібна ручна оцінка змісту', 'немає geo-вимоги'],
      status: 'auto_review',
      submittedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

function inspectProof(mediaTypes: string[]) {
  const hasVideo = mediaTypes.includes('video');
  const hasImage = mediaTypes.includes('image');
  const autoScore = hasVideo ? 88 : hasImage ? 74 : 42;
  const status: ProofReviewStatus = autoScore >= 80 ? 'needs_author' : 'auto_review';
  const signals = [
    hasVideo ? 'відео-доказ знайдено' : 'відео не додано',
    hasImage ? 'фото-доказ знайдено' : 'фото не додано',
    autoScore >= 80 ? 'ризик низький' : 'потрібна ручна перевірка',
  ];

  return { autoScore, signals, status };
}

function pickKeychain() {
  const roll = Math.random();
  const rarity =
    roll > 0.985 ? 'legendary' :
      roll > 0.9 ? 'epic' :
        roll > 0.68 ? 'rare' :
          'common';
  const pool = keychains.filter((keychain) => keychain.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)] ?? keychains[0];
}

export const usePlatformStore = create<PlatformStore>()(
  immer((set, get) => ({
    dailySpinDate: null,
    disputes: [],
    keychainInventory: {
      'qm-token': 1,
    },
    lastSpinRewardId: null,
    missions: dailyMissionSeeds.map((mission) => ({ ...mission, claimed: false })),
    paymentRuntime: createInitialPaymentRuntime(),
    proofSubmissions: createInitialProofs(),
    reports: [
      {
        createdAt: new Date(Date.now() - 5400000).toISOString(),
        details: 'Потрібна перевірка згоди учасника в кадрі.',
        id: 'report-proof-1',
        reasonId: 'privacy',
        status: 'triage',
        targetId: 'proof-npc-1',
        targetType: 'proof',
      },
    ],
    spinTokens: 1,

    approveProof: (proofId) =>
      set((state) => {
        const proof = state.proofSubmissions.find((item) => item.id === proofId);
        if (proof) proof.status = 'approved';
      }),

    claimMission: (missionId) => {
      let claimed = false;
      set((state) => {
        const mission = state.missions.find((item) => item.id === missionId);
        if (!mission || mission.claimed || mission.progress < mission.target) return;
        mission.claimed = true;
        state.spinTokens += mission.rewardSpins;
        claimed = true;
      });
      return claimed;
    },

    connectPaymentProvider: (providerId) =>
      set((state) => {
        state.paymentRuntime[providerId] = 'connected';
      }),

    createDispute: (proofId, escrowId, reason) =>
      set((state) => {
        const proof = state.proofSubmissions.find((item) => item.id === proofId);
        if (proof) proof.status = 'disputed';
        state.disputes.unshift({
          createdAt: new Date().toISOString(),
          escrowId,
          id: generateId('dispute'),
          messages: ['Диспут відкрито. Escrow лишається заблокованим до рішення модератора.'],
          proofId,
          reason: reason.trim() || 'Автор не приймає виконання',
          status: 'open',
        });
      }),

    createReport: (targetType, targetId, reasonId, details = '') =>
      set((state) => {
        const reason = reportReasons.find((item) => item.id === reasonId);
        state.reports.unshift({
          createdAt: new Date().toISOString(),
          details: details.trim() || reason?.label || 'Скарга без опису',
          id: generateId('report'),
          reasonId,
          status: 'new',
          targetId,
          targetType,
        });
      }),

    rejectProof: (proofId) =>
      set((state) => {
        const proof = state.proofSubmissions.find((item) => item.id === proofId);
        if (proof) proof.status = 'rejected';
      }),

    resolveDispute: (disputeId) =>
      set((state) => {
        const dispute = state.disputes.find((item) => item.id === disputeId);
        if (dispute) {
          dispute.status = 'resolved';
          dispute.messages.push('Модератор закрив диспут і зафіксував рішення.');
        }
      }),

    spinKeychainRoulette: (source) => {
      const state = get();
      if (source === 'daily' && state.dailySpinDate === todayKey()) {
        return { ok: false, message: 'Daily roulette вже використано сьогодні.' };
      }
      if (source === 'mission' && state.spinTokens <= 0) {
        return { ok: false, message: 'Немає spin-токенів. Заберіть нагороду за місію.' };
      }

      const reward = pickKeychain();
      set((draft) => {
        if (source === 'daily') {
          draft.dailySpinDate = todayKey();
        } else {
          draft.spinTokens = Math.max(0, draft.spinTokens - 1);
        }
        draft.keychainInventory[reward.id] = (draft.keychainInventory[reward.id] ?? 0) + 1;
        draft.lastSpinRewardId = reward.id;
      });

      return { ok: true, message: `Випав брелок: ${reward.label}`, reward };
    },

    submitProofForReview: (input) => {
      const inspection = inspectProof(input.mediaTypes);
      const submission: ProofSubmission = {
        autoScore: inspection.autoScore,
        escrowId: input.escrowId,
        id: generateId('proof'),
        mediaTypes: input.mediaTypes,
        performerName: 'Ви',
        questId: input.questId,
        questTitle: input.questTitle,
        signals: inspection.signals,
        status: inspection.status,
        submittedAt: new Date().toISOString(),
      };

      set((state) => {
        state.proofSubmissions.unshift(submission);
        const proofMission = state.missions.find((mission) => mission.id === 'daily-proof');
        if (proofMission) {
          proofMission.progress = Math.min(proofMission.target, proofMission.progress + 1);
        }
      });

      return submission;
    },
  }))
);
