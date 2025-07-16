import { useFarms } from '../components/Provider';
import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';

export const useCreateFarm = ({
  onSuccess,
}: {
  onSuccess?: (data: any) => any;
}) => {
  const { setFarms } = useFarms();

  const create = Trpc.client.farms.create.useMutation({
    onSuccess: (data: any) => {
      setFarms({ type: 'ADD_FARM', payload: { farm: data?.farm || {} } });
      onSuccess?.(data);
    },
    onError: (err) => {
      Alert.alert('Error', err.message || 'Failed to create farm', [
        { text: 'OK' },
      ]);
    },
  });

  return { mutate: create.mutateAsync, status: create.status };
};
