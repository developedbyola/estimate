import { Space } from '@/constants';
import * as SecureStore from 'expo-secure-store';
import { useFormContext } from 'react-hook-form';
import {
  Action,
  Box,
  Flow,
  useAuth,
  useFlowContext,
  useOverlayContext,
  useUser,
} from '@/components';
import { trpc } from '@/lib/trpc';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  authType?: 'login' | 'register';
};

const Footer = ({ authType }: Props) => {
  const { setAuth } = useAuth();
  const { setUser } = useUser();
  const router = useRouter();
  const { onToggle } = useOverlayContext();
  const { reset, handleSubmit } = useFormContext();
  const { onNextStep, setData, data } = useFlowContext<{
    email?: string;
    name?: string;
    password?: string;
  }>();

  const login = trpc.auth.login.useMutation({
    onSuccess: async (data: any) => {
      await SecureStore.setItemAsync('refresh_token', data.refreshToken);
      await AsyncStorage.setItem('access_token', data.accessToken);

      setUser({ type: 'SET_USER', payload: { user: data.user } });
      setAuth({
        type: 'LOGIN',
        payload: {
          auth: { isAuthenticated: true, accessToken: data.accessToken },
        },
      });

      onToggle(false);
      router.push('/(tabs)');
    },
    onError: (error) => {
      Alert.alert('Login failed', error.message, [{ text: 'Cancel' }]);
    },
  });

  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      onNextStep();
    },
    onError: (error) => {
      Alert.alert('Registration failed', error.message, [{ text: 'Cancel' }]);
    },
  });

  return (
    <Box
      pt='lg'
      pb='6xl'
      style={{ position: 'absolute', bottom: 0, width: '100%' }}
    >
      <Box
        px='xl'
        mx='auto'
        style={{
          width: '100%',
          maxWidth: 320,
          gap: Space.base,
        }}
      >
        <Flow.NextButton
          onPress={handleSubmit((values) => {
            setData(values);
          })}
          onComplete={handleSubmit((values) => {
            if (authType === 'login') {
              login.mutate({
                email: data.email ?? '',
                password: values.password ?? '',
              });
            }
            if (authType === 'register') {
              register.mutate({
                email: data.email?.toLowerCase() ?? '',
                name: data.name?.toLowerCase() ?? '',
                password: values.password ?? '',
              });
            }
          })}
        >
          <Action.Root loading={login.isPending || register.isPending}>
            <Action.Loader />
            <Action.Label>Continue</Action.Label>
          </Action.Root>
        </Flow.NextButton>
        <Action.Root
          variant='surface'
          onPress={() => {
            reset();
            onToggle(false);
          }}
        >
          <Action.Label>Cancel</Action.Label>
        </Action.Root>
      </Box>
    </Box>
  );
};

export default Footer;
