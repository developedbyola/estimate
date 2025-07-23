import React from 'react';
import { Form } from './Form';
import { Space } from '@/constants';
import { useCategories } from './Provider';
import { categorySchema } from '../schemas';
import { useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Safe, Box, Action, Heading, Text } from '@/components';
import { useCreateCategory } from '../hooks/useCreateCategory';
import { useUpdateCategory } from '../hooks/useUpdateCategory';

export const Add = () => {
  const { categories } = useCategories();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const category = categories.find((c) => c.id === id);

  const { mutate: createCategory, status: createStatus } = useCreateCategory();
  const { mutate: updateCategory, status: updateStatus } = useUpdateCategory();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      icon: category?.icon || '🥜',
    },
  });

  const title = category
    ? 'Update data for ' + category.name
    : 'Add category to manage farms';
  const subTitle = category
    ? 'Update category details to keep your information accurate and up-to-date for better estimate management.'
    : "Create a new category to easily manage and organize your farm's data and estimates.";

  const isPending = createStatus === 'pending' || updateStatus === 'pending';
  const btnLabel = category ? 'Update' : 'Save';

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
          mt='8xl'
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
          disabled={
            isPending || !form.formState.isValid || !form.formState.isDirty
          }
          onPress={form.handleSubmit(async (values) => {
            if (category) {
              await updateCategory({
                categoryId: category.id,
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
            {btnLabel}
          </Action.Label>
        </Action.Root>
      </Box>
    </Safe>
  );
};
