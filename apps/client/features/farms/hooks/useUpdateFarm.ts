import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useFarms } from '../components/Provider';

export const useUpdateFarm = ({
  onSuccess,
}: {
  onSuccess?: (data: any) => any;
}) => {
  const { setFarms } = useFarms();

  const update = Trpc.client.farms.update.useMutation({
    onSuccess: (data: any) => {
      setFarms({ type: 'ADD_FARM', payload: { farm: data?.farm || {} } });
      onSuccess?.(data);
    },
    onError: (err) => {
      Alert.alert('Error', err.message || 'Failed to update farm', [
        { text: 'OK' },
      ]);
    },
  });

  return { mutate: update.mutateAsync, status: update.status };
};
