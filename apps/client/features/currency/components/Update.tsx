import { currencySchema } from '../schemas';
import Currencies from '../constants/Currencies';
import { Provider, useCurrency } from './Provider';
import { Picker } from '@react-native-picker/picker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Action, Box, Heading, Overlay } from '@/components';

type SwitchProps = {
  children: React.ReactNode;
};

export const Update = ({ children }: SwitchProps) => {
  const { currency, setCurrency } = useCurrency();
  const form = useForm({
    resolver: zodResolver(currencySchema),
    defaultValues: { currency: currency.label },
  });

  const Footer = () => {
    const { bottomSheet } = Overlay.use();

    return (
      <Box
        pt='lg'
        pb='6xl'
        px='lg'
        bg='bg.base'
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
    <Provider>
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
    </Provider>
  );
};
