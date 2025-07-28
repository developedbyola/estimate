import { signUp } from '@/lib/auth';
import { Alert } from 'react-native';
import { Popup } from '@/components';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';

export const useRegister = () => {
  const router = useRouter();
  const popup = Popup.use();
  const form = useForm({
    mode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutate = form.handleSubmit(async (data) => {
    await signUp.email(
      {
        name: 'null',
        ...data,
      },
      {
        onSuccess: () => {
          form.reset();
          router.back();
          popup.open({
            variant: 'success',
            title: 'Congratulations, your account is now active.',
            message:
              'We’re excited to have you on board and can’t wait for you to explore everything we have to offer.',
            actions: [{ text: 'OK' }],
          });
        },
        onError: ({ error }) => {
          Alert.alert('Registration failed', error.message, [
            { text: 'Cancel' },
            {
              text: 'Retry',
              onPress: async () => await mutate(),
            },
          ]);
        },
      }
    );
  });

  return { mutate, form };
};
