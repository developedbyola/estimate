import React from 'react';

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
  accessToken: string | null;
  isAuthenticated: boolean;
};

type State = Auth;

export type Action =
  | {
      type: 'LOGIN';
      payload: Pick<Auth, 'accessToken' | 'isAuthenticated'>;
    }
  | { type: 'LOGOUT'; payload: never };

export type AuthContext = State & {
  setAuth: React.ActionDispatch<[Action]>;
};

export const authContext = React.createContext<AuthContext | null>(null);

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
        accessToken: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const useAuth = () => {
  const context = React.useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
