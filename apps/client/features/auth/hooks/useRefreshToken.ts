import { useAuth } from '@/contexts/authContext';
import { refreshToken } from '@/lib/auth';

export const useRefreshToken = () => {
  const data = useAuth();

  // const mutate = refreshToken(
  //   { userId: session?.user.id },
  //   {
  //     onSuccess: (data) => {
  //       setAuth({ type: 'REFRESH_TOKEN' });
  //     },
  //     onError: (err) => {
  //       setAuth({ type: 'ERROR' });
  //     },
  //   }
  // );
};
