import { Alert } from 'react-native';
import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';
import { useFarms } from '../components/Provider';

export const useUpdateFarm = () => {
  const popup = Popup.usePopup();
  const { setFarms } = useFarms();

  const update = Trpc.client.farms.me.update.useMutation({
    onSuccess: (data) => {
      setFarms({ type: 'ADD_FARM', payload: { farm: data.farm } });
      popup.open({
        title: 'Farm data updated',
        message: '',
        actions: [],
      });
    },
    onError: (err, input) => {
      Alert.alert('Unable to update farm', err.message, [
        { text: 'Retry', onPress: async () => await update.mutateAsync(input) },
      ]);
    },
  });

  return { mutate: update.mutateAsync, status: update.status };
};
