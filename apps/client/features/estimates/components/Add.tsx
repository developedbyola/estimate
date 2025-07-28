import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { estimateSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Action, Box } from '@/components';
import { Form } from './Form';

export const Add = () => {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(estimateSchema),
    defaultValues: {
      title: '',
      farmId: '',
      calculations: [
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
        <Action.Root size='lg'>
          <Action.Label>Create estimate</Action.Label>
        </Action.Root>
      </Box>
    </FormProvider>
  );
};
