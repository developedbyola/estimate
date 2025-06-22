import { Space } from '@/constants';
import { useFormContext } from 'react-hook-form';
import {
  Action,
  Box,
  Flow,
  useFlowContext,
  useOverlayContext,
} from '@/components';
import { trpc } from '@/lib/trpc';
import { Alert } from 'react-native';

type Props = {
  authType?: 'login' | 'register';
};

const Footer = ({ authType }: Props) => {
  const { onOpenChange } = useOverlayContext();
  const { reset, handleSubmit } = useFormContext();
  const { onNextStep, setData, data } = useFlowContext<{
    email?: string;
    name?: string;
    password?: string;
  }>();

  const login = trpc.auth.login.useMutation({
    onSuccess: () => {
      onNextStep();
    },
    onError: (error) => {
      Alert.alert(error.message);
    },
  });

  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      onNextStep();
    },
    onError: (error) => {
      Alert.alert(error.message);
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
                email: data.email ?? '',
                name: data.name ?? '',
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
            onOpenChange(false);
          }}
        >
          <Action.Label>Cancel</Action.Label>
        </Action.Root>
      </Box>
    </Box>
  );
};

export default Footer;
