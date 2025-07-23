import React from 'react';
import { Form } from './Form';
import { Space } from '@/constants';
import { useFarms } from './Provider';
import { farmSchema } from '../schemas';
import { useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateFarm } from '../hooks/useCreateFarm';
import { useUpdateFarm } from '../hooks/useUpdateFarm';
import { FormProvider, useForm } from 'react-hook-form';
import { Action, Box, Heading, Safe, Scroll, Text } from '@/components';

export const Add = () => {
  const { farms } = useFarms();
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  const farm = farms.find((farm) => farm.id === farmId);

  const { mutate: update, status: updateStatus } = useUpdateFarm();
  const { mutate: create, status: createStatus } = useCreateFarm();
  const form = useForm({
    mode: 'all',
    defaultValues: {
      name: farm?.name || '',
      size: farm?.size || '',
      state: farm?.state || '',
      city: farm?.city || '',
      address: farm?.address || '',
      categoryId: farm?.categoryId || '',
      sizeUnit: farm?.sizeUnit || 'acres',
    },
    resolver: zodResolver(farmSchema),
  });

  const isPending = createStatus === 'pending' || updateStatus === 'pending';
  const title = farm
    ? 'Update this farm record details'
    : 'Set a new farm record for your estimates';
  const subTitle = farm
    ? 'Update your farm details to keep your information accurate and up-to-date.'
    : "Create a new farm profile to easily manage and organize all your farm's data and estimates.";

  const btnLabel = farm ? 'Update farm' : 'Create farm';

  return (
    <Safe style={{ flex: 1 }}>
      <Scroll style={{ flex: 1 }}>
        <Box
          px='xl'
          mt='4xl'
          style={{ gap: Space.lg }}
        >
          <Heading
            size='3xl'
            leading='lg'
            align='center'
            style={{ maxWidth: 280, marginInline: 'auto' }}
          >
            {title}
          </Heading>
          <Text
            align='center'
            color='text.soft'
            style={{ maxWidth: 320, marginInline: 'auto' }}
          >
            {subTitle}
          </Text>
        </Box>

        <Box
          px='xl'
          mt='4xl'
          style={{ flex: 1 }}
        >
          <FormProvider {...form}>
            <Form />
          </FormProvider>
        </Box>
      </Scroll>

      <Box
        px='xl'
        bg='bg.base'
        style={{}}
      >
        <Action.Root
          size='xl'
          loading={isPending}
          disabled={
            !form.formState.isValid || !form.formState.isDirty || isPending
          }
          onPress={form.handleSubmit(async (value) => {
            if (farm) {
              await update({ farmId, ...value });
              return;
            }
            await create(value);
          })}
        >
          <Action.Loader />
          <Action.Label
            size='lg'
            weight='medium'
          >
            {btnLabel}
          </Action.Label>
        </Action.Root>
      </Box>
    </Safe>
  );
};
