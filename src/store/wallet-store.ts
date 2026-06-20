/**
 * Zustand Wallet Store
 *
 * Manages the user's wallet balance and transaction history.
 * Top-ups increase balance, withdrawals decrease it.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TransactionType = 'topup' | 'withdraw' | 'quest_reward' | 'quest_spend';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface WalletTransaction {
  id: string;
  title: string;
  amount: string;       // Display string e.g. "+75 грн" or "-250 грн"
  numericAmount: number; // Signed number: positive for income, negative for expense
  status: string;
  type: TransactionType;
  createdAt: string;
}

interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
}

interface WalletActions {
  topUp: (amount: number, method: string) => void;
  withdraw: (amount: number, fee: number, method: string, cardLast4: string) => void;
  addQuestReward: (questTitle: string, amount: number) => void;
  setBalance: (balance: number) => void;
}

export type WalletStore = WalletState & WalletActions;

function generateId() {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const initialTransactions: WalletTransaction[] = [
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
    transactions: initialTransactions,

    topUp: (amount, method) =>
      set((state) => {
        state.balance += amount;
        state.transactions.unshift({
          id: generateId(),
          title: 'Поповнення балансу',
          amount: `+${amount} грн`,
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
          amount: `+${amount} грн`,
          numericAmount: amount,
          status: 'Виплачено',
          type: 'quest_reward',
          createdAt: new Date().toISOString(),
        });
      }),

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
export const selectTransactions = (state: WalletStore) => state.transactions;
