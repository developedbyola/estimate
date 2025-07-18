import React from 'react';
import * as SecureStore from 'expo-secure-store';

export type Auth = {
  refreshToken: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
};

type State = { isLoading: boolean; auth: Auth };

export type Action =
  | {
      type: 'LOGIN';
      payload: {
        auth: Pick<Auth, 'accessToken' | 'refreshToken'>;
      };
    }
  | {
      type: 'SET_TOKENS';
      payload: {
        auth: Pick<Auth, 'accessToken' | 'refreshToken'>;
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
      SecureStore.setItem('refresh_token', action.payload.auth.refreshToken!);
      return {
        ...state,
        isLoading: false,
        auth: {
          isAuthenticated: true,
          accessToken: action.payload.auth.accessToken,
          refreshToken: action.payload.auth.refreshToken,
        },
      };
    case 'SET_TOKENS':
      SecureStore.setItem('refresh_token', action.payload.auth.refreshToken!);
      return {
        ...state,
        isLoading: false,
        auth: {
          isAuthenticated: true,
          accessToken: action.payload.auth.accessToken,
          refreshToken: action.payload.auth.refreshToken,
        },
      };
    case 'LOGOUT':
      SecureStore.setItem('refresh_token', '');
      return {
        ...state,
        isLoading: false,
        auth: {
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        },
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        auth: {
          ...state.auth,
        },
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
    auth: {
      accessToken: null,
      refreshToken: refreshToken,
      isAuthenticated: !!refreshToken,
    },
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
