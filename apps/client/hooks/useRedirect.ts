import React from 'react';
import { Href, useRouter } from 'expo-router';

type UseRedirectProps = {
  condition?: boolean;
  delay?: number;
  onComplete?: () => void;
};

export const useRedirect = (
  to: Href,
  { condition = true, delay = 0, onComplete }: UseRedirectProps
) => {
  const router = useRouter();

  React.useEffect(() => {
    if (condition) {
      const timer = setTimeout(() => {
        router.push(to);
        onComplete?.();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [condition, delay, to]);
};
