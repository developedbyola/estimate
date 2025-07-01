import React from 'react';
import { Space } from '@/constants';
import { Stack } from 'expo-router';
import { Alert, Button } from 'react-native';
import Calculations from './Calculations';
import { estimateSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import {
  Action,
  ActivityIndicator,
  Box,
  Field,
  Overlay,
  Safe,
  Scroll,
  useOverlay,
} from '@/components';
import { useEstimates } from './Provider';
import { trpc } from '@/lib/trpc';
import { useFarms } from '@/features/farms';
import { useRouter } from 'expo-router';

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
  const router = useRouter();
  const { farm } = useFarms();
  const colors = useThemeColors();
  const { setEstimates } = useEstimates();

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

  const create = trpc.userEstimates.create.useMutation({
    onSuccess: (data: any) => {
      setEstimates({
        type: 'ADD_ESTIMATE',
        payload: { estimate: data?.estimate },
      });
      form.reset();
      router.back();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to create estimate');
    },
  });

  const onSubmit = async () => {
    const values = form.getValues();
    await create.mutateAsync({
      title: values.title,
      farmId: farm?.id || '',
      calculations: values.calculations,
    });
  };

  const isLoading = create.isPending;

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
                    trigger={<Button title='Title' />}
                  />
                );
              },
              headerRight: () => {
                if (isLoading) {
                  return <ActivityIndicator />;
                }

                return (
                  <Button
                    title='Create'
                    onPress={async () => await onSubmit()}
                  />
                );
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
