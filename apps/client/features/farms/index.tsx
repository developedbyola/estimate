import { Add } from './components/Add';
import { List } from './components/List';
import { Empty } from './components/Empty';
import { Provider, useFarms } from './components/Provider';

const Farms = {
  Provider,
  Add: ({ children }: { children: React.ReactNode }) => (
    <Provider>
      <Add>{children}</Add>
    </Provider>
  ),
  Empty: () => (
    <Provider>
      <Empty />
    </Provider>
  ),
  List: () => (
    <Provider>
      <List />
    </Provider>
  ),
};

export { Farms, useFarms };
