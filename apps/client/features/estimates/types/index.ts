type Calculation = {
  id: string;
  quantity: string;
  unitPrice: string;
  description: string;
  type: 'income' | 'expense';
};

export type Estimate = {
  id: string;
  title: string;
  calculations: Calculation[];
};
