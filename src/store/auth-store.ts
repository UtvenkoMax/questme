import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { AuthSession, UserProfile } from '@/services/auth-service';

type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  profile: UserProfile | null;
  session: AuthSession | null;
  pinVerified: boolean;
  biometricVerified: boolean;
  loginAttempts: number;
  lastLoginAt: string | null;
}

interface AuthActions {
  setStatus: (status: AuthStatus) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSession: (session: AuthSession | null) => void;
  setPinVerified: (verified: boolean) => void;
  setBiometricVerified: (verified: boolean) => void;
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
  login: (profile: UserProfile, session: AuthSession) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, 'name' | 'email'>>) => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  status: 'idle',
  profile: null,
  session: null,
  pinVerified: false,
  biometricVerified: false,
  loginAttempts: 0,
  lastLoginAt: null,
};

export const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    ...initialState,

    setStatus: (status) =>
      set((state) => {
        state.status = status;
      }),

    setProfile: (profile) =>
      set((state) => {
        state.profile = profile;
      }),

    setSession: (session) =>
      set((state) => {
        state.session = session;
        state.status = session ? 'authenticated' : 'unauthenticated';
      }),

    setPinVerified: (verified) =>
      set((state) => {
        state.pinVerified = verified;
      }),

    setBiometricVerified: (verified) =>
      set((state) => {
        state.biometricVerified = verified;
      }),

    incrementLoginAttempts: () =>
      set((state) => {
        state.loginAttempts += 1;
      }),

    resetLoginAttempts: () =>
      set((state) => {
        state.loginAttempts = 0;
      }),

    login: (profile, session) =>
      set((state) => {
        state.profile = profile;
        state.session = session;
        state.status = 'authenticated';
        state.pinVerified = true;
        state.loginAttempts = 0;
        state.lastLoginAt = new Date().toISOString();
      }),

    logout: () =>
      set((state) => {
        state.profile = null;
        state.session = null;
        state.status = 'unauthenticated';
        state.pinVerified = false;
        state.biometricVerified = false;
        state.lastLoginAt = null;
      }),

    updateProfile: (updates) =>
      set((state) => {
        if (state.profile) {
          if (updates.name !== undefined) state.profile.name = updates.name;
          if (updates.email !== undefined) state.profile.email = updates.email;
        }
      }),
  }))
);

/** Selectors for optimized re-renders */
export const selectIsAuthenticated = (state: AuthStore) => state.status === 'authenticated';
export const selectProfile = (state: AuthStore) => state.profile;
export const selectAuthStatus = (state: AuthStore) => state.status;
