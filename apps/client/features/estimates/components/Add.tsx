import React from 'react';
import { Form } from './Form';
import { Stack, useRouter } from 'expo-router';
import { Button } from 'react-native';
import { FormProvider } from 'react-hook-form';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCreateEstimate } from '../hooks/useCreateEstimate';
import {
  Box,
  Text,
  Field,
  Action,
  Overlay,
  SegmentedControl,
  ActivityIndicator,
  RadioGroup,
} from '@/components';
import { Farms } from '@/features/farms';
import { excerpt } from '@/utils/excerpt';

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
  const { form, mutate } = useCreateEstimate();

  const title = form.watch('title');

  return (
    <React.Fragment>
      <FormProvider {...form}>
        <Stack.Screen
          options={{
            headerTitle: excerpt(title || 'Title', 20),
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: '600',
              color: colors.getColor(title ? 'text.strong' : 'text.soft'),
            },
            headerRight: () => {
              const router = useRouter();

              return (
                <Overlay.Root>
                  <Overlay.SheetTrigger>
                    <Button title='Edit' />
                  </Overlay.SheetTrigger>
                  <Overlay.Sheet snapPoints={['65%', '80%']}>
                    <Overlay.SheetContent style={{ flex: 1 }}>
                      <Field.Root
                        mt='2xl'
                        name='title'
                        style={{
                          gap: 8,
                          paddingBottom: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.getColor('border.base'),
                        }}
                        control={form.control as any}
                      >
                        <Field.Container
                          style={{
                            height: 36,
                            borderRadius: 8,
                          }}
                        >
                          <Field.Row>
                            <Field.TextInput placeholder='e.g October estimate' />
                          </Field.Row>
                        </Field.Container>
                      </Field.Root>

                      <Box
                        py='xl'
                        style={{ flex: 1 }}
                      >
                        <Farms.List isSelect />
                      </Box>
                    </Overlay.SheetContent>
                  </Overlay.Sheet>
                </Overlay.Root>
              );
            },
          }}
        />
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
      </FormProvider>
    </React.Fragment>
  );
};
