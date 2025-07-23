import React from 'react';
import type { Farm } from '../types';

type State = {
  farms: Farm[];
  loading: boolean;
};

type Action =
  | {
      type: 'SET_FARMS';
      payload: { farms: Farm[] };
    }
  | {
      type: 'SET_FARM';
      payload: { farm: Farm | null };
    }
  | {
      type: 'ADD_FARM';
      payload: { farm: Omit<Farm, 'estimates'> };
    }
  | {
      type: 'REMOVE_FARM';
      payload: { farmId: string };
    }
  | {
      type: 'UPDATE_FARM';
      payload: { farm: Omit<Farm, 'estimates'> };
    }
  | {
      type: 'ERROR';
      payload?: never;
    };

type farmContextType = State & {
  setFarms: React.ActionDispatch<[Action]>;
};

const farmsContext = React.createContext<farmContextType | null>(null);

export const useFarms = () => {
  const context = React.useContext(farmsContext);
  if (!context) {
    throw new Error('useFarms must be used within a FarmsProvider');
  }
  return context;
};

const farmsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FARMS':
      return {
        ...state,
        loading: false,
        farms: action.payload.farms,
      };

    case 'ADD_FARM':
      return {
        ...state,
        farms: [...state.farms, action.payload.farm],
      };
    case 'UPDATE_FARM':
      return {
        ...state,
        farms: state.farms.map((farm) =>
          farm.id === action.payload.farm.id
            ? { ...farm, ...action.payload.farm }
            : farm
        ),
      };
    case 'REMOVE_FARM':
      return {
        ...state,
        farms: state.farms.filter((farm) => farm.id !== action.payload.farmId),
      };

    case 'ERROR':
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

type FarmsProviderProps = {
  children: React.ReactNode;
  initialState?: State;
};

export const Provider = ({
  children,
  initialState = { farms: [], loading: true },
}: FarmsProviderProps) => {
  const [state, dispatch] = React.useReducer(farmsReducer, initialState);

  return (
    <farmsContext.Provider
      value={{
        ...state,
        setFarms: dispatch,
      }}
    >
      {children}
    </farmsContext.Provider>
  );
};
