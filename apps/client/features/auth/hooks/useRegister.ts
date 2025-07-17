import { router } from 'expo-router';
import { Alert } from 'react-native';
import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';

export const useRegister = () => {
  const popup = Popup.usePopup();
  const register = Trpc.client.auth.public.register.useMutation({
    onSuccess: () => {
      popup.open({
        variant: 'success',
        title: 'Congratulations, your account is now active.',
        onDismiss: () => router.back(),
        message:
          'We’re excited to have you on board and can’t wait for you to explore everything we have to offer.',
        actions: [{ text: 'OK', onPress: () => router.back() }],
      });
    },
    onError: (error, input) => {
      Alert.alert('Registration failed', error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: async () => await register.mutateAsync(input),
        },
      ]);
    },
  });

  return {
    status: register.status,
    mutate: register.mutateAsync,
  };
};
