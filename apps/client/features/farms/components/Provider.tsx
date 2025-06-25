import React from 'react';
import { trpc } from '@/lib/trpc';
import { FarmSchema } from '../schemas';
import { Category } from '@/features/categories';

export type Farm = FarmSchema & {
  id: string;
  category: Omit<Category, 'created_at'>;
};

type State = {
  farms: Farm[];
  loading: boolean;
  error: ReturnType<typeof trpc.userFarms.list.useQuery>['error'];
  refetch: ReturnType<typeof trpc.userFarms.list.useQuery>['refetch'];
};

type Action =
  | {
      type: 'SET_FARMS';
      payload: { farms: Farm[] };
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

export const Provider = ({
  children,
  initialFarms = [],
}: FarmsProviderProps) => {
  const list = trpc.userFarms.list.useQuery();
  const [state, dispatch] = React.useReducer(farmsReducer, {
    error: null,
    loading: false,
    farms: initialFarms,
    refetch: list.refetch,
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
        error: list.error,
        setFarms: dispatch,
        farms: state.farms,
        loading: list.isLoading,
        refetch: list.refetch,
      }}
    >
      {children}
    </farmsContext.Provider>
  );
};
