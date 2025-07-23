import { Banner } from '@/components';
import { Trpc } from '@/features/trpc';
import { Auth } from '@/features/auth';
import { useFarms } from '../components/Provider';

export const useGetFarms = () => {
  const { setFarms } = useFarms();
  const banner = Banner.useBanner();
  const { isAuthenticated } = Auth.useAuth();

  const query = Trpc.client.farms.me.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const list = Trpc.useQuery(query, {
    onError: (err) => {
      setFarms({
        type: 'ERROR',
      });
      banner.open({
        variant: 'destructive',
        message: err.message,
        actions: [
          {
            label: 'Retry',
            onPress: () => {
              list.refetch();
            },
          },
        ],
      });
    },
    onSuccess: (data) => {
      setFarms({
        type: 'SET_FARMS',
        payload: {
          farms: data.farms,
        },
      });
    },
  });

  return { status: list.status };
};
