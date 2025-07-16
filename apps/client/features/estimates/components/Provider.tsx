import React from 'react';

type CalculationItem = {
  id: string;
  quantity: string;
  unit_price: string;
  description: string;
  operation: 'add' | 'subtract';
  attached_to: string | null;
};

export type Estimate = {
  id: string;
  title: string;
  calculations: CalculationItem[];
};

type State = {
  estimates: Estimate[];
};

type Action =
  | {
      type: 'SET_ESTIMATES';
      payload: { estimates: State['estimates'] };
    }
  | {
      type: 'ADD_ESTIMATE';
      payload: { estimate: Estimate };
    }
  | {
      type: 'REMOVE_ESTIMATE';
      payload: { id: string };
    }
  | {
      type: 'UPDATE_ESTIMATE';
      payload: { estimate: Estimate };
    };

type EstimateContext = State & {
  setEstimates: React.ActionDispatch<[Action]>;
};

const estimateContext = React.createContext<EstimateContext | null>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ESTIMATES':
      return { ...state, estimates: action.payload.estimates };
    case 'ADD_ESTIMATE':
      return {
        ...state,
        estimates: [...state.estimates, action.payload.estimate],
      };
    case 'REMOVE_ESTIMATE':
      return {
        ...state,
        estimates: state.estimates.filter(
          (estimate) => estimate.id !== action.payload.id
        ),
      };
    case 'UPDATE_ESTIMATE':
      return {
        ...state,
        estimates: state.estimates.map((estimate) =>
          estimate.id === action.payload.estimate.id
            ? action.payload.estimate
            : estimate
        ),
      };
    default:
      return state;
  }
};

export const useEstimates = () => {
  const context = React.useContext(estimateContext);
  if (!context) {
    throw new Error('useEstimates must be used within an EstimateProvider');
  }
  return context;
};

type Props = {
  children: React.ReactNode;
  initialState?: State;
};

export const Provider: React.FC<Props> = ({
  children,
  initialState = {
    estimates: [],
  },
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <estimateContext.Provider
      value={{
        setEstimates: dispatch,
        estimates: state.estimates,
      }}
    >
      {children}
    </estimateContext.Provider>
  );
};
