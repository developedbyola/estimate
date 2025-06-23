import React from 'react';
import { sum } from '../utils/sum';
import { Space } from '@/constants';
import Calculations from './Calculations';
import { calculationSchema } from '../schemas';
import { useCurrency } from '@/features/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { Action, Box, Heading, Overlay, Scroll, Text } from '@/components';

type Props = {
  children: React.ReactNode;
};

export const Add = ({ children }: Props) => {
  const { currency } = useCurrency();

  const form = useForm({
    resolver: zodResolver(calculationSchema),
    defaultValues: {
      calculations: [
        {
          id: Date.now().toString(),
          description: 'Electricity',
          quantity: '1',
          unitPrice: '100',
          operation: 'add',
          attachedTo: null,
        },
      ],
    },
  });

  const calculations = useWatch({
    control: form.control,
    name: 'calculations',
  });

  return (
    <Overlay.Root>
      <Overlay.SheetTrigger>{children}</Overlay.SheetTrigger>
      <Overlay.Sheet snapPoints={['95%']}>
        <FormProvider {...form}>
          <Box my='lg'>
            <Heading
              size='2xl'
              leading='xl'
              weight='medium'
              align='center'
              style={{ maxWidth: 200, marginHorizontal: 'auto' }}
            >
              Estimation{'\n'}
              <Text
                size='xl'
                leading='lg'
                align='center'
              >
                {`${currency.symbol}${sum(calculations as any).toFixed(2)}`}
              </Text>
            </Heading>
          </Box>
          <Scroll
            mt='2xl'
            mb='4xl'
          >
            <Calculations />
          </Scroll>
          <Box
            pt='lg'
            px='xl'
            pb='6xl'
            style={{
              bottom: 0,
              width: '100%',
              position: 'absolute',
              boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.05)`,
            }}
          >
            <Box
              mx='auto'
              style={{
                flex: 1,
                maxWidth: 320,
                width: '100%',
                gap: Space['xs'],
                flexDirection: 'row',
              }}
            >
              {/* <Currency.Switch>
                <Action.Root variant='ghost'>
                  <Action.Label>Currency</Action.Label>
                </Action.Root>
              </Currency.Switch> */}
              <Action.Root style={{ flex: 1 }}>
                <Action.Label>Create Estimate</Action.Label>
              </Action.Root>
            </Box>
          </Box>
        </FormProvider>
      </Overlay.Sheet>
    </Overlay.Root>
  );
};
