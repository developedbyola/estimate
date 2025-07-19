import React from 'react';
import { Profile } from '../types';

type State = {
  loading: boolean;
  profile: Profile | null;
};

type Action =
  | {
      type: 'SET_PROFILE';
      payload: { profile: Profile };
    }
  | {
      type: 'UPDATE_PROFILE';
      payload: { profile: Profile };
    }
  | {
      type: 'ERROR';
      payload?: never;
    };

type Context = State & {
  setProfile: React.Dispatch<Action>;
};

const profileContext = React.createContext<Context | null>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, loading: false, profile: action.payload.profile };
    case 'ERROR':
      return { ...state, loading: false, profile: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        loading: false,
        profile: action.payload.profile,
      };
    default:
      return state;
  }
};

export const useProfile = () => {
  const context = React.useContext(profileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

type Props = {
  initialState?: State;
  children: React.ReactNode;
};

export const Provider = ({
  children,
  initialState = {
    loading: true,
    profile: null,
  },
}: Props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <profileContext.Provider value={{ ...state, setProfile: dispatch }}>
      {children}
    </profileContext.Provider>
  );
};
