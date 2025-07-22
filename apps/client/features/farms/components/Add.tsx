import React from 'react';
import { Form } from './Form';
import { Space } from '@/constants';
import { farmSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateFarm } from '../hooks/useCreateFarm';
import { FormProvider, useForm } from 'react-hook-form';
import { Action, Box, Heading, Safe, Scroll, Text } from '@/components';

export const Add = () => {
  const { mutate, status } = useCreateFarm();
  const form = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      size: '',
      state: '',
      city: '',
      address: '',
      categoryId: '',
      sizeUnit: 'acres',
    },
    resolver: zodResolver(farmSchema),
  });

  const isPending = status === 'pending';

  return (
    <Safe style={{ flex: 1 }}>
      <Scroll style={{ flex: 1 }}>
        <Box
          px='xl'
          mt='4xl'
          style={{ gap: Space.xl }}
        >
          <Heading
            size='3xl'
            leading='lg'
            style={{ maxWidth: 240 }}
          >
            Set a new farm record to keep your estimates
          </Heading>
          <Text color='text.soft'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
            laudantium veritatis necessitatibus odio exercitationem quas
            recusandae iste asperiores esse placeat ipsam molestias.
          </Text>
        </Box>
        <Box
          px='xl'
          mt='3xl'
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
            await mutate(value);
          })}
        >
          <Action.Loader />
          <Action.Label size='lg'>
            {isPending ? 'Creating...' : 'Create farm'}
          </Action.Label>
        </Action.Root>
      </Box>
    </Safe>
  );
};
