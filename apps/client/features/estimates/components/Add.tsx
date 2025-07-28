import {
  Box,
  Text,
  Field,
  Action,
  Scroll,
  Overlay,
  SegmentedControl,
} from '@/components';

import React from 'react';
import { Form } from './Form';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native';
import { Farms } from '@/features/farms';
import { excerpt } from '@/utils/excerpt';
import { StatusBar } from 'expo-status-bar';
import { useThemeColors } from '@/hooks/useThemeColors';
import { FormProvider, useFormContext } from 'react-hook-form';
import { useCreateEstimate } from '../hooks/useCreateEstimate';
import { useUpdateEstimate } from '../hooks/useUpdateEstimate';

const Edit = () => {
  const form = useFormContext();

  return (
    <Overlay.Sheet snapPoints={['65%', '80%']}>
      <Box
        mt='2xl'
        px='xl'
      >
        <Field.Root
          name='title'
          control={form.control as any}
        >
          <Field.Container
            style={{
              height: 36,
              borderRadius: 12,
            }}
          >
            <Field.Row>
              <Field.Label>Title</Field.Label>
              <Field.TextInput
                style={{ textAlign: 'right' }}
                placeholder='e.g October estimate'
              />
            </Field.Row>
          </Field.Container>
        </Field.Root>
      </Box>

      <Box
        bg='border.base'
        style={{ height: 1, marginBlock: 12 }}
      />

      <Scroll
        px='xl'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1, gap: 8 }}
      >
        <Text
          size='xl'
          style={{ fontWeight: '600' }}
          color='text.strong'
        >
          Farms
        </Text>
        <Farms.List isSelect />
      </Scroll>
    </Overlay.Sheet>
  );
};

const Type = () => {
  return (
    <React.Fragment>
      <SegmentedControl.Root>
        <SegmentedControl.Control
          values={['Expenses', 'Income']}
          selectedIndex={0}
        />
        <SegmentedControl.Content
          value={0}
          style={{ flex: 1 }}
        >
          <Form type='expense' />
        </SegmentedControl.Content>
        <SegmentedControl.Content
          value={1}
          style={{ flex: 1 }}
        >
          <Form type='income' />
        </SegmentedControl.Content>
      </SegmentedControl.Root>
    </React.Fragment>
  );
};

export const Add = () => {
  const colors = useThemeColors();
  const overlay = Overlay.useConfig();
  const { form, mutate } = useCreateEstimate();

  const title = form.watch('title');
  const { estimateId } = useLocalSearchParams<{ estimateId: string }>();

  const { mutate: create } = useCreateEstimate();
  const { mutate: update } = useUpdateEstimate();

  return (
    <React.Fragment>
      <StatusBar style={'light'} />
      <Stack.Screen
        options={{
          headerTitle: excerpt(title || 'Title', 20),
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: title ? '600' : '400',
            color: colors.getColor(title ? 'text.strong' : 'text.soft'),
          },
          headerRight: () => {
            return (
              <Button
                title='Edit'
                onPress={() => {
                  overlay.bottomSheet.open();
                }}
              />
            );
          },
        }}
      />
      <FormProvider {...form}>
        <Overlay.Provider
          value={overlay}
          style={{ flex: 1 }}
        >
          <Edit />
          <Box
            mt='3xl'
            pb='xl'
            px='xl'
            style={{ flex: 1 }}
          >
            <Type />
          </Box>

          <Box
            px='xl'
            py='xl'
            bg='bg.soft'
            style={{ minHeight: 102 }}
          >
            <Action.Root
              size='lg'
              onPress={() => mutate(form.getValues())}
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              style={{
                backgroundColor: colors.getColor('bg.strong'),
              }}
            >
              <Action.Loader />
              <Action.Label
                color='text.base'
                style={{ fontSize: 16, lineHeight: 18, fontWeight: '600' }}
              >
                Create estimate
              </Action.Label>
            </Action.Root>
          </Box>
        </Overlay.Provider>
      </FormProvider>
    </React.Fragment>
  );
};
