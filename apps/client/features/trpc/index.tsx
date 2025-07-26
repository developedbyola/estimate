import { useQuery } from './hooks/useQuery';
import { Provider, trpc } from './components/Provider';

export const Trpc = {
  Provider,
  client: trpc,
  useQuery,
};
