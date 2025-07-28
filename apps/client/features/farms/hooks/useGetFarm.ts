import { Popup } from '@/components';
import { Trpc } from '@/features/trpc';
import { useLocalSearchParams } from 'expo-router';

export const useGetFarm = () => {
  const popup = Popup.use();
  const { farmId } = useLocalSearchParams<{ farmId: string }>();

  const query = Trpc.client.farms.me.get.useQuery({ farmId });

  const data = query.data;
  const farm = Trpc.useQuery(query, {
    onError: (err) => {
      popup.open({
        title: 'Failed to fetch farm',
        message: err.message,
        variant: 'destructive',
        actions: [
          {
            text: 'Retry',
            onPress: async () => {
              await farm.refetch();
            },
          },
        ],
      });
    },
  });

  return { status: farm.status, data: data?.farm };
};
