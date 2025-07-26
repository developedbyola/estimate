import { signIn } from '@/lib/auth';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useFormContext } from 'react-hook-form';

export const useLogin = () => {
  const form = useFormContext();

  const mutate = async () => {
    await signIn.email(
      {
        email: form.getValues('email'),
        password: form.getValues('password'),
      },
      {
        onSuccess: () => {
          router.push('/(protected)');
        },
        onError: (err: any) => {
          Alert.prompt(
            'Login Failed',
            err?.message ||
              'An unexpected error occurred during login. Please try again later.',
            [
              { text: 'OK' },
              {
                text: 'Try Again',
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
