import React from 'react';
import { Form } from './Form';
import { Stack, useRouter } from 'expo-router';
import { Button } from 'react-native';
import { FormProvider } from 'react-hook-form';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useCreateEstimate } from '../hooks/useCreateEstimate';
import {
  Action,
  ActivityIndicator,
  Box,
  Field,
  Overlay,
  Scroll,
  SegmentedControl,
  Text,
} from '@/components';
import { Farms } from '@/features/farms';

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
  const { form } = useCreateEstimate();

  const title = form.watch('title');

  return (
    <React.Fragment>
      <FormProvider {...form}>
        <Stack.Screen
          options={{
            headerRight: () => {
              const router = useRouter();
              const { farms, loading } = Farms.useFarms();

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
                            height: 40,
                            borderRadius: 10,
                          }}
                        >
                          <Field.Row>
                            <Field.TextInput placeholder='e.g October estimate' />
                          </Field.Row>
                        </Field.Container>
                      </Field.Root>

                      <Box
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {loading ? <ActivityIndicator /> : null}
                        {farms.length === 0 ? (
                          <React.Fragment>
                            <Text
                              style={{
                                maxWidth: 200,
                                textAlign: 'center',
                                marginInline: 'auto',
                              }}
                            >
                              No farms found, create one to view a list of
                              available farms
                            </Text>
                            <Overlay.SheetTrigger
                              onPress={() => router.navigate('/farms/create')}
                            >
                              <Button title='Create farm' />
                            </Overlay.SheetTrigger>
                          </React.Fragment>
                        ) : null}
                      </Box>
                    </Overlay.SheetContent>
                  </Overlay.Sheet>
                </Overlay.Root>
              );
            },
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: '600',
              color: colors.getColor(title ? 'text.strong' : 'text.soft'),
            },
            headerTitle: title || 'Title',
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
