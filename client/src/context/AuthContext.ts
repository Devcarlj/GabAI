import { createContext } from 'react';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  avatar?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);