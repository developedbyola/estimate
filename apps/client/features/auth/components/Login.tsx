import React from 'react';
import { Keyboard } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { FormProvider } from 'react-hook-form';
import { Action, Box, Field, Safe, Text } from '@/components';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';

export const Login = () => {
  const { mutate, form } = useLogin();

  return (
    <FormProvider {...form}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Safe
          bg='bg.base'
          style={{ flex: 1 }}
        >
          <Box
            px='xl'
            mt='4xl'
          >
            <Text
              size='lg'
              color='text.strong'
            >
              Sign in to access your account and continue where you left off.
            </Text>
          </Box>

          <Box
            px={'xl'}
            mt='4xl'
            style={{ flex: 1, gap: 8 }}
          >
            <Field.Root
              name='email'
              control={form.control as any}
            >
              <Field.Container>
                <Field.Label>Email</Field.Label>
                <Field.Row>
                  <Field.TextInput
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    placeholder='Enter your email'
                  />
                </Field.Row>
              </Field.Container>
              <Field.Feedback />
            </Field.Root>

            <Field.Root
              isTextHidden
              name='password'
              control={form.control as any}
            >
              <Field.Container>
                <Field.Label>Password</Field.Label>
                <Field.Row>
                  <Field.TextInput
                    textContentType='password'
                    placeholder='Enter your password'
                  />
                  <Field.ToggleTextHidden />
                </Field.Row>
              </Field.Container>
              <Field.Feedback />
            </Field.Root>
          </Box>

          <Box px={'xl'}>
            <Action.Root
              size='xl'
              onPress={async () => await mutate()}
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              <Action.Loader />
              <Action.Label style={{ fontSize: 18 }}>Sign in</Action.Label>
            </Action.Root>
          </Box>
        </Safe>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
};
