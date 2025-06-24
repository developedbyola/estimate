import React from 'react';
import { Add } from './components/Add';
import { List } from './components/List';
import { useCategories, Provider } from './components/Provider';

const Categories = {
  Provider,
  Add: ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider>
        <Add>{children}</Add>
      </Provider>
    );
  },
  List: () => {
    return (
      <Provider>
        <List />
      </Provider>
    );
  },
};

export { useCategories, Categories };
