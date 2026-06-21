import { useMemo } from 'react';

import { achievements, leaderboard, walletTransactions } from '@/data/questme';

export function useProfileDashboard() {
  return useMemo(
    () => ({
      achievements,
      leaderboard,
      stats: {
        completed: '234',
        created: '18',
        earned: '4,820 грн',
        level: 'Level 7',
        title: 'Квест-Мастер',
        wallet: '1,245 грн',
      },
      transactions: walletTransactions,
    }),
    []
  );
}
