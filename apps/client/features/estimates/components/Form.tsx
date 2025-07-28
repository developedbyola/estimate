import {
  Box,
  Text,
  Field,
  Scroll,
  Overlay,
  SegmentedControl,
} from '@/components';

import React from 'react';
import { Stack } from 'expo-router';
import { Button } from 'react-native';
import { Farms } from '@/features/farms';
import { excerpt } from '@/utils/excerpt';
import { StatusBar } from 'expo-status-bar';
import { EstimateSchema } from '../schemas';
import { Calculations } from './Calculations';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useFormContext } from 'react-hook-form';

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
    <SegmentedControl.Root>
      <SegmentedControl.Control
        values={['Expenses', 'Income']}
        selectedIndex={0}
      />
      <SegmentedControl.Content
        value={0}
        style={{ flex: 1 }}
      >
        <Calculations type='expense' />
      </SegmentedControl.Content>
      <SegmentedControl.Content
        value={1}
        style={{ flex: 1 }}
      >
        <Calculations type='income' />
      </SegmentedControl.Content>
    </SegmentedControl.Root>
  );
};

export const Form = () => {
  const colors = useThemeColors();
  const overlay = Overlay.useConfig();
  const form = useFormContext<EstimateSchema>();

  const title = form.watch('title');

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
      <Overlay.Provider value={overlay}>
        <Edit />
      </Overlay.Provider>
      <Type />
    </React.Fragment>
  );
};
