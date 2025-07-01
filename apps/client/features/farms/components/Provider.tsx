import React from 'react';
import { trpc } from '@/lib/trpc';
import { Category } from '@/features/categories';

export type Farm = {
  id: string;
  size: string;
  name: string;
  city: string;
  state: string;
  address: string;
  category_id: string;
  category: Omit<Category, 'created_at'>;
  size_unit: 'hectares' | 'acres' | 'square meters';
};

type State = {
  farms: Farm[];
  farm: Farm | null;
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
      payload: { farm: Farm };
    }
  | {
      type: 'REMOVE_FARM';
      payload: { farmId: string };
    }
  | {
      type: 'UPDATE_FARM';
      payload: { farm: Farm };
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
        farms: action.payload.farms,
      };
    case 'SET_FARM':
      return {
        ...state,
        farm: action.payload.farm,
      };
    case 'ADD_FARM':
      return { ...state, farms: [...state.farms, action.payload.farm] };
    case 'REMOVE_FARM':
      return {
        ...state,
        farm: null,
        farms: state.farms.filter((farm) => farm.id !== action.payload.farmId),
      };
    case 'UPDATE_FARM':
      return {
        ...state,
        farm:
          state.farm && state.farm.id === action.payload.farm.id
            ? { ...state.farm, ...action.payload.farm }
            : state.farm,
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

export const Provider = ({
  children,
  initialFarms = [],
}: FarmsProviderProps) => {
  const list = trpc.userFarms.list.useQuery();
  const [state, dispatch] = React.useReducer(farmsReducer, {
    farms: initialFarms,
    farm: null,
  });

  React.useEffect(() => {
    if (list.data) {
      dispatch({
        type: 'SET_FARMS',
        payload: {
          farms: (list.data as any)?.farms || [],
        },
      });
    }
  }, [list.data]);

  return (
    <farmsContext.Provider
      value={{
        farm: state.farm,
        setFarms: dispatch,
        farms: state.farms,
      }}
    >
      {children}
    </farmsContext.Provider>
  );
};
