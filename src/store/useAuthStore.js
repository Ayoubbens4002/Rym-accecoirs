import { create } from 'zustand';
import api, { fetchCsrfCookie } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      await fetchCsrfCookie();
      const response = await api.get('/auth/user');
      const user = response.data.user;
      if (user?.role === 'admin') {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await fetchCsrfCookie();
      const response = await api.post('/auth/login', credentials);
      const user = response.data.user;
      if (user?.role !== 'admin') {
        set({ error: 'Accès réservé à l\'administrateur.', isLoading: false });
        return { success: false, message: 'Accès réservé à l\'administrateur.' };
      }
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        (error.response?.status === 419
          ? 'Session expirée. Rechargez la page et réessayez.'
          : 'Connexion impossible. Vérifiez que l\'API Laravel tourne.');
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetchCsrfCookie();
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
