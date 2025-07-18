import React from 'react';

export type User = {
  id: string;
  email: string;
  createdAt: string;
  isOnboarded: boolean;
};

export type State = {
  isLoading: boolean;
  user: User | null;
};

export type Action =
  | {
      type: 'SET_USER';
      payload: { user: User };
    }
  | {
      type: 'UPDATE_USER';
      payload: { user: Partial<User> };
    }
  | {
      type: 'ERROR';
      payload?: never;
    };

type UserContext = State & {
  setUser: React.ActionDispatch<[Action]>;
};

export const userContext = React.createContext<UserContext | null>(null);

export const useUser = () => {
  const context = React.useContext(userContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const userReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        isLoading: false,
        user: {
          ...state.user,
          ...action.payload,
        } as User,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        user: state.user,
      };
    default:
      return state;
  }
};

export const Provider = ({
  children,
  initialState = {
    isLoading: true,
    user: null,
  },
}: {
  children: React.ReactNode;
  initialState?: State;
}) => {
  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return (
    <userContext.Provider value={{ ...state, setUser: dispatch }}>
      {children}
    </userContext.Provider>
  );
};
