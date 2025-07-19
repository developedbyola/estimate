import { useQuery } from '././components/useQuery';
import { Provider, trpc } from './components/Provider';

export const Trpc = {
  Provider,
  client: trpc,
  useQuery,
};
