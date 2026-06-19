import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import {
  getUserProfile,
  getAuthSession,
  hasPin,
  registerAccount,
  savePin,
  verifyPin,
  logout as logoutService,
  updateUserProfile,
  type RegistrationInput,
  type UserProfile,
} from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';

/** Check if user has an active session */
export function useAuthSession() {
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setStatus = useAuthStore((s) => s.setStatus);

  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      setStatus('checking');
      const [profile, session, pinExists] = await Promise.all([
        getUserProfile(),
        getAuthSession(),
        hasPin(),
      ]);

      if (profile) setProfile(profile);
      if (session) setSession(session);

      return { profile, session, pinExists };
    },
    staleTime: 60 * 1000,
  });
}

/** Get user profile */
export function useUserProfile() {
  const setProfile = useAuthStore((s) => s.setProfile);

  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const profile = await getUserProfile();
      if (profile) setProfile(profile);
      return profile;
    },
  });
}

/** Register new account */
export function useRegister() {
  const client = useQueryClient();
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (input: RegistrationInput) => {
      return registerAccount(input);
    },
    onSuccess: (profile) => {
      login(profile, { signedInAt: new Date().toISOString() });
      client.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/** Verify PIN */
export function useVerifyPin() {
  const setPinVerified = useAuthStore((s) => s.setPinVerified);
  const incrementAttempts = useAuthStore((s) => s.incrementLoginAttempts);

  return useMutation({
    mutationFn: async (pin: string) => {
      const valid = await verifyPin(pin);
      if (!valid) throw new Error('Невірний PIN-код.');
      return valid;
    },
    onSuccess: () => {
      setPinVerified(true);
    },
    onError: () => {
      incrementAttempts();
    },
  });
}

/** Save new PIN */
export function useSavePin() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (pin: string) => {
      await savePin(pin);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.auth.pin() });
    },
  });
}

/** Update profile */
export function useUpdateProfile() {
  const client = useQueryClient();
  const updateStore = useAuthStore((s) => s.updateProfile);

  return useMutation({
    mutationFn: async (data: Pick<UserProfile, 'name' | 'email'>) => {
      return updateUserProfile(data);
    },
    onMutate: (data) => {
      updateStore(data);
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
}

/** Logout */
export function useLogout() {
  const client = useQueryClient();
  const storeLogout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      await logoutService();
    },
    onSuccess: () => {
      storeLogout();
      client.clear();
    },
  });
}
