import React from 'react';
import { Calculations } from '../schemas';

type Estimate = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
  operation: 'add' | 'subtract';
  attachedTo: string | null;
  calculations: Calculations;
};

type State = {
  estimates: Estimate[];
};

type Action =
  | {
      type: 'SET_ESTIMATES';
      payload: State;
    }
  | {
      type: 'SET_ESTIMATE';
      payload: { estimate: Estimate };
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

type EstimateContext = {
  estimates: Estimate[];
  setEstimates: React.ActionDispatch<[Action]>;
};

const estimateContext = React.createContext<EstimateContext | null>(null);

export const useEstimates = () => {
  const context = React.useContext(estimateContext);
  if (!context) {
    throw new Error('useEstimates must be used within an EstimateProvider');
  }
  return context;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ESTIMATES':
      return { ...state, estimates: action.payload.estimates };
    case 'SET_ESTIMATE':
      return {
        ...state,
        estimates: state.estimates.map((estimate) =>
          estimate.id === action.payload.estimate.id
            ? action.payload.estimate
            : estimate
        ),
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
  });

  return (
    <estimateContext.Provider
      value={{ estimates: state.estimates, setEstimates: dispatch }}
    >
      {children}
    </estimateContext.Provider>
  );
};
