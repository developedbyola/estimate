import React from 'react';
import { Form } from './Form';
import { Category } from '../types';
import { FormProvider, useForm } from 'react-hook-form';
import { categorySchema } from '../schemas';
import { useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scroll, Safe, Box, Action, Heading, Text } from '@/components';
import { useCreateCategory } from '../hooks/useCreateCategory';
import { useUpdateCategory } from '../hooks/useUpdateCategory';
import { Space } from '@/constants';

type AddProps = {
  category?: Category;
};

export const Add = ({ category }: AddProps) => {
  const { mutate: createCategory, status: createStatus } = useCreateCategory();
  const { mutate: updateCategory, status: updateStatus } = useUpdateCategory();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      icon: category?.icon || '',
    },
  });

  const title = categoryId ? 'Update category' : 'Add category';
  const subTitle = categoryId
    ? 'Update category details to keep your information accurate and up-to-date for better estimate management.'
    : "Create a new category to easily manage and organize all your farm's information and estimates in a single, convenient location.";

  const isPending = createStatus === 'pending' || updateStatus === 'pending';

  return (
    <Safe>
      <Scroll style={{ flex: 1 }}>
        <Box style={{ gap: Space['xl'] }}>
          <Heading
            size='3xl'
            leading='lg'
            style={{ maxWidth: 280 }}
          >
            {title}
          </Heading>
          <Text color='text.soft'>{subTitle}</Text>
        </Box>

        <Box px='xl'>
          <FormProvider {...form}>
            <Form />
          </FormProvider>
        </Box>
      </Scroll>
      <Box
        px='xl'
        mt='4xl'
      >
        <Action.Root
          size='xl'
          loading={isPending}
          disabled={isPending || !form.formState.isValid}
          onPress={form.handleSubmit(async (values) => {
            if (categoryId) {
              await updateCategory({
                categoryId,
                ...values,
              });
              return;
            }
            await createCategory(values);
          })}
        >
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
