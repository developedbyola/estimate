import type { Category } from '@/features/categories';

export type Farm = {
  id: string;
  size: string;
  name: string;
  city: string;
  state: string;
  userId: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: Omit<Category, 'created_at'>;
  sizeUnit: 'hectares' | 'acres' | 'square meters';
};
