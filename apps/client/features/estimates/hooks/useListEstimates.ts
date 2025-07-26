import { Auth } from '@/features/auth';
import { Trpc } from '@/features/trpc';
import { useLocalSearchParams } from 'expo-router';
import { useEstimates } from '../components/Provider';

export const useListEstimates = () => {
  const { setEstimates } = useEstimates();
  const { isAuthenticated } = Auth.useAuth();
  const { farmId } = useLocalSearchParams<{ farmId: string }>();
  const query = Trpc.client.estimates.me.list.useQuery(
    { farmId },
    { enabled: isAuthenticated }
  );

  const list = Trpc.useQuery(query, {
    onError: (_) => {
      setEstimates({
        type: 'SET_ESTIMATES',
        payload: { estimates: [] },
      });
    },
    onSuccess: (data) => {
      setEstimates({
        type: 'SET_ESTIMATES',
        payload: { estimates: data.estimates },
      });
    },
  });

  return {
    status: list.status,
    estimates: list.data?.estimates,
  };
};
