import React from 'react';
import { Category } from '../types';
import { useGetCategories } from '../hooks/useGetCategories';

type State = {
  loading: boolean;
  categories: Category[];
};

type Action =
  | {
      type: 'SET_CATEGORIES';
      payload: { categories: Category[] };
    }
  | {
      type: 'ADD_CATEGORY';
      payload: { category: Category };
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
      return {
        ...state,
        categories: action.payload.categories,
        loading: false,
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [action.payload.category, ...state.categories],
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
  initialState?: State;
};

const Get = () => {
  useGetCategories();
  return null;
};

export const Provider = ({
  children,
  initialState = { categories: [], loading: true },
}: CategoryProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <categoryContext.Provider
      value={{
        ...state,
        setCategories: dispatch,
      }}
    >
      <Get />
      {children}
    </categoryContext.Provider>
  );
};
