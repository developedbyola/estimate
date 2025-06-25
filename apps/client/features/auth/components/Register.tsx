import {
  Box,
  Flow,
  Heading,
  useFlowContext,
  Text,
  Field,
  Password,
  useOverlayContext,
  Action,
} from '@/components';
import React from 'react';
import { Space } from '@/constants';
import Footer from './shared/Footer';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { excerpt } from '@/utils/excerpt';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, nameSchema, passwordSchema } from '../schemas';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

const Success = () => {
  const colors = useThemeColors();
  const { onToggle } = useOverlayContext();
  const { data } = useFlowContext<{ name?: string }>();

  return (
    <React.Fragment>
      <Box
        px='xl'
        py='4xl'
        mx='auto'
        style={{ flex: 1, maxWidth: 320, width: '100%' }}
      >
        <Ionicons
          size={64}
          name='checkmark-circle'
          style={{ marginInline: 'auto' }}
          color={colors.getColor('success.base')}
        />
        <Box py='xl' />
        <Heading
          size='2xl'
          leading='lg'
          align='center'
          weight='medium'
          style={{ maxWidth: 200, marginInline: 'auto' }}
        >
          High five! ✋ {`${excerpt(data.name || '', 12)}`}
        </Heading>
        <Box py='sm' />
        <Text
          size='xl'
          leading='lg'
          align='center'
        >
          We are thrilled to have you join our community. Your account is all
          set up and ready to grow with us!
        </Text>
      </Box>

      <Box
        px='lg'
        pb='6xl'
        mx='auto'
        style={{ width: '100%', maxWidth: 320, gap: Space.base }}
      >
        <Action.Root onPress={() => onToggle(false)}>
          <Action.Label>Get started</Action.Label>
        </Action.Root>
        <Action.Root
          variant='surface'
          onPress={() => onToggle(false)}
        >
          <Action.Label>Close</Action.Label>
        </Action.Root>
      </Box>
    </React.Fragment>
  );
};

const NameForm = () => {
  const form = useFormContext();

  return (
    <Field.Root
      name={'name'}
      control={form.control}
    >
      <Field.Control>
        <Field.TextInput
          keyboardType='default'
          textContentType='name'
          placeholder='Enter your fullname'
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
          <Password.TextInput placeholder='Enter your password' />
          <Password.Indicator />
        </Password.Root>
      </Field.Control>
      <Field.Feedback />
    </Field.Root>
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
          placeholder='Enter your email'
        />
      </Field.Control>
      <Field.Feedback />
    </Field.Root>
  );
};

const flows = [
  {
    schema: nameSchema,
    heading: 'Provide your full legal names',
    subHeading: 'To help us get to know you better, please share your name.',
    content: <NameForm />,
  },
  {
    schema: emailSchema,
    heading: 'Share your official email address',
    subHeading: 'Get all the latest updates delivered straight to your inbox.',
    content: <EmailForm />,
  },
  {
    schema: passwordSchema,
    heading: 'Use a strong and secure password.',
    subHeading: "Shield your account with a strong password you'll remember.",
    content: <PasswordForm />,
  },
];

export const Register = () => {
  const flowContext = useFlowContext();

  return (
    <Box style={{ flex: 1 }}>
      {flows.map((flow, index) => (
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
                style={{
                  maxWidth: 280,
                  marginInline: 'auto',
                }}
              >
                {flow.subHeading}
              </Text>
            </Box>

            <Box
              px='xl'
              my='5xl'
              mx='auto'
              style={{ width: '100%', maxWidth: 340 }}
            >
              {flow.content}
            </Box>

            <Footer authType='register' />
          </Flow.Content>
        </FormProvider>
      ))}
      <Flow.Success>
        <Success />
      </Flow.Success>
    </Box>
  );
};
