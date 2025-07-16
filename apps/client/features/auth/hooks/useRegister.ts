import { router } from 'expo-router';
import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { usePopupContext } from '@/components';

export const useRegister = () => {
  const popup = usePopupContext();
  const register = Trpc.client.auth.register.useMutation({
    onSuccess: () => {
      popup.open({
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

  return {
    status: register.status,
    mutate: register.mutateAsync,
  };
};
