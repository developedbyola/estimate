import { Alert } from 'react-native';
import { Trpc } from '@/features/trpc';
import { useFarms } from '../components/Provider';
import { useLocalSearchParams } from 'expo-router';

type Props = {
  onSuccess?: (data: any) => void;
};

export const useDeleteFarm = ({ onSuccess }: Props) => {
  const { farmId } = useLocalSearchParams<{ farmId: string }>();
  const { setFarms } = useFarms();

  const remove = Trpc.client.farms.delete.useMutation({
    onSuccess: (data) => {
      setFarms({ type: 'REMOVE_FARM', payload: { farmId } });
      onSuccess?.(data);
    },
    onError: (err) => {
      Alert.alert('We couldn’t delete the farm', err.message, [
        { text: 'Okay' },
      ]);
    },
  });

  return { mutate: remove.mutateAsync, status: remove.status };
};
