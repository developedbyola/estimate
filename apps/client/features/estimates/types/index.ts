type Calculation = {
  id: string;
  price: string;
  quantity: string;
  description: string;
  type: 'income' | 'expense';
};

export type Estimate = {
  id: string;
  title: string;
  farmId: string;
  userId: string;
  createdAt: string;
  calculations: Calculation[];
};
