import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const PLATFORM_COMMISSION_RATE = 0.08;
export const PREMIUM_QUEST_PRICE = 35;

export type TransactionType =
  | 'topup'
  | 'withdraw'
  | 'quest_reward'
  | 'quest_spend'
  | 'escrow_hold'
  | 'escrow_release'
  | 'escrow_refund'
  | 'platform_fee'
  | 'promo_bonus'
  | 'referral_bonus'
  | 'premium_quest';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type EscrowStatus = 'held' | 'released' | 'refunded';

export interface WalletEscrow {
  id: string;
  questTitle: string;
  amount: number;
  fee: number;
  premiumFee: number;
  status: EscrowStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface WalletTransaction {
  id: string;
  title: string;
  amount: string;       // Display string e.g. "+75 грн" or "-250 грн"
  numericAmount: number; // Signed number: positive for income, negative for expense
  status: string;
  type: TransactionType;
  createdAt: string;
}

export type ReserveQuestRewardResult = {
  escrowId?: string;
  fee: number;
  ok: boolean;
  premiumFee: number;
  requiredAmount: number;
  message: string;
};

export type PromoCodeResult = {
  amount: number;
  ok: boolean;
  message: string;
};

interface WalletState {
  balance: number;
  escrowBalance: number;
  escrows: WalletEscrow[];
  redeemedCodes: string[];
  transactions: WalletTransaction[];
}

interface WalletActions {
  topUp: (amount: number, method: string) => void;
  withdraw: (amount: number, fee: number, method: string, cardLast4: string) => void;
  addQuestReward: (questTitle: string, amount: number) => void;
  applyPromoCode: (code: string) => PromoCodeResult;
  reserveQuestReward: (questTitle: string, amount: number, options?: { premium?: boolean }) => ReserveQuestRewardResult;
  releaseEscrow: (escrowId: string, performerName?: string) => boolean;
  refundEscrow: (escrowId: string) => boolean;
  setBalance: (balance: number) => void;
}

export type WalletStore = WalletState & WalletActions;

function generateId() {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateEscrowId() {
  return `escrow-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatAmount(amount: number) {
  if (amount > 0) return `+${amount} грн`;
  if (amount < 0) return `${amount} грн`;
  return '0 грн';
}

export function calculatePlatformFee(amount: number) {
  return Math.ceil(amount * PLATFORM_COMMISSION_RATE);
}

const PROMO_CODES: Record<string, { amount: number; title: string; type: Extract<TransactionType, 'promo_bonus' | 'referral_bonus'> }> = {
  CREATOR20: { amount: 20, title: 'Промокод CREATOR20', type: 'promo_bonus' },
  INVITE50: { amount: 50, title: 'Бонус за інвайт INVITE50', type: 'referral_bonus' },
  QUESTME100: { amount: 100, title: 'Промокод QUESTME100', type: 'promo_bonus' },
};

const initialEscrows: WalletEscrow[] = [
  {
    amount: 100,
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    fee: calculatePlatformFee(100),
    id: 'escrow-active-1',
    premiumFee: PREMIUM_QUEST_PRICE,
    questTitle: 'Танцювальний батл біля муралу',
    status: 'held',
  },
];

const initialTransactions: WalletTransaction[] = [
  {
    id: 't0',
    title: 'Танцювальний батл біля муралу',
    amount: '-100 грн',
    numericAmount: -100,
    status: 'Escrow: очікує підтвердження',
    type: 'escrow_hold',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 't0-fee',
    title: 'Комісія платформи',
    amount: '-8 грн',
    numericAmount: -8,
    status: '8% за безпечну угоду',
    type: 'platform_fee',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 't0-premium',
    title: 'Premium-підняття квесту',
    amount: '-35 грн',
    numericAmount: -35,
    status: 'Бейдж та вище у стрічці',
    type: 'premium_quest',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 't1',
    title: 'NPC голос у кавʼярні',
    amount: '+75 грн',
    numericAmount: 75,
    status: 'Виплачено',
    type: 'quest_reward',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 't1-promo',
    title: 'Бонус за інвайт INVITE50',
    amount: '+50 грн',
    numericAmount: 50,
    status: 'Активовано',
    type: 'referral_bonus',
    createdAt: new Date(Date.now() - 129600000).toISOString(),
  },
  {
    id: 't2',
    title: 'Мем про доставку',
    amount: '+45 грн',
    numericAmount: 45,
    status: 'Очікує автора',
    type: 'quest_reward',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 't3',
    title: 'Поповнення балансу',
    amount: '+250 грн',
    numericAmount: 250,
    status: 'Monobank',
    type: 'topup',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const useWalletStore = create<WalletStore>()(
  immer((set) => ({
    balance: 1245,
    escrowBalance: initialEscrows.reduce((sum, escrow) => sum + (escrow.status === 'held' ? escrow.amount : 0), 0),
    escrows: initialEscrows,
    redeemedCodes: ['INVITE50'],
    transactions: initialTransactions,

    topUp: (amount, method) =>
      set((state) => {
        state.balance += amount;
        state.transactions.unshift({
          id: generateId(),
          title: 'Поповнення балансу',
          amount: formatAmount(amount),
          numericAmount: amount,
          status: method,
          type: 'topup',
          createdAt: new Date().toISOString(),
        });
      }),

    withdraw: (amount, fee, method, cardLast4) =>
      set((state) => {
        const totalDeducted = amount;
        state.balance = Math.max(0, state.balance - totalDeducted);
        state.transactions.unshift({
          id: generateId(),
          title: `Виведення на •••• ${cardLast4}`,
          amount: `-${amount} грн`,
          numericAmount: -amount,
          status: `${method} (комісія ${fee} грн)`,
          type: 'withdraw',
          createdAt: new Date().toISOString(),
        });
      }),

    addQuestReward: (questTitle, amount) =>
      set((state) => {
        state.balance += amount;
        state.transactions.unshift({
          id: generateId(),
          title: questTitle,
          amount: formatAmount(amount),
          numericAmount: amount,
          status: 'Виплачено',
          type: 'quest_reward',
          createdAt: new Date().toISOString(),
        });
      }),

    applyPromoCode: (rawCode) => {
      const code = rawCode.trim().toUpperCase();
      let result: PromoCodeResult = {
        amount: 0,
        ok: false,
        message: 'Введіть промокод або інвайт-код.',
      };

      set((state) => {
        if (!code) return;

        const promo = PROMO_CODES[code];
        if (!promo) {
          result = {
            amount: 0,
            ok: false,
            message: 'Код не знайдено. Спробуйте QUESTME100, INVITE50 або CREATOR20.',
          };
          return;
        }

        if (state.redeemedCodes.includes(code)) {
          result = {
            amount: 0,
            ok: false,
            message: 'Цей код уже активовано.',
          };
          return;
        }

        state.balance += promo.amount;
        state.redeemedCodes.push(code);
        state.transactions.unshift({
          id: generateId(),
          title: promo.title,
          amount: formatAmount(promo.amount),
          numericAmount: promo.amount,
          status: 'Активовано',
          type: promo.type,
          createdAt: new Date().toISOString(),
        });

        result = {
          amount: promo.amount,
          ok: true,
          message: `Бонус ${promo.amount} грн додано на баланс.`,
        };
      });

      return result;
    },

    reserveQuestReward: (questTitle, amount, options) => {
      const premiumFee = options?.premium ? PREMIUM_QUEST_PRICE : 0;
      const fee = calculatePlatformFee(amount);
      const requiredAmount = amount + fee + premiumFee;
      let result: ReserveQuestRewardResult = {
        fee,
        ok: false,
        premiumFee,
        requiredAmount,
        message: 'Не вдалося зарезервувати винагороду.',
      };

      set((state) => {
        if (amount <= 0) {
          result = {
            fee,
            ok: false,
            premiumFee,
            requiredAmount,
            message: 'Винагорода має бути більшою за 0 грн.',
          };
          return;
        }

        if (state.balance < requiredAmount) {
          result = {
            fee,
            ok: false,
            premiumFee,
            requiredAmount,
            message: `Недостатньо коштів. Потрібно ${requiredAmount} грн, доступно ${state.balance} грн.`,
          };
          return;
        }

        const now = new Date().toISOString();
        const escrowId = generateEscrowId();
        state.balance -= requiredAmount;
        state.escrowBalance += amount;
        state.escrows.unshift({
          amount,
          createdAt: now,
          fee,
          id: escrowId,
          premiumFee,
          questTitle,
          status: 'held',
        });
        state.transactions.unshift({
          id: generateId(),
          title: questTitle,
          amount: formatAmount(-amount),
          numericAmount: -amount,
          status: 'Escrow: заблоковано до підтвердження',
          type: 'escrow_hold',
          createdAt: now,
        });
        state.transactions.unshift({
          id: generateId(),
          title: 'Комісія платформи',
          amount: formatAmount(-fee),
          numericAmount: -fee,
          status: `${Math.round(PLATFORM_COMMISSION_RATE * 100)}% за безпечну угоду`,
          type: 'platform_fee',
          createdAt: now,
        });

        if (premiumFee > 0) {
          state.transactions.unshift({
            id: generateId(),
            title: 'Premium-підняття квесту',
            amount: formatAmount(-premiumFee),
            numericAmount: -premiumFee,
            status: 'Бейдж та вище у стрічці',
            type: 'premium_quest',
            createdAt: now,
          });
        }

        result = {
          escrowId,
          fee,
          ok: true,
          premiumFee,
          requiredAmount,
          message: `Заблоковано ${amount} грн в escrow до підтвердження виконання.`,
        };
      });

      return result;
    },

    releaseEscrow: (escrowId, performerName = 'виконавцю') => {
      let released = false;

      set((state) => {
        const escrow = state.escrows.find((item: WalletEscrow) => item.id === escrowId);
        if (!escrow || escrow.status !== 'held') return;

        const now = new Date().toISOString();
        escrow.status = 'released';
        escrow.resolvedAt = now;
        state.escrowBalance = Math.max(0, state.escrowBalance - escrow.amount);
        state.transactions.unshift({
          id: generateId(),
          title: escrow.questTitle,
          amount: `${escrow.amount} грн`,
          numericAmount: 0,
          status: `Виплачено ${performerName} з escrow`,
          type: 'escrow_release',
          createdAt: now,
        });
        released = true;
      });

      return released;
    },

    refundEscrow: (escrowId) => {
      let refunded = false;

      set((state) => {
        const escrow = state.escrows.find((item: WalletEscrow) => item.id === escrowId);
        if (!escrow || escrow.status !== 'held') return;

        const now = new Date().toISOString();
        escrow.status = 'refunded';
        escrow.resolvedAt = now;
        state.escrowBalance = Math.max(0, state.escrowBalance - escrow.amount);
        state.balance += escrow.amount;
        state.transactions.unshift({
          id: generateId(),
          title: escrow.questTitle,
          amount: formatAmount(escrow.amount),
          numericAmount: escrow.amount,
          status: 'Повернення з escrow',
          type: 'escrow_refund',
          createdAt: now,
        });
        refunded = true;
      });

      return refunded;
    },

    setBalance: (balance) =>
      set((state) => {
        state.balance = balance;
      }),
  }))
);

/** Selectors */
export const selectBalance = (state: WalletStore) => state.balance;
export const selectFormattedBalance = (state: WalletStore) =>
  new Intl.NumberFormat('uk-UA').format(state.balance) + ' грн';
export const selectEscrowBalance = (state: WalletStore) => state.escrowBalance;
export const selectFormattedEscrowBalance = (state: WalletStore) =>
  new Intl.NumberFormat('uk-UA').format(state.escrowBalance) + ' грн';
export const selectActiveEscrows = (state: WalletStore) =>
  state.escrows.filter((escrow) => escrow.status === 'held');
export const selectTransactions = (state: WalletStore) => state.transactions;
export const selectWalletSummary = (state: WalletStore) => {
  const sumByType = (types: TransactionType[]) =>
    state.transactions
      .filter((transaction) => types.includes(transaction.type))
      .reduce((sum, transaction) => sum + Math.abs(transaction.numericAmount), 0);

  return {
    available: state.balance,
    escrow: state.escrowBalance,
    fees: sumByType(['platform_fee']),
    premium: sumByType(['premium_quest']),
    bonuses: sumByType(['promo_bonus', 'referral_bonus']),
  };
};
