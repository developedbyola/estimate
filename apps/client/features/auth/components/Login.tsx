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
            mt='6xl'
            style={{ gap: 8 }}
          >
            <Heading
              size='3xl'
              leading='xl'
              align='center'
              weight='bold'
              style={{ maxWidth: 280, marginInline: 'auto' }}
            >
              Welcome back!
            </Heading>
            <Text
              size='lg'
              align='center'
              style={{
                maxWidth: 320,
                marginInline: 'auto',
              }}
            >
              Good to have you! Sign in to access your account and continue
              where you left off.
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
              size='lg'
              onPress={async () => {
                await mutate(form.getValues());
              }}
              loading={status === 'pending'}
              disabled={!form.formState.isValid || status === 'pending'}
            >
              <Action.Loader />
              <Action.Label>Sign in</Action.Label>
            </Action.Root>
          </Box>
        </Safe>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
};
