import { signIn } from '@/lib/auth';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { loginSchema } from '../schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useLogin = () => {
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutate = form.handleSubmit(async (data) => {
    await signIn.email(data, {
      onSuccess: () => {
        router.push('/(protected)');
      },
      onError: ({ error }) => {
        Alert.alert('Login Failed', error.message, [
          { text: 'OK' },
          {
            text: 'Try Again',
            onPress: async () => await mutate(),
          },
        ]);
      },
    });
  });

  return { mutate, form };
};
