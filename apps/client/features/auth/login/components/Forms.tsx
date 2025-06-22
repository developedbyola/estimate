import React from 'react';
import Footer from '../../components/shared/Footer';
import {
  Box,
  Flow,
  Text,
  Field,
  Heading,
  Password,
  useFlowContext,
} from '@/components';
import Success from './Success';
import { Space } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, passwordSchema } from '../schemas';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { trpc } from '@/lib/trpc';

const EmailForm = () => {
  const form = useFormContext();

  return (
    <Field.Root
      name={'email'}
      control={form.control as any}
    >
      <Field.Control>
        <Field.TextInput
          keyboardType='email-address'
          textContentType='emailAddress'
          placeholder='Enter your email address'
        />
      </Field.Control>
      <Field.Feedback />
    </Field.Root>
  );
};

const PasswordForm = () => {
  const form = useFormContext();

  return (
    <Field.Root
      name={'password'}
      control={form.control as any}
    >
      <Field.Control>
        <Password.Root>
          <Password.TextInput
            textContentType='password'
            keyboardType='visible-password'
            placeholder='Enter your password'
          />
          <Password.Indicator />
        </Password.Root>
      </Field.Control>
      <Field.Feedback />
    </Field.Root>
  );
};

const flows = [
  {
    schema: emailSchema,
    heading: 'Ready to manage your farm finances',
    subHeading: 'Welcome back farmer. Tend your budget, grow your bounty 🌾.',
    content: <EmailForm />,
  },
  {
    schema: passwordSchema,
    heading: 'Provide your authentication key',
    subHeading:
      'Pick up right where you stopped — enter your account password.',
    content: <PasswordForm />,
  },
];

const Forms = () => {
  const flowContext = useFlowContext();
  const login = trpc.auth.login.useMutation({
    onSuccess: () => {},
  });

  return (
    <Box style={{ flex: 1 }}>
      {flows.map((flow, index) => {
        return (
          <FormProvider
            key={index}
            {...useForm({
              mode: 'all',
              defaultValues: flowContext.data,
              resolver: zodResolver(flow.schema as any),
            })}
          >
            <Flow.Content index={index}>
              <Box
                px='xl'
                mt='6xl'
                style={{ gap: Space.lg }}
              >
                <Heading
                  size='2xl'
                  leading='lg'
                  align='center'
                  weight='medium'
                  style={{
                    maxWidth: 200,
                    marginInline: 'auto',
                  }}
                >
                  {flow.heading}
                </Heading>
                <Text
                  size='lg'
                  align='center'
                  style={{ maxWidth: 280, marginInline: 'auto' }}
                >
                  {flow.subHeading}
                </Text>
              </Box>

              <Box
                px='xl'
                my='5xl'
                mx='auto'
                style={{ width: '100%', maxWidth: 320 }}
              >
                {flow.content}
              </Box>

              <Footer authType='login' />
            </Flow.Content>
          </FormProvider>
        );
      })}
      <Flow.Success>
        <Success />
      </Flow.Success>
    </Box>
  );
};

export default Forms;
