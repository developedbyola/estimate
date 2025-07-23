import { Banner } from '@/components';
import { Trpc } from '@/features/trpc';
import { Auth } from '@/features/auth';
import { useCategories } from '../components/Provider';

export const useGetCategories = () => {
  const banner = Banner.useBanner();
  const { setCategories } = useCategories();
  const { isAuthenticated } = Auth.useAuth();

  const query = Trpc.client.categories.me.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const list = Trpc.useQuery(query, {
    onError: (err) => {
      banner.open({
        variant: 'destructive',
        message: err.message,
        actions: [
          {
            label: 'Retry',
            onPress: async () => {
              await list.refetch();
            },
          },
        ],
      });
    },
    onSuccess: (data) => {
      setCategories({
        type: 'SET_CATEGORIES',
        payload: {
          categories: data.categories,
        },
      });
    },
  });

  return { status: list.status, data: list.data };
};
