import React from 'react';
import Calculations from './Calculations';
import { estimateSchema } from '../schemas';
import { useCurrency } from '@/features/currency';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import {
  Action,
  Box,
  Field,
  Heading,
  Overlay,
  Scroll,
  Text,
  useOverlay,
} from '@/components';
import { Stack } from 'expo-router';
import { Button } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Space } from '@/constants';

const Title = ({
  trigger,
  control,
}: {
  trigger: React.ReactNode;
  control: any;
}) => {
  const overlay = useOverlay();

  return (
    <Overlay.Provider value={overlay}>
      <Overlay.SheetTrigger>{trigger}</Overlay.SheetTrigger>
      <Overlay.Sheet snapPoints={['20%']}>
        <Overlay.SheetContent>
          <Field.Root
            name='title'
            control={control as any}
            style={{ marginBottom: Space.lg }}
          >
            <Field.Control>
              <Field.TextInput placeholder='Estimate title' />
            </Field.Control>
            <Field.Feedback />
          </Field.Root>
          <Overlay.SheetTrigger>
            <Action.Root>
              <Action.Label>Save</Action.Label>
            </Action.Root>
          </Overlay.SheetTrigger>
        </Overlay.SheetContent>
      </Overlay.Sheet>
    </Overlay.Provider>
  );
};

export const Add = () => {
  const colors = useThemeColors();
  const { currency } = useCurrency();

  const form = useForm({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      title: 'New Estimate',
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

  const values = useWatch({ control: form.control });

  return (
    <FormProvider {...form}>
      <Stack.Screen
        options={{
          title: values.title,
          headerStyle: {
            backgroundColor: colors.getColor('bg.soft'),
          },
          headerTitleStyle: {
            fontWeight: '500',
            color: colors.getColor('text.strong'),
          },
          headerLeft: () => {
            return (
              <Title
                control={form.control}
                trigger={<Button title='Edit' />}
              />
            );
          },
          headerRight: () => {
            return <Button title='Create' />;
          },
        }}
      />

      <Scroll
        bg='bg.base'
        style={{ flex: 1 }}
      >
        <Box py='lg' />
        <Calculations />
      </Scroll>
    </FormProvider>
  );
};
