import { signUp } from '@/lib/auth';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { Popup } from '@/components';
import { useFormContext } from 'react-hook-form';

export const useRegister = () => {
  const form = useFormContext();
  const popup = Popup.usePopup();

  const mutate = async () => {
    await signUp.email(
      {
        name: 'null',
        email: form.getValues('email'),
        password: form.getValues('password'),
      },
      {
        onSuccess: () => {
          form.reset();
          popup.open({
            variant: 'success',
            title: 'Congratulations, your account is now active.',
            message:
              'We’re excited to have you on board and can’t wait for you to explore everything we have to offer.',
            actions: [{ text: 'OK', onPress: () => router.back() }],
          });
        },
        onError: (err: any) => {
          Alert.prompt(
            'Registration failed',
            err?.message ||
              'An unexpected error occurred during registration. Please try again later.',
            [
              { text: 'Cancel' },
              {
                text: 'Retry',
                onPress: async () => await mutate(),
              },
            ]
          );
        },
      }
    );
  };

  return { mutate };
};
