import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Space, Typography } from '@/constants';
import { useOnboard } from '../hooks/useOnbaord';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Action, Box, Field, Heading, Safe, Text } from '@/components';

export const Onboard = () => {
  const { mutate, form } = useOnboard();

  return (
    <FormProvider {...form}>
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
            <Box style={{ gap: 8 }}>
              <Field.Root name='firstName'>
                <Field.Container>
                  <Field.Label>First Name</Field.Label>
                  <Field.Row>
                    <Field.TextInput placeholder='First legal name e.g John' />
                  </Field.Row>
                </Field.Container>
                <Field.Feedback />
              </Field.Root>

              <Field.Root name='lastName'>
                <Field.Container>
                  <Field.Label>Last Name</Field.Label>
                  <Field.Row>
                    <Field.TextInput placeholder='Last legal name e.g Doe' />
                  </Field.Row>
                </Field.Container>
                <Field.Feedback />
              </Field.Root>
            </Box>
          </Box>

          <Box px='xl'>
            <Action.Root
              size='xl'
              onPress={async () => await mutate()}
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              <Action.Loader />
              <Action.Label style={{ fontSize: Typography.size.lg }}>
                Personalize
              </Action.Label>
            </Action.Root>
          </Box>
        </Safe>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
};
