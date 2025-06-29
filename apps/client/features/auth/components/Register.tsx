import React from 'react';
import { Space } from '@/constants';
import { registerSchema } from '../schemas';
import {
  Action,
  Box,
  Field,
  Flow,
  Heading,
  Password,
  Text,
  useFlow,
  usePopupContext,
} from '@/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import { Keyboard } from 'react-native';
import { trpc } from '@/lib/trpc';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export const NameField = () => {
  const { control } = useFormContext<{ name: string }>();

  return (
    <Field.Root
      name='name'
      control={control as any}
    >
      <Field.Control>
        <Field.TextInput
          keyboardType='default'
          textContentType='name'
          placeholder='Enter your name'
        />
      </Field.Control>
      <Field.Feedback />
    </Field.Root>
  );
};

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
    fields: ['name'],
    component: NameField,
    title: 'Set up your name',
    description:
      "Please enter your full name as you'd like it to appear on your account.",
  },
  {
    fields: ['email'],
    component: EmailField,
    title: 'Set up your email',
    description:
      'To be used for account verification and important notifications.',
  },
  {
    fields: ['password'],
    component: PasswordField,
    title: 'Secure your accountx',
    description: 'Create a strong password with at least 8 characters.',
  },
];

export const Register = () => {
  const router = useRouter();
  const popupContext = usePopupContext();
  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      popupContext.open({
        title: 'Congratulations 🎉',
        onDismiss: () => router.back(),
        message:
          'Your account has been created successfully. Welcome to our community!',
        actions: [{ text: 'OK', onPress: () => router.back() }],
      });
    },
    onError: (error) => {
      Alert.alert('Registration failed', error.message, [{ text: 'Cancel' }]);
    },
  });

  const form = useForm({
    mode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const flow = useFlow({
    count: 3,
    onSubmit: form.handleSubmit(async (data) => {
      await register.mutateAsync({
        ...data,
        name: data.name.toLowerCase(),
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
                      {flow.isLastStep ? 'Become a member' : 'Next'}
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
