import { Banner } from '@/components';
import { Trpc } from '@/features/trpc';
import { useProfile } from '../components/Provider';
import { Auth } from '@/features/auth';

export const useGetMyProfile = () => {
  const banner = Banner.useBanner();
  const { setProfile } = useProfile();
  const { isAuthenticated } = Auth.useAuth();

  const query = Trpc.client.profiles.me.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const profile = Trpc.useQuery(query, {
    onSuccess: (data) => {
      setProfile({
        type: 'SET_PROFILE',
        payload: { profile: data?.profile },
      });
    },
    onError: (error) => {
      banner.open({
        variant: 'destructive',
        message: error.message,
        actions: [
          {
            label: 'Retry',
            onPress: async () => await profile.refetch(),
          },
        ],
      });
    },
  });

  return {
    data: profile.data,
    error: profile.error,
    status: profile.status,
    isLoading: profile.isLoading,
  };
};
