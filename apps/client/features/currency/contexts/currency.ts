import React from 'react';
import Currencies from '../constants/Currencies';

type Currency = (typeof Currencies)[number];

type State = {
  currency: Currency;
};

type Action = {
  type: 'SET_CURRENCY';
  payload: State;
};

export type CurrencyContext = State & {
  setCurrency: (action: Action) => Promise<void>;
};

export const currencyContext = React.createContext<CurrencyContext | null>(
  null
);

export const currencyDefaultState: State = {
  currency: Currencies[0],
};

export const useCurrencyContext = () => {
  const context = React.useContext(currencyContext);

  if (!context) {
    throw new Error(
      'useCurrencyContext must be used within <Currency.Provider> component'
    );
  }

  return context;
};

export const currencyReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload.currency,
      };
  }
};
