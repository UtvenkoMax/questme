import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
}));
