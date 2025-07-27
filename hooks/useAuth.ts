import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface DecodedToken {
  sub: string;
  user_id: string;
  exp: number;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  userId: null,
  isAuthenticated: false,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('access_token', token);
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        set({ token, userId: decoded.user_id, isAuthenticated: true });
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('access_token');
        set({ token: null, userId: null, isAuthenticated: false });
      }
    } else {
      localStorage.removeItem('access_token');
      set({ token: null, userId: null, isAuthenticated: false });
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null, userId: null, isAuthenticated: false });
  },
}));

// Initialize store on load
const initialToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
if (initialToken) {
  useAuthStore.getState().setToken(initialToken);
}