import React from 'react';
import { Space } from '@/constants';
import { loginSchema } from '../schemas';
import {
  Action,
  Box,
  Field,
  Heading,
  Password,
  Safe,
  Text,
} from '@/components';
import { Keyboard } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';

export const Login = () => {
  const { mutate, status } = useLogin();

  const form = useForm({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
            style={{ flex: 1, gap: 20 }}
          >
            <Field.Root
              name='email'
              control={form.control as any}
            >
              <Field.Label>Email</Field.Label>
              <Field.Control>
                <Field.TextInput
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  placeholder='Enter your email'
                />
              </Field.Control>
              <Field.Feedback />
            </Field.Root>

            <Field.Root
              name='password'
              control={form.control as any}
            >
              <Field.Label>Password</Field.Label>
              <Field.Control>
                <Password.Root>
                  <Password.TextInput
                    textContentType='password'
                    placeholder='Enter your password'
                  />
                  <Password.Indicator />
                </Password.Root>
              </Field.Control>
              <Field.Feedback />
            </Field.Root>
          </Box>

          <Box px={'xl'}>
            <Action.Root
              size='xl'
              onPress={async () => {
                await mutate(form.getValues());
              }}
              loading={status === 'pending'}
              disabled={!form.formState.isValid || status === 'pending'}
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
