import { Alert } from 'react-native';
import { User } from '@/features/users';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/Provider';
import { Trpc } from '@/features/trpc';

export const useLogin = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { setUser } = User.useUser();

  const login = Trpc.client.auth.public.login.useMutation({
    onSuccess: async (data: any) => {
      setAuth({
        type: 'LOGIN',
        payload: {
          auth: {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
          },
        },
      });
      setUser({
        type: 'SET_USER',
        payload: { user: data?.user },
      });
      router.replace('/(tabs)');
    },
    onError: (error, input) => {
      Alert.alert('Login failed', error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: async () => {
            await login.mutateAsync(input);
          },
        },
      ]);
    },
  });

  return { status: login.status, mutate: login.mutateAsync };
};
