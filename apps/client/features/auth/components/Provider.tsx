import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export type Auth = {
  accessToken: string | null;
  isAuthenticated: boolean;
};

type State = { auth: Auth };

export type Action =
  | {
      type: 'LOGIN';
      payload: { auth: Auth };
    }
  | { type: 'LOGOUT'; payload?: never };

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
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          accessToken: null,
          isAuthenticated: false,
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

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    auth: {
      accessToken: null,
      isAuthenticated: false,
    },
  });

  React.useEffect(() => {
    const validateAuth = async () => {
      const accessToken = await AsyncStorage.getItem('access_token');

      if (!accessToken) return;

      dispatch({
        type: 'LOGIN',
        payload: { auth: { accessToken, isAuthenticated: true } },
      });
    };

    validateAuth();
  }, []);

  return (
    <authContext.Provider value={{ ...state, setAuth: dispatch }}>
      {children}
    </authContext.Provider>
  );
};
