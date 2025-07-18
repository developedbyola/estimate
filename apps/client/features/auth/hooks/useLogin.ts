import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useRouter } from 'expo-router';
import { Users } from '@/features/users';
import { useAuth } from '../components/Provider';

export const useLogin = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { setUser } = Users.useUser();

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
      router.replace('/(protected)');
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
