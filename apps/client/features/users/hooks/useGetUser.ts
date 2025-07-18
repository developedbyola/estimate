import React from 'react';
import { Auth } from '@/features/auth';
import { Trpc } from '@/features/trpc';
import { useUser } from '../components/Provider';

export const useGetUser = () => {
  const { user, setUser } = useUser();
  const { isLoading } = Auth.useAuth();

  const profile = Trpc.client.users.me.get.useQuery(undefined, {
    enabled: !isLoading && !user,
  });

  React.useEffect(() => {
    const data = profile.data as any;
    if (profile.status === 'error') {
      console.error(profile.error.message);
      setUser({ type: 'ERROR' });
    }
    if (profile.status === 'success') {
      setUser({ type: 'SET_USER', payload: { user: data?.user } });
    }
  }, [profile.status]);

  return { status: profile.status };
};
