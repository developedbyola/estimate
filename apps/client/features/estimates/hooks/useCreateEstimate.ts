import { Alert } from 'react-native';
import { useEstimates } from '../components/Provider';
import { Trpc } from '@/features/trpc';

export const useCreateEstimate = <T extends object>({
  onSuccess,
}: {
  payload: T;
  onSuccess?: (data: any) => any;
}) => {
  const { setEstimates } = useEstimates();

  const create = Trpc.client.estimates.update.useMutation({
    onSuccess: (data: any) => {
      setEstimates({
        type: 'UPDATE_ESTIMATE',
        payload: { estimate: data?.estimate },
      });
      onSuccess?.(data);
    },
    onError: (err) => {
      Alert.alert('Failed to update estimate', err.message);
    },
  });

  const mutate = async (
    payload: Parameters<(typeof create)['mutateAsync']>[0]
  ) => {
    await create.mutateAsync({
      ...payload,
    });
  };

  return { mutate, status: create.status };
};
