import React from 'react';
import { Space } from '@/constants';
import { Keyboard } from 'react-native';
import { FormProvider } from 'react-hook-form';
import { useRegister } from '../hooks/useRegister';
import { Action, Box, Field, Safe, Text } from '@/components';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';

export const Register = () => {
  const { mutate, form } = useRegister();

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
            style={{ gap: 8 }}
          >
            <Text
              size='lg'
              color='text.strong'
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
              <Field.Container>
                <Field.Label>Email</Field.Label>
                <Field.Row>
                  <Field.TextInput
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    placeholder='e.g sam@icloud.com'
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
                    placeholder='Create a strong password'
                  />
                  <Field.ToggleTextHidden />
                </Field.Row>
              </Field.Container>
              <Field.Feedback />
            </Field.Root>
          </Box>

          <Box px='xl'>
            <Action.Root
              size='xl'
              style={{ marginTop: Space['xl'] }}
              onPress={async () => await mutate()}
              loading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              <Action.Loader />
              <Action.Label style={{ fontSize: 18 }}>Create</Action.Label>
            </Action.Root>
          </Box>
        </Safe>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
};
