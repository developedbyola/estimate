import React from 'react';
import {
  Field,
  Flow,
  Heading,
  Password,
  useFlowContext,
  useUser,
} from '@/components';
import { useRedirect } from '@/hooks/useRedirect';
import { ActivityIndicator, Box, Text, useOverlayContext } from '@/components';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { emailSchema, passwordSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Space } from '@/constants';
import Footer from './shared/Footer';

const Success = () => {
  const { user } = useUser();
  const overlayContext = useOverlayContext();

  useRedirect('/app', {
    condition: !!user,
    onComplete: () => overlayContext.onOpenChange(false),
  });

  return (
    <React.Fragment>
      <Box
        px='xl'
        my='5xl'
        style={{ justifyContent: 'center', flex: 1 }}
      >
        <ActivityIndicator />
      </Box>
      <Box
        px='lg'
        pb='6xl'
        mx='auto'
        style={{ maxWidth: 320, width: '100%' }}
      >
        <Text
          size='sm'
          leading='sm'
          align='center'
        >
          We’ve verified it’s really you. Everything’s locked down tight, so you
          can browse with peace of mind. Happy exploring!
        </Text>
      </Box>
    </React.Fragment>
  );
};

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

export const Login = () => {
  const flowContext = useFlowContext();

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
