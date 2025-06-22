import React from 'react';
import {
  CurrencyContext,
  currencyContext,
  currencyDefaultState,
  currencyReducer,
  useCurrencyContext,
} from '../contexts/currency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Currencies from '../constants/Currencies';
import { Action, Box, Heading, Overlay, useOverlayContext } from '@/components';
import { Picker } from '@react-native-picker/picker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { currencySchema } from '../schemas';

const CURRENCY_KEY = '@currency';

type Props = {
  children: React.ReactNode;
};

export const Provider = (props: Props) => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(
    currencyReducer,
    currencyDefaultState
  );

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

type RootRef = React.ComponentRef<typeof Box>;
type RootProps = React.ComponentProps<typeof Box>;
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { ...restProps } = props;

  return (
    <Provider>
      <Box
        ref={ref}
        {...restProps}
      />
    </Provider>
  );
});

type SwitchProps = {
  children: React.ReactNode;
};

const Switch = ({ children }: SwitchProps) => {
  const { currency, setCurrency } = useCurrencyContext();
  const form = useForm({
    resolver: zodResolver(currencySchema),
    defaultValues: { currency: currency.label },
  });

  const Footer = () => {
    const { bottomSheet } = useOverlayContext();

    return (
      <Box
        pt='lg'
        pb='6xl'
        px='lg'
        bg='background'
        style={{
          bottom: 0,
          width: '100%',
          position: 'absolute',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box
          mx='auto'
          style={{ maxWidth: 320, width: '100%' }}
        >
          <Action.Root
            onPress={form.handleSubmit((value) => {
              const currency = Currencies.find(
                (c) => c.label === (value.currency as any)
              )!;

              setCurrency({ type: 'SET_CURRENCY', payload: { currency } });
              bottomSheet.close();
            })}
          >
            <Action.Label>Change preferred currency</Action.Label>
          </Action.Root>
        </Box>
      </Box>
    );
  };

  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
      <Overlay.Sheet snapPoints={['56%']}>
        <Box
          my='lg'
          px='xl'
        >
          <Heading
            size='2xl'
            leading='xl'
            align='center'
            weight='medium'
            style={{ maxWidth: 200, marginHorizontal: 'auto' }}
          >
            Change your preferred currency
          </Heading>
        </Box>

        <Box
          px='xl'
          my='2xl'
          mx='auto'
          style={{ maxWidth: 320, width: '100%' }}
        >
          <Controller
            name='currency'
            control={form.control}
            render={({ field }) => {
              return (
                <Picker
                  selectedValue={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  {Currencies.map((currency, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        value={currency.label}
                        label={`${currency.name} ${currency.symbol}`}
                      />
                    );
                  })}
                </Picker>
              );
            }}
          />
        </Box>

        <Footer />
      </Overlay.Sheet>
    </Overlay.Root>
  );
};

const Currency = {
  Provider,
  Root,
  Switch,
};
export default Currency;
