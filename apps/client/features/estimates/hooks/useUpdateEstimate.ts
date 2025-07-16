import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useLocalSearchParams } from 'expo-router';
import { useEstimates } from '../components/Provider';

export const useUpdateEstimate = <T extends object>({
  onSuccess,
}: {
  payload: T;
  onSuccess?: (data: any) => any;
}) => {
  const { setEstimates } = useEstimates();
  const { estimateId } = useLocalSearchParams<{ estimateId: string }>();

  const update = Trpc.client.estimates.update.useMutation({
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
    payload: Omit<Parameters<(typeof update)['mutateAsync']>[0], 'estimateId'>
  ) => {
    await update.mutateAsync({
      estimateId,
      ...payload,
    });
  };

  return { mutate, status: update.status };
};
