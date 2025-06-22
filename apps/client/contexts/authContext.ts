import React from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Session = {
  id: string;
  device_name: string;
  device_type: string;
  ip_address: string;
  is_active: boolean;
  created_at: string;
  os_version: string;
  app_version: string;
  device_id: string;
  user_id: string;
};

export type Auth = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
};

type State = Auth;

export type Action =
  | {
      type: 'LOGIN';
      payload: Pick<Auth, 'user' | 'session'>;
    }
  | { type: 'LOGOUT'; payload: never };

export type AuthContext = State & {
  setAuth: (action: Action) => Promise<void>;
};

export const AuthContext = React.createContext<AuthContext | null>(null);

export const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
