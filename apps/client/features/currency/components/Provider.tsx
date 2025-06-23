import React from 'react';
import Currencies from '../constants/Currencies';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const useCurrency = () => {
  const context = React.useContext(currencyContext);

  if (!context) {
    throw new Error(
      'useCurrency must be used within <Currency.Provider> component'
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

const CURRENCY_KEY = '@currency';

type Props = {
  children: React.ReactNode;
  defaultCurrency?: Currency;
};

export const Provider = ({
  children,
  defaultCurrency = Currencies[0],
}: Props) => {
  const [state, dispatch] = React.useReducer(currencyReducer, {
    currency: defaultCurrency,
  });

  React.useEffect(() => {
    const loadCurrency = async () => {
      try {
        const stored = await AsyncStorage.getItem(CURRENCY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const currency = Currencies.find((c) => c.symbol === parsed.symbol);
          if (currency) {
            dispatch({ type: 'SET_CURRENCY', payload: { currency } });
          }
        }
      } catch (error) {
        console.error('Failed to load currency', error);
      }
    };

    loadCurrency();
  }, []);

  const setCurrency: CurrencyContext['setCurrency'] = async (action) => {
    dispatch(action);
    try {
      await AsyncStorage.setItem(
        CURRENCY_KEY,
        JSON.stringify(action.payload.currency)
      );
    } catch (error) {
      console.error('Failed to save currency', error);
    }
  };

  return (
    <currencyContext.Provider value={{ currency: state.currency, setCurrency }}>
      {children}
    </currencyContext.Provider>
  );
};
