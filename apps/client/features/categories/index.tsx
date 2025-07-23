import { List } from './components/List';
import { Form } from './components/Form';
import { useCategories, Provider } from './components/Provider';
import { Add } from './components/Add';
import { Category } from './types';

const Categories = {
  Provider,
  Form,
  Add,
  List,
};

export { useCategories, Categories, Category };
