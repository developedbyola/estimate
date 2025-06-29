import React from 'react';
import { Space } from '@/constants';
import { loginSchema } from '../schemas';
import {
  Action,
  Box,
  Field,
  Flow,
  Heading,
  Password,
  Text,
  useFlow,
} from '@/components';
import { trpc } from '@/lib/trpc';
import { Alert } from 'react-native';
import { useAuth } from './Provider';
import { User } from '@/features/user';
import { Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

const EmailField = () => {
  const { control } = useFormContext<{ email: string }>();

  return (
    <Field.Root
      name='email'
      control={control as any}
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
  );
};

const PasswordField = () => {
  const { control } = useFormContext<{ password: string }>();

  return (
    <Field.Root
      name='password'
      control={control as any}
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
  );
};

const steps = [
  {
    fields: ['email'],
    component: EmailField,
    title: "What's your email?",
    description:
      'To be used for account verification and important notifications.',
  },
  {
    fields: ['password'],
    component: PasswordField,
    title: "What's your password?",
    description: 'Create a strong password with at least 8 characters.',
  },
];

export const Login = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { setUser } = User.useUser();

  const login = trpc.auth.login.useMutation({
    onSuccess: async (data: any) => {
      await AsyncStorage.setItem('access_token', data?.accessToken);
      await SecureStore.setItemAsync('refresh_token', data?.refreshToken);
      setAuth({
        type: 'LOGIN',
        payload: {
          auth: {
            isAuthenticated: true,
            accessToken: data?.accessToken,
          },
        },
      });
      setUser({
        type: 'SET_USER',
        payload: {
          user: data?.user,
        },
      });
      router.replace('/(tabs)');
    },
    onError: (error) => {
      Alert.alert('Login failed', error.message, [{ text: 'Cancel' }]);
    },
  });

  const form = useForm({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const flow = useFlow({
    count: 2,
    onSubmit: form.handleSubmit(async (data) => {
      await login.mutateAsync({
        ...data,
        email: data.email.toLowerCase(),
      });
    }),
  });

  return (
    <FormProvider {...form}>
      <Box
        bg='bg.base'
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Flow.Provider
            value={flow}
            style={{ flex: 1 }}
          >
            {steps.map((step, index) => {
              return (
                <Flow.Step
                  key={index}
                  index={index + 1}
                  style={{
                    width: '100%',
                    maxWidth: 360,
                    marginInline: 'auto',
                    paddingTop: Space['4xl'],
                    paddingHorizontal: Space.xl,
                  }}
                >
                  <Heading
                    size='2xl'
                    leading='lg'
                    align='center'
                    weight='medium'
                    style={{ maxWidth: 200, marginInline: 'auto' }}
                  >
                    {step.title}
                  </Heading>
                  <Text
                    size='lg'
                    align='center'
                    style={{
                      maxWidth: 300,
                      marginInline: 'auto',
                      marginTop: Space.base,
                      marginBottom: Space['4xl'],
                    }}
                  >
                    {step.description}
                  </Text>

                  <step.component />

                  <Action.Root
                    loading={form.formState.isSubmitting}
                    style={{ marginTop: Space['xl'] }}
                    onPress={() =>
                      flow.next({
                        onValidate: async () =>
                          await form.trigger(step.fields as any[]),
                      })
                    }
                  >
                    <Action.Loader />
                    <Action.Label>
                      {flow.isLastStep ? 'Login' : 'Next'}
                    </Action.Label>
                  </Action.Root>
                </Flow.Step>
              );
            })}
          </Flow.Provider>
        </TouchableWithoutFeedback>
      </Box>
    </FormProvider>
  );
};
