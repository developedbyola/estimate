import React from 'react';
import { onboardSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Border, Space, Typography } from '@/constants';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Action, Box, Field, Heading, Safe, Text } from '@/components';

export const Onboard = () => {
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(onboardSchema),
    defaultValues: { firstName: '', lastName: '', username: '' },
  });

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Safe style={{ flex: 1 }}>
        <Box
          px='xl'
          mt='4xl'
        >
          <Heading
            size='3xl'
            leading='xl'
          >
            Let's personalize your experience
          </Heading>
          <Text
            size='lg'
            leading='base'
            style={{ marginTop: Space['base'] }}
          >
            Let's get to know you better. This will help us provide you with a
            better experience.
          </Text>
        </Box>

        <Box
          px='xl'
          mt='4xl'
          style={{ flex: 1 }}
        >
          <FormProvider {...form}>
            <Box>
              <Heading
                size='base'
                leading='base'
                weight='medium'
              >
                Username
              </Heading>
              <Box
                mt='base'
                bg='bg.soft'
                style={{ borderRadius: Border.radius.xl, overflow: 'hidden' }}
              >
                <Field.Root name='username'>
                  <Field.Control>
                    <Field.TextInput placeholder='Choose a unique username' />
                  </Field.Control>
                </Field.Root>
              </Box>
            </Box>

            <Box mt='4xl'>
              <Heading
                size='base'
                leading='base'
                weight='medium'
              >
                Legal names
              </Heading>
              <Box
                mt='base'
                bg='bg.soft'
                style={{ borderRadius: Border.radius.xl, overflow: 'hidden' }}
              >
                <Field.Root name='firstName'>
                  <Field.Control>
                    <Field.TextInput placeholder='First legal name e.g John' />
                  </Field.Control>
                </Field.Root>

                <Box
                  bg='bg.inactive'
                  style={{ height: 1 }}
                />

                <Field.Root name='lastName'>
                  <Field.Control>
                    <Field.TextInput placeholder='Last legal name e.g Doe' />
                  </Field.Control>
                </Field.Root>
              </Box>
            </Box>
          </FormProvider>
        </Box>

        <Box px='xl'>
          <Action.Root
            size='xl'
            disabled={!form.formState.isValid}
          >
            <Action.Label style={{ fontSize: Typography.size.lg }}>
              Personalize
            </Action.Label>
          </Action.Root>
        </Box>
      </Safe>
    </TouchableWithoutFeedback>
  );
};
