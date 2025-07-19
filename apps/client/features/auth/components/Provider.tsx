import React from 'react';
import * as SecureStore from 'expo-secure-store';

type Session = {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  lastActiveAt: string;
};

type User = {
  id: string;
  email: string;
  createdAt: string;
  isOnboarded: boolean;
};

type State = {
  isLoading: boolean;
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  session: Session | null;
};

export type Action =
  | {
      type: 'LOGIN';
      payload: {
        user: User;
        session: Session;
        accessToken: string;
        refreshToken: string;
      };
    }
  | {
      type: 'SET_TOKENS';
      payload: {
        user: User;
        session: Session;
        accessToken: string;
        refreshToken: string;
      };
    }
  | { type: 'LOGOUT'; payload?: never }
  | { type: 'ERROR'; payload?: never };

export type AuthContext = State & {
  setAuth: React.ActionDispatch<[Action]>;
};

export const authContext = React.createContext<AuthContext | null>(null);

export const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN':
      SecureStore.setItem('refresh_token', action.payload.refreshToken!);
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        session: action.payload.session,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
      };
    case 'SET_TOKENS':
      SecureStore.setItem('refresh_token', action.payload.refreshToken!);
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        session: action.payload.session,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      SecureStore.setItem('refresh_token', '');
      return {
        ...state,
        isLoading: false,
        user: null,
        session: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      };
    case 'ERROR':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
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

const refreshToken = SecureStore.getItem('refresh_token');

export const Provider = ({
  children,
  initialState = {
    isLoading: true,
    user: null,
    session: null,
    accessToken: null,
    refreshToken: refreshToken,
    isAuthenticated: !!refreshToken,
  },
}: {
  children: React.ReactNode;
  initialState?: State;
}) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  return (
    <authContext.Provider value={{ ...state, setAuth: dispatch }}>
      {children}
    </authContext.Provider>
  );
};
