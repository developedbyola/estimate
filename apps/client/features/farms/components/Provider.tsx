import React from 'react';
import { FarmSchemaType } from '../schemas';

type Farm = FarmSchemaType & {
  id: string;
};

type State = {
  farms: Farm[];
};

type Action =
  | {
      type: 'SET_FARMS';
      payload: State;
    }
  | {
      type: 'SET_FARM';
      payload: { farm: Farm };
    }
  | {
      type: 'ADD_FARM';
      payload: { farm: Farm };
    }
  | {
      type: 'REMOVE_FARM';
      payload: { id: string };
    }
  | {
      type: 'UPDATE_FARM';
      payload: { farm: Farm };
    };

type farmContextType = {
  farms: Farm[];
  setFarms: React.Dispatch<Action>;
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
      return { ...state, farms: action.payload.farms };
    case 'SET_FARM':
      return {
        ...state,
        farms: state.farms.map((farm) =>
          farm.id === action.payload.farm.id ? action.payload.farm : farm
        ),
      };
    case 'ADD_FARM':
      return { ...state, farms: [...state.farms, action.payload.farm] };
    case 'REMOVE_FARM':
      return {
        ...state,
        farms: state.farms.filter((farm) => farm.id !== action.payload.id),
      };
    case 'UPDATE_FARM':
      return {
        ...state,
        farms: state.farms.map((farm) =>
          farm.id === action.payload.farm.id ? action.payload.farm : farm
        ),
      };
    default:
      return state;
  }
};

type FarmsProviderProps = {
  children: React.ReactNode;
  initialFarms?: Farm[];
};

export const Provider = ({ children, initialFarms }: FarmsProviderProps) => {
  const [state, dispatch] = React.useReducer(farmsReducer, {
    farms: initialFarms || [],
  });

  return (
    <farmsContext.Provider value={{ farms: state.farms, setFarms: dispatch }}>
      {children}
    </farmsContext.Provider>
  );
};
