import React from 'react';
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
        title: 'Welcome to the community!',
        onDismiss: () => router.back(),
        message:
          'Your account has been created successfully. Welcome to our community!',
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

  React.useEffect(() => {
    if (register.status === 'idle') {
      popup.open({
        variant: 'success',
        title: 'Congratulations 🎉',
        onDismiss: () => router.back(),
        message:
          'Your account has been created successfully. Welcome to our community!',
        actions: [{ text: 'OK', onPress: () => router.back() }],
      });
    }
  }, [register.status]);

  return {
    status: register.status,
    mutate: register.mutateAsync,
  };
};
