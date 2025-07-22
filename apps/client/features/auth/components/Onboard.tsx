import React from 'react';
import { onboardSchema } from '../schemas';
import { Space, Typography } from '@/constants';
import { useOnboard } from '../hooks/useOnbaord';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Action, Box, Field, Heading, Safe, Text } from '@/components';

export const Onboard = () => {
  const form = useForm({
    mode: 'all',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
    },
    resolver: zodResolver(onboardSchema),
  });
  const { mutate, isPending } = useOnboard();

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
            <Box style={{ gap: 8 }}>
              <Field.Root name='username'>
                <Field.Container>
                  <Field.Label>Username</Field.Label>
                  <Field.Row>
                    <Field.TextInput placeholder='Choose a unique username' />
                  </Field.Row>
                </Field.Container>
                <Field.Feedback />
              </Field.Root>

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
          </FormProvider>
        </Box>

        <Box px='xl'>
          <Action.Root
            size='xl'
            loading={isPending}
            disabled={!form.formState.isValid || isPending}
            onPress={async () => await mutate(form.getValues())}
          >
            <Action.Loader />
            <Action.Label style={{ fontSize: Typography.size.lg }}>
              {isPending ? 'Personalizing...' : 'Personalize'}
            </Action.Label>
          </Action.Root>
        </Box>
      </Safe>
    </TouchableWithoutFeedback>
  );
};
