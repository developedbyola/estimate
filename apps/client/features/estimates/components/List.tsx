import React from 'react';
import { Box } from '@/components';
import { useListEstimates } from '../hooks/useListEstimates';

const DefaultError = () => {
  return <Box></Box>;
};

const DefaultEmpty = () => {
  return <Box></Box>;
};

const Loader = () => {
  return <Box></Box>;
};

export const List = () => {
  const { status, estimates } = useListEstimates();

  if (status === 'pending') return <Loader />;
  if (status === 'error') return <DefaultError />;
  if (estimates?.length === 0) return <DefaultEmpty />;

  return <div>List</div>;
};
