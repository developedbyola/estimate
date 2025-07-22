import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useAuth } from '../components/Provider';

export const useLogin = () => {
  const { setAuth } = useAuth();

  const login = Trpc.client.auth.public.login.useMutation({
    onSuccess: async (data) => {
      setAuth({
        type: 'LOGIN',
        payload: {
          user: data.user,
          session: data.session,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
    },
    onError: (error, input) => {
      Alert.alert('Login failed', error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          isPreferred: true,
          onPress: async () => {
            await login.mutateAsync(input);
          },
        },
      ]);
    },
  });

  return { status: login.status, mutate: login.mutateAsync };
};
