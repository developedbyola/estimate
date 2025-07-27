import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';
import { useRouter } from 'expo-router';
import { useFarms } from '../components/Provider';

export const useDeleteFarm = () => {
  const router = useRouter();
  const popup = Popup.usePopup();
  const { setFarms } = useFarms();

  const remove = Trpc.client.farms.me.delete.useMutation({
    onSuccess: (data) => {
      setFarms({ type: 'REMOVE_FARM', payload: { farmId: data.farm.id } });
      router.back();
    },
    onError: (err, input) => {
      popup.open({
        title: 'We couldn’t delete the farm',
        message: err.message,
        variant: 'destructive',
        actions: [
          {
            text: 'Retry',
            onPress: async () => {
              await remove.mutateAsync(input);
            },
          },
        ],
      });
    },
  });

  return { mutate: remove.mutateAsync, status: remove.status };
};
