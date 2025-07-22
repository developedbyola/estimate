import React from 'react';
import { Space } from '@/constants';
import { Stack } from 'expo-router';
import { Button } from 'react-native';
import Calculations from './Calculations';
import { estimateSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import {
  Action,
  Box,
  Field,
  Overlay,
  Safe,
  Scroll,
  useOverlay,
} from '@/components';

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
            <Field.Content>
              <Field.TextInput placeholder='Estimate title' />
            </Field.Content>
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

  const form = useForm({
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      title: 'New Estimate',
      calculations: [
        {
          quantity: '1',
          unitPrice: '100',
          operation: 'add',
          attachedTo: null,
          id: Date.now().toString(),
          description: 'Electricity',
        },
      ],
    },
  });

  const values = useWatch({ control: form.control });

  return (
    <Safe
      bg='bg.base'
      style={{ flex: 1 }}
    >
      <Scroll style={{ flex: 1 }}>
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
                    trigger={<Button title='Change title' />}
                  />
                );
              },
              headerRight: () => {
                // if (isLoading) {
                //   return <ActivityIndicator />;
                // }

                return <Button title={'Create'} />;
              },
            }}
          />
          <Box mt='3xl'>
            <Calculations />
          </Box>
        </FormProvider>
      </Scroll>
    </Safe>
  );
};
