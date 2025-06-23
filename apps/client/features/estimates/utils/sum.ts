import { CalculationItem } from '../schemas';

/**
 * Alternative simpler version that treats all items equally
 * @param calculations - Array of calculation items
 * @returns Total sum considering add/subtract operations
 */
export const sum = (calculations: CalculationItem[]): number => {
  return calculations.reduce((total, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const itemValue = quantity * unitPrice;

    return item.operation === 'subtract'
      ? total - itemValue
      : total + itemValue;
  }, 0);
};
