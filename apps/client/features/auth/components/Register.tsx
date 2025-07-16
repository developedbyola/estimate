import React from 'react';
import { Space } from '@/constants';
import { Keyboard } from 'react-native';
import { registerSchema } from '../schemas';
import { useRegister } from '../hooks/useRegister';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import {
  Action,
  Box,
  Field,
  Heading,
  Password,
  Safe,
  Text,
} from '@/components';

export const Register = () => {
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { status, mutate } = useRegister();

  return (
    <FormProvider {...form}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Safe
          bg='bg.base'
          style={{ flex: 1 }}
        >
          <Box
            mt='6xl'
            px='xl'
            style={{ gap: 8 }}
          >
            <Heading
              size='3xl'
              leading='xl'
              align='center'
              weight='bold'
              style={{ maxWidth: 280, marginInline: 'auto' }}
            >
              Create an account
            </Heading>
            <Text
              size='lg'
              align='center'
              style={{
                maxWidth: 320,
                marginInline: 'auto',
              }}
            >
              Join our community and start your journey with us. Create an
              account to get started.
            </Text>
          </Box>

          <Box
            px='xl'
            mt='4xl'
            style={{ gap: 8, flex: 1 }}
          >
            <Field.Root
              name='email'
              control={form.control as any}
            >
              <Field.Control>
                <Field.TextInput
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  placeholder='Your email address'
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
                    placeholder='Create a strong password'
                  />
                  <Password.Indicator />
                </Password.Root>
              </Field.Control>
              <Field.Feedback />
            </Field.Root>
          </Box>

          <Box px='xl'>
            <Action.Root
              loading={status === 'pending'}
              style={{ marginTop: Space['xl'] }}
              disabled={status === 'pending' || !form.formState.isValid}
            >
              <Action.Loader />
              <Action.Label>Create an account</Action.Label>
            </Action.Root>
          </Box>
        </Safe>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
};
