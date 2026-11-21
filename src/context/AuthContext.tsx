import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'user';
  status: 'Active' | 'Inactive' | 'Suspended';
  phone?: string;
  joinDate?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('parlour_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Verify session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('parlour_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiFetch<{ success: boolean; user: User }>('/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
          setToken(storedToken);
          // Set legacy flag for backward compatibility
          localStorage.setItem('isAdmin', String(res.user.role === 'owner' || res.user.role === 'admin'));
        } else {
          logout();
        }
      } catch {
        // Expired or invalid token
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiFetch<{ success: boolean; token: string; user: User; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (res.success && res.token) {
        localStorage.setItem('parlour_token', res.token);
        localStorage.setItem('isAdmin', String(res.user.role === 'owner' || res.user.role === 'admin'));
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}! ✨`);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const res = await apiFetch<{ success: boolean; token: string; user: User; message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone })
      });

      if (res.success && res.token) {
        localStorage.setItem('parlour_token', res.token);
        localStorage.setItem('isAdmin', 'false');
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome to Shree Ambika, ${res.user.name}! 💖`);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please check your details.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('parlour_token');
    localStorage.setItem('isAdmin', 'false');
    setToken(null);
    setUser(null);
    toast.success('You have been signed out.');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'owner' || user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isOwner,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
