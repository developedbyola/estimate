import { Banner } from '@/components';
import { Trpc } from '@/features/trpc';
import { useProfile } from '../components/Provider';

export const useGetMyProfile = () => {
  const banner = Banner.useBanner();
  const { setProfile } = useProfile();

  const profile = Trpc.useQuery(Trpc.client.profiles.me.get.useQuery(), {
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
