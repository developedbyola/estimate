import { trpc } from '@/lib/trpc';
import React from 'react';

type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type State = {
  loading: boolean;
  categories: Category[];
  error: ReturnType<typeof trpc.userCategories.list.useQuery>['error'];
  refetch: ReturnType<typeof trpc.userCategories.list.useQuery>['refetch'];
};

type Action =
  | {
      type: 'SET_CATEGORIES';
      payload: { categories: Category[] };
    }
  | {
      type: 'SET_CATEGORY';
      payload: { category: Category };
    }
  | {
      type: 'ADD_CATEGORY';
      payload: { category: Category };
    }
  | {
      type: 'REMOVE_CATEGORY';
      payload: { id: string };
    }
  | {
      type: 'UPDATE_CATEGORY';
      payload: { category: Category };
    };

type CategoryContext = State & {
  setCategories: React.Dispatch<Action>;
};
const categoryContext = React.createContext<CategoryContext | null>(null);

export const useCategories = () => {
  const context = React.useContext(categoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload.categories };
    case 'SET_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.category.id
            ? action.payload.category
            : category
        ),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload.category],
      };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload.id
        ),
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.category.id
            ? action.payload.category
            : category
        ),
      };
    default:
      return state;
  }
};

type CategoryProviderProps = {
  children: React.ReactNode;
  initialCategories?: Category[];
};

export const Provider = ({
  children,
  initialCategories = [],
}: CategoryProviderProps) => {
  const list = trpc.userCategories.list.useQuery();
  const [state, dispatch] = React.useReducer(reducer, {
    error: null,
    loading: false,
    refetch: list.refetch,
    categories: initialCategories,
  } as State);

  React.useEffect(() => {
    if (list.data) {
      dispatch({
        type: 'SET_CATEGORIES',
        payload: {
          categories: (list.data as any)?.categories || [],
        },
      });
    }
  }, [list.data]);

  return (
    <categoryContext.Provider
      value={{
        error: list.error,
        refetch: list.refetch,
        setCategories: dispatch,
        loading: list.isLoading,
        categories: state.categories,
      }}
    >
      {children}
    </categoryContext.Provider>
  );
};
