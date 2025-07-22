import React from 'react';
import { Form } from './Form';
import { Space } from '@/constants';
import type { Farm } from '../types';
import { farmSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateFarm } from '../hooks/useCreateFarm';
import { useUpdateFarm } from '../hooks/useUpdateFarm';
import { FormProvider, useForm } from 'react-hook-form';
import { Action, Box, Heading, Safe, Scroll, Text } from '@/components';

type AddProps = {
  farm?: Farm;
};

export const Add = ({ farm }: AddProps) => {
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
  const title = farm ? 'Update ' : 'Set a new farm record for your estimates';
  const subTitle = farm
    ? 'Update your farm details to keep your information accurate and up-to-date for better estimate management.'
    : "Create a new farm profile to easily manage and organize all your farm's information and estimates in a single, convenient location.";

  const btnLabel = farm ? 'Update farm' : 'Create farm';

  return (
    <Safe style={{ flex: 1 }}>
      <Scroll
        mb='xl'
        style={{ flex: 1 }}
      >
        <Box
          px='xl'
          mt='4xl'
          style={{ gap: Space.lg }}
        >
          <Heading
            size='3xl'
            leading='lg'
            style={{ maxWidth: 280 }}
          >
            {title}
          </Heading>
          <Text color='text.soft'>{subTitle}</Text>
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

      <Box px='xl'>
        <Action.Root
          size='xl'
          loading={isPending}
          disabled={!form.formState.isValid || isPending}
          onPress={form.handleSubmit(async (value) => {
            if (farm) {
              await update({ farmId: farm.id, ...value });
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
