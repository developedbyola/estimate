import { useFormContext } from 'react-hook-form';
import { EstimateSchema } from '../schemas';

type UseWatchTotalProps = {
  type?: EstimateSchema['calculations'][number]['type'];
};

export const useWatchTotal = ({ type }: UseWatchTotalProps) => {
  const form = useFormContext<EstimateSchema>();
  const calculations = form.watch('calculations');

  const filteredCalculations = calculations.filter(
    (calculation) => calculation.type === type
  );

  const total = calculations.reduce((acc, field) => {
    return acc + Number(field.price || 0) * Number(field.quantity || 0);
  }, 0);

  const filteredTotal = filteredCalculations.reduce((acc, field) => {
    return acc + Number(field.price || 0) * Number(field.quantity || 0);
  }, 0);

  return [total, filteredTotal];
};
