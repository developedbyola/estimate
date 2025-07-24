import { Popup } from '@/components';
import { router } from 'expo-router';
import { Trpc } from '@/features/trpc';
import { useFarms } from '../components/Provider';

export const useUpdateFarm = () => {
  const popup = Popup.usePopup();
  const { setFarms } = useFarms();

  const update = Trpc.client.farms.me.update.useMutation({
    onSuccess: (data) => {
      router.replace({ pathname: '/(protected)/(tabs)' });
      setFarms({ type: 'UPDATE_FARM', payload: { farm: data.farm } });
      popup.open({
        title: 'Farm Updated Successfully',
        message:
          'Your farm details have been saved successfully. The changes are now active and visible.',
        variant: 'success',
        actions: [
          {
            text: 'Got it',
            variant: 'primary',
          },
        ],
      });
    },
    onError: (err, input) => {
      popup.open({
        message: err.message,
        variant: 'destructive',
        title: 'Unable to update farm',
        actions: [
          {
            text: 'Retry',
            variant: 'primary',
            onPress: async () => {
              await update.mutateAsync(input);
            },
          },
        ],
      });
    },
  });

  return { mutate: update.mutateAsync, status: update.status };
};
