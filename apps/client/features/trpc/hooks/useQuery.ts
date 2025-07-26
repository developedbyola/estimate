import React from 'react';

type Options = {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  onPending?: () => void;
};

export const useQuery = <T = any>(query: T, options?: Options) => {
  const { status, data, error } = query as any;

  React.useEffect(() => {
    if (status === 'success') {
      options?.onSuccess?.(data);
    }
    if (status === 'error') {
      options?.onError?.(error);
    }
    if (status === 'pending') {
      options?.onPending?.();
    }
  }, [status]);

  return query as T;
};
