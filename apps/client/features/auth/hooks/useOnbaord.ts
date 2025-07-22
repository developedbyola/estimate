import { Popup } from '@/components';
import { Auth } from '@/features/auth';
import { Trpc } from '@/features/trpc';
import { useRouter } from 'expo-router';
import { Profiles } from '@/features/profiles';

export const useOnboard = () => {
  const router = useRouter();
  const popup = Popup.usePopup();
  const { setAuth } = Auth.useAuth();
  const { setProfile } = Profiles.useProfile();

  const updateUser = Trpc.client.users.me.update.useMutation({
    onSuccess: async (data) => {
      setAuth({
        type: 'UPDATE_USER',
        payload: { user: data.user },
      });
      router.replace('/(protected)');
    },
    onError: (error, input) => {
      popup.open({
        variant: 'destructive',
        title: 'Failed to complete onboarding',
        message: error.message,
        actions: [
          {
            text: 'Retry',
            onPress: async () => await updateUser.mutateAsync(input),
          },
        ],
      });
    },
  });

  const updateProfile = Trpc.client.profiles.me.update.useMutation({
    onSuccess: async (data) => {
      setProfile({
        type: 'UPDATE_PROFILE',
        payload: { profile: data.profile },
      });
    },
    onError: (error, input) => {
      popup.open({
        variant: 'destructive',
        title: 'Failed to update profile',
        message: error.message,
        actions: [
          {
            text: 'Retry',
            onPress: async () => await updateProfile.mutateAsync(input),
          },
        ],
      });
    },
  });

  const mutate = async (
    data: Parameters<typeof updateProfile.mutateAsync>[0]
  ) => {
    await Promise.all([
      updateProfile.mutateAsync(data),
      updateUser.mutateAsync({ isOnboarded: true }),
    ]);
  };

  return {
    mutate,
    isPending: updateUser.isPending || updateProfile.isPending,
  };
};

export default useOnboard;
