import React from 'react';
import { Form } from './Form';
import { Action, Box } from '@/components';
import { estimateSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useCreateEstimate } from '../hooks/useCreateEstimate';
import { useUpdateEstimate } from '../hooks/useUpdateEstimate';
import { useLocalSearchParams } from 'expo-router';
import { useEstimates } from './Provider';

export const Add = () => {
  const { mutate: create } = useCreateEstimate();
  const { mutate: update } = useUpdateEstimate();
  const { estimateId } = useLocalSearchParams<{ estimateId: string }>();

  const { estimates } = useEstimates();

  const estimate = estimates.find((estimate) => estimate.id === estimateId);

  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      title: estimate?.title || '',
      farmId: estimate?.farmId || '',
      calculations: estimate?.calculations || [
        {
          price: '0',
          quantity: '1',
          description: '',
          type: 'expense',
          id: String(Date.now()),
        },
        {
          price: '0',
          quantity: '1',
          type: 'income',
          description: '',
          id: String(Date.now()),
        },
      ],
    },
  });

  return (
    <FormProvider {...form}>
      <Box style={{ flex: 1 }}>
        <Box>
          <Form />
        </Box>
        <Action.Root
          size='lg'
          loading={form.formState.isSubmitting}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <Action.Loader />
          <Action.Label>Create estimate</Action.Label>
        </Action.Root>
      </Box>
    </FormProvider>
  );
};
