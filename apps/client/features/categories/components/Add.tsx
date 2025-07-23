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

  const title = categoryId
    ? 'Update this category data'
    : 'Add category to manage farms';
  const subTitle = categoryId
    ? 'Update category details to keep your information accurate and up-to-date for better estimate management.'
    : "Create a new category to easily manage and organize all your farm's information and estimates in a single, convenient location.";

  const isPending = createStatus === 'pending' || updateStatus === 'pending';
  const btnLabel = categoryId ? 'Update' : 'Save';

  return (
    <Safe
      bg='bg.base'
      style={{ flex: 1 }}
    >
      <Box style={{ flex: 1 }}>
        <Box
          px='xl'
          mt='4xl'
          style={{ gap: Space['lg'] }}
        >
          <Heading
            size='3xl'
            leading='xl'
            style={{ maxWidth: 280 }}
          >
            {title}
          </Heading>
          <Text
            color='text.soft'
            style={{ maxWidth: 320 }}
          >
            {subTitle}
          </Text>
        </Box>

        <Box
          px='xl'
          mt='4xl'
        >
          <FormProvider {...form}>
            <Form />
          </FormProvider>
        </Box>
      </Box>
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
            await createCategory(values as any);
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
