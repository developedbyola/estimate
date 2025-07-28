import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useLocalSearchParams } from 'expo-router';
import { useEstimates } from '../components/Provider';

export const useUpdateEstimate = () => {
  const { setEstimates } = useEstimates();
  const { estimateId } = useLocalSearchParams<{ estimateId: string }>();

  const update = Trpc.client.estimates.me.update.useMutation({
    onSuccess: (data: any) => {
      setEstimates({
        type: 'UPDATE_ESTIMATE',
        payload: { estimate: data?.estimate },
      });
    },
    onError: (err) => {
      Alert.alert('Failed to update estimate', err.message);
    },
  });

  return { mutate: update.mutateAsync };
};
