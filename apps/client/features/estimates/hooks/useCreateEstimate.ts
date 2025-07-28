import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useEstimates } from '../components/Provider';

export const useCreateEstimate = () => {
  const { setEstimates } = useEstimates();

  const create = Trpc.client.estimates.me.create.useMutation({
    onSuccess: (data: any) => {
      setEstimates({
        type: 'UPDATE_ESTIMATE',
        payload: { estimate: data?.estimate },
      });
    },
    onError: (err, input) => {
      Alert.alert('Failed to update estimate', err.message, [
        {
          text: 'Retry',
          onPress: async () => {
            await create.mutateAsync(input);
          },
        },
      ]);
    },
  });

  return { mutate: create.mutateAsync };
};
