import React from 'react';
import { Form } from './Form';
import { Category } from '../types';
import { useForm } from 'react-hook-form';
import { categorySchema } from '../schemas';
import { useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scroll, Safe, Box, Action } from '@/components';

type AddProps = {
  category?: Category;
};

export const Add = ({ category }: AddProps) => {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      icon: category?.icon || '',
    },
  });

  return (
    <Safe>
      <Scroll style={{ flex: 1 }}>
        <Box></Box>

        <Box>
          <Form />
        </Box>
      </Scroll>
      <Box
        px='xl'
        mt='4xl'
      >
        <Action.Root size='xl'>
          <Action.Loader />
          <Action.Label
            size='lg'
            weight='medium'
          >
            Save
          </Action.Label>
        </Action.Root>
      </Box>
    </Safe>
  );
};
