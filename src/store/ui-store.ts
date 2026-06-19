import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type ModalType =
  | 'create-quest'
  | 'quest-complete'
  | 'achievement-unlocked'
  | 'confirm-delete'
  | 'settings'
  | 'camera'
  | null;

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UIState {
  activeModal: ModalType;
  modalData: Record<string, unknown> | null;
  toasts: Toast[];
  isRefreshing: boolean;
  tabBarVisible: boolean;
  searchBarExpanded: boolean;
  bottomSheetOpen: boolean;
  hapticEnabled: boolean;
  animationsEnabled: boolean;
  keyboardVisible: boolean;
}

interface UIActions {
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  setRefreshing: (refreshing: boolean) => void;
  setTabBarVisible: (visible: boolean) => void;
  setSearchBarExpanded: (expanded: boolean) => void;
  setBottomSheetOpen: (open: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setKeyboardVisible: (visible: boolean) => void;
}

export type UIStore = UIState & UIActions;

let toastCounter = 0;

export const useUIStore = create<UIStore>()(
  immer((set) => ({
    activeModal: null,
    modalData: null,
    toasts: [],
    isRefreshing: false,
    tabBarVisible: true,
    searchBarExpanded: false,
    bottomSheetOpen: false,
    hapticEnabled: true,
    animationsEnabled: true,
    keyboardVisible: false,

    openModal: (modal, data) =>
      set((state) => {
        state.activeModal = modal;
        state.modalData = data ?? null;
      }),

    closeModal: () =>
      set((state) => {
        state.activeModal = null;
        state.modalData = null;
      }),

    addToast: (type, message, duration = 3000) =>
      set((state) => {
        toastCounter += 1;
        state.toasts.push({
          id: `toast-${toastCounter}`,
          type,
          message,
          duration,
        });
      }),

    removeToast: (id) =>
      set((state) => {
        state.toasts = state.toasts.filter((t) => t.id !== id);
      }),

    clearToasts: () =>
      set((state) => {
        state.toasts = [];
      }),

    setRefreshing: (refreshing) =>
      set((state) => {
        state.isRefreshing = refreshing;
      }),

    setTabBarVisible: (visible) =>
      set((state) => {
        state.tabBarVisible = visible;
      }),

    setSearchBarExpanded: (expanded) =>
      set((state) => {
        state.searchBarExpanded = expanded;
      }),

    setBottomSheetOpen: (open) =>
      set((state) => {
        state.bottomSheetOpen = open;
      }),

    setHapticEnabled: (enabled) =>
      set((state) => {
        state.hapticEnabled = enabled;
      }),

    setAnimationsEnabled: (enabled) =>
      set((state) => {
        state.animationsEnabled = enabled;
      }),

    setKeyboardVisible: (visible) =>
      set((state) => {
        state.keyboardVisible = visible;
      }),
  }))
);

export const selectActiveModal = (state: UIStore) => state.activeModal;
export const selectToasts = (state: UIStore) => state.toasts;
