import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';
import { useRouter } from 'expo-router';
import { useFarms } from '../components/Provider';
import { useLocalSearchParams } from 'expo-router';

export const useDeleteFarm = () => {
  const router = useRouter();
  const { setFarms } = useFarms();
  const popup = Popup.usePopup();
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  const remove = Trpc.client.farms.me.delete.useMutation({
    onSuccess: () => {
      setFarms({ type: 'REMOVE_FARM', payload: { farmId } });
      router.back();
    },
    onError: (err) => {
      popup.open({
        title: 'We couldn’t delete the farm',
        message: err.message,
        variant: 'destructive',
        actions: [
          {
            text: 'Retry',
            onPress: async () => {
              await remove.mutateAsync({ farmId });
            },
          },
        ],
      });
    },
  });

  return { mutate: remove.mutateAsync, status: remove.status };
};
