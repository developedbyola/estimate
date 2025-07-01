import React from 'react';

type CalculationItem = {
  id: string;
  quantity: string;
  unit_price: string;
  description: string;
  operation: 'add' | 'subtract';
  attached_to: string | null;
};

type Estimate = {
  id: string;
  title: string;
  calculations: CalculationItem[];
};

type State = {
  estimates: Estimate[];
  estimate: Estimate | null;
};

type Action =
  | {
      type: 'SET_ESTIMATES';
      payload: { estimates: State['estimates'] };
    }
  | {
      type: 'SET_ESTIMATE';
      payload: { estimate: State['estimate'] };
    }
  | {
      type: 'ADD_ESTIMATE';
      payload: { estimate: NonNullable<State['estimate']> };
    }
  | {
      type: 'REMOVE_ESTIMATE';
      payload: { id: string };
    }
  | {
      type: 'UPDATE_ESTIMATE';
      payload: { estimate: NonNullable<State['estimate']> };
    };

type EstimateContext = State & {
  setEstimates: React.ActionDispatch<[Action]>;
};

const estimateContext = React.createContext<EstimateContext | null>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ESTIMATES':
      return { ...state, estimates: action.payload.estimates };
    case 'SET_ESTIMATE':
      return {
        ...state,
        estimates: state.estimates.map((estimate) =>
          estimate.id === action.payload?.estimate?.id
            ? action.payload.estimate
            : estimate
        ),
        estimate: action.payload.estimate,
      };
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
  initialEstimates?: Estimate[];
};

export const Provider: React.FC<Props> = ({
  children,
  initialEstimates = [],
}) => {
  const [state, dispatch] = React.useReducer(reducer, {
    estimates: initialEstimates,
    estimate: null,
  });

  return (
    <estimateContext.Provider
      value={{
        setEstimates: dispatch,
        estimate: state.estimate,
        estimates: state.estimates,
      }}
    >
      {children}
    </estimateContext.Provider>
  );
};
